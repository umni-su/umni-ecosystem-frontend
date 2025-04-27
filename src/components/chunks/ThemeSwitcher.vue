<script>
export default {
  name: 'ThemeSwitcher',
  computed: {
    theme() {
      return this.$store.getters['getTheme']
    }
  },
  methods: {
    switchTheme() {
      const newTheme = this.theme === 'dark' ? 'light' : 'dark'
      this.$store.commit('setTheme', newTheme)
    }
  }
}
</script>

<template>
  <VBtn
    variant="text"
    :color="theme === 'dark' ? 'white' : 'dark'"
    :icon="theme === 'dark' ?'mdi-weather-night' : 'mdi-weather-sunny'"
    @click="switchTheme"
  />
</template>
