<script>
export default {
  name: "StorageSettings"
}
</script>

<template>
  <VCard class="mt-3">
    <template #append>
      <VBtn
        variant="plain"
        density="comfortable"
        icon="mdi-plus"
        color="default"
      />
      <VBtn
        variant="plain"
        density="comfortable"
        icon="mdi-reload"
        color="default"
      />
    </template>
    <template #title>
      {{ $t('Storage settings') }}
    </template>
    <template #text>
      storage
    </template>
  </VCard>
</template>

<style scoped>

</style>