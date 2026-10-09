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
      :muted="muted"
      :poster="poster || undefined"
    />

    <!-- Оверлей рисования (canvas) поверх видео -->
    <slot />

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

    <!-- Управление звуком: видео стартует как muted (autoplay) -->
    <VBtn
      v-if="connected && audio"
      class="webrtc-audio-btn"
      :icon="muted ? 'mdi-volume-off' : 'mdi-volume-high'"
      size="small"
      variant="tonal"
      density="comfortable"
      @click="toggleMute"
    />
  </div>
</template>

<script>
import {WebRtcClient} from '../../../js/helpers/WebRtcClient.js'

export default {
  name: 'WebRtcPlayer',
  props: {
    camera: {
      type: Object,
      required: true
    },
    // Кадр-заглушка (обложка), показывается до появления видео
    poster: {
      type: String,
      default: null
    },
    // Максимальная ширина контейнера в px (0 — без ограничения)
    maxWidth: {
      type: Number,
      default: 0
    },
    // Воспроизводить ли звук камеры
    audio: {
      type: Boolean,
      default: true
    },
    // Задержка авто-переподключения, мс (0 — выключено)
    reconnectDelay: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      state: 'connecting',
      connected: false,
      muted: true,
      session: null,
      mediaStream: null,
      retryTimer: null
    }
  },
  computed: {
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
  },
  methods: {
    async start() {
      this._clearRetry()
      this.state = 'connecting'
      this.connected = false
      this.mediaStream = new MediaStream()

      try {
        const client = WebRtcClient.get(this.token)
        this.session = await client.createSession(this.camera.id, {
          onTrack: track => this._onTrack(track),
          onState: state => this._onState(state),
          onError: message => {
            console.error('WebRTC error:', message)
            this._onState('error')
          }
        })
      } catch (e) {
        console.error('WebRTC: failed to start session', e)
        this._onState('error')
      }
    },

    stop() {
      this._clearRetry()
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
            video.play().catch(() => {})
            this.$emit('ready', video)
          }
          if (video.readyState >= 2) {
            onPlay()
          } else {
            video.addEventListener('loadeddata', onPlay, {once: true})
          }
        }
      }
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
}

.webrtc-placeholder {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  pointer-events: none;
}

.webrtc-audio-btn {
  position: absolute;
  right: 8px;
  bottom: 8px;
  z-index: 20;
}
</style>
