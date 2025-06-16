<script>
import Hls from "hls.js"
import CameraRecordDot from "../../chunks/camera/CameraRecordDot.vue";

export default {
  name: "CameraPage",
  components: {CameraRecordDot},
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      camera: null,
      playing: false
    }
  },
  computed: {
    token() {
      return this.$store.getters['getToken']
    },
    loading() {
      return this.$store.getters['isLoading']
    },
    src() {
      return `/api/cameras/${this.camera.id}/stream/index.m3u8`
    }
  },
  watch: {
    async id() {
      if (typeof this.id === "number") {
        await this.getCamera()
      }
    }
  },
  async created() {
    await this.getCamera()
    this.$store.commit('setTitle', this.$t('Camera: {name}', {name: this.camera.name}))

  },
  methods: {
    play() {
      this.playing = true
      this.$refs.video.play()
    },
    pause() {
      this.playing = false
      this.$refs.video.pause()
    },
    async getCamera() {
      this.camera = await this.$store.dispatch('getCamera', this.id)
      await Promise.resolve(
          this.$nextTick(() => {
            if (this.$refs.video.canPlayType('application/vnd.apple.mpegurl')) {
              this.$refs.video.src = this.src;
              //
              // If no native HLS support, check if HLS.js is supported
              //
            } else if (Hls.isSupported()) {
              const hls = new Hls({
                maxLiveSyncPlaybackRate: 1.5,
                xhrSetup: xhr => {
                  xhr.setRequestHeader("Authorization", `Bearer ${this.token}`);
                },
              });
              hls.loadSource(this.src);
              hls.attachMedia(this.$refs.video);
              hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                this.$refs.video.muted = true;
                this.play()
              });
            }
            // this.$refs.video.src = this.src
          })
      )
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
    <video
      ref="video"
      class="bg-grey-darken-1 rounded-lg"
      controls
    />
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
    </VSheet>
    {{ camera }}
  </VSheet>
</template>

<style lang="scss" scoped>
.video-wrapper {
  video {
    max-height: 640px;
    width: 100%;
  }
}
</style>