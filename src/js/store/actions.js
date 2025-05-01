import axios from 'axios'

window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
axios.interceptors.response.use(function (response) {
    if (response.headers['auth-token']) {
        localStorage.setItem('token', response.headers['auth-token'])
        window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.headers['auth-token']
    }
    if (response.headers['refresh-token']) {
        localStorage.setItem('token', response.headers['refresh-token'])
        window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.headers['refresh-token']
    }
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});

const API = '/api/'

export default {
    async init({commit}) {
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
        const res = await axios.get(url).catch(() => {
            commit('setAuthenticated', false)
            commit('setUser', null)
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
            commit('setToken', res.data.token)
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
    /** DEVICES **/
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
        }
    },
    async updateDevice({commit}, data) {
        commit('setLoading', true)
        const res = await axios.post(`${API}devices/${data.id}`, data).finally(() => {
            commit('setLoading', false)
        })
        if (res) {
            commit('addDevice', res.data)
            return res.data
        }
    },
    async updateDeviceCover({commit}, data) {
        commit('setLoading', true)
        const res = await axios.post(`${API}devices/${data.id}/cover`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).finally(() => {
            commit('setLoading', false)
        })
        if (res) {
            commit('setDevice', res.data)
        }
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
}
