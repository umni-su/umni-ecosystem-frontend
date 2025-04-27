<script>
import ThemeSwitcher from "../../components/chunks/ThemeSwitcher.vue";
import UmniLogo from "../../components/chunks/UmniLogo.vue";
import LeftMenu from "../../components/chunks/LeftMenu.vue";
import NotificationsPanel from "../../components/chunks/NotificationsPanel.vue";
import PageTitle from "../../components/chunks/PageTitle.vue";
import UserMenu from "../../components/chunks/UserMenu.vue";

export default {
    name: 'PageLayoutOld',
    components: {
        UserMenu,
        PageTitle,
        NotificationsPanel,
        LeftMenu,
        UmniLogo,
        ThemeSwitcher
    },
    data() {
        return {
            opened: true,
            rail: true,
        }
    },
    computed: {
        user() {
            return this.$store.getters['getUser']
        },
        theme() {
            return this.$store.getters['getTheme']
        }
    },
    created() {

    }
}
</script>

<template>
  <VSheet
    class="fill-height"
    rounded="0"
    :color="theme === 'light' ? 'blue-grey-lighten-5' : 'grey-darken-4'"
  >
    <VNavigationDrawer
      v-model="opened"
      class="px-3 py-4"
      border="0"
      permanent
      rail-width="72"
      :rail="rail"
      rounded="0"
      color="primary"
    >
      <LeftMenu />
      <template #prepend>
        <VBtn
          width="100%"
          icon
          class="mb-4"
          color="transparent"
        >
          <UmniLogo :size="32" />
        </VBtn>
      </template>
      <template #append>
        <VBtn
          color="transparent"
          icon="mdi-cog"
        />
      </template>
    </VNavigationDrawer>

    <VMain class="h-100">
      <VAppBar
        elevation="0"
        rounded="0"
        class="pa-2"
        color="transparent"
      >
        <template #title>
          <PageTitle />
        </template>
        <template #append>
          <NotificationsPanel />
          <ThemeSwitcher class="mr-2" />
          <UserMenu />
        </template>
      </VAppBar>
      <VLayout
        class="py-4 px-2"
        full-height
      >
        <VSheet
          width="100%"
          class="ma-auto pa-4"
          height="100%"
          color="transparent"
        >
          <RouterView />
        </VSheet>
      </VLayout>
    </VMain>
  </VSheet>
</template>

<style scoped>

</style>
