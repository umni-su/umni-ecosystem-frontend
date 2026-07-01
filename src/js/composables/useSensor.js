import {computed} from 'vue'

export function useSensor(sensor, value) {
  const valueByType = computed(() => {
    const type = sensor.type

    const rawValue = value?.value !== undefined ? value.value : value

    if (rawValue === null || rawValue === undefined) return rawValue


    // SWITCH, BOOLEAN - возвращаем boolean
    if (type === 100 || type === 104) {
      return Boolean(rawValue === 'True')
    }

    // NUMBER, SETPOINT - возвращаем number (целое)
    if (type === 102 || type === 200) {
      const num = parseInt(rawValue, 10)
      return isNaN(num) ? rawValue : num
    }

    // FLOAT, TEMPERATURE, HUMIDITY, PRESSURE - возвращаем number
    if (type === 103 || type === 201 || type === 202 || type === 203) {
      const num = parseFloat(parseFloat(rawValue).toFixed(2))
      return isNaN(num) ? rawValue : num
    }

    // STRING - возвращаем string
    if (type === 900) {
      return String(rawValue)
    }

    // RGB, RGBA - возвращаем объект
    if (type === 301 || type === 302) {
      try {
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue
      } catch {
        return rawValue
      }
    }

    // Остальное как есть
    return rawValue
  })

  const colorByType = computed(() => {
    const type = sensor.type
    const val = valueByType.value

    switch (type) {
    case 100:
      return val ? 'primary' : 'default'
    default:
      return 'default'
    }
  })

  return {valueByType, colorByType}
}