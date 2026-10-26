import axios from 'axios'
import {getBase64Image} from '../../../helpers/resToBase64.js'

export default {
  async getSensor({commit}, id) {
    commit('setLoading', true, {root: true})
    const res = await axios.get(`/api/sensors/${id}`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    return res.data
  },

  async getSensors({commit}, {page = 1, size = 10, term = null}) {
    commit('setLoading', true, {root: true})
    const url = '/api/sensors'
    const res = await axios.post(
      url,
      {page, size, term}
    ).finally(() => {
      commit('setLoading', false, {root: true})
    })
    return res.data
  },

  async getSensorTypes({commit}) {
    const res = await axios.get('/api/sensors/types')
    if (res) {
      commit('setSensorTypes', res.data)
    }
    return res.data
  },

  async updateSensor({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.patch(`/api/sensors/${data.id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).finally(() => {
      commit('setLoading', false, {root: true})
    })
    return res.data
  },

  async setSensorState({commit}, data) {
    commit('setLoading', false, {root: true})
    const res = await axios.post(`/api/sensors/${data.id}/set`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })
    return res.data
  },

  async getDeviceSensorCover({state, dispatch}, {id, width}) {
    const res = await fetch(
      `/api/sensors/${id}/cover/${width}`,
      {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      })
    return await getBase64Image(res)
  }
}