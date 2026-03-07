<script>
import UserListItem from '../../../chunks/users/UserListItem.vue'

export default {
  name: 'UsersSettings',
  components: {UserListItem},
  data() {
    return {
      selectedUser: null

    }
  },
  computed: {
    loading() {
      return this.$store.getters['isLoading']
    },
    permissions() {
      return this.$store.getters['users/getPermissions']
    }
  },
  async mounted() {
    await this.getPermissions()
  },
  methods: {
    async getPermissions() {
      await this.$store.dispatch('users/getPermissions', {
        term: null,
        page: 1,
        size: 100
      })
    }
  }
}
</script>

<template>
  <VCard
    class="mt-3"
    :loading="loading"
  >
    <template #append>
      <VBtn
        icon="mdi-account-plus"
        density="comfortable"
        variant="plain"
        color="default"
        @click="$router.push({name: 'user', params: {id: null}})"
      />
    </template>
    <template #title>
      {{ $t('Users and access') }}
    </template>
    <template #text>
      <RouterView/>
    </template>
  </VCard>
</template>

<style scoped>

</style>