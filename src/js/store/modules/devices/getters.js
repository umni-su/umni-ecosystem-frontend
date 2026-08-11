export default {
  getDevices(state) {
    return state.devices
  },
  getDevice(state) {
    return state.device
  },
  isScanning(state) {
    return state.scanMode
  }
}