<script>
export default {
  name: 'NotFound',
  props:{
    icon:{
      type:String,
      default:'mdi-alert-circle-outline'
    },
    title:{
      type:String,
      default:null
    }
  }
}
</script>

<template>
  <VEmptyState
    headline="404"
    :size="100"
    :icon="icon"
    :title="title !== null ? title : $t('Page not found')"
  />
</template>

<style scoped>

</style>