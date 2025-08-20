<script>
import {eventTypeToColor} from '../../../js/helpers/cameraHelper.js'
import CameraEventImage from './CameraEventImage.vue'
import secondsToHms from '../../../js/helpers/secondsToHms.js'
import ConfirmationDialog from '../ConfirmationDialog.vue'
import {createSuccessNotification} from '../../../js/helpers/notificationHelper.js'

export default {
  name: 'CameraEventDetails',
  components: {ConfirmationDialog, CameraEventImage},
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
    },
    token(){
      return this.$store.getters['getToken']
    },
    downloadUrl(){
      return `/api/events/${this.event.id}/download?token=${this.token}`
    }
  },

  methods: {
    eventTypeToColor,
    async deleteEvent(){
      const ok = await this.$refs.confirm.show({
        title: this.$t('Delete event'),
        message: this.$t('Event with files will be deleted'),
        okText: this.$t('Delete'),
        okIcon: 'mdi-trash-can'
      })
      if(ok){
        const res = await this.$store.dispatch('deleteCameraEvent', this.event.id)
        if(res){
          this.$router.push({name:'camera-events', params:{id:this.camera.id}})
          this.$store.commit('addNotification', createSuccessNotification(this.$t('Event has been deleted')))
        }

      }
    }
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
              :href="downloadUrl"
              target="_blank"
            />
          </template>
          <template #append>
            <VBtn
              color="red"
              density="comfortable"
              variant="tonal"
              prepend-icon="mdi-trash-can"
              :text="$t('Delete')"
              @click="deleteEvent"
            />
          </template>
        </VListItem>
      </VList>
    </VSheet>
    <ConfirmationDialog ref="confirm"/>
  </VSheet>
</template>

<style scoped>

</style>