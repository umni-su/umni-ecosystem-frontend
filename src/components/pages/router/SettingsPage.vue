<script>
export default {
  name: "SettingsPage",
  data() {
    return {
      opened: true
    }
  },
  created() {
    if (this.$route.fullPath === '/settings') {
      this.$router.push({name: 'settings'})
    }
    this.$store.commit('setTitle', this.$t('Settings'))
  }
}
</script>

<template>
  <VSheet>
    <VNavigationDrawer
      v-model="opened"
      width="300"
      disable-resize-watcher
      rounded="0"
    >
      <VBtn
        density="comfortable"
        color="default"
        variant="text"
        class="burger-opened"
        icon="mdi-menu"
        @click="opened = !opened"
      />
      <VList
        class="pa-0"
        rounded="0"
      >
        <VListItem
          :title="$t('System settings')"
          prepend-icon="mdi-cog"
          :to="{name: 'settings'}"
        />
        <VListItem
          :title="$t('Notifications settings')"
          prepend-icon="mdi-bell"
          :to="{name: 'notifications'}"
        />

        <VListItem
          :title="$t('Backup and restore')"
          prepend-icon="mdi-database"
          :to="{name: 'backup'}"
        />
      </VList>
    </VNavigationDrawer>
    <VSheet class="py-6 fill-height">
      <RouterView />
    </VSheet>
  </VSheet>
</template>

<style scoped lang="scss">
.burger-opened {
  position: absolute;
  right: -40px;
  top: 2px
}
</style>