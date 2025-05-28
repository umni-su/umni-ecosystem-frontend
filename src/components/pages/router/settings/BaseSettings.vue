<script>
import {createSuccessNotification} from "../../../../js/helpers/notificationHelper.js";

export default {
  name: "BaseSettings",
  data() {
    return {
      configuration: null
    }
  },
  async created() {
    await this.getConfiguration();
  },
  methods: {
    async getConfiguration() {
      this.configuration = await this.$store.dispatch('getBaseSettings');
    },
    async saveValue(conf) {
      await this.$store.dispatch('saveBaseSetting', {
        id: conf.id,
        value: conf.value,
      })
      this.$store.commit('addNotification', createSuccessNotification(this.$t('Updated')))
      conf.success = true;
      setTimeout(() => {
        delete conf.success;
      }, 1000)
    }
  }
}
</script>

<template>
  <VCard
    v-if="configuration"
    class="mt-3"
  >
    <template #title>
      {{ $t('System settings') }}
    </template>
    <template #text>
      <VSheet
        v-for="conf in configuration"
        :key="conf.id"
        class="mb-4"
      >
        <VSelect
          v-if="conf.key === 'app.locale'"
          v-model="conf.value"
          :label="conf.translation"
          density="compact"
        />
        <VTextField
          v-else
          v-model="conf.value"
          :label="conf.translation"
        >
          <template #append-inner>
            <VBtn
              variant="plain"
              :disabled="conf?.success"
              :color="conf?.success === undefined ? 'default' : 'success'"
              density="comfortable"
              :icon="conf?.success === undefined ? 'mdi-content-save':'mdi-check'"
              @click="saveValue(conf)"
            />
          </template>
        </VTextField>
      </VSheet>
    </template>
  </VCard>
</template>

<style scoped>

</style>