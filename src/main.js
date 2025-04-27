import '@mdi/font/css/materialdesignicons.css'
import 'simplebar-vue/dist/simplebar.min.css';
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import router from "./js/router/router.js";
import store from './js/store/store'
import {setupI18n, loadLocaleMessages, plural} from './js/i18n'
import moment from 'moment/min/moment-with-locales';
import App from './App.vue'
import {createApp} from 'vue'

const light = {
    dark: false,
    colors: {
        primary: '#008dd2',
        'primary-lighten': '#16a0de',
        'primary-darken': '#0486c2',
        'primary-black': '#006fa2',
        secondary: '#809098',
    },
}

const dark = {
    dark: true,
    colors: {
        primary: '#008dd2',
        'primary-lighten': '#16a0de',
        'primary-darken': '#0486c2',
        secondary: '#809098',
        'secondary-lighten': 'rgba(128,144,152,0.3)'
    },
}

const vuetify = createVuetify({
    components,
    directives,
    defaults: {
        global: {
            rounded: 'lg',
        },
        VTextField: {
            density: 'compact',
            variant: 'outlined',
            hideDetails: true,
        },
        VSheet: {
            color: 'transparent'
        },
        VSelect: {
            variant: 'outlined',
            hideDetails: true,
            class: 'mb-4'
        },
        VCheckbox: {
            hideDetails: true,
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
                rounded: 0,
            }
        },
        VSwitch: {
            hideDetails: true,
            color: 'primary'
        },
        VContainer: {
            fluid: true
        }
    },
    theme: {
        defaultTheme: 'light',
        themes: {
            light,
            dark
        },
    },

})

const defaultLang = 'ru'

const i18n = setupI18n({
    legacy: false, // you must set `false`, to use Composition API
    locale: defaultLang,
    pluralizationRules: {
        ru: plural
    }
})
loadLocaleMessages(i18n, i18n.global.locale).then(() => {
    const app = createApp(App)
    moment.locale(defaultLang)
    app.config.globalProperties.$moment = moment
    app.use(store)
    app.use(i18n)
    app.use(router)
    app.use(vuetify)
    app.mount('#app')
})