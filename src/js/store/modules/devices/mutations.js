export default {
  setDevices(state, devices) {
    state.devices = devices
  },
  setDevice(state, device) {
    state.device = device
  },
  setOnline(state, {id, online}) {
    const index = state.devices.findIndex(d => d.id === id)
    if (index > -1) {
      state.devices[index].online = online
    }
  },
  addDevice(state, device) {
    const index = state.devices.findIndex(d => d.id === device.id)
    if (index > -1) {
      state.devices[index] = device
    } else {
      state.devices.push(device)
    }
  },
  removeDevice(state, device) {
    state.devices = state.devices.filter(d => d.id !== device.id)
  },
  setScanMode(state, scanMode) {
    state.scanMode = scanMode
  }
}