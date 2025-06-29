export default {
    loading: false,
    interval: 10000,
    authenticated: false,
    installed: false,
    user: null,
    token: localStorage.getItem('token') ?? null,
    title: null,
    theme: localStorage.getItem('theme') ?? 'light',
    notifications: [],
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    systemInfo: null,
    systemNotifications: [],
    devices: [],
    services: [],
    storages: [],
    cameras: [],
    device: null,
    sensor: null,
    confirmation: {
        show: false,
        options: {}
    },
    ws: {
        id: null,
        server: null,
        connecting: false,
        connected: true,
        lastMessage: null
    }
}
