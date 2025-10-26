import axios from 'axios'
import {getBase64Image} from '../helpers/resToBase64.js'
import state from './state.js'
import store from './store.js'

window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

axios.interceptors.response.use(function (response) {
  if (response.headers['x-auth-token']) {
    localStorage.setItem('token', response.headers['x-auth-token'])
    state.token = response.headers['x-auth-token']
    window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.headers['x-auth-token']
  }
  if (response.headers['x-refresh-token']) {
    localStorage.setItem('token', response.headers['x-refresh-token'])
    state.token = response.headers['x-refresh-token']
    window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.headers['x-refresh-token']
  }
  return response
}, function (error) {
  if (error.response.status === 401) {
    store.commit('logout')
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

const API = '/api/'

export default {
  async init() {
    const url = `${API}init`
    const res = await axios.get(url)
    return res.data
  },
  /** INSTALL **/
  async checkMqttConnection(_, data) {
    const res = await axios.post(`${API}install/check/mqtt`, data)
    if (res) {
      return res.data
    }
  },
  async install({commit}, {account, mqtt}) {
    const res = await axios.post(`${API}install`, {account, mqtt})
    if (res) {
      commit('setInstalled', res.data.success)
      commit('setAuthenticated', false)
      commit('setUser', null)
      commit('setToken', null)
      return res.data
    }
  },

  async getSystemInfo({commit}) {
    const res = await axios.get(`${API}systeminfo`)
    if (res) {
      commit('setSystemInfo', res.data)
      return res.data
    }
  },

  /** AUTHENTICATION **/
  async checkAuth({commit}) {
    const url = `${API}auth/check`
    const res = await axios.get(url)
      .catch(e => {
        const status = e.response.status
        if(status === 401) {
          commit('setInstalled', true)
        }
        commit('setAuthenticated', false)
        commit('setUser', null)
        commit('setToken', null)
      })
    if (res) {
      if (!res.data?.installed) {
        commit('setAuthenticated', false)
        commit('setInstalled', false)
        commit('setUser', null)
      } else {
        commit('setInstalled', res?.data?.installed)
        commit('setAuthenticated', res?.data?.authenticated)
        commit('setUser', res?.data?.user)
      }

    }
  },
  async logIn({commit}, {username, password}) {
    commit('setLoading', true)
    const params = new URLSearchParams()
    params.append('username', username)
    params.append('password', password)
    const res = await axios.post(`${API}auth/login`, params, {
      'Content-Type': 'application/x-www-form-urlencoded'
    }).finally(() => {
      commit('setLoading', false)
    })
    if (res.status === 200) {
      commit('setAuthenticated', true)
      commit('setToken', res.data.access_token)
      commit('setUser', res.data.user)
      return res.data
    }
  },
  async logOut({commit}) {
    commit('setLoading', true)
    const res = await axios.get(`${API}auth/logout`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setAuthenticated', false)
      commit('setUser', null)
      commit('setToken', null)
    }
  },
  /** WEBSOCKETS**/
  wsConnect({commit, state}) {
    if (state.ws.server === null) {
      const token = state.token
      const url = `${document.location.protocol}//${document.location.host}/api/ws/notifications?token=${token}`
      state.ws.server = new WebSocket(url)
      state.ws.server.onopen = () => {
        console.log('Connection opened')
      }
      state.ws.server.onerror = ws => {
        console.log('Error raised', ws)
      }
      state.ws.server.onmessage = (message) => {
        try {
          message = JSON.parse(message.data)
        } catch (e) {
          message = message.data
          console.error(e)
        }
        commit('setWsLastMessage', message)
      }
      state.ws.server.onclose = (e) => {
        console.log('Connection was closed', e)
      }
    }
  },
  wsDisconnect() {
    if (state.ws.server !== null) {
      state.ws.server.close()
      state.ws.connecting = false
      state.ws.connected = false
      state.ws.lastMessage = null
    }
  },

  async getDevices({commit, state}) {
    commit('setLoading', true)
    console.log(state.token)
    const res = await axios.get(`${API}devices`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setDevices', res.data)
      return res.data
    }
  },
  async getDevice({commit}, id) {
    commit('setLoading', true)
    const res = await axios.get(`${API}devices/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setDevice', res.data)
      return res.data
    }
  },
  async updateDevice({commit}, data) {
    commit('setLoading', true)
    const res = await axios.patch(`${API}devices/${data.id}`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('addDevice', res.data)
      return res.data
    }
  },
  async updateDeviceCover({commit, state}, data) {
    const device = state.device
    commit('setLoading', true)
    const res = await axios.post(`${API}devices/${data.id}/cover`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setDevice', {...device, ...res.data})
      return res.data
    }
  },
  async getDeviceCover({state}, id) {
    const res = await fetch(
      `/api/devices/${id}/cover/600`,
      {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      })
    return await getBase64Image(res)
  },
  async setRelayState({commit}, data) {
    commit('setLoading', true)
    const res = await axios.post(`${API}sensors/${data.id}/state`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },
  /** HISTORY **/
  async getSensorHistory({commit}, data) {
    commit('setLoading', true)
    const res = await axios.post(`${API}sensors/${data.id}/history`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },
  /** SETTINGS **/
  async getConfiguration({commit}, data) {
    commit('setLoading', true)
    const res = await axios.get(`${API}configuration`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setConfiguration', res.data)
      return res.data
    }
  },
  async saveConfigurationGroup({commit}, data) {
    commit('setLoading', true)
    const res = await axios.post(`${API}configuration`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setConfiguration', res.data)
      return res.data
    }
  },
  async getAvailableLanguages({commit}, data) {
    const res = await axios.get(`${API}configuration/lang`, data)
    if (res) {
      commit('setAvailableLanguages', res.data)
      const currentLanguage = res.data.find(l=>l.selected === true).key
      if(currentLanguage === null || currentLanguage === undefined) {
        commit('setCurrentLanguage', 'en')
      }else {
        commit('setCurrentLanguage', currentLanguage)
      }
      return res.data
    }
  },
  async getTranslationsForLang({_}, locale){
    const translation = await axios.get(`${API}configuration/lang/${locale}`)
    if(translation){
      return translation.data
    }
  },

  /** SENSORS */
  async updateSensor({commit}, data) {
    commit('setLoading', true)
    const res = await axios.patch(`${API}sensors/${data.id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).finally(() => {
      commit('setLoading', false)
    })
    return res.data
  },
  async getDeviceSensorCover({state}, {id, width}) {
    const res = await fetch(
      `/api/sensors/${id}/cover/${width}`,
      {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      })
    return await getBase64Image(res)
  },

  /**
     * SERVICES
     */
  async getServices({commit}, data) {
    commit('setLoading', true)
    const res = await axios.get(`${API}services`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setServices', res.data)
      return res.data
    }
  },
  async stopService({commit}, name) {
    commit('setLoading', true)
    const res = await axios.post(`${API}services/${name}/stop`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },
  async startService({commit}, name) {
    commit('setLoading', true)
    const res = await axios.post(`${API}services/${name}/start`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },
  async restartService({commit}, name) {
    commit('setLoading', true)
    const res = await axios.post(`${API}services/${name}/restart`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },

  /**
     * STORAGES
     */
  async getStorages({commit}) {
    commit('setLoading', true)
    const res = await axios.get(`${API}storages`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setStorages', res.data)
      return res.data
    }
  },
  async addStorage({commit}, data) {
    commit('setLoading', true)
    const res = await axios.post(`${API}storages`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('addStorage', res.data)
      return res.data
    }
  },
  async updateStorage({commit}, data) {
    commit('setLoading', true)
    const res = await axios.put(`${API}storages/${data.id}`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('addStorage', res.data)
      return res.data
    }
  },
  async deleteStorage({commit}, id) {
    commit('setLoading', true)
    const res = await axios.delete(`${API}storages/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('removeStorage', id)
      return res.data
    }
  },
  /**
     * CAMERAS
     */
  async getCameras({commit}) {
    commit('setLoading', true)
    const res = await axios.get(`${API}cameras`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setCameras', res.data)
      return res.data
    }
  },
  async getCamera({commit}, id) {
    commit('setLoading', true)
    const res = await axios.get(`${API}cameras/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },
  async addCamera({commit}, data) {
    commit('setLoading', true)
    const res = await axios.post(`${API}cameras`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('addCamera', res.data)
      return res.data
    }
  },
  async updateCamera({commit}, data) {
    commit('setLoading', true)
    const res = await axios.put(`${API}cameras/${data.id}`, data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('addCamera', res.data)
      return res.data
    }
  },
  async deleteCamera({commit}, id) {
    commit('setLoading', true)
    const res = await axios.delete(`${API}cameras/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('removeCamera', id)
      return res.data
    }
  },
  async getCameraCover({state}, {id}) {
    const res = await fetch(
      `/api/cameras/${id}/cover`,
      {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      })
    return await getBase64Image(res)
  },

  async saveCameraAreas(_, data) {
    const res = await axios.post(
      `/api/cameras/${data.id}/areas`,
      data.areas
    )
    if (res) {
      return res.data
    }
  },

  async deleteCameraArea(_, data) {
    const res = await axios.delete(`/api/cameras/${data.camera_id}/areas/${data.area_id}`)
    if (res) {
      return res.data
    }
  },

  async getCameraEvent({commit}, id) {
    commit('setLoading', true)
    const res = await axios.get(`/api/events/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },

  async deleteCameraEvent({commit}, id) {
    commit('setLoading', true)
    const res = await axios.delete(`/api/events/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },
  async getCameraEvents({commit}, data) {
    commit('setLoading', true)
    const res = await axios.post(
      `/api/cameras/${data.id}/events`,
      data
    ).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },

  async getCameraTimeline({commit}, data) {
    commit('setLoading', true)
    const res = await axios.post(
      `/api/cameras/${data.id}/timeline`,
      data
    ).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },

  async getCameraEventScreenshot({state}, {id, type}) {
    const res = await fetch(
      `/api/cameras/events/${id}/${type}`,
      {
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      })
    return await getBase64Image(res)
  },

  async getEventStream({state}, id) {
    const response = await axios.get(`/api/events/${id}/play`, {
      headers: {
        'Authorization': `Bearer ${state.token}`
      },
      responseType: 'blob'
    })
    if (response) {
      return response.data
    }
  },

  /** RULES **/

  async getRules({commit}) {
    commit('setLoading', true)
    const res = await axios.get('/api/rules').finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setRules', res.data)
      return res.data
    }
  },

  async getRule({commit}, id) {
    commit('setLoading', true)
    const res = await axios.get(`/api/rules/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('setActiveRule', res.data)
      return res.data
    }
  },

  async addRule({commit}, data) {
    commit('setLoading', true)
    const res = await axios.post('/api/rules', data).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('addRule', res.data)
      return res.data
    }
  },

  async updateRule({commit}, {id,nodes,edges}) {
    commit('setLoading', true)
    const res = await axios.put(`/api/rules/${id}/graph`, {nodes,edges}).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('addRule', res.data)
      return res.data
    }
  },

  async deleteRule({commit}, id) {
    commit('setLoading', true)
    const res = await axios.delete(`${API}rules/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      commit('removeRule', id)
      return res.data
    }
  },

  async getRuleNode({commit}, id) {
    commit('setLoading', true)
    const res = await axios.get(`/api/rules/nodes/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },

  async getRuleNodeList({commit}, {id,filter}) {
    commit('setLoading', true)
    const res = await axios.post(`/api/rules/nodes/${id}/list`,filter).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },

  async executeRule({commit}, id) {
    commit('setLoading', true)
    const res = await axios.get(`/api/rules/${id}/execute`).finally(() => {
      commit('setLoading', false)
    })
    if (res) {
      return res.data
    }
  },

  async getConditionsList({commit}){
    const res = await axios.get('/api/rules/conditions/list')
    if(res){
      return res.data
    }
  },
  async getConditionsEntities({commit}, filter){
    const res = await axios.post('/api/rules/conditions/entities', filter.filter)
    if(res){
      return res.data
    }
  },
  /**
   * NOTIFICATIONS
   */
  async getNotifications({commit})
  {
    commit('setLoading', true)
    const res = await axios.get(`${API}notifications`).finally(() => {
      commit('setLoading', false)
    })
    if(res){
      commit('setSystemNotifications', res.data)
      return res.data
    }
  },

  async getNotificationSchema({commit}, id)
  {
    commit('setLoading', true)
    const res = await axios.get(`${API}notifications/${id}/schema`).finally(() => {
      commit('setLoading', false)
    })
    if(res){

      return res.data
    }
  },

  async addNotification({commit}, data)
  {
    commit('setLoading', true)
    const res = await axios.post(`${API}notifications`, data).finally(() => {
      commit('setLoading', false)
    })
    if(res){
      commit('addSystemNotification', res.data)
      return res.data
    }
  },
  async editNotification({commit}, data)
  {
    commit('setLoading', true)
    const res = await axios.put(`${API}notifications/${data.id}`, data).finally(() => {
      commit('setLoading', false)
    })
    if(res){
      return res.data
    }
  },
  async deleteNotification({commit}, id)
  {
    commit('setLoading', true)
    const res = await axios.delete(`${API}notifications/${id}`).finally(() => {
      commit('setLoading', false)
    })
    if(res){
      return res.data
    }
  },
  async sendNotification({commit}, data)
  {
    commit('setLoading', true)
    const res = await axios.post(`${API}notifications/test`, data).finally(() => {
      commit('setLoading', false)
    })
    if(res){
      return res.data
    }
  }
}
