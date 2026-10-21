export default {
  getWidgets(state) {
    return state.widgets
  },
  getWidget(state) {
    return state.widget
  },
  getWidgetsByOwner: (state) => ({entity_id, type}) => {
    return state.widgets.filter(
      w => w.entity_id === entity_id && (!type || w.type === type)
    )
  },
  getWidgetItems: (state) => (widgetId) => {
    const widget = state.widgets.find(w => w.id === widgetId)
    return widget ? widget.items : []
  }
}
