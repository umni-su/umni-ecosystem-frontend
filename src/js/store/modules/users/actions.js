import axios from 'axios'
import {getBase64Image} from '../../../helpers/resToBase64.js'

export default {
  async getUser({commit}, id) {
    commit('setLoading', true, {root: true})
    const res = await axios.get(`/api/users/${id}`).finally(() => {
      commit('setLoading', false, {root: true})
    })
    if (res) {
      return res.data
    }
  },
  async getUsers({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.post('/api/users/list', data).finally(() => {
      commit('setLoading', false, {root: true})
    })

    if (res) {
      commit('setUsers', res.data)
      return res.data
    }
  },
  async createUser({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.post('/api/users', data).finally(() => {
      commit('setLoading', false, {root: true})
    })

    if (res) {
      commit('saveUser', res.data)
      return res.data
    }
  },
  async updateUser({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.put(`/api/users/${data.id}`, data).finally(() => {
      commit('setLoading', false, {root: true})
    })

    if (res) {
      commit('saveUser', res.data)
      return res.data
    }
  },
  async deleteUser({commit}, id) {
    commit('setLoading', true, {root: true})
    const res = await axios.delete(`/api/users/${id}`).finally(() => {
      commit('setLoading', false, {root: true})
    })

    if (res) {
      commit('deleteUser', id)
      return res.data
    }
  },
  async getPermissions({commit}, data) {
    commit('setLoading', true, {root: true})
    const res = await axios.post('/api/permissions/list', data).finally(() => {
      commit('setLoading', false, {root: true})
    })

    if (res) {
      commit('setPermissions', res.data)
      return res.data
    }
  }
}