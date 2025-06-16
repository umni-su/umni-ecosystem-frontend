<script>
import CameraRecordDot from "./CameraRecordDot.vue";

export default {
  name: "CameraItem",
  components: {CameraRecordDot},
  props: {
    camera: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      src: null,
      height: 0
    }
  },
  async created() {
    this.src = await this.$store.dispatch('getCameraCover', {id: this.camera.id, w: 400})
    this.height = this.$refs.card.$el.clientWidth / 4 * 3
    window.addEventListener("resize", () => {
      this.height = this.$refs.card.$el.clientWidth / 4 * 3
    })
  }
}
</script>

<template>
  <VCol
    sm="4"
    cols="12"
  >
    <VCard
      ref="card"
      :class="{'opacity-50': !camera.active}"
      hover
      :height="height"
      variant="tonal"
      @click="$router.push({name: 'camera', params:{id: camera.id}})"
    >
      <template #image>
        <VImg
          v-if="src"
          cover
          :src="src"
        />
        <VSkeletonLoader v-else />
      </template>
      <template #text>
        <div class="overflow text-white pa-4">
          <div class="text-h6 ma-0 title">
            {{ camera.name }}
            <CameraRecordDot :camera="camera" />
          </div>

          <div class="bottom">
            <VBtn
              readonly
              icon="mdi-file-refresh"
              color="white"
              variant="plain"
              density="compact"
              class="mr-4"
            />
            <VBtn
              readonly
              icon="mdi-cloud-upload"
              color="white"
              variant="plain"
              density="compact"
              class="mr-4"
            />
            <VBtn
              readonly
              icon="mdi-folder-play"
              color="white"
              variant="plain"
              density="compact"
              class="mr-4"
            />
            <VBtn
              readonly
              icon="mdi-folder-multiple-image"
              color="white"
              variant="plain"
              density="compact"
              class="mr-4"
            />
          </div>
        </div>
      </template>
    </VCard>
  </VCol>
</template>

<style lang="scss" scoped>
.overflow {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);

  .record {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;

    &.pulse {
      animation: pulse 1s ease infinite;
    }
  }

  .bottom {
    position: absolute;
    bottom: 10px;
    right: 10px;
    left: 10px;
    z-index: 10;
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