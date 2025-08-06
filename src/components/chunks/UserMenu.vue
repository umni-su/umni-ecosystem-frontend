<script>
export default {
  name: 'UserMenu',
  props: {
    color: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    user() {
      return this.$store.getters['getUser']
    },
    initials() {
      return `${this.user.firstname[0]}${this.user.lastname[0]}`
    },
    fullName() {
      return `${this.user.firstname} ${this.user.lastname}`
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
        :color="color"
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
