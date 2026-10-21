<!-- src/components/I18nLoader.vue -->
<template>
  <VSheet
    v-if="error"
    rounded="0"
    class="i18n-error with-bg"
  >
    <VBtn
      :loading="loading"
      :disabled="loading"
      variant="elevated"
      rounded="pill"
      size="x-large"
      icon="mdi-refresh"
      @click="retry"
    />
  </VSheet>

  <slot v-else/>
</template>

<script>
import {initI18nFromAPI} from '../../../js/i18n.js'

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

    async retry() {
      let go = false
      this.loading = true
      const res = await this.$store.dispatch('checkAuth')
        .catch(status => {
          go = status === 401
        }).finally(() => this.loading = false)
      if (res || go) {
        await Promise.any([
          this.$store.dispatch('init'),
          this.initializeI18n()
        ]).finally(() => {
          this.loading = false
        })
      }

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

.with-bg {
  background-image: url("../../../assets/img/eco-bg.jpg");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>