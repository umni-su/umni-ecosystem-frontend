<script>
export default {
  name: 'PageActions'
}
</script>

<template>
  <VCard
    variant="text"
    color="default"
  >
    <template #prepend>
      <slot name="prepend" />
    </template>
    <template #title>
      <slot name="title" />
    </template>
    <template #append>
      <slot name="append" />
    </template>
  </VCard>
</template>

<style scoped>

</style>