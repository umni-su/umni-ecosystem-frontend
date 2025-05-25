<script>
import {mapType} from "../../../js/helpers/mapDeviceType.js";
import ModalDialog from "../ModalDialog.vue";
import {createSuccessNotification} from "../../../js/helpers/notificationHelper.js";

export default {
  name: "DeviceInfoCard",
  components: {ModalDialog},
  props: {
    device: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      showForm: false,
      src: null
    }
  },
  computed: {
    token() {
      return this.$store.state.token;
    },
    lastSyncFromNow() {
      return this.$moment(this.device.last_sync).fromNow()
    },
    typeStr() {
      return this.$t(mapType(this.device.type))
    },
    name() {
      return this.device.title ? this.device.title.toUpperCase() : this.device.name.toUpperCase()
    },
  },
  async created() {
    await this.getImage()
  },
  methods: {
    async setCover(e) {
      this.cover = e.target.files[0]
      const ok = await this.$store.dispatch('updateDeviceCover', {
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
      const res = await this.$store.dispatch('updateDevice', {
        id: this.device.id,
        title: this.device.title,
      })
      if (res) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
      }
    },
    async getImage() {
      if (this.device) {
        this.src = await this.$store.dispatch('getDeviceCover', this.device.id)
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