export default {
  isLoading(state) {
    return state.isLoading
  },
  getPlugins: (state) => {
    return state.pluginsList
  },
  pluginById: (state) => (id) => {
    return state.pluginsList.find(plugin => plugin.id === id)
  }
}