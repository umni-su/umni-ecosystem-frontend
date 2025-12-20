import axios from 'axios'
import {getBase64Image} from '../../../helpers/resToBase64.js'

export default {
  async getLogs({commit}, data)
  {
    commit('setLoading', true)
    const res = await axios.post('/api/logs', data).finally(() => {
      commit('setLoading', false)
    })

    if(res){
      commit('setLogs', res.data)
      return res.data
    }
  }
}