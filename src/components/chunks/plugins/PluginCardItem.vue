<script>
import {createErrorNotification, createSuccessNotification} from '../../../js/helpers/notificationHelper.js'
import ConfirmationDialog from '../ConfirmationDialog.vue'
import ModalDialog from '../ModalDialog.vue'
import ConfigurationDynamicField from '../configuration/ConfigurationDynamicField.vue'

export default {
  name: 'PluginCardItem',
  components: {ConfigurationDynamicField, ModalDialog, ConfirmationDialog},
  props: {
    plugin: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      src: null,
      active: false,
      loading: false,
      opened: false,
      config: {}
    }
  },
  computed: {
    isCore() {
      return this.plugin.is_core
    }
  },
  async created() {
    await this.getImage()
    this.active = this.plugin.active
  },
  methods: {
    async getImage() {
      this.src = await this.$store.dispatch('plugins/getPluginLogo', this.plugin.name)
    },
    async togglePluginState() {
      const active = !this.active
      const ok = await this.$refs.confirm.show({
        title: this.$t('Change plugin state'),
        message: active ? this.$t('Plugin will be started') : this.$t('Plugin will be stopped'),
        okText: active ? this.$t('Enable') : this.$t('Disable'),
        okIcon: active ? 'mdi-power' : 'mdi-power-off'
      })
      if (ok) {
        this.loading = true
        const res = await this.$store.dispatch('plugins/toggleState', {
          plugin_id: this.plugin.id,
          active: active
        }).catch((e) => {
          this.$store.commit('addNotification', createErrorNotification(e.response.data.message))
        }).finally(() => {
          this.loading = false
        })
        if (res) {
          this.$store.commit('addNotification', createSuccessNotification(res.message))
          this.active = active
          this.$store.commit('plugins/addPlugin', {...this.plugin, ...{active: this.active}})
        }
      }
    },
    async getSchema() {
      this.config = await this.$store.dispatch('plugins/getPluginSchema', this.plugin.id)
      this.opened = true
    },
    async savePluginSchema() {
      const fields = {}
      Object.keys(this.config.fields).map(key => {
        fields[key] = this.config.fields[key].value
        return key
      })
      const res = await this.$store.dispatch('plugins/savePluginSchema', {
        id: this.plugin.id,
        config: {
          name: this.config.model_name,
          schema: fields
        }
      })
      if (res) {
        this.$store.commit(
          'addNotification',
          createSuccessNotification(this.$t('Saved'))
        )
      }
    }
  }
}
</script>
<template>
  <VCard
    :disabled="loading"
    :loading="loading"
    hover
    class="text-center pt-4"
  >
    <VCardTitle>
      <VImg
        v-if="src"
        class="mx-auto mb-2"
        max-width="170"
        max-height="70"
        :src="src"
      />
      {{ plugin.display_name }}
    </VCardTitle>
    <VCardSubtitle>
      {{ plugin.description }}
    </VCardSubtitle>
    <VCardSubtitle class="pt-2 d">
      <VBtn
        prepend-icon="mdi-account"
        variant="text"
        color="default"
        readonly
        density="comfortable"
        size="small"
        :text="plugin.author"
      />
      <VBtn
        prepend-icon="mdi-tag"
        variant="text"
        color="default"
        readonly
        density="comfortable"
        size="small"
        :text="plugin.version"
      />
    </VCardSubtitle>
    <VCardActions class="px-4 justify-center">
      <VBtn
        v-if="!isCore"
        size="small"
        density="comfortable"
        icon="mdi-power-standby"
        :color="active ? 'success' : 'grey'"
        :variant="active ? 'tonal' : 'plain'"
        @click="togglePluginState"
      />
      <VBtn
        v-else
        readonly
        disabled
        size="small"
        density="comfortable"
        icon="mdi-database"
        color="default"
      />
      <VBtn
        size="small"
        density="comfortable"
        color="default"
        icon="mdi-cog"
        @click="getSchema"
      />
      <VBtn
        v-tooltip="plugin.url"
        size="small"
        density="comfortable"
        color="default"
        icon="mdi-open-in-new"
        :href="plugin.url"
        target="_blank"
      />
    </VCardActions>
    <ModalDialog
      v-if="config.fields"
      v-model="opened"
    >
      {{ config.fields }}
      <ConfigurationDynamicField
        v-for="(field, key) in config.fields"
        v-model="config.fields[key].value"
        class="mb-4"
        :field="field"
      />
      <template #actions>
        <VBtn
          :text="$t('Save')"
          prepend-icon="mdi-content-save"
          @click="savePluginSchema"
        />
      </template>
    </ModalDialog>
    <ConfirmationDialog ref="confirm"/>
  </VCard>
</template>

<style scoped>

</style>