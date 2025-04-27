<script>
export default {
  name: "PageTitle",
  computed: {
    title() {
      return this.$store.getters['getTitle']
    }
  }
}
</script>

<template>
  <div
    v-if="title"
    class="text-h6"
  >
    {{ title }}
  </div>
</template>

<style scoped>

</style>
