import { createStore } from 'vuex'
import actions from './actions.js'
import state from './state.js'
import mutations from './mutations.js'
import getters from './getters.js'
import plugins from './modules/plugins/index.js'
import logs from './modules/logs/index.js'
const store = createStore({
  actions,
  mutations,
  getters,
  state,
  modules:{
    plugins: plugins,
    logs: logs
  }
})
export default store
