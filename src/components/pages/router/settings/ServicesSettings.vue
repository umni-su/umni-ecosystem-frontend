<script>
import ServiceItem from '../../../chunks/service/ServiceItem.vue'

export default {
  name: 'ServicesSettings',
  components: {ServiceItem},
  computed: {
    services() {
      return this.$store.getters['getServices']
    }
  },
  async created() {
    await this.getServices()
  },
  methods: {
    async getServices() {
      await this.$store.dispatch('getServices')
    }
  }
}
</script>

<template>
  <VCard class="mt-3">
    <template #title>
      {{ $t('System services') }}
    </template>
    <template #text>
      <VList>
        <ServiceItem
          v-for="service in services"
          :key="service"
          :service="service"
        />
      </VList>
    </template>
  </VCard>
</template>

<style scoped>

</style>