<script>
import ThemeSwitcher from '../../components/chunks/ThemeSwitcher.vue'
import UmniLogo from '../../components/chunks/UmniLogo.vue'
import LeftMenu from '../../components/chunks/LeftMenu.vue'
import NotificationsPanel from '../../components/chunks/NotificationsPanel.vue'
import PageTitle from '../../components/chunks/PageTitle.vue'
import UserMenu from '../../components/chunks/UserMenu.vue'

export default {
  name: 'PageLayout',
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
      rail: true
    }
  },
  computed: {
    user() {
      return this.$store.getters['getUser']
    },
    theme() {
      return this.$store.getters['getTheme']
    },
    lastMessage() {
      return this.$store.getters['getWsLastMessage']
    },
    appBarColor() {
      if (!this.opened) {
        return 'primary'
      }
      return this.theme === 'light' ? 'white' : 'grey-darken-4'
    }
  },
  watch: {
    lastMessage: {
      handler() {
        console.log(this.lastMessage)
      },
      deep: true
    }
  },
  mounted() {
    this.$store.dispatch('wsConnect')
  },
  unmounted() {
    this.$store.dispatch('wsDisconnect')
  }
}
</script>

<template>
  <VSheet
    class="fill-height"
    rounded="0"
    :color="theme === 'light' ? 'blue-grey-lighten-5' : 'black'"
  >
    <VNavigationDrawer
      v-model="opened"
      border="0"
      :permanent="rail"
      rail-width="60"
      :rail="rail"
      rounded="0"
      :color="theme === 'light' ? 'primary' : 'primary-darken'"
    >
      <LeftMenu />
      <template #prepend>
        <VBtn
          size="large"
          width="100%"
          block
          rounded="0"
          class="mb-4 mt-4"
          color="transparent"
          :active="false"
          @click="rail = !rail"
        >
          <UmniLogo :width="44" />
        </VBtn>
      </template>
      <template #append>
        <VList>
          <VListItem
            block
            prepend-icon="mdi-cog"
            :title="$t('Settings')"
            :to="{name: 'settings'}"
          />
        </VList>
      </template>
    </VNavigationDrawer>
    <VAppBar
      scroll-behavior="elevate"
      class="px-2 border-b"
      rounded="0"
      height="70"
      :color="appBarColor"
    >
      <template #prepend>
        <VBtn
          :icon="opened ? 'mdi-backburger' : 'mdi-menu-close'"
          color="default"
          @click="opened = !opened"
        />
        <VBtn
          class="ml-2"
          icon="mdi-arrow-left"
          color="default"
          @click="$router.go(-1)"
        />
        <VBtn
          class="ml-2"
          icon="mdi-arrow-right"
          color="default"
          @click="$router.forward()"
        />
      </template>
      <template #title>
        <PageTitle />
      </template>
      <template #append>
        <NotificationsPanel />
        <ThemeSwitcher
          density="comfortable"
          class="mr-2"
        />
        <UserMenu :color="opened ? 'primary' : 'white'" />
      </template>
    </VAppBar>
    <VMain class="fill-height">
      <VSheet
        ref="page"
        rounded="0"
        class="overflow-hidden fill-height position-relative"
        full-height
      >
        <VSheet
          max-width="1200"
          class="mx-auto pa-4 fill-height"
        >
          <RouterView />
        </VSheet>
      </VSheet>
    </VMain>
  </VSheet>
</template>

<style scoped>

</style>
