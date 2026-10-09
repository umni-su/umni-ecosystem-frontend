<script>
import {ImageClickTracker} from '../../../js/helpers/ImageClickTracker.js'
import WebRtcPlayer from './WebRtcPlayer.vue'

export default {
  name: 'CameraRootArea',
  components: {WebRtcPlayer},
  props: {
    camera: {type: Object, required: true},
    hideDrawings: {type: Boolean, default: false},
    maxWidth: {type: Number, default: 1000},
    audio: {type: Boolean, default: true},
    // Пространство, в котором хранятся точки полигонов камеры
    referenceWidth: {type: Number, default: 640},
    referenceHeight: {type: Number, default: 480}
  },
  data() {
    return {
      tracker: null,
      src: null
    }
  },
  computed: {
    token() {
      return this.$store.getters['getToken']
    }
  },
  async mounted() {
    await this.getCameraCover()
    this.$store.commit('destroyTracker')
  },
  beforeUnmount() {
    this.destroyTracker()
  },
  methods: {
    onConnected() {
      console.log('Connected')
    },

    onPlayerReady(videoEl) {
      if (this.tracker && this.tracker.image === videoEl) {
        // тот же <video> — просто пересчитываем геометрию
        this.tracker.resizeCanvas()
      } else {
        this.createTracker(videoEl)
      }
    },

    onPlayerResize() {
      if (this.tracker) {
        this.tracker.resizeCanvas()
      }
    },

    createTracker(imageEl) {
      this.destroyTracker()
      this.tracker = new ImageClickTracker(
        imageEl,
        null,
        this.$refs.draw,
        {
          referenceWidth: this.referenceWidth,
          referenceHeight: this.referenceHeight
        }
      )
      this.tracker.importFromJSON(this.camera.areas || [])
      this.$store.commit('setTracker', this.tracker)
    },

    destroyTracker() {
      if (this.tracker) {
        this.tracker.destroy()
        this.tracker = null
      }
      this.$store.commit('destroyTracker')
    },

    stop() {
      this.$refs.player?.stop()
    },

    async start() {
      this.$refs.player?.start()
    },

    async getCameraCover() {
      this.src = await this.$store.dispatch('getCameraCover', {id: this.camera.id, w: 700})
    }
  }
}
</script>

<template>
  <VSheet class="frame position-relative">
    <WebRtcPlayer
      ref="player"
      :camera="camera"
      :poster="src"
      :max-width="maxWidth"
      :audio="audio"
      @on-connected="onConnected"
      @ready="onPlayerReady"
      @resize="onPlayerResize"
    >
      <canvas
        id="canvas"
        ref="draw"
        :class="hideDrawings?'d-none':'d-block'"
      />
    </WebRtcPlayer>
  </VSheet>
</template>

<style lang="scss" scoped>
.frame {
  z-index: 100;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: auto;
    cursor: default;
  }
}
</style>