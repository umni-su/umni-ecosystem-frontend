<script>
import UserListItem from '../../../../chunks/users/UserListItem.vue'

export default {
  name: 'UsersList',
  components: {UserListItem},
  data() {
    return {
      params: {
        page: 1,
        size: 10,
        term: null
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters['isLoading']
    },
    users() {
      return this.$store.getters['users/getUsers']
    }
  },
  async mounted() {
    await this.getUsers()
  },
  methods: {
    async getUsers() {
      await this.$store.dispatch('users/getUsers', this.params)
    }
  }
}
</script>

<template>
  <VList v-if="users?.items?.length > 0">
    <UserListItem
      v-for="user in users?.items"
      :key="user.id"
      :user="user"
    />
  </VList>
</template>

<style scoped>

</style>