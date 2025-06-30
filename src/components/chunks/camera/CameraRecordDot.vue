<script>
export default {
  name: "CameraRecordDot",
  props: {
    camera: {
      type: Object,
      required: true
    }
  },
  computed: {
    hasRecord() {
      return this.camera.record && this.camera.record_mode !== null
    },
    hasDetection() {
      return this.camera.record && [3, 4].indexOf(this.camera.record_mode) > -1
    },
  }
}
</script>

<template>
  <VIcon
    v-if="hasRecord"
    :color="hasRecord ? 'red' : 'white'"
    :icon="hasDetection ? 'mdi-motion-sensor' : 'mdi-record'"
    class="record"
    size="large"
    :class="{'pulse':hasRecord && !hasDetection}"
  />
</template>

<style lang="scss" scoped>
.record {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;

  &.pulse {
    animation: pulse 1s ease infinite;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  60% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    transform: scale(01);
    opacity: 0.5;
  }
}
</style>