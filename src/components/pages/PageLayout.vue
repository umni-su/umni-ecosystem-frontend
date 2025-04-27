<script>
import ThemeSwitcher from "../../components/chunks/ThemeSwitcher.vue";
import UmniLogo from "../../components/chunks/UmniLogo.vue";
import LeftMenu from "../../components/chunks/LeftMenu.vue";
import NotificationsPanel from "../../components/chunks/NotificationsPanel.vue";
import PageTitle from "../../components/chunks/PageTitle.vue";
import UserMenu from "../../components/chunks/UserMenu.vue";

export default {
  name: 'PageLayout',
  components: {
    UserMenu,
    PageTitle,
    NotificationsPanel,
    LeftMenu,
    UmniLogo,
    ThemeSwitcher,
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
  mounted() {
    //this.calcHeight()
    //window.addEventListener("resize", this.calcHeight);
  },
  unmounted() {
    //window.removeEventListener("resize", this.calcHeight);
  },
  methods: {
    calcHeight() {
      const bounds = this.$refs.page.$el.getBoundingClientRect()
      const height = document.documentElement.clientHeight
      console.log(bounds, height)
      this.$refs.page.$el.style.height = `${height - bounds.x - 10}px`
    }
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
          class="mb-4 mt-5"
          color="transparent"
          :active="false"
          @click="rail = !rail"
        >
          <UmniLogo :size="32" />
        </VBtn>
      </template>
      <template #append>
        <VList>
          <VListItem
            block
            prepend-icon="mdi-cog"
            :title="$t('Settings')"
          />
        </VList>
      </template>
    </VNavigationDrawer>
    <VAppBar
      scroll-behavior="elevate"
      class="px-2 border-b"
      rounded="0"
      height="80"
      :color="theme === 'light' ? 'white' : 'grey-darken-4'"
    >
      <template #prepend>
        <VBtn
          :icon="opened ? 'mdi-backburger' : 'mdi-menu-close'"
          color="default"
          @click="opened = !opened"
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
        <UserMenu />
      </template>
    </VAppBar>
    <VMain class="fill-height">
      <VSheet
        ref="page"
        rounded="0"
        class="overflow-hidden position-relative"
        full-height
      >
        <VSheet class="pa-4">
          <RouterView />
        </VSheet>
      </VSheet>
    </VMain>
  </VSheet>
</template>

<style scoped>

</style>
