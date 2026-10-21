import axios from 'axios'

const API = '/api/'

export default {
  async getWidgets({commit}, {entity_id = null, type = null} = {}) {
    commit('setLoading', true, {root: true})
    const params = {}
    if (entity_id !== null && entity_id !== undefined) {
      params.entity_id = entity_id
    }
    if (type) {
      params.type = type
    }
    const res = await axios.get(`${API}widgets`, {params}).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('setWidgets', res.data)
      return res.data
    }
  },

  async getWidget({commit}, id) {
    commit('setLoading', true, {root: true})
    const res = await axios.get(`${API}widgets/${id}`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('setWidget', res.data)
      return res.data
    }
  },

  async addWidget({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.post(`${API}widgets`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('addWidget', res.data)
      return res.data
    }
  },

  async updateWidget({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.put(`${API}widgets/${data.id}`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('addWidget', res.data)
      return res.data
    }
  },

  async updateWidgetSort({commit}, {id, sort_order}) {
    commit('setLoading', true, {root: true})
    const res = await axios.patch(`${API}widgets/${id}/sort`, null, {
      params: {sort_order}
    }).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('addWidget', res.data)
      return res.data
    }
  },

  async deleteWidget({commit}, id) {
    commit('setLoading', true, {root: true})
    const res = await axios.delete(`${API}widgets/${id}`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('removeWidget', {id})
      return res.data
    }
  },

  // ========== Items ==========

  async getWidgetItems({commit}, widget_id) {
    commit('setLoading', true, {root: true})
    const res = await axios.get(`${API}widgets/${widget_id}/items`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('setWidgetItems', {widget_id, items: res.data})
      return res.data
    }
  },

  async addWidgetItem({commit}, {widget_id, ...data}) {
    commit('setLoading', true, {root: true})
    const res = await axios.post(`${API}widgets/${widget_id}/items`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('addWidgetItem', {widget_id, item: res.data})
      return res.data
    }
  },

  async updateWidgetItem({commit}, {widget_id, id, ...data}) {
    commit('setLoading', true, {root: true})
    const res = await axios.put(`${API}widgets/${widget_id}/items/${id}`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('updateWidgetItem', {widget_id, item: res.data})
      return res.data
    }
  },

  async deleteWidgetItem({commit}, {widget_id, item_id}) {
    commit('setLoading', true, {root: true})
    const res = await axios.delete(`${API}widgets/${widget_id}/items/${item_id}`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('removeWidgetItem', {widget_id, item_id})
      return res.data
    }
  },

  /**
   * Bulk-reorder: items = [{id, sort_order}, ...] (ровно два поля).
   * Сервер применяет порядок атомарно и возвращает обновлённый список.
   */
  async reorderWidgetItems({commit}, {widget_id, items}) {
    commit('setLoading', true, {root: true})
    const res = await axios.put(`${API}widgets/${widget_id}/items/reorder`, items).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('setWidgetItems', {widget_id, items: res.data})
      return res.data
    }
  }
}
