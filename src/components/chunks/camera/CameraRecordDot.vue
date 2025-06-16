<script>
export default {
  name: "CameraRecordDot",
  props: {
    camera: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <VIcon
    :color="camera.record ? 'red' : 'white'"
    icon="mdi-record"
    class="record"
    size="large"
    :class="{'pulse':camera.record}"
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