import {computed} from 'vue'
import store from '../store/store.js'

// Фолбэк по числовому типу, пока схема /sensors/types не загружена
// (и для исторических записей в БД).
const LEGACY_COMPONENTS = {
  100: 'switch',
  101: 'input',
  102: 'number',
  103: 'float',
  104: 'boolean',
  200: 'setpoint',
  201: 'temperature',
  202: 'humidity',
  203: 'pressure',
  300: 'light',
  301: 'rgb',
  302: 'rgba',
  900: 'string'
}

function uiComponentOf(type) {
  const types = store.state.sensors.sensorTypes || []
  for (const item of types) {
    if (item.value === type) return item.ui_component
  }
  return LEGACY_COMPONENTS[type] ?? null
}

export function getSensorUiComponent(type) {
  return uiComponentOf(type)
}

export function getSensorIcon(type) {
  const types = store.state.sensors.sensorTypes || []
  for (const item of types) {
    if (item.value === type) return item.icon
  }
  return 'mdi-help-circle'
}

/**
 * Значение options.values у сенсора.
 *
 * Бэкенд (Tuya) может отдавать values JSON-строкой, например
 * '{"min":10,"max":1000,"scale":0,"step":1}' или '["auto","manual"]',
 * поэтому строку нужно разобрать. Если разобрать не удалось — null.
 */
export function parseSensorValues(options) {
  const raw = options?.values
  if (raw === null || raw === undefined) return null
  if (typeof raw !== 'string') return raw

  const text = raw.trim()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

/**
 * Числовой диапазон для слайдера из options.values.
 *
 * scale уже учтён: бэкенд хранит значение, разделённое на 10**scale.
 * Для яркости (brightness/light) бэкенд хранит проценты 0..100.
 * Если диапазона нет — null.
 */
export function getSensorRange(sensor) {
  const options = sensor?.options ?? {}
  const values = parseSensorValues(options)
  const component = sensor?.ui_component ?? uiComponentOf(sensor?.type)

  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    return null
  }

  if (component === 'brightness' || component === 'light') {
    const rawMax = Number(values.max)
    if (!Number.isFinite(rawMax) || rawMax <= 0) return null
    const rawMin = Number(values.min)
    return {
      min: Number.isFinite(rawMin) ? Math.round(rawMin / rawMax * 100) : 0,
      max: 100,
      step: 1
    }
  }

  const min = Number(values.min)
  const max = Number(values.max)
  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) return null

  const scale = Number(values.scale) || 0
  const factor = Math.pow(10, scale)
  const step = Number(values.step) > 0 ? Number(values.step) : 1

  return {
    min: min / factor,
    max: max / factor,
    step: step / factor
  }
}

export function useSensor(sensor, value) {
  const valueByType = computed(() => {
    const rawValue = value?.value !== undefined ? value.value : value

    if (rawValue === null || rawValue === undefined) return rawValue

    const component = uiComponentOf(sensor.type)

    // switch, boolean, motion, contact, alarm, lock - возвращаем boolean
    if (component === 'switch' || component === 'boolean' ||
        component === 'motion' || component === 'contact' ||
        component === 'alarm' || component === 'lock') {
      if (typeof rawValue === 'string') {
        return rawValue === '1' || rawValue.toLowerCase() === 'true'
      }
      return Boolean(rawValue)
    }

    // number, setpoint, battery, fan, color_temp - возвращаем number (целое)
    if (component === 'number' || component === 'setpoint' ||
        component === 'battery' || component === 'fan' ||
        component === 'color_temp') {
      const num = parseInt(rawValue, 10)
      return isNaN(num) ? rawValue : num
    }

    // float, temperature, humidity, pressure, energy, power, voltage,
    // current, co2, illuminance, ai, ntc - возвращаем number
    if (component === 'float' || component === 'temperature' ||
        component === 'humidity' || component === 'pressure' ||
        component === 'energy' || component === 'power' ||
        component === 'voltage' || component === 'current' ||
        component === 'co2' || component === 'illuminance' ||
        component === 'ai' || component === 'ntc') {
      const num = parseFloat(parseFloat(rawValue).toFixed(2))
      return isNaN(num) ? rawValue : num
    }

    // string - возвращаем string
    if (component === 'string') {
      return String(rawValue)
    }

    // rgb, rgba - hex-строка (#RRGGBB[AA]) либо JSON-объект
    if (component === 'rgb' || component === 'rgba') {
      if (typeof rawValue === 'string') {
        if (/^#?[0-9a-f]{6}[0-9a-f]{0,2}$/i.test(rawValue.trim())) {
          return rawValue
        }
        try {
          return JSON.parse(rawValue)
        } catch {
          return rawValue
        }
      }
      return rawValue
    }

    // brightness - проценты 0..100
    if (component === 'brightness') {
      const num = parseInt(rawValue, 10)
      return isNaN(num) ? rawValue : num
    }

    // Остальное как есть
    return rawValue
  })

  const colorByType = computed(() => {
    const component = uiComponentOf(sensor.type)
    const val = valueByType.value

    if (component === 'switch') {
      return val ? 'primary' : 'default'
    }
    return 'default'
  })

  // Добавляем computed для отображения в виде строки
  const displayValue = computed(() => {
    const val = valueByType.value

    // Для булевых значений показываем On/Off
    if (typeof val === 'boolean') {
      return val ? 'On' : 'Off'
    }

    return val
  })

  return {valueByType, colorByType, displayValue}
}
