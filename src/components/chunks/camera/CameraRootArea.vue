<script>
import {ImageClickTracker} from "../../../js/helpers/ImageClickTracker.js";

export default {
  name: "CameraRootArea",
  props: {
    camera: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tracker: null,
      url: null,
      src: null,
    }
  },
  computed: {
    token() {
      return this.$store.getters['getToken']
    },
  },
  async mounted() {
    this.createUrl()
    await this.getCameraCover()
    this.tracker = new ImageClickTracker(
        this.$refs.image,
        this.$refs.output,
        this.$refs.draw
    )
    this.tracker.importFromJSON(this.camera.areas)
    this.$store.commit('setTracker', this.tracker)
  },
  methods: {
    stop() {
      //this.url = null
      window.stop()
      this.url = this.src
    },
    async start() {
      this.createUrl()
      await this.getCameraCover()
    },
    createUrl() {
      this.url = `/api/cameras/${this.camera.id}/stream?token=${this.token}`
    },
    async getCameraCover() {
      if (this.camera.cover !== null) {
        this.src = await this.$store.dispatch('getCameraCover', {id: this.camera.id, w: 700});
      }
    },
    onRootAreaClick(e) {

    },
  }
}
</script>

<template>
  <VSheet
    class="frame position-relative"
    width="1000"
  >
    <img
      id="targetImage"
      ref="image"
      class="d-block video w-100"
      :src="url"
      @click="onRootAreaClick"
    >
    <canvas
      id="canvas"
      ref="draw"
    />
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