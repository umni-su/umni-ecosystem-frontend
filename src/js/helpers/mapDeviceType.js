/*
 * @copyright (c) 2025.
 * @file mapDeviceType.js
 * @author Mikhail Sazanov <m@sazanof.ru>
 * @licence MIT
 */

export const DEVICE_TYPES = {
  UMNI_C_ONE: 20
}

export function mapType(val) {
  switch (val) {
  case DEVICE_TYPES.UMNI_C_ONE:
    return 'UMNI C1'
  default:
    return 'Unsupported'
  }
}
