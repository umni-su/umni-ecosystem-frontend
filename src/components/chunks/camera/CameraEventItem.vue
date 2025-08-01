<script>
import secondsToHms from "../../../js/helpers/secondsToHms.js";

export default {
  name: "CameraEventItem",
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      src: null
    }
  },
  computed: {
    area() {
      return this.event?.area
    },
    recording() {
      return this.event?.recording
    },
    duration() {
      return this.event?.duration ? secondsToHms(this.event.duration.toFixed(2)) : null
    },
    record_duration() {
      return this.recording?.duration ? secondsToHms(this.recording.duration.toFixed(2)) : null
    },
    isImage() {
      /**
       * class CameraRecordTypeEnum(Enum):
       *     NONE = 0
       *     VIDEO = 1
       *     SCREENSHOTS = 2
       *     DETECTION_VIDEO = 3
       *     DETECTION_SCREENSHOTS = 4
       */
      return this.event?.type === 2 || this.event?.type === 4
    }
  },
  created() {
    this.getPreview()
  },
  methods: {
    getPreview() {
      this.$store.dispatch('getCameraEventScreenshot', {id: this.event.id, type: 'resized'}).then(res => {
        this.src = res
      })
    }
  }
}
</script>

<template>
  <VCard
    v-if="event"
    variant="text"
    hover
    @click="$router.push({name:'event', params:{id: event.id}})"
  >
    <VCardText class="pa-0">
      <VImg
        v-if="src"
        height="180"
        cover
        :src="src"
        :lazy-src="src"
      />
      <VSkeletonLoader
        v-else
        width="100%"
        height="180"
      />
      <div class="date">
        <VChip
          prepend-icon="mdi-clock"
          variant="flat"
          color="grey-darken-4"
          density="compact"
          :text="$moment(event.start).fromNow()"
        />
      </div>
      <VAlert
        variant="tonal"
        density="compact"
        class="area"
      >
        <template #prepend>
          <VBtn
            density="compact"
            variant="tonal"
            color="white"
            :icon="isImage?'mdi-camera':'mdi-video'"
          />
        </template>
        <VBtn
          v-if="area"
          v-tooltip="area.name"
          density="compact"
          variant="text"
          color="white"
          rounded="pill"
          icon="mdi-map-marker"
        />
        <VBtn
          v-if="recording !== null"
          density="compact"
          variant="text"
          color="red"
          rounded="pill"
          icon="mdi-record"
        />
      </VAlert>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  text-align: right;
}

.date {
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
}
</style>