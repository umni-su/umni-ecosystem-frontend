<script>
import CameraVideoPlayer from '../../chunks/camera/CameraVideoPlayer.vue'
import CameraTimeline from '../../chunks/camera/CameraTimeline.vue'
import CameraEventsBar from '../../chunks/camera/CameraEventsBar.vue'
import SidebarPanel from '../../chunks/SidebarPanel.vue'
import CameraRecordingPlayback from '../../chunks/camera/CameraRecordingPlayback.vue'
import CameraEventDetails from '../../chunks/camera/CameraEventDetails.vue'

export default {
  name: 'CameraEventPage',
  components: {
    CameraEventDetails,
    CameraRecordingPlayback, SidebarPanel, CameraEventsBar, CameraTimeline, CameraVideoPlayer
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      asTimeLine: false,
      url: null,
      event: null,
      open: true
    }
  },
  computed: {
    playback() {
      return this.$store.getters['getPlayback']
    }
  },
  watch: {
    async id() {
      this.url = null
      await this.init()
    }
  },
  async created() {
    await this.init()
  },
  methods: {
    async init() {
      await this.getEvent()
      await this.getUrl()
      this.$store.commit('setTitle', this.$t('Event {id}', {id: this.id}))
    },
    async getEvent() {
      this.event = await this.$store.dispatch('getCameraEvent', this.id)
    },
    async getUrl() {
      const url = await this.$store.dispatch('getEventStream', this.id)
      this.url = URL.createObjectURL(url)
    }
  }
}
</script>

<template>
  <VCard
    v-if="event"
    class="pa-4 position-relative"
    color="default"
  >
    <VSheet class="mode-switcher">
      <VBtn
        density="comfortable"
        :color="!asTimeLine ? 'primary':'white'"
        :variant="!asTimeLine ? 'flat':'text'"
        icon="mdi-image"
        class="mr-2"
        @click="asTimeLine = false"
      />
      <VBtn
        density="comfortable"
        :color="asTimeLine ? 'primary':'white'"
        :variant="asTimeLine ? 'flat':'text'"
        icon="mdi-timeline"
        class="mr-2"
        @click="asTimeLine = true"
      />
      <VBtn
        density="comfortable"
        color="white"
        variant="text"
        icon="mdi-menu"
        @click="open = !open"
      />
    </VSheet>

    <SidebarPanel v-model="open">
      <CameraRecordingPlayback
        style="z-index: 10"
        :event="event"
      />
      <CameraEventDetails :event="event" />
    </SidebarPanel>
    <CameraVideoPlayer
      v-if="url"
      :src="url"
      :event="event"
    />
    <VSkeletonLoader
      v-else
      height="640"
      width="100%"
    />
    <VSheet
      v-if="event.camera"
      position="relative"
    >
      <CameraTimeline
        v-if="asTimeLine"
        :event="event"
      />
      <CameraEventsBar
        v-else
        :event="event"
      />
    </VSheet>
  </VCard>
</template>

<style scoped lang="scss">
.mode-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}
</style>