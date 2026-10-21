export default {
  setWidgets(state, widgets) {
    state.widgets = widgets
  },
  setWidget(state, widget) {
    state.widget = widget
  },
  addWidget(state, widget) {
    const index = state.widgets.findIndex(w => w.id === widget.id)
    if (index > -1) {
      state.widgets[index] = widget
    } else {
      state.widgets.push(widget)
    }
  },
  removeWidget(state, widget) {
    const id = widget?.id ?? widget
    state.widgets = state.widgets.filter(w => w.id !== id)
    if (state.widget && state.widget.id === id) {
      state.widget = null
    }
  },
  setWidgetItems(state, {widget_id, items}) {
    const widget = state.widgets.find(w => w.id === widget_id)
    if (widget) {
      widget.items = items
    }
    if (state.widget && state.widget.id === widget_id) {
      state.widget.items = items
    }
  },
  addWidgetItem(state, {widget_id, item}) {
    const widget = state.widgets.find(w => w.id === widget_id)
    if (widget) {
      widget.items = [...(widget.items || []), item]
    }
    if (state.widget && state.widget.id === widget_id) {
      state.widget.items = [...(state.widget.items || []), item]
    }
  },
  updateWidgetItem(state, {widget_id, item}) {
    const replace = (items) => (items || []).map(i => i.id === item.id ? item : i)
    const widget = state.widgets.find(w => w.id === widget_id)
    if (widget) {
      widget.items = replace(widget.items)
    }
    if (state.widget && state.widget.id === widget_id) {
      state.widget.items = replace(state.widget.items)
    }
  },
  removeWidgetItem(state, {widget_id, item_id}) {
    const filter = (items) => (items || []).filter(i => i.id !== item_id)
    const widget = state.widgets.find(w => w.id === widget_id)
    if (widget) {
      widget.items = filter(widget.items)
    }
    if (state.widget && state.widget.id === widget_id) {
      state.widget.items = filter(state.widget.items)
    }
  }
}
