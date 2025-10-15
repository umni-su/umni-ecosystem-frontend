<!-- src/components/I18nLoader.vue -->
<template>
  <div
    v-if="loading"
    class="i18n-loader"
  >
    <VProgressCircular
      size="130"
      indeterminate
    />
  </div>

  <div
    v-else-if="error"
    class="i18n-error"
  >
    <VBtn
      size="x-large"
      icon="mdi-refresh"
      @click="retry"
    />
  </div>

  <slot v-else/>
</template>

<script>
import { initI18nFromAPI } from '../../../js/i18n.js'

export default {
  name: 'I18nLoader',

  emits: ['initialized'],

  data() {
    return {
      loading: true,
      error: false,
      initializationData: null
    }
  },

  async mounted() {
    await this.initializeI18n()
  },

  methods: {
    async initializeI18n() {
      try {
        this.loading = true
        this.error = false

        this.initializationData = await initI18nFromAPI()

        this.$moment.locale(this.$store.getters['getCurrentLanguage'])

        this.$emit('initialized', this.initializationData)
        this.loading = false

      } catch (error) {
        console.error('Failed to initialize i18n:', error)
        this.error = true
        this.loading = false
      }
    },

    retry() {
      this.initializeI18n()
    }
  }
}
</script>

<style scoped>
.i18n-loader, .i18n-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>