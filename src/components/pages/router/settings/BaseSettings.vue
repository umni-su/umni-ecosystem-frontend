<script>
import {createSuccessNotification} from '../../../../js/helpers/notificationHelper.js'
import LanguageSwitcher from '../../../chunks/i18n/LanguageSwitcher.vue'
import {changeLanguage} from '../../../../js/i18n.js'

export default {
  name: 'BaseSettings',
  components: {LanguageSwitcher},
  data() {
    return {
      lang: null,
      configuration: null
    }
  },
  async created() {
    await this.getConfiguration()
  },
  methods: {
    async getConfiguration() {
      this.configuration = await this.$store.dispatch('getConfiguration')
    },
    async saveGroup(group) {
      this.configuration = await this.$store.dispatch('saveConfigurationGroup', group)
      this.$store.commit('addNotification', createSuccessNotification(this.$t('Updated')))
      if(this.lang !== null){
        await changeLanguage(this.lang)
        this.$moment.locale(this.lang)
      }
    }
  }
}
</script>

<template>
  <VSheet v-if="configuration">
    <VCard
      v-for="conf in configuration"
      class="mt-3"
    >
      <template #title>
        {{ conf.label }}
      </template>
      <template #text>
        <VSheet
          v-for="setting in conf.items"
          :key="setting.key"
          class="mb-4"
        >
          <LanguageSwitcher
            v-if="setting.key === 'app.locale'"
            v-model="setting.value"
            :label="setting.translation"
            @update:model-value="lang = $event"
          />
          <VTextField
            v-else
            v-model="setting.value"
            :label="setting.translation"
          />
        </VSheet>
      </template>
      <template #actions>
        <VSpacer/>
        <VBtn
          prepend-icon="mdi-content-save"
          :text="$t('Save')"
          @click="saveGroup(conf.items)"
        />
      </template>
    </VCard>
  </VSheet>
</template>

<style scoped>

</style>