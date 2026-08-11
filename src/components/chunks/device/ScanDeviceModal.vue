<script>
import ModalDialog from '../ModalDialog.vue'
import PluginsSelect from '../plugins/PluginsSelect.vue'
import PluginDeviceSearchItem from '../plugins/PluginDeviceSearchItem.vue'
import {createSuccessNotification} from '../../../js/helpers/notificationHelper.js'

export default {
  name: 'ScanDeviceModal',
  components: {PluginDeviceSearchItem, PluginsSelect, ModalDialog},
  data() {
    return {
      loading: false,
      activePlugin: null,
      devices: []
    }
  },
  computed: {
    isScanning() {
      return this.$store.getters['devices/isScanning']
    }
  },
  methods: {
    async scanDevices(id) {
      this.loading = true
      this.devices = []
      const res = await this.$store.dispatch('plugins/scanPluginDevices', id).finally(() => {
        this.loading = false
      })
      if (res) {
        this.devices = res
      }
    },
    async addScanDevice(item) {
      this.loading = true
      const res = await this.$store.dispatch('plugins/addPluginDevice', {
        id: item.plugin_id,
        external_id: item.external_id
      }).finally(() => {
        this.loading = false
      })
      if (res) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Device added successfully')))
      }
    }
  },
  watch: {
    activePlugin: {
      deep: true,
      async handler(val) {
        if (val !== null && val !== undefined && val.hasOwnProperty('id')) {
          await this.scanDevices(val.id)
        }
      }
    }
  }
}
</script>

<template>
  <ModalDialog
    :title="$t('Select plugin')"
    :model-value="isScanning"
    @update:model-value="$store.commit('devices/setScanMode', $event)"
  >
    <PluginsSelect
      v-model="activePlugin"
      :disabled="loading"
    />
    <VProgressLinear
      v-if="loading"
      indeterminate
      class="my-4"
      color="primary"
    />
    <VSheet class="my-4">
      <PluginDeviceSearchItem
        v-for="item in devices"
        :key="item.external_id"
        class="mb-4"
        :item="item"
      >
        <template #append>
          <VBtn
            icon="mdi-plus"
            color="green"
            density="comfortable"
            variant="tonal"
            class="ml-2"
            rounded="pill"
            @click="addScanDevice(item)"
          />
        </template>
      </PluginDeviceSearchItem>
    </VSheet>
  </ModalDialog>
</template>

<style scoped>

</style>