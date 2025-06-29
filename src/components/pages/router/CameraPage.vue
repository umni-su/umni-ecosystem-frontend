<script>
import CameraRecordDot from "../../chunks/camera/CameraRecordDot.vue";
import CameraModal from "../../chunks/camera/CameraModal.vue";

export default {
  name: "CameraPage",
  components: {CameraModal, CameraRecordDot},
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      alert: true,
      camera: null,
      playing: false,
      url: null,
      src: null,
      open: false
    }
  },

  computed: {
    token() {
      return this.$store.getters['getToken']
    },
    loading() {
      return this.$store.getters['isLoading']
    },
    lastMessage() {
      return this.$store.getters['getWsLastMessage']
    }
  },
  watch: {
    async id() {
      if (typeof this.id === "number") {
        await this.getCamera()
      }
    },
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
    }
  },
  async mounted() {
    await this.getCamera()
    this.createUrl()
    await this.getCameraCover()
    this.playing = true
  },
  beforeUnmount() {
    this.url = null
    window.stop()
  },
  methods: {
    createUrl() {
      this.url = `/api/cameras/${this.camera.id}/stream?token=${this.token}`
    },
    async getCameraCover() {
      this.src = await this.$store.dispatch('getCameraCover', {id: this.camera.id, w: 700});
    },
    async play() {
      this.createUrl()
      await this.getCameraCover()
      this.playing = true
    },
    pause() {
      this.playing = false
      this.url = this.src
      window.stop()
    },
    async getCamera() {
      this.camera = await this.$store.dispatch('getCamera', this.id)
    },
    openModal() {
      this.open = true
    }
  }
}
</script>

<template>
  <VSheet
    v-if="camera"
    class="ma-auto video-wrapper position-relative"
    max-width="1000"
    width="100%"
  >
    <VSheet
      :color="alert ? 'error' : 'grey-lighten-2'"
      class="border-lg overflow-hidden position-relative mx-auto d-flex align-center justify-center"
    >
      <VSheet
        class="overflow position-absolute"
        :style="`background-image:url(${src})`"
      />
      <img
        ref="image"
        class="d-block video"
        width="600"
        :src="url"
      >
    </VSheet>

    <VSheet
      class="actions text-center pa-2"
    >
      <CameraRecordDot :camera="camera" />

      <VBtn
        v-if="!playing"
        icon="mdi-play"
        color="default"
        variant="plain"
        density="compact"
        class="mr-4"
        @click="play()"
      />
      <VBtn
        v-else
        icon="mdi-pause"
        color="default"
        variant="plain"
        density="compact"
        class="mr-4"
        @click="pause()"
      />
      <VBtn
        readonly
        icon="mdi-file-refresh"
        color="default"
        variant="plain"
        density="compact"
        class="mr-4"
      />
      <VBtn
        readonly
        icon="mdi-cloud-upload"
        color="default"
        variant="plain"
        density="compact"
        class="mr-4"
      />
      <VBtn
        readonly
        icon="mdi-folder-play"
        color="default"
        variant="plain"
        density="compact"
        class="mr-4"
      />
      <VBtn
        readonly
        icon="mdi-folder-multiple-image"
        color="default"
        variant="plain"
        density="compact"
        class="mr-4"
      />
      <VBtn
        icon="mdi-pencil"
        color="default"
        variant="plain"
        density="compact"
        class="mr-4"
        @click="openModal()"
      />
    </VSheet>
    {{ camera }}
    <CameraModal
      v-model="open"
      :camera-model="camera"
    />
  </VSheet>
</template>

<style lang="scss" scoped>
.overflow {
  background-repeat: no-repeat;
  background-size: cover;
  z-index: 0;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  filter: blur(10px);
  opacity: 0.7;
  background-color: rgba(0, 0, 0, 0.7);
}

.video {
  position: relative;
  z-index: 10
}
</style>