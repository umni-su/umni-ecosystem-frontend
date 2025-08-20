<script>
import PageLayout from './components/pages/PageLayout.vue'
import LoginPage from './components/pages/LoginPage.vue'
import InstallPage from './components/pages/InstallPage.vue'
import SystemNotifications from './components/chunks/SystemNotifications.vue'


export default {
  components: {
    SystemNotifications,
    LoginPage,
    PageLayout,
    InstallPage
  },
  data() {
    return {
      visible: false,
      init: false
    }
  },
  computed: {
    _theme() {
      return this.$store.getters['getTheme']
    },
    authenticated() {
      return this.$store.getters['isAuthenticated']
    },
    installed() {
      return this.$store.getters['isInstalled']
    },
    step() {
      return this.$route.params.step
    }
  },
  async created() {
    const res = await this.$store.dispatch('init').catch(e => {
      this.init = false
    })
    if (res) {
      this.init = res.success
      await this.$store.dispatch('checkAuth')
    }
    this.visible = true
  }
}
</script>

<template>
  <VSheet>
    <VApp
      v-if="visible"
      :theme="_theme"
      class="fill-height"
    >
      <InstallPage v-if="!init && !installed" />
      <PageLayout v-else-if="authenticated" />
      <LoginPage v-else />

    </VApp>
    <Teleport to="body">
      <SystemNotifications />
    </Teleport>
  </VSheet>
</template>

<style scoped>

</style>
