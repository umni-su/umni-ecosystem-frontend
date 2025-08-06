<script>
export default {
  name: 'NotificationSettings',
  async created() {
    await this.$store.dispatch('getNotifications')
  }
}
</script>

<template>
  not
</template>

<style scoped>

</style>