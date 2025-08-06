<script>
import {eventTypeToColor} from '../../../js/helpers/cameraHelper.js'
import CameraEventImage from './CameraEventImage.vue'
import secondsToHms from '../../../js/helpers/secondsToHms.js'

export default {
  name: 'CameraEventDetails',
  components: {CameraEventImage},
  props: {
    event: {
      type: Object,
      required: true
    }
  },

  computed: {
    area() {
      return this.event.area
    },
    camera() {
      return this.event.camera
    },
    recording() {
      return this.event.recording
    },
    format() {
      return this.$store.getters['getDateTimeFormat']
    },
    event_duration() {
      return this.event ? secondsToHms(this.event.duration) : 0
    },
    record_duration() {
      return this.recording ? secondsToHms(this.recording.duration) : 0
    }
  },

  methods: {
    eventTypeToColor
  }
}
</script>

<template>
  <VSheet>
    <VChip
      :to="{name:'camera', params: {id: camera.id}}"
      :text="camera.name"
      prepend-icon="mdi-video"
      color="primary"
      variant="tonal"
    />
    <VIcon
      v-if="area"
      icon="mdi-chevron-right"
    />
    <VChip
      v-if="area"
      variant="tonal"
      :text="area.name"
      prepend-icon="mdi-texture-box"
      :color="eventTypeToColor(event.type)"
    />

    <VSheet class="mt-4">
      <CameraEventImage
        :download="true"
        :event="event"
      />
      <VList density="compact">
        <VListSubheader :title="$t('Event')" />
        <VListItem>
          <template #prepend>
            <VBtn
              density="compact"
              variant="text"
              color="default"
              :text="$t('Start')"
              prepend-icon="mdi-clock-start"
              readonly
            />
          </template>
          <template #append>
            {{ $moment(event.start).format(format) }}
          </template>
        </VListItem>
        <VListItem>
          <template #prepend>
            <VBtn
              density="compact"
              variant="text"
              color="default"
              :text="$t('End')"
              prepend-icon="mdi-clock-end"
              readonly
            />
          </template>
          <template #append>
            {{ $moment(event.end).format(format) }}
          </template>
        </VListItem>
        <VListItem>
          <template #prepend>
            <VBtn
              density="compact"
              variant="text"
              color="default"
              :text="$t('Duration')"
              prepend-icon="mdi-timer-outline"
              readonly
            />
          </template>
          <template #append>
            {{ `${event_duration.h}:${event_duration.m}:${event_duration.s}` }}
          </template>
        </VListItem>

        <VListSubheader
          v-if="recording"
          :title="$t('Record')"
        />
        <VListItem v-if="recording">
          <template #prepend>
            <VBtn
              density="compact"
              variant="text"
              color="default"
              :text="$t('Start')"
              prepend-icon="mdi-clock-start"
              readonly
            />
          </template>
          <template #append>
            {{ $moment(recording.start).format(format) }}
          </template>
        </VListItem>
        <VListItem v-if="recording">
          <template #prepend>
            <VBtn
              density="compact"
              variant="text"
              color="default"
              :text="$t('End')"
              prepend-icon="mdi-clock-end"
              readonly
            />
          </template>
          <template #append>
            {{ $moment(recording.end).format(format) }}
          </template>
        </VListItem>
        <VListItem v-if="recording">
          <template #prepend>
            <VBtn
              density="compact"
              variant="text"
              color="default"
              :text="$t('Duration')"
              prepend-icon="mdi-timer-outline"
              readonly
            />
          </template>
          <template #append>
            {{ `${record_duration.h}:${record_duration.m}:${record_duration.s}` }}
          </template>
        </VListItem>
        <VListSubheader :title="$t('Actions')" />
        <VListItem>
          <template #prepend>
            <VBtn
              color="default"
              density="comfortable"
              variant="tonal"
              prepend-icon="mdi-download"
              :text="$t('Download')"
              class="mr-4"
            />
          </template>
          <template #append>
            <VBtn
              color="red"
              density="comfortable"
              variant="tonal"
              prepend-icon="mdi-trash-can"
              :text="$t('Delete')"
            />
          </template>
        </VListItem>
      </VList>
    </VSheet>
  </VSheet>
</template>

<style scoped>

</style>