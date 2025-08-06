/*
 * @copyright (c) 2025.
 * @file sensorGroups.js
 * @author Mikhail Sazanov <m@sazanof.ru>
 * @licence MIT
 */

export const SENSOR_RELAYS = 1
export const SENSOR_INPUTS = 2
export const SENSOR_NTC = 3
export const SENSOR_ADC = 4
export const SENSOR_RF433 = 5
export const SENSOR_DS18B20 = 6
export const SENSOR_OPENTHERM = 7

export const SENSOR_GROUP = {
  SENSOR_RELAYS,
  SENSOR_INPUTS,
  SENSOR_NTC,
  SENSOR_ADC,
  SENSOR_OPENTHERM,
  SENSOR_DS18B20,
  SENSOR_RF433
}

export const SENSOR_TEXT = {
  SENSOR_RELAYS: 'Relay',
  SENSOR_INPUTS: 'Input',
  SENSOR_NTC: 'NTC thermistor',
  SENSOR_ADC: 'Analog sensor',
  SENSOR_OPENTHERM: 'OpenTherm',
  SENSOR_DS18B20: 'Temperature',
  SENSOR_RF433: 'Wireless sensor'
}
