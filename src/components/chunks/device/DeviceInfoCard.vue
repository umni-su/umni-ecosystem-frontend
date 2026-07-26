<script>
import ModalDialog from '../ModalDialog.vue'
import {createSuccessNotification} from '../../../js/helpers/notificationHelper.js'
import DeviceCardCharacteristicItem from '../DeviceCardCharacteristicItem.vue'

export default {
  name: 'DeviceInfoCard',
  components: {DeviceCardCharacteristicItem, ModalDialog},
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showForm: false,
      src: null,
      title: null
    }
  },
  computed: {
    token() {
      return this.$store.state.token
    },
    lastSyncFromNow() {
      return this.$moment(this.device.last_sync).fromNow()
    },
    typeStr() {
      return this.device.plugin.name
    },
    name() {
      return this.device.title ? `${this.device.title.toUpperCase()} (${this.device.name.toUpperCase()})` : this.device.name.toUpperCase()
    },
    online() {
      return this.device?.online
    },
    memoryUsage() {
      return 100 - (this.device?.free_heap * 100 / this.device.total_heap)
    },
    memoryColor() {
      if (this.memoryUsage <= 50) return 'green'
      if (this.memoryUsage > 50 && this.memoryUsage < 75) return 'orange'
      if (this.memoryUsage > 75) return 'red'
      return 'grey'
    }
  },
  watch: {
    device: {
      deep: true,
      handler(device) {
        this.title = device.title
      }
    }
  },
  async created() {
    await this.getImage()
  },
  methods: {
    async setCover(e) {
      this.cover = e.target.files[0]
      const ok = await this.$store.dispatch('devices/updateDeviceCover', {
        id: this.device.id,
        cover: this.cover
      })
      if (ok) {
        await this.getImage()
      }
    },
    openEditModal() {
      this.showForm = !this.showForm
    },
    async save() {
      const res = await this.$store.dispatch('devices/updateDevice', {
        id: this.device.id,
        title: this.device.title
      })
      if (res) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
      }
    },
    async getImage() {
      if (this.device) {
        this.src = await this.$store.dispatch('devices/getDeviceCover', this.device.id)
      }
    },
    async locateDevice() {
      this.disabled = true
      const success = await this.$store.dispatch('devices/locateDevice', this.device.id).finally(() => {
        this.disabled = false
      })
      if (success) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Success')))
      }
    }
  }
}
</script>

<template>
  <VCard
    v-if="device"
    width="100%"
  >
    <template #title>
      {{ name.toUpperCase() }}
    </template>
    <template #subtitle>
      {{ $t('Last update') }}: {{ lastSyncFromNow }}
    </template>
    <template #text>
      <VSheet
        v-if="device.photo !== null && src !== null"
        class="mb-2"
      >
        <VImg
          height="120"
          cover
          :src="src"
        />
      </VSheet>
      <DeviceCardCharacteristicItem
        class="mb-2"
        icon="mdi-power"
        :title="$t('Status')"
      >
        <template #value>
          <VChip
            :color="online ? 'green' : 'red'"
            rounded="pill"
            density="comfortable"
            prepend-icon="mdi-circle"
            :text="online ? $t('Online') : $t('Offline')"
          />
        </template>
      </DeviceCardCharacteristicItem>
      <DeviceCardCharacteristicItem
        icon="mdi-memory"
        :title="$t('Memory')"
      >
        <template #value>
          <div class="d-flex align-center justify-between">
            <VProgressLinear
              :color="memoryColor"
              :model-value="memoryUsage.toFixed(2)"
            />
            <div class="text-subtitle-2 ml-4 font-weight-bold opacity-50">
              {{ memoryUsage.toFixed(2) }}%
            </div>
          </div>
        </template>
      </DeviceCardCharacteristicItem>
      <VBtn
        class="mt-4"
        density="comfortable"
        rounded="pill"
        color="success"
        variant="tonal"
        :text="$t('Locate')"
        prepend-icon="mdi-map-marker"
        @click="locateDevice"
      />
      <VEmptyState
        v-if="device.location_id === null"
        class="mt-4 text-center border-md border-dashed rounded-lg"
      >
        <template #text>
          {{ $t('Location provides order and expands the possibilities of interaction between device') }}
        </template>
        <template #actions>
          <VBtn
            color="primary"
            variant="flat"
            prepend-icon="mdi-map-marker"
            :text="$t('Assign location')"
          />
        </template>
      </VEmptyState>
    </template>
    <template #append>
      <VChip
        class="mr-4"
        color="primary"
        density="compact"
        :text="typeStr"
      />
      <VBtn
        density="comfortable"
        variant="plain"
        icon="mdi-pencil"
        color="default"
        @click="openEditModal"
      />
      <VMenu>
        <template #activator="{props}">
          <VBtn
            density="comfortable"
            variant="plain"
            v-bind="props"
            icon="mdi-dots-vertical"
            color="default"
          />
        </template>
        <input
          ref="cover"
          type="file"
          class="d-none"
          accept="image/*"
          @change="setCover"
        >
        <VList>
          <VListItem
            prepend-icon="mdi-camera"
            :title="$t('Change cover')"
            @click="$refs.cover.click()"
          />
          <VListItem
            prepend-icon="mdi-trash-can"
            color="red"
            :title="$t('Delete')"
          />
        </VList>
      </VMenu>
      <ModalDialog
        v-model="showForm"
        :title="$t('Device info')"
      >
        <VTextField
          v-model="device.title"
          :label="$t('Title')"
        />
        <template #actions>
          <VBtn
            prepend-icon="mdi-content-save"
            :text="$t('Save')"
            @click="save"
          />
        </template>
      </ModalDialog>
    </template>
  </VCard>
</template>

<style scoped>

</style>