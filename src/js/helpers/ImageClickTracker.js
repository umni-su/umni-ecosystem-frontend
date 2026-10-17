export class ImageClickTracker {
  constructor(image, output, canvas, options = {}) {
    this.image = image
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
    this.output = output

    this.referenceWidth = options.referenceWidth || 640
    this.referenceHeight = options.referenceHeight || 480

    this.polygons = []
    this.currentPolygon = null
    this.selectedPolygonIndex = -1
    this.isDrawingMode = false

    this.hoveredPoint = null
    this.hoveredSegment = null
    this._cursor = null

    this.draggedPoint = null
    this.draggedPolygon = null
    this.mergeTarget = null
    this.pointerStart = null
    this._activePointerId = null
    this._lastPointerType = 'mouse'

    this.snapThreshold = options.snapThreshold || 12
    this.pointThreshold = options.pointThreshold || 14
    this.segmentThreshold = options.segmentThreshold || 18
    this.dragThresholdPx = 6

    this.rect = null
    this.dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1

    this._raf = null
    this._handlers = {}
    this._ctxButton = null
    this._ctxState = null
    this._ctxHideTimer = null

    this.init()
  }

  init() {
    this.canvas.style.touchAction = 'none'
    this.resizeCanvas()

    this._handlers.pointerdown = this.handlePointerDown.bind(this)
    this._handlers.pointermove = this.handlePointerMove.bind(this)
    this._handlers.pointerup = this.handlePointerUp.bind(this)
    this._handlers.pointercancel = this.handlePointerCancel.bind(this)
    this._handlers.pointerleave = this.handlePointerLeave.bind(this)
    this._handlers.contextmenu = this.handleContextMenu.bind(this)
    this._handlers.dblclick = this.handleDoubleClick.bind(this)

    this.canvas.addEventListener('pointerdown', this._handlers.pointerdown)
    this.canvas.addEventListener('pointermove', this._handlers.pointermove)
    this.canvas.addEventListener('pointerup', this._handlers.pointerup)
    this.canvas.addEventListener('pointercancel', this._handlers.pointercancel)
    this.canvas.addEventListener('pointerleave', this._handlers.pointerleave)
    this.canvas.addEventListener('contextmenu', this._handlers.contextmenu)
    this.canvas.addEventListener('dblclick', this._handlers.dblclick)

    this._onResize = this.resizeCanvas.bind(this)
    window.addEventListener('resize', this._onResize)
  }

  destroy() {
    if (this.canvas && this._handlers) {
      Object.keys(this._handlers).forEach(name => {
        this.canvas.removeEventListener(name, this._handlers[name])
      })
    }
    this._handlers = {}
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize)
      this._onResize = null
    }
    if (this._ctxHideTimer) {
      clearTimeout(this._ctxHideTimer)
      this._ctxHideTimer = null
    }
    if (this._raf != null) {
      cancelAnimationFrame(this._raf)
      this._raf = null
    }
    if (this._ctxButton) {
      this._ctxButton.remove()
      this._ctxButton = null
    }
    this._ctxActionButton = null
    this._ctxState = null
    this._cancelInteractions()
  }

  setColor(color) {
    this.color = color
  }

  // Режимы
  toggleMode() {
    this.isDrawingMode = !this.isDrawingMode
    this._cancelInteractions()
    this.redraw()
  }

  enableDrawing() {
    this.isDrawingMode = true
    this._cancelInteractions()
    this.redraw()
  }

  disableDrawing() {
    this.isDrawingMode = false
    this._cancelInteractions()
    this.closeCurrentPolygon()
    this.redraw()
  }

  _cancelInteractions() {
    this.draggedPoint = null
    this.draggedPolygon = null
    this.mergeTarget = null
    this.pointerStart = null
    this._activePointerId = null
    this.hoveredPoint = null
    this.hoveredSegment = null
    this.hideContextButton()
  }

  startNewPolygon() {
    if (this.currentPolygon && this.currentPolygon.points.length === 0) {
      this._selectPolygon(this.polygons.indexOf(this.currentPolygon))
      return
    }
    if (this.currentPolygon && this.currentPolygon.points.length > 2) {
      this.closeCurrentPolygon()
    }
    this.currentPolygon = {
      id: null,
      name: null,
      priority: 3,
      active: true,
      points: [],
      options: {},
      isClosed: false,
      color: this.color ?? this.getRandomColor()
    }
    this.polygons.push(this.currentPolygon)
    this.selectedPolygonIndex = this.polygons.length - 1
    this.redraw()
    this.fireData()
  }

  closeCurrentPolygon() {
    if (this.currentPolygon && !this.currentPolygon.isClosed && this.currentPolygon.points.length >= 3) {
      this.currentPolygon.isClosed = true
      this.redraw()
      this.fireData()
    }
  }

  // Обработчики событий
  handlePointerDown(event) {
    if (!event.isPrimary) return
    this._lastPointerType = event.pointerType || 'mouse'
    this._updateRect()

    if (event.button === 2) return

    const pos = this.getEventPosition(event)
    this._activePointerId = event.pointerId
    this.pointerStart = {
      x: pos.x,
      y: pos.y,
      clientX: event.clientX,
      clientY: event.clientY,
      moved: false
    }

    this.hideContextButton()
    this._updateHoverFromPos(pos)

    if (event.button !== 0) return

    try {
      this.canvas.setPointerCapture(event.pointerId)
    } catch (e) {
      void e
    }

    if (this.isDrawingMode) {
      if (this.hoveredPoint) {
        this.draggedPoint = this.hoveredPoint
      }
      return
    }

    const idx = this.findPolygonIndex(pos.x, pos.y)
    let polygon = idx >= 0 ? this.polygons[idx] : null
    if (!polygon && this.hoveredPoint) polygon = this.hoveredPoint.polygon
    if (!polygon && this.hoveredSegment) polygon = this.hoveredSegment.polygon
    if (polygon) {
      this._selectPolygon(this.polygons.indexOf(polygon))
      this.draggedPolygon = {
        polygon,
        startPoints: JSON.parse(JSON.stringify(polygon.points)),
        startPos: {x: pos.x, y: pos.y}
      }
    } else {
      this.selectedPolygonIndex = -1
      this.redraw()
    }
  }

  handlePointerMove(event) {
    const pos = this.getEventPosition(event)

    if (this.pointerStart && this.pointerStart.moved === false) {
      const dx = event.clientX - this.pointerStart.clientX
      const dy = event.clientY - this.pointerStart.clientY
      if (Math.sqrt(dx * dx + dy * dy) > this.dragThresholdPx) {
        this.pointerStart.moved = true
      }
    }

    if (this.draggedPoint) {
      if (!this.pointerStart || !this.pointerStart.moved) return
      const polygon = this.draggedPoint.polygon
      const merge = this.findMergeTarget(polygon, this.draggedPoint.pointIndex, pos.x, pos.y)
      this.mergeTarget = merge
      let nx = Math.round(pos.x)
      let ny = Math.round(pos.y)
      if (merge) {
        nx = polygon.points[merge.pointIndex][0]
        ny = polygon.points[merge.pointIndex][1]
      }
      this.draggedPoint.point[0] = nx
      this.draggedPoint.point[1] = ny
      this.redraw()
      return
    }

    if (this.draggedPolygon) {
      if (!this.pointerStart || !this.pointerStart.moved) return
      const dx = Math.round(pos.x - this.draggedPolygon.startPos.x)
      const dy = Math.round(pos.y - this.draggedPolygon.startPos.y)
      this.draggedPolygon.polygon.points = this.draggedPolygon.startPoints.map(point => {
        return [point[0] + dx, point[1] + dy]
      })
      this.redraw()
      return
    }

    this._cursor = pos
    this._updateHoverFromPos(pos)
    this._updateCursorStyle(event.ctrlKey || event.metaKey)
    this.redraw()
  }

  handlePointerUp(event) {
    if (this._activePointerId !== null && event.pointerId !== this._activePointerId) return
    const pos = this.getEventPosition(event)
    const start = this.pointerStart
    const wasTap = !!start && !start.moved

    try {
      this.canvas.releasePointerCapture(event.pointerId)
    } catch (e) {
      void e
    }

    if (this.draggedPoint) {
      const polygon = this.draggedPoint.polygon
      const pointIndex = this.draggedPoint.pointIndex
      if (start && start.moved) {
        if (this.mergeTarget) {
          this._mergePointInto(polygon, pointIndex, this.mergeTarget.pointIndex)
          this.mergeTarget = null
          this.redraw()
        }
        this.fireData()
      } else {
        this._handleDrawTap(pos, event, polygon, pointIndex)
      }
      this.draggedPoint = null
    } else if (this.draggedPolygon) {
      if (start && start.moved) {
        this.fireData()
      }
      this.draggedPolygon = null
    } else if (wasTap) {
      if (this.isDrawingMode) {
        this._handleDrawTap(pos, event)
      } else {
        this._handleDragModeTap(pos)
      }
    }

    this.pointerStart = null
    this._activePointerId = null
  }

  handlePointerCancel() {
    this.draggedPoint = null
    this.draggedPolygon = null
    this.mergeTarget = null
    this.pointerStart = null
    this._activePointerId = null
    this.hideContextButton()
    this.redraw()
  }

  handlePointerLeave(event) {
    if (event.pointerType === 'touch') return
    if (this.pointerStart || this.draggedPoint || this.draggedPolygon) return
    this.hoveredPoint = null
    this.hoveredSegment = null
    this._cursor = null
    this._updateCursorStyle(false)
    this.scheduleContextHide()
    this.redraw()
  }

  handleContextMenu(event) {
    event.preventDefault()
    if (this._lastPointerType === 'touch') return
    this._updateRect()
    const pos = this.getEventPosition(event)

    if (!this.isDrawingMode) {
      const polygonIndex = this.findPolygonIndex(pos.x, pos.y)
      if (polygonIndex >= 0) {
        this.removePolygon(polygonIndex)
      }
      return
    }

    this._updateHoverFromPos(pos)
    if (this.hoveredPoint) {
      this.removePoint(this.hoveredPoint.polygon, this.hoveredPoint.pointIndex)
    }
  }

  handleDoubleClick(event) {
    if (!this.isDrawingMode) return
    const polygon = this.currentPolygon
    if (!polygon || polygon.isClosed || polygon.points.length < 3) return
    this._closePolygonByTap(polygon)
  }

  _handleDrawTap(pos, event, tappedPolygon = null, tappedIndex = null) {
    this._updateHoverFromPos(pos)

    let pointInfo = this.hoveredPoint
    if (tappedPolygon && tappedIndex != null) {
      pointInfo = {
        polygon: tappedPolygon,
        pointIndex: tappedIndex,
        point: tappedPolygon.points[tappedIndex]
      }
    }

    if (pointInfo) {
      if (pointInfo.pointIndex === 0 && !pointInfo.polygon.isClosed && pointInfo.polygon.points.length >= 3) {
        this._closePolygonByTap(pointInfo.polygon)
        return
      }
      this._selectPolygon(this.polygons.indexOf(pointInfo.polygon))
      this.showContextButton(
        {kind: 'delete', polygon: pointInfo.polygon, pointIndex: pointInfo.pointIndex},
        event.clientX,
        event.clientY
      )
      return
    }

    if (this.hoveredSegment) {
      this._selectPolygon(this.polygons.indexOf(this.hoveredSegment.polygon))
      this.showContextButton(
        {
          kind: 'insert',
          polygon: this.hoveredSegment.polygon,
          segmentIndex: this.hoveredSegment.segmentIndex,
          x: Math.round(pos.x),
          y: Math.round(pos.y)
        },
        event.clientX,
        event.clientY
      )
      return
    }

    this.showContextButton(
      {kind: 'add', x: Math.round(pos.x), y: Math.round(pos.y)},
      event.clientX,
      event.clientY
    )
  }

  _handleDragModeTap(pos) {
    const idx = this.findPolygonIndex(pos.x, pos.y)
    if (idx >= 0) {
      this._selectPolygon(idx)
    } else {
      this.selectedPolygonIndex = -1
      this.redraw()
    }
  }

  _closePolygonByTap(polygon) {
    const points = polygon.points
    if (points.length >= 4) {
      const first = points[0]
      const last = points[points.length - 1]
      if (Math.sqrt(Math.pow(first[0] - last[0], 2) + Math.pow(first[1] - last[1], 2)) <= this.snapThreshold) {
        points.pop()
      }
    }
    polygon.isClosed = true
    this._selectPolygon(this.polygons.indexOf(polygon))
    this.redraw()
    this.fireData()
  }

  _selectPolygon(index) {
    if (index < 0 || index >= this.polygons.length) return
    this.selectedPolygonIndex = index
    this.currentPolygon = this.polygons[index]
    this.redraw()
  }

  // Поисковые методы
  findPoint(x, y) {
    const threshold = this.pointThreshold * this._hitScale()

    for (let pIdx = 0; pIdx < this.polygons.length; pIdx++) {
      const polygon = this.polygons[pIdx]
      for (let i = 0; i < polygon.points.length; i++) {
        const point = polygon.points[i]
        const distance = Math.sqrt(Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2))
        if (distance < threshold) {
          return {
            polygon,
            pointIndex: i,
            point
          }
        }
      }
    }
    return null
  }

  findSegment(x, y) {
    const threshold = this.segmentThreshold * this._hitScale()
    const thresholdSq = threshold * threshold

    for (let pIdx = 0; pIdx < this.polygons.length; pIdx++) {
      const polygon = this.polygons[pIdx]
      if (polygon.points.length < 2) continue

      for (let i = 0; i < polygon.points.length; i++) {
        if (!polygon.isClosed && i === polygon.points.length - 1) break

        const p1 = polygon.points[i]
        const p2 = polygon.points[(i + 1) % polygon.points.length]

        const d = this.distanceToSegmentSquared(x, y, p1[0], p1[1], p2[0], p2[1])
        if (d < thresholdSq) {
          return {
            polygon,
            segmentIndex: i,
            distance: Math.sqrt(d)
          }
        }
      }
    }
    return null
  }

  findPolygonIndex(x, y) {
    if (!this.ctx) return -1

    for (let i = 0; i < this.polygons.length; i++) {
      const polygon = this.polygons[i]
      if (polygon.points.length < 3 || !polygon.isClosed) continue

      this.ctx.save()
      this.ctx.beginPath()
      this.ctx.moveTo(this.px(polygon.points[0][0]), this.py(polygon.points[0][1]))

      for (let j = 1; j < polygon.points.length; j++) {
        this.ctx.lineTo(this.px(polygon.points[j][0]), this.py(polygon.points[j][1]))
      }

      this.ctx.closePath()
      const isPointInPath = this.ctx.isPointInPath(x * this.scaleX() * this.dpr, y * this.scaleY() * this.dpr)
      this.ctx.restore()

      if (isPointInPath) return i
    }
    return -1
  }

  findMergeTarget(polygon, excludeIndex, x, y) {
    const threshold = this.snapThreshold * this._hitScale()
    for (let i = 0; i < polygon.points.length; i++) {
      if (i === excludeIndex) continue
      const point = polygon.points[i]
      if (Math.sqrt(Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2)) <= threshold) {
        return {polygon, pointIndex: i}
      }
    }
    return null
  }

  distanceToSegmentSquared(px, py, x1, y1, x2, y2) {
    const l2 = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    if (l2 === 0) return Math.pow(px - x1, 2) + Math.pow(py - y1, 2)

    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2
    t = Math.max(0, Math.min(1, t))

    return Math.pow(px - (x1 + t * (x2 - x1)), 2) +
            Math.pow(py - (y1 + t * (y2 - y1)), 2)
  }

  // Методы работы с точками
  addPoint(polygon, x, y) {
    if (!polygon) return
    polygon.points.push([Math.round(x), Math.round(y)])
    this.redraw()
    this.fireData()
  }

  insertPoint(polygon, index, x, y) {
    if (!polygon) return
    polygon.points.splice(index, 0, [Math.round(x), Math.round(y)])
    this.redraw()
    this.fireData()
  }

  removePoint(polygon, index) {
    if (!polygon || index < 0 || index >= polygon.points.length) return
    polygon.points.splice(index, 1)
    if (polygon.points.length < 3) {
      polygon.isClosed = false
    }
    this.redraw()
    this.fireData()
  }

  removePolygon(index) {
    const removed = this.polygons.splice(index, 1)[0]
    if (!removed) return
    if (this._ctxState && this._ctxState.polygon === removed) {
      this.hideContextButton()
    }
    if (this.currentPolygon === removed) {
      this.currentPolygon = this.polygons[this.polygons.length - 1] || null
      this.selectedPolygonIndex = this.polygons.length - 1
    } else if (this.selectedPolygonIndex > index) {
      this.selectedPolygonIndex--
    }
    this.redraw()
    this.fireData()
  }

  _mergePointInto(polygon, removeIndex, keepIndex) {
    const count = polygon.points.length
    const closesShape = (removeIndex === 0 && keepIndex === count - 1) ||
                        (removeIndex === count - 1 && keepIndex === 0)
    polygon.points.splice(removeIndex, 1)
    if (polygon.points.length < 3) {
      polygon.isClosed = false
    } else if (closesShape) {
      polygon.isClosed = true
    }
  }

  // Контекстные кнопки-подтверждения
  _ensureContextButton() {
    if (this._ctxButton) return this._ctxButton

    const btnCss = 'display:flex;align-items:center;justify-content:center;width:44px;height:44px;' +
      'border-radius:50%;border:none;padding:0;cursor:pointer;background:#ffffff;' +
      'box-shadow:0 2px 8px rgba(0,0,0,.35);font-size:22px;' +
      'touch-action:manipulation;-webkit-tap-highlight-color:transparent'

    const wrap = document.createElement('div')
    wrap.style.cssText = 'position:fixed;display:none;align-items:center;justify-content:center;gap:8px;' +
      'transform:translate(-50%,-50%);z-index:10000'

    const action = document.createElement('button')
    action.type = 'button'
    action.style.cssText = btnCss

    const cancel = document.createElement('button')
    cancel.type = 'button'
    cancel.className = 'mdi mdi-close'
    cancel.title = 'Cancel'
    cancel.style.cssText = btnCss + ';color:#616161'

    cancel.addEventListener('pointerdown', e => {
      e.preventDefault()
      e.stopPropagation()
    })
    cancel.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      this.hideContextButton()
    })

    action.addEventListener('pointerdown', e => {
      e.preventDefault()
      e.stopPropagation()
    })
    action.addEventListener('click', e => {
      e.preventDefault()
      e.stopPropagation()
      this._performContextAction()
    })

    wrap.appendChild(action)
    wrap.appendChild(cancel)

    wrap.addEventListener('pointerenter', () => {
      if (this._ctxHideTimer) {
        clearTimeout(this._ctxHideTimer)
        this._ctxHideTimer = null
      }
    })
    wrap.addEventListener('pointerleave', () => {
      this.scheduleContextHide()
    })

    document.body.appendChild(wrap)
    this._ctxButton = wrap
    this._ctxActionButton = action
    return wrap
  }

  showContextButton(state, clientX, clientY) {
    if (!this.isDrawingMode) return
    const wrap = this._ensureContextButton()

    this._ctxState = state
    this._ctxActionButton.className = state.kind === 'delete' ? 'mdi mdi-trash-can-outline' : 'mdi mdi-plus'
    this._ctxActionButton.title = state.kind === 'delete' ? 'Delete point' :
      (state.kind === 'insert' ? 'Insert point' : 'Add point')
    this._ctxActionButton.style.color = state.kind === 'delete' ? '#c62828' : '#1565c0'
    wrap.style.display = 'flex'
    this._positionContextButton(clientX, clientY)
    this.redraw()
  }

  _positionContextButton(clientX, clientY) {
    if (!this._ctxButton) return
    const margin = 8
    const half = 50
    const left = Math.max(half + margin, Math.min(window.innerWidth - half - margin, clientX))
    const top = Math.max(28 + margin, Math.min(window.innerHeight - 28 - margin, clientY - 46))
    this._ctxButton.style.left = `${left}px`
    this._ctxButton.style.top = `${top}px`
  }

  hideContextButton() {
    if (this._ctxHideTimer) {
      clearTimeout(this._ctxHideTimer)
      this._ctxHideTimer = null
    }
    const hadState = !!this._ctxState
    this._ctxState = null
    if (this._ctxButton) {
      this._ctxButton.style.display = 'none'
    }
    if (hadState) {
      this.redraw()
    }
  }

  scheduleContextHide(delay = 350) {
    if (this._ctxHideTimer) clearTimeout(this._ctxHideTimer)
    this._ctxHideTimer = setTimeout(() => {
      this._ctxHideTimer = null
      this.hideContextButton()
    }, delay)
  }

  _performContextAction() {
    const state = this._ctxState
    if (!state) return

    if (state.kind === 'add') {
      if (!this.currentPolygon || this.currentPolygon.isClosed) {
        this.startNewPolygon()
      }
      this.addPoint(this.currentPolygon, state.x, state.y)
    } else if (state.kind === 'insert') {
      this._selectPolygon(this.polygons.indexOf(state.polygon))
      this.insertPoint(state.polygon, state.segmentIndex + 1, state.x, state.y)
    } else if (state.kind === 'delete') {
      this.removePoint(state.polygon, state.pointIndex)
    }

    this.hideContextButton()
  }

  _updateHoverFromPos(pos) {
    this.hoveredPoint = this.findPoint(pos.x, pos.y)
    this.hoveredSegment = this.hoveredPoint ? null : this.findSegment(pos.x, pos.y)
  }

  _updateCursorStyle(ctrlPressed) {
    if (this.draggedPoint) {
      this.canvas.style.cursor = 'move'
    } else if (this.draggedPolygon) {
      this.canvas.style.cursor = 'grabbing'
    } else if (this.hoveredPoint) {
      this.canvas.style.cursor = 'move'
    } else if (this.hoveredSegment && (this.isDrawingMode || ctrlPressed)) {
      this.canvas.style.cursor = 'cell'
    } else {
      this.canvas.style.cursor = this.isDrawingMode ? 'crosshair' : 'default'
    }
  }

  // Отрисовка
  redraw() {
    if (this._raf != null) return
    this._raf = requestAnimationFrame(() => {
      this._raf = null
      this._render()
    })
  }

  _render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.polygons.forEach((polygon, index) => {
      this.drawPolygon(polygon, index === this.selectedPolygonIndex)
    })

    this._drawRubberBand()

    if (this.hoveredSegment && (this.isDrawingMode || this.hoveredSegment.polygon === this.currentPolygon)) {
      const points = this.hoveredSegment.polygon.points
      const p1 = points[this.hoveredSegment.segmentIndex]
      const p2 = points[(this.hoveredSegment.segmentIndex + 1) % points.length]

      this.ctx.strokeStyle = 'rgba(255, 150, 0, 0.7)'
      this.ctx.lineWidth = 3
      this.ctx.beginPath()
      this.ctx.moveTo(this.px(p1[0]), this.py(p1[1]))
      this.ctx.lineTo(this.px(p2[0]), this.py(p2[1]))
      this.ctx.stroke()
    }

    if (this.hoveredPoint && (this.isDrawingMode || this.hoveredPoint.polygon === this.currentPolygon)) {
      this._drawMarker(this.hoveredPoint.point, 'rgba(103,0,0,0.66)', 9, 'rgba(255,255,255,0.5)', 5)
    }

    if (this.mergeTarget) {
      const point = this.mergeTarget.polygon.points[this.mergeTarget.pointIndex]
      this._drawMarker(point, 'rgba(0,160,0,0.8)', 10, 'rgba(255,255,255,0.85)', 3)
    }

    this._drawPendingGhost()
  }

  _drawPendingGhost() {
    const state = this._ctxState
    if (!state || !this.isDrawingMode) return

    let point = null
    if (state.kind === 'add' || state.kind === 'insert') {
      point = [state.x, state.y]
    } else if (state.kind === 'delete' && state.polygon && state.polygon.points[state.pointIndex]) {
      point = state.polygon.points[state.pointIndex]
    }
    if (!point) return

    const ctx = this.ctx
    const x = this.px(point[0])
    const y = this.py(point[1])

    ctx.save()

    if (state.kind === 'delete') {
      ctx.setLineDash([4, 3])
      ctx.fillStyle = 'rgba(200, 40, 40, 0.35)'
      ctx.strokeStyle = 'rgba(200, 40, 40, 0.95)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()

      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(x - 6, y - 6)
      ctx.lineTo(x + 6, y + 6)
      ctx.moveTo(x + 6, y - 6)
      ctx.lineTo(x - 6, y + 6)
      ctx.stroke()
    } else {
      ctx.setLineDash([4, 3])
      ctx.fillStyle = 'rgba(0, 170, 90, 0.4)'
      ctx.strokeStyle = 'rgba(0, 200, 100, 0.95)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
    }

    ctx.restore()
  }

  _drawRubberBand() {
    if (!this.isDrawingMode || !this._cursor) return
    const polygon = this.currentPolygon
    if (!polygon || polygon.isClosed || polygon.points.length === 0) return

    const ctx = this.ctx
    const last = polygon.points[polygon.points.length - 1]
    const first = polygon.points[0]

    ctx.save()
    ctx.setLineDash([6, 4])
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(this.px(last[0]), this.py(last[1]))
    ctx.lineTo(this.px(this._cursor.x), this.py(this._cursor.y))
    ctx.strokeStyle = 'rgba(255,255,255,0.75)'
    ctx.stroke()

    if (polygon.points.length >= 3) {
      const d = Math.sqrt(
        Math.pow(first[0] - this._cursor.x, 2) + Math.pow(first[1] - this._cursor.y, 2)
      )
      ctx.beginPath()
      ctx.moveTo(this.px(this._cursor.x), this.py(this._cursor.y))
      ctx.lineTo(this.px(first[0]), this.py(first[1]))
      if (d <= this.snapThreshold) {
        ctx.setLineDash([])
        ctx.strokeStyle = 'rgba(0,200,0,0.9)'
        ctx.stroke()
        ctx.restore()
        this._drawMarker(first, 'rgba(0,160,0,0.7)', 9, 'rgba(255,255,255,0.85)', 3)
        return
      }
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.stroke()
    }
    ctx.restore()
  }

  _drawMarker(point, fill, radius, stroke, strokeWidth) {
    this.ctx.fillStyle = fill
    this.ctx.beginPath()
    this.ctx.arc(this.px(point[0]), this.py(point[1]), radius, 0, Math.PI * 2)
    this.ctx.fill()

    this.ctx.strokeStyle = stroke
    this.ctx.lineWidth = strokeWidth
    this.ctx.stroke()
  }

  fireData() {
    const event = new CustomEvent('on-redraw', {
      bubbles: true,
      detail: this.exportToJSON()
    })
    this.canvas.dispatchEvent(event)
  }

  drawPolygon(polygon, isSelected) {
    if (!polygon.points || polygon.points.length < 1) return
    const ctx = this.ctx
    const disabled = polygon.options && polygon.options.enabled === false
    const color = disabled ? '#9e9e9e' : polygon.color

    if (polygon.points.length >= 3 && polygon.isClosed) {
      ctx.fillStyle = this.adjustAlpha(color, 0.3)
      ctx.beginPath()
      ctx.moveTo(this.px(polygon.points[0][0]), this.py(polygon.points[0][1]))

      for (let i = 1; i < polygon.points.length; i++) {
        ctx.lineTo(this.px(polygon.points[i][0]), this.py(polygon.points[i][1]))
      }

      ctx.closePath()
      ctx.fill()
    }

    ctx.strokeStyle = this.adjustAlpha(color, isSelected ? 0.9 : 0.5)
    ctx.lineWidth = isSelected ? 4 : 2
    ctx.beginPath()
    ctx.moveTo(this.px(polygon.points[0][0]), this.py(polygon.points[0][1]))

    for (let i = 1; i < polygon.points.length; i++) {
      ctx.lineTo(this.px(polygon.points[i][0]), this.py(polygon.points[i][1]))
    }

    if (polygon.isClosed && polygon.points.length >= 3) {
      ctx.closePath()
    }
    ctx.stroke()

    polygon.points.forEach(point => {
      const markerColor = disabled ? '#8a8a8a' : (polygon === this.currentPolygon ? '#ff0000' : '#aa0000')
      this._drawMarker(point, markerColor, 5, '#ffffff', 1)
    })
  }

  // Вспомогательные методы
  setPolygonEnabled(index, enabled) {
    const polygon = this.polygons[index]
    if (!polygon) return
    if (!polygon.options) polygon.options = {}
    polygon.options.enabled = enabled
    this.redraw()
  }

  changePolygonColor(i, color) {
    if (this.polygons[i]) {
      this.polygons[i].color = color
      if (this.currentPolygon === this.polygons[i]) {
        this.currentPolygon.color = color
      }
      this.redraw()
    }
  }

  updateName(name) {
    if (!this.currentPolygon) return
    this.currentPolygon.name = name
    this.redraw()
  }

  getEventPosition(event) {
    if (!this.rect) this._updateRect()
    return {
      x: (event.clientX - this.rect.left) / this.scaleX(),
      y: (event.clientY - this.rect.top) / this.scaleY()
    }
  }

  _updateRect() {
    const target = this.image || this.canvas
    const rect = target.getBoundingClientRect()
    if (rect.width >= 1 && rect.height >= 1) {
      this.rect = rect
    } else if (!this.rect) {
      this.rect = rect
    }
    this.dpr = window.devicePixelRatio || 1
  }

  resizeCanvas() {
    this._updateRect()
    if (!this.rect || this.rect.width < 1 || this.rect.height < 1) {
      this.redraw()
      return
    }
    this.canvas.width = Math.round(this.rect.width * this.dpr)
    this.canvas.height = Math.round(this.rect.height * this.dpr)
    this.canvas.style.width = `${this.rect.width}px`
    this.canvas.style.height = `${this.rect.height}px`
    this.redraw()
  }

  // Импорт/экспорт
  exportToJSON() {
    return this.polygons.map(polygon => ({
      id: polygon?.id,
      name: polygon.name,
      active: polygon.active,
      points: polygon.points,
      options: polygon.options,
      priority: polygon.priority,
      isClosed: polygon.isClosed,
      color: polygon.color
    }))
  }

  importFromJSON(json) {
    try {
      this.polygons = (json || []).map(polygon => ({
        id: polygon?.id,
        active: polygon.active,
        name: polygon.name,
        points: polygon.points,
        options: polygon.options,
        priority: polygon.priority,
        isClosed: true,
        color: polygon.color || this.getRandomColor()
      }))

      this.currentPolygon = this.polygons[this.polygons.length - 1] || null
      this.selectedPolygonIndex = this.polygons.length - 1
      this.redraw()
      this.fireData()
    } catch (e) {
      console.log('Ошибка при разборе JSON: ' + e.message)
    }
  }

  // Вспомогательные
  getRandomColor() {
    return '#2192D143'
  }

  adjustAlpha(color, alpha) {
    if (!color || typeof color !== 'string') return color
    if (color.startsWith('hsl')) {
      return color.replace(')', `, ${alpha})`).replace('hsl', 'hsla')
    }
    if (color.startsWith('#')) {
      let hex = color.slice(1)
      if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(char => char + char).join('')
      }
      if (hex.length === 8) {
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return `rgba(${r}, ${g}, ${b}, ${alpha})`
      }
    }
    return color
  }

  px(x) {
    return x * this.scaleX() * this.dpr
  }

  py(y) {
    return y * this.scaleY() * this.dpr
  }

  scaleX() {
    if (!this.rect) this._updateRect()
    return this.rect.width / this.referenceWidth || 1
  }

  scaleY() {
    if (!this.rect) this._updateRect()
    return this.rect.height / this.referenceHeight || 1
  }

  _hitScale() {
    const base = 1 / Math.min(this.scaleX(), this.scaleY())
    return this._lastPointerType === 'touch' ? base * 1.6 : base
  }
}
