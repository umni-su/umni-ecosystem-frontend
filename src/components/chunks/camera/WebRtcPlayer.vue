<template>
  <div
    class="webrtc-player position-relative"
    :style="containerStyle"
  >
    <video
      ref="video"
      class="webrtc-video d-block w-100"
      autoplay
      playsinline
      controls
      muted
      :poster="poster || undefined"
    />

    <!-- Оверлей рисования (canvas) поверх видео -->
    <slot/>

    <!-- Заглушка: старт / потеря сигнала / остановка -->
    <div
      v-if="!connected"
      class="webrtc-placeholder d-flex flex-column align-center justify-center"
    >
      <VProgressCircular
        v-if="state === 'connecting'"
        indeterminate
        color="white"
      />
      <template v-else>
        <VIcon
          icon="mdi-video-off-outline"
          size="48"
          color="white"
        />
        <span class="text-caption text-white mt-2">{{ statusText }}</span>
      </template>
    </div>

    <VSheet
      class="position-absolute right-0 top-0 overflow-hidden pa-2"
      color="transparent"
    >
      <VMenu :close-on-content-click="false">
        <template #activator="{props}">
          <VBtn
            class="mr-2"
            color="default"
            variant="elevated"
            density="comfortable"
            :icon="selectedQuality?.icon ?? 'mdi-video-standard-definition'"
            v-bind="props"
          />
        </template>
        <VSheet>
          <VList width="270">
            <VListItem
              v-for="item in qualityOptions"
              :key="item"
              :prepend-icon="item.icon"
              :active="item.width === quality"
              :title="item.label"
              @click="changeQuality(item.width)"
            />
          </VList>
        </VSheet>
      </VMenu>
    </VSheet>
  </div>
</template>

<script>
import {WebRtcClient} from '../../../js/helpers/WebRtcClient.js'

