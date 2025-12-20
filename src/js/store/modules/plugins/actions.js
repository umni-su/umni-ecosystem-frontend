import axios from 'axios'
import {getBase64Image} from '../../../helpers/resToBase64.js'

export default {
  async getPlugins({commit}, data)
  {
    commit('setLoading', true)
    const res = await axios.get('/api/plugins', data).finally(() => {
      commit('setLoading', false)
    })

    if(res){
      commit('setPlugins', res.data)
      return res.data
    }
  },
  async getPluginSchema({commit}, id)
  {
    commit('setLoading', true)
    const res = await axios.get(`/api/plugins/${id}/schema`).finally(() => {
      commit('setLoading', false)
    })

    if(res){
      return res.data
    }
  },
  async savePluginSchema({commit}, data)
  {
    commit('setLoading', true)
    const res = await axios.post(`/api/plugins/${data.id}/schema`, data).finally(() => {
      commit('setLoading', false)
    })

    if(res){
      return res.data
    }
  },
  async toggleState({commit}, data)
  {
    commit('setLoading', true)
    const res = await axios.post(`/api/plugins/${data.plugin_id}/toggle`, data).finally(() => {
      commit('setLoading', false)
    })

    if(res){
      return res.data
    }
  },
  async getPluginLogo({state, rootState}, name) {
    const res = await fetch(
      `/api/plugins/${name}/logo`,
      {
        headers: {
          Authorization: `Bearer ${rootState.token}`
        }
      })
    return await getBase64Image(res)
  }
}