export default {
  getConfiguration(state){
    return state.configuration
  },
  getAvailableLanguages(state){
    return state.languages
  },
  getCurrentLanguage(state){
    return state.app.language
  },
  getToken(state) {
    return state.token
  },
  isLoading(state) {
    return state.loading
  },
  isFullWidth(state) {
    return state.fullWidth
  },
  isAuthenticated(state) {
    return state.authenticated
  },
  isInstalled(state) {
    return state.installed
  },
  getSystemInfo(state) {
    return state.systemInfo
  },
  getUser(state) {
    return state.user
  },
  getInterval(state) {
    return state.interval
  },
  getTheme(state) {
    return state.theme
  },
  getTitle(state) {
    return state.title
  },
  getNotifications(state) {
    return state.notifications
  },
  getSystemNotifications(state) {
    return state.systemNotifications
  },
  getWsServer(state) {
    return state.ws.server
  },
  isWsConnecting(state) {
    return state.ws.connecting
  },
  isWsConnected(state) {
    return state.ws.connected
  },
  getWsLastMessage(state) {
    return state.ws.lastMessage
  },
  getDevices(state) {
    return state.devices
  },
  getDevice(state) {
    return state.device
  },
  getDateFormat(state) {
    return state.dateFormat
  },
  getTimeFormat(state) {
    return state.timeFormat
  },
  getDateTimeFormat(state) {
    return `${state.dateFormat} ${state.timeFormat}`
  },
  getActiveSensor(state) {
    return state.sensor
  },
  getServices(state) {
    return state.services
  },
  getStorages(state) {
    return state.storages
  },
  getCameras(state) {
    return state.cameras
  },
  getTracker(state) {
    return state.tracker
  },
  getPlayback(state) {
    return state.playback
  },
  getFlow(state){
    return state.flow
  },
  getEdges(state){
    return state.edges
  },
  getNodes(state) {
    return state.nodes
  },
  getNode:(state) => id => {
    return state.nodes.find(node => node.id === id)
  },
  getSelectedNode(state) {
    return state.selectedNode
  },
  getRules(state){
    return state.rules
  },
  getRule:(state)=> id => {
    return state.rules.find(node => node.id === id)
  },
  getCurrentRule(state){
    return state.rule
  }
}
