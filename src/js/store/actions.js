import axios from 'axios'
import {getBase64Image} from "../helpers/resToBase64.js";

window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
axios.interceptors.response.use(function (response) {
    if (response.headers['x-auth-token']) {
        localStorage.setItem('token', response.headers['x-auth-token'])
        window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.headers['x-auth-token']
    }
    if (response.headers['x-refresh-token']) {
        localStorage.setItem('token', response.headers['x-refresh-token'])
        window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.headers['x-refresh-token']
    }
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

const API = '/api/'

export default {
    async init({_}) {
        const url = `${API}init`
        const res = await axios.get(url)
        return res.data
    },
    /** INSTALL **/
    async checkMqttConnection({commit}, data) {
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
    /** AUTHENTICATION **/
    async checkAuth({commit}) {
        const url = `${API}auth/check`
        const res = await axios.get(url)
            .catch(() => {
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
    async logIn({commit}, {username, password, remember}) {
        commit('setLoading', true)
        const res = await axios.post(`${API}auth/login`, {username, password, remember}).finally(() => {
            commit('setLoading', false)
        })
        if (res) {
            commit('setAuthenticated', true)
            commit('setToken', res.data.access_token)
            commit('setUser', res.data.user)
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
    /** NOTIFICATIONS **/
    async getNotifications({commit}) {
        commit('setLoading', true)
        const res = await axios.get(`${API}notifications`).finally(() => {
            commit('setLoading', false)
        })
        if (res) {
            commit('setSystemNotifications', res.data)
            return res.data
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
            `/api/devices/${id}/cover/500`,
            {
                headers: {
                    Authorization: `Bearer ${state.token}`,
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
    async getBaseSettings({commit}, data) {
        commit('setLoading', true)
        const res = await axios.get(`${API}configuration`, data).finally(() => {
            commit('setLoading', false)
        })
        if (res) {
            return res.data
        }
    },
    async saveBaseSetting({commit}, data) {
        commit('setLoading', true)
        const res = await axios.post(`${API}configuration/${data.id}`, data).finally(() => {
            commit('setLoading', false)
        })
        if (res) {
            return res.data
        }
    },
    /** SENSORS */
    async updateSensor({commit}, data) {
        commit('setLoading', true)
        const res = await axios.post(`${API}sensors/${data.id}`, data, {
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
                    Authorization: `Bearer ${state.token}`,
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
    async getCameraStream({state}, id) {
        const res = await axios.get(
            `/api/cameras/${id}/stream/primary`,
            {
                headers: {
                    Authorization: `Bearer ${state.token}`,
                }
            })
        return res.data
        //return await getBase64Image(res)
    },
    async getCameraCover({state}, {id, w}) {
        const res = await fetch(
            `/api/cameras/${id}/cover/${w}`,
            {
                headers: {
                    Authorization: `Bearer ${state.token}`,
                }
            })
        return await getBase64Image(res)
    },
}
