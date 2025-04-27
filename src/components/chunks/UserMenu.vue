<script>
export default {
  name: "UserMenu",
  computed: {
    user() {
      return this.$store.getters['getUser']
    },
    initials() {
      return `${this.user.first_name[0]}${this.user.last_name[0]}`
    },
    fullName() {
      return `${this.user.first_name} ${this.user.last_name}`
    }
  },
  methods: {
    async logOut() {
      await this.$store.dispatch('logOut')
    }
  }
}
</script>

<template>
  <VMenu hover>
    <template #activator="{props}">
      <VAvatar
        variant="tonal"
        v-bind="props"
        :text="initials"
        color="primary"
      />
    </template>
    <VList class="pa-0">
      <VListItem
        variant="tonal"
        class="font-weight-bold"
      >
        {{ fullName }}
      </VListItem>
      <VListItem
        value="logout"
        prepend-icon="mdi-logout"
        :title="$t('Logout')"
        @click="logOut"
      />
    </VList>
  </VMenu>
</template>

<style scoped>

</style>
