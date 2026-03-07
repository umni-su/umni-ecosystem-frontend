<script>
export default {
  name: 'SecurityToggleWidget',
  computed:{
    isSecurity(){
      return this.$store.getters['isSecurity']
    }
  }
}
</script>

<template>
  <VBtn
    v-tooltip="$t('Enable security mode')"
    size="large"
    variant="tonal"
    :color="isSecurity ? 'info' : 'default'"
    icon="mdi-security"
  />
</template>

<style scoped>

</style>