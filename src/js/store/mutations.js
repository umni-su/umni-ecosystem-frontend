export default {
    logout(state) {
        state.user = null
        state.authenticated = false
    },
    setLoading(state, loading) {
        state.loading = loading
    },
    setTitle(state, title) {
        state.title = title
    },
    setInterval(state, interval) {
        state.interval = interval
    },
    setSystemInfo(state, systemInfo) {
        state.systemInfo = systemInfo
    },
    setAuthenticated(state, authenticated) {
        state.authenticated = authenticated
    },
    setInstalled(state, installed) {
        state.installed = installed
    },
    setUser(state, user) {
        state.user = user
    },
    setToken(state, token) {
        state.token = token
        localStorage.setItem('token', token)
    },
    setTheme(state, theme) {
        localStorage.setItem('theme', theme)
        state.theme = theme
    },
    addNotification(state, notification) {
        state.notifications.push(notification)
    },
    removeNotification(state) {
        state.notifications = state.notifications.filter(n => n.active === true)
    },
    setSystemNotifications(state, notifications) {
        state.systemNotifications = notifications
    },
    addSystemNotification(state, notification) {
        state.systemNotifications.push(notification)
    },
    removeSystemNotification(state, noty) {
        state.systemNotifications = state.systemNotifications.filter(n => n.id !== noty.id)
    },
    setWsLastMessage(state, message) {
        state.ws.lastMessage = message
    },
    setDevices(state, devices) {
        state.devices = devices
    },
    setDevice(state, device) {
        state.device = Object.create(device)
    },
    setOnline(state, {id, online}) {
        const index = state.devices.findIndex(d => d.id === id)
        if (index > -1) {
            state.devices[index].online = online
        }
    },
    addDevice(state, device) {
        const index = state.devices.findIndex(d => d.id === device.id)
        if (index > -1) {
            state.devices[index] = device
        } else {
            state.devices.push(device)
        }
    },
    removeDevice(state, device) {
        state.devices = state.devices.filter(d => d.id !== device.id)
    },
    setActiveSensor(state, sensor) {
        state.sensor = sensor
    },
    setServices(state, services) {
        state.services = services
    },
    setStorages(state, storages) {
        state.storages = storages
    },
    addStorage(state, storage) {
        const index = state.storages.findIndex(d => d.id === storage.id)
        if (index > -1) {
            state.storages[index] = storage
        } else {
            state.storages.push(storage)
        }
    },
    removeStorage(state, id) {
        state.storages = state.storages.filter(d => d.id !== id)
    },
    setCameras(state, cameras) {
        state.cameras = cameras
    },
    addCamera(state, camera) {
        const index = state.cameras.findIndex(d => d.id === camera.id)
        if (index > -1) {
            state.cameras[index] = camera
        } else {
            state.cameras.push(camera)
        }
    },
    removeCamera(state, id) {
        state.cameras = state.cameras.filter(d => d.id !== id)
    },
    setTracker(state, tracker) {
        if (tracker === null || tracker === undefined) {
            console.error('Tracker must be instance of ImageClickTracker')
        } else {
            state.tracker = tracker
        }
    },
    destroyTracker(state) {
        state.tracker = null
    },
    updatePlayback(state, {date, seconds}) {
        state.playback.date = date
        state.playback.seconds = seconds
    }
}
