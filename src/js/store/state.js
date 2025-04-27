export default {
    loading: false,
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
    ws: {
        id: null,
        connecting: false,
        connected: true,
        lastMessage: null
    }
}
