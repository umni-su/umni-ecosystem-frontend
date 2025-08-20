<script>
import CameraRecordDot from './CameraRecordDot.vue'

export default {
  name: 'CameraItem',
  components: {CameraRecordDot},
  props: {
    camera: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      alert: false,
      src: null,
      height: 200
    }
  },
  computed: {
    lastMessage() {
      return this.$store.getters['getWsLastMessage']
    }
  },
  watch: {
    lastMessage: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.camera_id === this.camera.id) {
          switch (newVal.topic) {
          case 'detection.start':
            this.alert = true
            break
          case 'detection.end':
            this.alert = false
            break
          }
        }
      }
    },
    camera: {
      deep: true,
      async handler(newVal, oldVal) {
        if (newVal.cover !== null) {
          this.src = await this.$store.dispatch('getCameraCover', {id: newVal.id, w: 400})
        } else {
          this.src = null
        }
      }
    }
  },
  async created() {
    this.src = await this.$store.dispatch('getCameraCover', {id: this.camera.id, w: 400})
    // this.height = this.$refs.card.$el.clientWidth / 4 * 3
    // window.addEventListener("resize", () => {
    //   this.height = this.$refs.card.$el.clientWidth / 4 * 3
    // })
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
      :color="alert ? 'error' : null"
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
        <VSkeletonLoader
          v-else
          width="100%"
          :height="height"
        />
      </template>
      <template #text>
        <div class="overflow text-white pa-4">
          <div class="text-h6 ma-0 title">
            {{ camera.name }}
          </div>

          <div class="bottom">
            <VBtn
              icon="mdi-folder-play"
              color="white"
              variant="plain"
              density="compact"
              class="mx-4"
              @click.stop="$router.push({name:'camera-events',params:{id:camera.id}})"
            />
            <CameraRecordDot :camera="camera" />
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
}

.bottom {
  text-align: right;
  position: absolute;
  bottom: 10px;
  right: 10px;
  left: 10px;
  z-index: 10;
}

</style>