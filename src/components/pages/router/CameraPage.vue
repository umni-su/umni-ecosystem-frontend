<script>
import CameraRecordDot from "../../chunks/camera/CameraRecordDot.vue";
import CameraForm from "../../chunks/camera/CameraForm.vue";
import SidebarPanel from "../../chunks/SidebarPanel.vue";
import CameraRootArea from "../../chunks/camera/CameraRootArea.vue";

export default {
  name: "CameraPage",
  components: {CameraRootArea, SidebarPanel, CameraForm, CameraRecordDot},
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      hideDrawings: false,
      alert: false,
      camera: null,
      playing: false,
      url: null,
      src: null,
      open: true,
    }
  },

  computed: {
    token() {
      return this.$store.getters['getToken']
    },
    lastMessage() {
      return this.$store.getters['getWsLastMessage']
    },
    title() {
      return this.camera?.id ? this.$t('Edit camera') : this.$t('Add camera')
    }
  },
  watch: {
    async id() {
      if (typeof this.id === "number") {
        this.pause()
        await this.getCamera()
        this.play()
      }
    },
    lastMessage: {
      deep: true,
      handler(newVal) {
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
    this.playing = true
  },
  beforeUnmount() {
    this.$refs.stream.stop()
    window.stop()
  },
  methods: {
    async play() {
      await this.$refs.stream.start()
      this.playing = true
    },
    pause() {
      this.playing = false
      this.$refs.stream.stop()
    },
    async getCamera() {
      this.camera = await this.$store.dispatch('getCamera', this.id)
      this.$store.commit('setTitle', this.camera.name)
    },
    openModal() {
      this.open = !this.open
    }
  }
}
</script>

<template>
  <VSheet
    v-if="camera"
    class="ma-auto pa-4 video-wrapper position-relative fill-height"
    color="white"
    width="100%"
  >
    <VSheet
      :color="alert ? 'error' : 'grey-lighten-2'"
      class="border-lg overflow-hidden position-relative mx-auto d-flex align-center justify-center"
    >
      <VSheet
        height="600"
        class="overflow position-absolute"
        :style="`background-image:url(${$refs.stream?.src});`"
      />
      <CameraRootArea
        ref="stream"
        :hide-drawings="hideDrawings"
        :camera="camera"
      />
    </VSheet>

    <VSheet
      class="actions text-center pa-2"
    >
      <CameraRecordDot :camera="camera" />

      <VBtn
        icon="mdi-image"
        color="orange"
        variant="tonal"
        density="comfortable"
        class="mr-2"
        @click="hideDrawings = !hideDrawings"
      />
      <VBtn
        v-if="!playing"
        icon="mdi-play"
        color="orange"
        variant="tonal"
        density="comfortable"
        class="mr-2"
        @click="play()"
      />
      <VBtn
        v-else
        icon="mdi-pause"
        color="secondary"
        variant="tonal"
        density="comfortable"
        class="mr-2"
        @click="pause()"
      />
      <VBtn
        readonly
        icon="mdi-file-refresh"
        color="secondary"
        variant="tonal"
        density="comfortable"
        class="mr-2"
      />
      <VBtn
        readonly
        icon="mdi-cloud-upload"
        color="secondary"
        variant="tonal"
        density="comfortable"
        class="mr-2"
      />
      <VBtn
        readonly
        icon="mdi-folder-play"
        color="secondary"
        variant="tonal"
        density="comfortable"
        class="mr-2"
      />
      <VBtn
        readonly
        icon="mdi-folder-multiple-image"
        color="secondary"
        variant="tonal"
        density="comfortable"
        class="mr-2"
      />
      <VBtn
        icon="mdi-cog"
        color="primary"
        density="comfortable"
        variant="tonal"
        class="mr-2"
        :text="$t('Settings')"
        @click="openModal"
      />
    </VSheet>
    <SidebarPanel
      v-model="open"
      :title="title"
      :camera-model="camera"
    >
      <CameraForm :camera-model="camera" />
    </SidebarPanel>
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