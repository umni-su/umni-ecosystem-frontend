<script>
export default {
    name: 'DashboardPage',
    mounted() {
        this.$store.commit('setTitle', this.$t('Dashboard'))
    }
}
</script>

<template>
  dashboard
</template>

<style scoped>

</style>
