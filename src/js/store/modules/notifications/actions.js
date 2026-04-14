import axios from 'axios'
import {getBase64Image} from '../../../helpers/resToBase64.js'

const API = '/api/'

export default {
  async getNotifications({commit}) {
    commit('setLoading', true, {root: true})
    const res = await axios.get(`${API}notifications`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('setNotifications', res.data)
      return res.data
    }
  },

  async getNotificationSchema({commit}, id) {
    commit('setLoading', true, {root: true})
    const res = await axios.get(`${API}notifications/${id}/schema`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      return res.data
    }
  },

  async getNotificationsTypes({commit}) {
    commit('setLoading', true, {root: true})
    const res = await axios.get(`${API}notifications/types`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('setTypes', res.data)
      return res.data
    }
  },

  async addNotification({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.post(`${API}notifications`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('addNotification', res.data)
      return res.data
    }
  },
  async editNotification({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.put(`${API}notifications/${data.id}`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      return res.data
    }
  },
  async deleteNotification({commit}, id) {
    commit('setLoading', true, {root: true})
    const res = await axios.delete(`${API}notifications/${id}`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      return res.data
    }
  },
  async sendNotification({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.post(`${API}notifications/test`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      return res.data
    }
  }
}