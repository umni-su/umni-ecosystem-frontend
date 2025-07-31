<script>
import CameraVideoPlayer from "../../chunks/camera/CameraVideoPlayer.vue";
import CameraTimeline from "../../chunks/camera/CameraTimeline.vue";
import CameraEventsBar from "../../chunks/camera/CameraEventsBar.vue";

export default {
  name: "CameraEventPage",
  components: {CameraEventsBar, CameraTimeline, CameraVideoPlayer},
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
      event: null
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
      this.event = await this.$store.dispatch('getCameraEvent', this.id);
    },
    async getUrl() {
      const url = await this.$store.dispatch('getEventStream', this.id)
      this.url = URL.createObjectURL(url);
    },
  }
}
</script>

<template>
  <VSheet
    v-if="event"
    class="pa-4 position-relative"
    color="default"
  >
    <VSheet class="mode-switcher">
      <VMenu max-width="400">
        <template #activator="{props}">
          <VBtn
            v-bind="props"
            icon="mdi-information"
            color="white"
            density="comfortable"
            class="mr-2"
          />
        </template>
        <VCard>
          <template #text>
            {{ playback }}
            {{ event }}
          </template>
        </VCard>
      </VMenu>
      <VBtnToggle
        v-model="asTimeLine"
        color="primary"
        density="comfortable"
      >
        <VBtn
          icon="mdi-image"
          :value="false"
        />
        <VBtn
          :value="true"
          icon="mdi-timeline"
        />
      </VBtnToggle>
    </VSheet>


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
  </VSheet>
</template>

<style scoped lang="scss">
.mode-switcher {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}
</style>