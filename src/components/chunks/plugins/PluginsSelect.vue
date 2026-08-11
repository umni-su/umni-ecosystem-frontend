<script>
import PluginLogo from './PluginLogo.vue'

export default {
  name: 'PluginsSelect',
  components: {PluginLogo},
  data() {
    return {
      selectedPlugin: null,
      plugins: []
    }
  },
  async mounted() {
    await this.getPlugins()
  },
  methods: {
    async getPlugins() {
      const res = await this.$store.dispatch('plugins/getPlugins')
      if (res) {
        this.plugins = res
      }
    }
  }
}
</script>

<template>
  <VAutocomplete
    v-model="selectedPlugin"
    :label="$t('Select plugin')"
    clearable
    autocomplete="off"
    :items="plugins"
    item-value="id"
    item-title="name"
    return-object
  >
    <template #selection="{item}">
      {{ item.display_name }}
    </template>
    <template #item="{ item, props }">
      <VListItem
        :disabled="!item.active"
        v-bind="props"
      >
        <template #prepend>
          <PluginLogo
            class="mr-4"
            :width="50"
            :height="50"
            :plugin="item"
          />
        </template>
        <template #title>
          {{ item.display_name }}
        </template>
        <template #subtitle>
          {{ item.name }}, {{ item.version }}
        </template>
      </VListItem>
    </template>
  </VAutocomplete>
</template>

<style scoped>

</style>