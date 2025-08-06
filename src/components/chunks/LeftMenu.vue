<script>
export default {
  name: 'LeftMenu'
}
</script>

<template>
  <VList>
    <VListItem
      class="py-4"
      prepend-icon="mdi-view-dashboard"
      :title="$t('Dashboard')"
      :to="{name: 'dashboard'}"
    />
    <VListItem
      class="py-4"
      :title="$t('Devices')"
      prepend-icon="mdi-chip"
      :to="{name: 'devices'}"
    />
    <VListItem
      :title="$t('Video surveillance')"
      class="py-4"
      prepend-icon="mdi-video"
      :to="{name: 'cameras'}"
    />
    <VListItem
      :title="$t('Access control')"
      class="py-4"
      prepend-icon="mdi-hand-back-left-outline"
    />

    <VListItem
      :title="$t('Rules')"
      class="py-4"
      prepend-icon="mdi-graph-outline"
      :to="{name: 'rules'}"
    />
  </VList>
</template>

<style scoped>

</style>
