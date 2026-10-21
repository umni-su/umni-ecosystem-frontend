import {createStore} from 'vuex'
import actions from './actions.js'
import state from './state.js'
import mutations from './mutations.js'
import getters from './getters.js'
import plugins from './modules/plugins/index.js'
import logs from './modules/logs/index.js'
import users from './modules/users/index.js'
import notifications from './modules/notifications/index.js'
import devices from './modules/devices/index.js'
import sensors from './modules/sensors/index.js'
import widgets from './modules/widgets/index.js'

const store = createStore({
  actions,
  mutations,
  getters,
  state,
  modules: {
    plugins,
    logs,
    users,
    notifications,
    devices,
    sensors,
    widgets
  }
})
export default store
