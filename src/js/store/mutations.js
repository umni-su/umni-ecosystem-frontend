import {useVueFlow} from '@vue-flow/core'

const {
  addNodes,
  updateNode,
  updateNodeData,
  findNode,
  removeNodes,
  removeEdges,
  nodes} = useVueFlow()
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
  setFullWidth(state, w) {
    state.fullWidth = w
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
    state.systemNotifications = state.systemNotifications.filter(
      n => n.id !== noty.id
    )
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
      console.log('Tracker must be instance of ImageClickTracker')
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
  },
  setFlow(state, flow) {
    state.flow = {...state.flow, ...flow}
  },
  setFlowDragging(state, dragging) {
    state.flow.dragging = dragging
    if(!dragging) {
      state.flow.ruleIndex = null
      state.flow.ruleGroup = null
      state.flow.type = null
    }
  },
  setFlowType(state, type) {
    state.flow.type = type
  },
  setFlowRuleIndex(state, index) {
    state.flow.ruleIndex = index
  },
  setFlowRuleGroup(state, group) {
    state.flow.groupIndex = group
  },
  setEdges(state, edges) {
    state.edges = edges
  },
  setNodes(state, nodes) {
    addNodes(nodes)
    state.nodes = nodes
  },
  addNode(state, node) {
    const index = state.nodes.findIndex(n => n.id === node.id)
    if (index > -1) {
      const currentNode = state.nodes[index]
      node.data = currentNode.data ?? {} // fix
      updateNode(node.id, node)
      updateNodeData(node.id, node)
      state.nodes[index] = node
    } else {
      addNodes([...state.nodes, node])
      state.nodes.push(node)
    }
    console.log(nodes.value)
  },
  updateNodeData(state, {id,data}) {
    const index = state.nodes.findIndex(n => n.id === id)
    if (index > -1) {
      state.nodes[index].data = {...state.nodes[index].data,...data}
      updateNodeData(id,state.nodes[index].data)
      console.log(nodes.value,state.nodes[index])
    }
  },
  updateNodeDataOptions(state, {id,options}) {
    const index = state.nodes.findIndex(n => n.id === id)
    if (index > -1) {
      state.nodes[index].data.options = {...state.nodes[index].data.options,...options}
      updateNodeData(id,state.nodes[index].data)
      console.log(nodes.value,state.nodes[index])
    }
  },
  removeNode(state, id) {
    console.log(id)
    state.edges = state.edges.filter(e => {
      return e.source !== id && e.target !== id
    })
    state.nodes = state.nodes.filter(n => n.id !== id)
    removeNodes(id)

    console.log(state.edges)
  },
  selectNode(state, id) {
    state.selectedNode = findNode(id)
  },
  destroySelectedNode(state){
    state.selectedNode = null
  },
  addEdge(state, edge) {
    const index = state.edges.findIndex(e => e.target === edge.target && e.source === edge.source)
    edge.id = `e${edge.target}-${edge.source}-${edge.sourceHandle}`
    if (index > -1) {
      state.edges = state.edges.filter((e,i)=>i!==index)
      state.edges.push(edge)
      console.log(edge)
    } else {
      state.edges.push(edge)
    }
  },
  /** RULES **/
  setRules(state, rules){
    state.rules = rules
  },
  setActiveRule(state, rule){
    state.rule = rule
  },
  addRule(state, rule) {
    const ind = state.rules.findIndex(n => n.id === rule.id)
    if (ind > -1) {
      state.rules[ind] = rule
    } else {
      state.rules.push(rule)
    }
  },
  removeRule(state, id){
    state.rules = state.rules.filter(rule => rule.id !== id)
  }
}
