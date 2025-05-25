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
    systemNotifications: [],
    devices: [],
    device: null,
    sensor: null,
    ws: {
        id: null,
        connecting: false,
        connected: true,
        lastMessage: null
    }
}
