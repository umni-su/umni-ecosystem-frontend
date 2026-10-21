<script>
import {useI18n} from './js/i18n.js'
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
  computed: {
    _theme() {
      return this.$store.getters['getTheme']
    },
    authenticated() {
      return this.$store.getters['isAuthenticated']
    },
    installed() {
      return this.$store.getters['isInstalled']
    }
  },
  async created() {
    useI18n()
    const res = await this.$store.dispatch('init').catch(e => {
      this.init = false
    })
    if (res) {
      this.init = res.success
      await this.$store.dispatch('checkAuth').finally(
        this.visible = true
      )
    }
    // Healthcheck авторизации.
    // Бэкенд перевыпускает токен только когда до его истечения остаётся
    // <= 1/5 срока (ACCESS_TOKEN_EXPIRE_MINUTES / 5, т.е. последние 6 минут
    // из 30) и лишь в ответ на запрос. Пока страница простаивает, никто
    // токен не обновляет, и через 30 минут следующий запрос даёт 401.
    // Опрос раз в 5 минут гарантированно попадает в это 6-минутное окно,
    // а присланный X-Refresh-Token axios-интерсептор пишет в state.token,
    // localStorage и заголовок Authorization.
    this._healthcheck = setInterval(() => {
      if (this.$store.getters['isAuthenticated']) {
        this.$store.dispatch('checkAuth')
      }
    }, 5 * 60 * 1000)
    this.visible = true
  },
  beforeUnmount() {
    clearInterval(this._healthcheck)
  },
  methods: {
    onI18nInitialized(data) {
      console.log('i18n initialized with:', data)
    }
  }
}
</script>

<template>
  <I18nLoader @initialized="onI18nInitialized">
    <VLocaleProvider
      :locale="$store.getters['getCurrentLanguage']"
      fallback-locale="en"
    >
      <VSheet>
        <VApp
          v-if="visible"
          :theme="_theme"
          class="fill-height"
        >
          <InstallPage v-if="!init && !installed"/>
          <PageLayout v-else-if="authenticated"/>
          <LoginPage v-else/>

        </VApp>
        <Teleport to="body">
          <SystemNotifications/>
        </Teleport>
      </VSheet>
    </VLocaleProvider>

  </I18nLoader>
</template>

<style scoped>

</style>
