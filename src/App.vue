<script>
import { useI18n } from './js/i18n.js'
import PageLayout from './components/pages/PageLayout.vue'
import LoginPage from './components/pages/LoginPage.vue'
import InstallPage from './components/pages/InstallPage.vue'
import SystemNotifications from './components/chunks/SystemNotifications.vue'
import I18nLoader from './components/chunks/i18n/I18nLoader.vue'


export default {
  components: {
    I18nLoader,
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
  created() {
    useI18n()
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
  },
  methods:{
    onI18nInitialized(data){
      console.log('i18n initialized with:', data)
    }
  }
}
</script>

<template>
  <I18nLoader @initialized="onI18nInitialized">
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
  </I18nLoader>
</template>

<style scoped>

</style>
