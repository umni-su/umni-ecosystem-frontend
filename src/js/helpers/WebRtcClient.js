// Клиент WebRTC-сигналинга.
//
// На одну страницу открывается ОДНО мультиплексированное WebSocket-соединение
// (/api/ws/webrtc). Каждая камера — это отдельная peer-сессия (session_id),
// сообщения которой маркируются camera_id.
//
// Видео/аудио идут от сервера (aiortc) через один и тот же RTSP-поток и
// энкодятся персонально под каждого зрителя.

const CONFIG_URL = '/api/cameras/webrtc/config'

function wsUrl(token) {
  const scheme = document.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${scheme}//${document.location.host}/api/ws/webrtc?token=${encodeURIComponent(token)}`
}

function uuid() {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID()
  }
  return `s-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export class WebRtcClient {
  constructor(token) {
    this.token = token
    this.ws = null
    this.connecting = null
    // sessionId -> { pc, cameraId, handlers }
    this.sessions = new Map()
    this.iceServers = []
    this.maxWidth = 0
    this.configLoaded = false
  }

  // Один клиент (и один WS) на токен/страницу.
  static get(token) {
    if (!WebRtcClient.instance || WebRtcClient.instance.token !== token) {
      WebRtcClient.instance = new WebRtcClient(token)
    }
    return WebRtcClient.instance
  }

  async loadConfig() {
    if (this.configLoaded) {
      return
    }
    try {
      const res = await fetch(CONFIG_URL, {
        headers: {Authorization: `Bearer ${this.token}`}
      })
      if (res.ok) {
        const data = await res.json()
        this.iceServers = data.ice_servers || []
        this.maxWidth = data.max_width || 0
      }
    } catch (e) {
      console.warn('WebRTC: failed to load ICE config', e)
    }
    this.configLoaded = true
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve()
    }
    if (this.connecting) {
      return this.connecting
    }

    this.connecting = new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl(this.token))
      this.ws = ws

      ws.onopen = () => {
        this.connecting = null
        resolve()
      }
      ws.onerror = () => {
        this.connecting = null
        reject(new Error('WebRTC signaling connection error'))
      }
      ws.onclose = () => {
        this.ws = null
        this.connecting = null
        for (const session of this.sessions.values()) {
          session.handlers.onState && session.handlers.onState('disconnected')
        }
      }
      ws.onmessage = event => this._onMessage(event)
    })

    return this.connecting
  }

  _onMessage(event) {
    let data
    try {
      data = JSON.parse(event.data)
    } catch (e) {
      return
    }

    const session = this.sessions.get(data.session_id)
    if (!session) {
      return
    }

    switch (data.type) {
    case 'answer':
      session.pc.setRemoteDescription({type: 'answer', sdp: data.sdp})
        .catch(e => {
          console.error('WebRTC: setRemoteDescription failed', e)
          session.handlers.onState && session.handlers.onState('error')
        })
      break
    case 'state':
      session.handlers.onState && session.handlers.onState(data.state)
      break
    case 'error':
      session.handlers.onError && session.handlers.onError(data.message)
      break
    }
  }

  _send(payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(payload))
      return true
    }
    return false
  }

  // Создаёт peer-сессию для камеры и отправляет offer.
  // options.videoWidth — желаемая ширина видео (клипится по server max_width).
  // Возвращает { sessionId, close }.
  async createSession(cameraId, handlers = {}, options = {}) {
    await this.loadConfig()
    await this.connect()

    const sessionId = handlers.sessionId || uuid()
    const pc = new RTCPeerConnection({iceServers: this.iceServers})

    pc.addTransceiver('video', {direction: 'recvonly'})
    pc.addTransceiver('audio', {direction: 'recvonly'})

    pc.ontrack = event => {
      handlers.onTrack && handlers.onTrack(event.track, event)
    }

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState
      if (state === 'failed') {
        handlers.onState && handlers.onState('error')
      } else if (state === 'connected') {
        handlers.onState && handlers.onState('connected')
      } else if (state === 'disconnected' || state === 'closed') {
        handlers.onState && handlers.onState(state)
      }
    }

    this.sessions.set(sessionId, {pc, cameraId, handlers})

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    const payload = {
      type: 'offer',
      session_id: sessionId,
      camera_id: cameraId,
      sdp: pc.localDescription.sdp,
      sdp_type: 'offer'
    }

    let width = options.videoWidth || 0
    if (width < 0) {
      width = 0
    }
    if (width > 0 && this.maxWidth > 0) {
      width = Math.min(width, this.maxWidth)
    }
    if (width > 0) {
      payload.width = Math.round(width)
    }

    this._send(payload)

    return {
      sessionId,
      close: () => this.closeSession(sessionId)
    }
  }

  // Меняет разрешение видео на лету (без пересоединения).
  async setVideoWidth(sessionId, width) {
    if (!width || width <= 0) {
      return
    }
    await this.loadConfig().catch(() => {})
    let w = width
    if (this.maxWidth > 0) {
      w = Math.min(w, this.maxWidth)
    }
    this._send({type: 'set_width', session_id: sessionId, width: Math.round(w)})
  }

  closeSession(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) {
      return
    }
    this.sessions.delete(sessionId)
    try {
      session.pc.close()
    } catch (e) {
      // ignore
    }
    this._send({type: 'close', session_id: sessionId})
  }
}
