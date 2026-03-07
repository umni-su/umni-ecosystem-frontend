<script>
export default {
  name: 'AlarmToggleWidget',
  computed:{
    isAlarm(){
      return this.$store.getters['isAlarm']
    }

  }
}
</script>

<template>
  <VBtn
    v-tooltip="$t('Enable alarm')"
    size="large"
    variant="tonal"
    :color="isAlarm ? 'red' : 'default'"
    icon="mdi-alarm-light"
  />
</template>

<style scoped>

</style>