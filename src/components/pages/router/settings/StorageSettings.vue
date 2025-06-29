<script>
import StorageListItem from "../../../chunks/storage/StorageListItem.vue";
import ModalDialog from "../../../chunks/ModalDialog.vue";
import {
  createManyNotifications,
  createSuccessNotification,
  createWarningNotification
} from "../../../../js/helpers/notificationHelper.js";
import ConfirmationDialog from "../../../chunks/ConfirmationDialog.vue";

export default {
  name: "StorageSettings",
  components: {ConfirmationDialog, ModalDialog, StorageListItem},
  data() {
    return {
      open: false,
      model: {
        active: true
      }
    }
  },
  computed: {
    storages() {
      return this.$store.getters['getStorages']
    },
    loading() {
      return this.$store.getters['isLoading']
    },
    title() {
      return this.model.hasOwnProperty('id') ? this.$t('Edit storage') : this.$t('Add storage')
    }
  },
  async created() {
    await this.getStorages();
  },
  methods: {
    async getStorages() {
      await this.$store.dispatch('getStorages');
    },
    async deleteStorage(storage) {
      const ok = await this.$refs.conf.show({
        title: this.$t('Delete storage'),
        message: this.$t('All data will be deleted'),
        okText: this.$t('Delete'),
        okIcon: 'mdi-trash-can'
      });
      if (ok) {
        if (await this.$store.dispatch('deleteStorage', storage.id)) {
          this.$store.commit('addNotification', createWarningNotification(this.$t('Deleted')))
        }
      }

    },
    async saveStorage() {
      const method = this.model.hasOwnProperty('id') ? 'updateStorage' : 'addStorage'
      const res = await this.$store.dispatch(method, this.model).catch(e => {
        this.$store.commit('addNotification', createManyNotifications('error', e.response.data.detail))
      })
      if (res) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
        this.model = {
          active: true
        }
        this.open = false
      }
    },
    openModal(storage = {}) {
      this.open = true;
      this.model = storage;
    }
  }
}
</script>

<template>
  <VCard
    class="mt-3"
    :loading="loading"
  >
    <template #append>
      <VBtn
        variant="plain"
        density="comfortable"
        icon="mdi-plus"
        color="default"
        @click="openModal({active:true})"
      />
      <VBtn
        variant="plain"
        density="comfortable"
        icon="mdi-reload"
        color="default"
        :disabled="loading"
        :loading="loading"
        @click="getStorages()"
      />
    </template>
    <template #title>
      {{ $t('Storage settings') }}
    </template>
    <template #text>
      <VList>
        <StorageListItem
          v-for="storage in storages"
          :key="storage.id"
          :storage="storage"
          @on-click="openModal(storage)"
          @on-edit="openModal(storage)"
          @on-delete="deleteStorage(storage)"
        />
      </VList>
    </template>
    <ModalDialog
      v-model="open"
      :title="title"
    >
      <VTextField
        v-model="model.name"
        class="mb-4"
        :label="$t('Name')"
      />
      <VTextField
        v-model="model.path"
        class="mb-2"
        :label="$t('Path')"
      />
      <VCheckbox
        v-model="model.active"
        hide-details
        :true-value="true"
        :false-value="false"
        :label="$t('Is active')"
      />
      <template #actions>
        <VBtn
          :text="$t('Save')"
          :disabled="loading"
          :loading="loading"
          prepend-icon="mdi-content-save"
          @click="saveStorage"
        />
      </template>
    </ModalDialog>
    <ConfirmationDialog ref="conf" />
  </VCard>
</template>

<style scoped>

</style>