import '@mdi/font/css/materialdesignicons.css'
import 'simplebar-vue/dist/simplebar.min.css'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from './js/router/router.js'
import store from './js/store/store'
import moment from 'moment/min/moment-with-locales'
import '@vuepic/vue-datepicker/dist/main.css'
import App from './App.vue'
import {createApp} from 'vue'
import {createI18nInstance, installI18nHelpers} from './js/i18n.js'

const light = {
  dark: false,
  colors: {
    primary: '#008dd2',
    'primary-lighten': '#16a0de',
    'primary-darken': '#0486c2',
    'primary-black': '#006fa2',
    secondary: '#809098'
  }
}

const dark = {
  dark: true,
  colors: {
    primary: '#008dd2',
    'primary-lighten': '#16a0de',
    'primary-darken': '#0486c2',
    secondary: '#809098',
    'secondary-lighten': 'rgba(128,144,152,0.3)'
  }
}

const defaultLang = 'ru'

const vuetify = createVuetify({
  components,
  directives,
  defaults: {
    global: {
      rounded: 'lg'
    },
    VTextField: {
      density: 'compact',
      variant: 'outlined',
      hideDetails: true
    },
    VTextarea: {
      density: 'compact',
      variant: 'outlined',
      hideDetails: true
    },
    VFileInput: {
      density: 'compact',
      variant: 'outlined',
      hideDetails: true
    },
    VSheet: {
      color: 'transparent'
    },
    VSelect: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: true
    },
    VAutocomplete: {
      variant: 'outlined',
      density: 'compact',
      hideDetails: true
    },
    VCheckbox: {
      hideDetails: true
    },
    VBtn: {
      variant: 'flat',
      color: 'primary'
    },
    VChip: {
      rounded: 'pill'
    },
    VList: {
      VListItem: {
        rounded: 0
      }
    },
    VSwitch: {
      density: 'comfortable',
      hideDetails: true,
      color: 'primary'
    },
    VSlider: {
      hideDetails: true,
      color: 'primary'
    },
    VContainer: {
      fluid: true
    },
    VBtnToggle: {
      VBtn: {
        rounded: 0
      }
    }
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light,
      dark
    }
  }

})

const app = createApp(App)

const i18n = createI18nInstance()

installI18nHelpers(app)
app.use(i18n)
app.config.globalProperties.$moment = moment
app.use(store)
app.use(router)
app.use(vuetify)
app.mount('#app')