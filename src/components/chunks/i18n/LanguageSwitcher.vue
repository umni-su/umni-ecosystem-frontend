<!-- src/components/LanguageSwitcher.vue -->
<template>
  <VSelect
    v-if="availableLanguages.length > 0"
    v-model="currentLocale"
    :label="label"
    :items="availableLanguages"
    item-title="key"
    item-value="key"
    @update:model-value="changeLanguage"
  />
</template>

<script>
import {changeLanguage} from '../../../js/i18n.js'

export default {
  name: 'LanguageSwitcher',
  emits: ['update:model-value'],
  modelValue: {
    type:String,
    default:null
  },
  props:{
    label:String,
    liveLoad:{
      type:Boolean,
      default: false
    }
  },
  watch: {
    modelValue(newValue){
      this.currentLocale = newValue
    },
    currentLocale(newValue){
      this.$emit('update:model-value',newValue)
    }
  },
  data() {
    return {
      loading: false,
      availableLanguages: [],
      currentLocale: this.$i18n ? this.$i18n.locale : 'en'
    }
  },

  async mounted() {
    await this.loadAvailableLanguages()
    // Следим за изменением языка
    this.$watch(
      () => this.$i18n?.locale,
      (newLocale) => {
        this.currentLocale = newLocale
      }
    )
  },

  methods: {
    async loadAvailableLanguages() {
      try {
        this.loading = true
        const response = await fetch('/api/configuration/lang')
        if (response.ok) {
          this.availableLanguages = await response.json()
        }
      } catch (error) {
        console.error('Failed to load languages:', error)
        this.availableLanguages = ['ru', 'en'] // Fallback
      } finally {
        this.loading = false
      }
    },

    async changeLanguage(newLocale) {
      if(this.liveLoad){
        try {
          this.loading = true
          await changeLanguage(newLocale)
          this.currentLocale = newLocale
        } catch (error) {
          console.error('Failed to change language:', error)
        } finally {
          this.loading = false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>