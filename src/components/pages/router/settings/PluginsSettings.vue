<script>
import PluginCardItem from '../../../chunks/plugins/PluginCardItem.vue'

export default {
  name: 'PluginsSettings',
  components: {PluginCardItem},
  async created() {
    await this.getPlugins()
  },
  computed: {
    plugins() {
      return this.$store.getters['plugins/getPlugins']
    }
  },
  methods: {
    async getPlugins() {
      await this.$store.dispatch('plugins/getPlugins')
    }
  }
}
</script>

<template>
  <VSheet>
    search...
    <VSheet v-if="plugins">
      <VContainer class="pa-0">
        <VRow>
          <VCol
            v-for="(plugin, index) in plugins"
            :key="index"
            cols="12"
            md="4"
            sm="6"
          >
            <PluginCardItem
              :plugin="plugin"
            />
          </VCol>
        </VRow>
      </VContainer>
    </VSheet>
  </VSheet>
</template>

<style scoped>

</style>