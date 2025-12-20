export default {
  setPlugins(state, plugins) {
    state.pluginsList = plugins
  },
  addPlugin(state, plugin) {
    const index = state.pluginsList.findIndex(p=> p.id === plugin.id)
    if (index > -1) {
      state.pluginsList[index] = plugin
    } else {
      state.pluginsList.push(plugin)
    }
  },
  setCurrentPlugin(state, plugin) {
    state.currentPlugin = plugin
  },
  setLoading(state, isLoading) {
    state.isLoading = isLoading
  }
}