export default {
  name: 'WebRtcPlayer',
  emits: ['on-connected', 'ready', 'resize'],
  props: {
    camera: {
      type: Object,
      required: true
    },
    poster: {
      type: String,
      default: null
    },
    maxWidth: {
      type: Number,
      default: 0
    },
    streamWidth: {
      type: Number,
      default: 640
    },
    audio: {
      type: Boolean,
      default: true
    },
    reconnectDelay: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      client: null,
      state: 'connecting',
      connected: false,
      muted: true,
      session: null,
      mediaStream: null,
      retryTimer: null,
      quality: 640,
      qualityOptions: [
        {
          label: this.$t('Minimum quality'),
          icon: 'mdi-quality-low',
          width: 320
        },
        {
          label: this.$t('Medium quality'),
          icon: 'mdi-quality-medium',
          width: 640
        },
        {
          label: this.$t('High quality'),
          icon: 'mdi-quality-high',
          width: 1280
        },
        {
          label: this.$t('Ultra quality'),
          icon: 'mdi-crown',
          width: 1920
        }
      ],
      // наблюдатели за размером видео
      _rvfcHandle: null,
      _resizeObserver: null,
      _lastMediaW: 0,
      _lastMediaH: 0
    }
  },
  computed: {
    selectedQuality() {
      return this.qualityOptions.find(item => item.width === this.quality)
    },
    token() {
      return this.$store.getters['getToken']
    },
    containerStyle() {
      return this.maxWidth > 0 ? {maxWidth: `${this.maxWidth}px`} : {}
    },
    statusText() {
      switch (this.state) {
      case 'stopped':
        return this.$t('Stopped')
      case 'error':
      case 'failed':
        return this.$t('No signal')
      default:
        return this.$t('Connecting...')
      }
    }
  },
  mounted() {
    this.start()
  },
  beforeUnmount() {
    this.stop()
    this._clearRetry()
    this._stopSizeWatchers()
  },
  methods: {
    async start() {
      this._clearRetry()
      this.state = 'connecting'
      this.connected = false
      this.mediaStream = new MediaStream()

      try {
        this.client = WebRtcClient.get(this.token)
        this.session = await this.client.createSession(this.camera.id, {
          onTrack: track => this._onTrack(track),
          onState: state => this._onState(state),
          onError: message => {
            console.error('WebRTC error:', message)
            this._onState('error')
          }
        }, {videoWidth: this.quality})
      } catch (e) {
        console.error('WebRTC: failed to start session', e)
        this._onState('error')
      }
    },

    stop() {
      this._clearRetry()
      this._stopSizeWatchers()
      if (this.session) {
        this.session.close()
        this.session = null
      }
      if (this.$refs.video) {
        this.$refs.video.srcObject = null
      }
      this.mediaStream = null
      this.connected = false
      this.state = 'stopped'
    },

    async changeQuality(q) {
      this.quality = q
      if (this.client !== null && this.session) {
        await this.client.setVideoWidth(this.session.sessionId, this.quality)
      }
    },

    _onTrack(track) {
      if (!this.mediaStream) {
        this.mediaStream = new MediaStream()
      }
      this.mediaStream.addTrack(track)

      const video = this.$refs.video
      if (video && video.srcObject !== this.mediaStream) {
        video.srcObject = this.mediaStream
      }

      if (track.kind === 'video') {
        this.connected = true
        this.state = 'connected'
        if (video) {
          const onPlay = () => {
            video.play().catch(() => {
            })
            this._startSizeWatchers(video)
            this.$emit('ready', video)
          }
          if (video.readyState >= 2) {
            onPlay()
          } else {
            video.addEventListener('loadeddata', onPlay, {once: true})
          }
        }
        this.$nextTick(() => {
          this.$emit('on-connected', video)
        })
      }
    },

    /**
     * Следим за изменением размеров <video> двумя способами:
     *  - ResizeObserver — ловит изменение CSS-размера элемента;
     *  - requestVideoFrameCallback — ловит изменение videoWidth/videoHeight
     *    (метаданные каждого декодированного кадра).
     * При любом изменении эмитим 'resize', чтобы родитель пересчитал canvas.
     */
    _startSizeWatchers(video) {
      this._stopSizeWatchers()
      if (!video) return

      this._lastMediaW = video.videoWidth
      this._lastMediaH = video.videoHeight

      // 1) CSS-размер
      if (typeof ResizeObserver !== 'undefined') {
        this._resizeObserver = new ResizeObserver(() => {
          this.$emit('resize', {
            width: video.videoWidth,
            height: video.videoHeight,
            clientWidth: video.clientWidth,
            clientHeight: video.clientHeight
          })
        })
        this._resizeObserver.observe(video)
      }

      // 2) Натуральный размер кадра — rVFC срабатывает на каждый кадр
      if (typeof video.requestVideoFrameCallback === 'function') {
        const cb = (now, meta) => {
          if (meta.mediaWidth !== this._lastMediaW || meta.mediaHeight !== this._lastMediaH) {
            this._lastMediaW = meta.mediaWidth
            this._lastMediaH = meta.mediaHeight
            this.$emit('resize', {
              width: meta.mediaWidth,
              height: meta.mediaHeight,
              clientWidth: video.clientWidth,
              clientHeight: video.clientHeight
            })
          }
          this._rvfcHandle = video.requestVideoFrameCallback(cb)
        }
        this._rvfcHandle = video.requestVideoFrameCallback(cb)
      }
    },

    _stopSizeWatchers() {
      if (this._resizeObserver) {
        this._resizeObserver.disconnect()
        this._resizeObserver = null
      }
      const video = this.$refs.video
      if (video && this._rvfcHandle != null && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(this._rvfcHandle)
      }
      this._rvfcHandle = null
    },

    _onState(state) {
      this.state = state
      if (state === 'connected') {
        this.connected = true
        return
      }
      if (state === 'disconnected' || state === 'closed') {
        this.connected = false
        this._scheduleReconnect()
      }
      if (state === 'error' || state === 'failed') {
        this.connected = false
        this._scheduleReconnect()
      }
    },

    _scheduleReconnect() {
      if (this.reconnectDelay <= 0 || this.retryTimer) {
        return
      }
      this.retryTimer = setTimeout(() => {
        this.retryTimer = null
        this.start()
      }, this.reconnectDelay)
    },

    _clearRetry() {
      if (this.retryTimer) {
        clearTimeout(this.retryTimer)
        this.retryTimer = null
      }
    },

    toggleMute() {
      this.muted = !this.muted
      if (this.$refs.video) {
        this.$refs.video.muted = this.muted
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.webrtc-player {
  position: relative;
  width: 100%;
  background: #000;
}

.webrtc-video {
  width: 100%;
  height: auto;
  background: #000;
  display: block;
}

.webrtc-placeholder {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: none;
}
</style>