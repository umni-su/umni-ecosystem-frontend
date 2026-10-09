<script>
import {ImageClickTracker} from '../../../js/helpers/ImageClickTracker.js'
import WebRtcPlayer from './WebRtcPlayer.vue'

export default {
  name: 'CameraRootArea',
  components: {WebRtcPlayer},
  props: {
    camera: {
      type: Object,
      required: true
    },
    hideDrawings: {
      type: Boolean,
      default: false
    },
    // Ограничение ширины видео (px), 0 — на всю ширину контейнера
    maxWidth: {
      type: Number,
      default: 1000
    },
    // Воспроизводить звук камеры (стартует как muted из-за autoplay)
    audio: {
      type: Boolean,
      default: true
    }
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
    onPlayerReady(videoEl) {
      this.createTracker(videoEl)
    },
    createTracker(imageEl) {
      this.destroyTracker()
      this.tracker = new ImageClickTracker(
        imageEl,
        null,
        this.$refs.draw
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
      @ready="onPlayerReady"
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
    pointer-events: auto;
    cursor: default;
  }
}
</style>
