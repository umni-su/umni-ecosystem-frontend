import axios from 'axios'
import {getBase64Image} from '../../../helpers/resToBase64.js'

export default {
  async getDevices({commit, state}) {
    commit('setLoading', true, {root: true})
    const res = await axios.get('/api/devices').finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('setDevices', res.data)
      return res.data
    }
  },
  async getDevice({commit}, id) {
    commit('setLoading', true, {root: true})
    const res = await axios.get(`/api/devices/${id}`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('setDevice', res.data)
      return res.data
    }
  },
  async updateDevice({commit}, data) {
    commit('setLoading', true)
    const res = await axios.patch(`/api/devices/${data.id}`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('addDevice', res.data)
      return res.data
    }
  },
  async updateDeviceCover({commit, state}, data) {
    const device = state.device
    commit('setLoading', true, {root: true})
    const res = await axios.post(`/api/devices/${data.id}/cover`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      commit('setDevice', {...device, ...res.data})
      return res.data
    }
  },
  async getDeviceCover({state, rootState}, id) {
    const res = await fetch(
      `/api/devices/${id}/cover/600`,
      {
        headers: {
          Authorization: `Bearer ${rootState.token}`
        }
      })
    return await getBase64Image(res)
  },
  async locateDevice({commit}, id) {
    commit('setLoading', true, {root: true})
    const res = await axios.get(`/api/devices/${id}/locate`, id).finally(() => {
      commit('setLoading', false, {root: true})
    })

    if (res) {
      return res.data.success
    }
  }
}