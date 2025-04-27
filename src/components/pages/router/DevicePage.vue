<script>
import DeviceListItemSensor from "../../chunks/DeviceListItemSensor.vue";
import ModalDialog from "../../chunks/ModalDialog.vue";
import DeviceCardCharacteristicItem from "../../chunks/DeviceCardCharacteristicItem.vue";
import {mapType} from "../../../js/helpers/mapDeviceType.js";
import SimpleBar from 'simplebar-vue'

export default {
  name: "DevicePage",
  components: {
    DeviceCardCharacteristicItem,
    DeviceListItemSensor,
    ModalDialog,
    SimpleBar
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      cover: null,
      showForm: false,
      showMore: false
    }
  },
  computed: {
    device() {
      return this.$store.getters['getDevice']
    },
    name() {
      return this.device.title ? this.device.title : this.device.name.toUpperCase()
    },
    type() {
      return this.device.type
    },
    network() {
      return this.device.network_interfaces
    },
    lastSyncFromNow() {
      return this.$moment(this.device.last_sync).fromNow()
    },
    typeStr() {
      return this.$t(mapType(this.device.type))
    },
  },
  async mounted() {
    await this.getDevice()
  },
  methods: {
    async getDevice() {
      await this.$store.dispatch('getDevice', this.id)
      this.$store.commit('setTitle', this.$t('Devices'))
    },
    async setCover(e) {
      this.cover = e.target.files[0]
      await this.$store.dispatch('updateDeviceCover', {
        id: this.id,
        cover: this.cover
      })
    },
    openEditModal() {
      this.showForm = !this.showForm
    }

  }
}
</script>

<template>
  <VSheet
    v-if="device"
    class="ma-auto"
    max-width="1200"
    color="transparent"
  >
    <VContainer fluid>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VCard
            width="100%"
          >
            <template #title>
              {{ name.toUpperCase() }}
            </template>
            <template #subtitle>
              {{ $t('Last update') }}: {{ lastSyncFromNow }}
            </template>
            <template #text>
              <VEmptyState
                v-if="device.location_id === null"
                class="text-center border-md border-dashed rounded-lg"
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
            </template>
          </VCard>

          <VCard class="mt-8">
            <template #title>
              {{ $t('Network interfaces') }}
            </template>
            <template
              #text
            >
              <VSheet
                v-for="(net, index) in network"
                :key="net.id"
              >
                <DeviceCardCharacteristicItem
                  class="py-1"
                  icon="mdi-circle-medium"
                  :title="$t('Name')"
                  :value="net.name"
                />
                <DeviceCardCharacteristicItem
                  class="py-1"
                  icon="mdi-circle-medium"
                  :title="$t('IP address')"
                  :value="net.ip"
                />
                <DeviceCardCharacteristicItem
                  class="py-1"
                  icon="mdi-circle-medium"
                  :title="$t('MAC address')"
                  :value="net.mac.toUpperCase()"
                />
                <DeviceCardCharacteristicItem
                  class="py-1"
                  icon="mdi-circle-medium"
                  :title="$t('Netmask')"
                  :value="net.mask"
                />
                <DeviceCardCharacteristicItem
                  class="py-1"
                  icon="mdi-circle-medium"
                  :title="$t('Gateway')"
                  :value="net.gw"
                />
                <VDivider
                  v-if="index !== network.length - 1"
                  class="my-4"
                />
              </VSheet>
            </template>
          </VCard>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VCard>
            <template #title>
              {{ $t('Sensors') }}
            </template>
            <template #text>
              <SimpleBar
                class="hidden-list"
                :class="{more:showMore}"
              >
                <VList>
                  <DeviceListItemSensor
                    v-for="(sensor, key) in device.sensors"
                    :key="key"
                    v-model="device.sensors[key]"
                  />
                </VList>
              </SimpleBar>

              <VBtn
                variant="plain"
                :prepend-icon="showMore ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                :text="showMore ? $t('Show less') : $t('Show more')"
                density="compact"
                block
                @click="showMore = !showMore"
              />
            </template>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>

    <ModalDialog
      v-model="showForm"
      :title="name"
    >
      <VTextField
        v-model="device.title"
        :label="$t('Title')"
      />
    </ModalDialog>
  </VSheet>
</template>

<style scoped lang="scss">
.hidden-list {
  height: 388px;

  &.more {
    height: auto;
  }
}
</style>
