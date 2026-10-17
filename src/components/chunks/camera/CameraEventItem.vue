<script>
import secondsToHms from '../../../js/helpers/secondsToHms.js'
import CameraEventImage from './CameraEventImage.vue'

export default {
  name: 'CameraEventItem',
  components: {CameraEventImage},
  emits: ['on-check'],
  props: {
    event: {
      type: Object,
      required: true
    },
    mode: {
      type: String,
      default: 'card'
    }
  },
  data() {
    return {
      src: null,
      selected: false
    }
  },
  computed: {
    area() {
      return this.event?.area
    },
    hasEnd() {
      return this.event?.end !== null
    },
    format() {
      return this.$store.getters['getDateTimeFormat'] + ':ss'
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
    onUpdateCheckbox(e) {
      this.$emit('on-check', e)
    },
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
    v-if="event && mode==='card'"
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
          icon="mdi-texture-box"
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
  <tr
    v-else-if="event && mode==='row'"
  >
    <td>
      <VCheckbox
        v-model="selected"
        @update:model-value="onUpdateCheckbox"
      />
    </td>
    <td>
      <VSheet
        class="position-relative mt-2"
        width="110"
        height="60"
      >
        <CameraEventImage
          v-if="src"
          :download="false"
          :event="event"
        />
        <VSkeletonLoader
          v-else
          width="90"
          height="60"
        />
      </VSheet>
    </td>
    <td>
      {{ event.id }}
    </td>
    <td>
      <VBtn
        v-if="area"
        readonly
        density="comfortable"
        variant="flat"
        rounded="pill"
        :color="area.color"
        prepend-icon="mdi-texture-box"
        :text="area.name"
      />
      <span v-else>
        {{ recording.path }}
      </span>
    </td>
    <td
      class="text-right"
      style="min-width:250px"
    >
      <VBtn
        v-if="recording !== null"
        readonly
        density="compact"
        variant="text"
        color="red"
        size="small"
        class="mb-1"
        rounded="pill"
        icon="mdi-record"
      />
      <VBtn
        density="compact"
        size="small"
        variant="plain"
        readonly
        color="default"
        class="mr-1 mb-1"
        :icon="isImage?'mdi-camera':'mdi-video'"
      />
      {{ $moment(event.start).fromNow() }}
      <span v-if="duration">
        ({{ duration.h }}:
        {{ duration.m }}:
        {{ duration.s }})
      </span>
      <div
        v-if="format"
        class="text-body-small opacity-70"
      >
        <span v-if="hasEnd">
          {{ $moment(event.start).format(format) }} - {{ $moment(event.end).format(format) }}
        </span>
        <span v-else>
          {{ $moment(event.start).format(format) }}
        </span>
      </div>
    </td>
    <td class="text-center">
      <VBtn
        density="compact"
        variant="text"
        color="default"
        :to="{name:'event', params:{id: event.id}}"
        icon="mdi-chevron-right"
        class="mr-4"
      />
      <VBtn
        density="compact"
        variant="text"
        icon="mdi-trash-can"
        color="error"
      />
    </td>
  </tr>
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