<script>

export default {
  name: 'CameraRecordingPlayback',
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  computed: {
    playback() {
      return this.$store.getters['getPlayback']
    },
    percent() {
      return Math.floor(100 * this.playback.seconds / this.event.recording.duration)
    },
    area() {
      return this.event.area
    },
    recording() {
      return this.event.recording
    },
    camera() {
      return this.event.camera
    }
  }
}
</script>

<template>
  <VSheet>
    <VProgressLinear
      :model-value="percent"
      height="8"
      color="primary"
      class="mb-4 position-absolute left-0 top-0 w-full"
      rounded="0"
    />
  </VSheet>
</template>

<style scoped>

</style>