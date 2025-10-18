// src/i18n.js
import { createI18n } from 'vue-i18n'
import store from './store/store.js'

// Глобальный экземпляр i18n
let i18nInstance = null
let isInitialized = false

// Кэш загруженных переводов
const loadedLanguages = new Set()

/**
 * Создание экземпляра i18n без предзагрузки
 */
export function createI18nInstance() {
  i18nInstance = createI18n({
    legacy: true,
    locale: 'ru', // Временный язык, будет изменен после загрузки
    fallbackLocale: 'ru',
    messages: {},
    pluralizationRules: {
      ru: plural
    }
  })

  return i18nInstance
}

/**
 * Получение экземпляра i18n
 */
export function getI18n() {
  if (!i18nInstance) {
    return createI18nInstance()
  }
  return i18nInstance
}

/**
 * Инициализация с загрузкой данных из FastAPI
 */
export async function initI18nFromAPI() {
  const i18n = getI18n()

  try {
    // 1. Получаем список доступных языков с бэкенда
    const languagesResponse = await store.dispatch('getAvailableLanguages')
    if (!languagesResponse) throw new Error('Failed to fetch languages')
    const allLanguages = store.getters['getAvailableLanguages']

    const availableLanguages = allLanguages.map(l=>l.key)

    // 2. Получаем язык по умолчанию с бэкенда

    const defaultLanguage = store.getters['getCurrentLanguage']

    // 3. Загружаем переводы для языка по умолчанию
    await loadLocaleMessages(i18n, defaultLanguage)

    // 4. Устанавливаем язык
    setI18nLanguage(i18n, defaultLanguage)

    isInitialized = true

    return {
      i18n,
      availableLanguages,
      defaultLanguage
    }

  } catch (error) {
    console.error('Failed to initialize i18n from API:', error)

    // Fallback на ручной режим
    const availableLanguages = ['ru', 'en']
    const defaultLanguage = 'en'

    await loadLocaleMessages(i18n, defaultLanguage)
    setI18nLanguage(i18n, defaultLanguage)

    isInitialized = true

    return {
      i18n,
      availableLanguages,
      defaultLanguage
    }
  }
}

/**
 * Загрузка переводов с бэкенда
 */
export async function loadLocaleMessages(i18n, locale) {
  if (loadedLanguages.has(locale)) {
    return Promise.resolve()
  }

  try {
    const response = await store.dispatch('getTranslationsForLang',locale)
    if (!response) throw new Error(`HTTP ${response.status}`)

    const messages = response

    i18n.global.setLocaleMessage(locale, messages)
    loadedLanguages.add(locale)

    console.log(`✅ Translations loaded for: ${locale}`)
    return messages

  } catch (error) {
    console.error(`❌ Error loading translations for ${locale}:`, error)
    throw error
  }
}

/**
 * Установка языка
 */
export function setI18nLanguage(i18n, locale) {
  i18n.global.locale = locale
  document.querySelector('html').setAttribute('lang', locale)
  localStorage.setItem('preferred-language', locale)

  if (typeof axios !== 'undefined') {
    axios.defaults.headers.common['Accept-Language'] = locale
  }

  return locale
}

/**
 * Смена языка
 */
export async function changeLanguage(locale) {
  const i18n = getI18n()

  if (i18n.global.locale === locale) {
    return
  }

  try {
    if (!loadedLanguages.has(locale)) {
      await loadLocaleMessages(i18n, locale)
    }

    setI18nLanguage(i18n, locale)

    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { locale }
    }))

  } catch (error) {
    console.error(`Failed to change language to ${locale}:`, error)
    throw error
  }
}

/**
 * Правила плюрализации
 */
export function plural(choice, choicesLength) {
  if (choice === 0) {
    return 0
  }

  const teen = choice > 10 && choice < 20
  const endsWithOne = choice % 10 === 1
  if (!teen && endsWithOne) {
    return 1
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2
  }

  return choicesLength < 4 ? 2 : 3
}

/**
 * Composition API хелпер
 */
export function useI18n() {
  const i18n = getI18n()

  return {
    t: i18n.global.t,
    locale: i18n.global.locale,
    te: i18n.global.te,
    changeLocale: changeLanguage,
    isInitialized: () => isInitialized
  }
}

/**
 * Глобальные методы для использования в template
 */
export function installI18nHelpers(app) {
  // Глобальные свойства для Options API
  app.config.globalProperties.$t = function(key, params) {
    return this.$i18n ? this.$i18n.t(key, params) : key
  }

  app.config.globalProperties.$i18n = getI18n().global
}

export default getI18n