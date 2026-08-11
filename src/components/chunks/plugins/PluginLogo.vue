<script>
export default {
  name: 'PluginLogo',
  props: {
    plugin: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 100
    },
    height: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      src: null
    }
  },
  async mounted() {
    await this.getPluginImage()
  },
  methods: {
    async getPluginImage() {
      this.src = await this.$store.dispatch('plugins/getPluginLogo', this.plugin.name)
    }
  }
}
</script>

<template>
  <VImg
    v-if="src"
    :src="src"
    :width="width"
    :height="height"
  />
</template>

<style scoped>

</style>