export class ImageClickTracker {
    constructor(image, output, canvas) {
        console.log('Init ImageClickTracker');
        this.image = image;
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d');
        this.output = output

        // this.modeIndicator = document.getElementById('modeIndicator');
        // this.polygonsContainer = document.getElementById('polygonsContainer');
        // this.polygonCountElement = document.getElementById('polygonCount');

        this.polygons = [];
        this.currentPolygon = null;
        this.hoveredPoint = null;
        this.draggedPoint = null;
        this.hoveredSegment = null;
        this.selectedPolygonIndex = -1;
        this.isDrawingMode = false;

        this.init();
    }

    init() {
        this.resizeCanvas()
        // Обработчики событий
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    setColor(color) {
        this.color = color;
    }

    // Основные методы
    toggleMode() {
        this.isDrawingMode = !this.isDrawingMode;

        this.redraw();
    }

    enableDrawing() {
        this.isDrawingMode = true
        this.startNewPolygon();

        this.redraw();
    }

    startNewPolygon() {
        if (this.currentPolygon && this.currentPolygon.points.length > 2) {
            this.closeCurrentPolygon();
        }
        this.currentPolygon = {
            id: null,
            name: null,
            priority: 3,
            active: true,
            points: [],
            options: null,
            isClosed: false,
            color: this.color ?? this.getRandomColor()
        };
        this.polygons.push(this.currentPolygon);
        this.selectedPolygonIndex = this.polygons.length - 1;
        this.redraw()
        this.fireData()
    }

    closeCurrentPolygon() {
        if (this.currentPolygon && this.currentPolygon.points.length >= 3) {
            this.currentPolygon.isClosed = true;
            this.updateOutput(`Полигон ${this.polygons.length} замкнут`);
            this.redraw();
            this.fireData();
        }
    }

    // Обработчики событий
    handleMouseDown(event) {
        const pos = this.getMousePosition(event);

        if (event.button === 0) { // ЛКМ
            if (!this.isDrawingMode) {
                // Начинаем перемещение полигона
                if (this.currentPolygon) {
                    this.draggedPolygon = {
                        polygon: this.currentPolygon,
                        startPoints: JSON.parse(JSON.stringify(this.currentPolygon.points)),
                        startPos: pos
                    };
                }
                this.redraw();
                return;
            }

            if (event.ctrlKey || event.metaKey) {
                // Вставка точки между существующими (Ctrl+ЛКМ)
                if (this.hoveredSegment && this.hoveredSegment.polygon) {
                    this.insertPoint(
                        this.hoveredSegment.polygon,
                        this.hoveredSegment.segmentIndex + 1,
                        pos.x,
                        pos.y
                    );
                }
            } else if (this.hoveredPoint) {
                // Начало перетаскивания
                this.draggedPoint = this.hoveredPoint;
            } else if (this.currentPolygon) {
                // Добавление новой точки
                this.addPoint(this.currentPolygon, pos.x, pos.y);
            }
        }
    }

    handleMouseMove(event) {
        const pos = this.getMousePosition(event);

        // Перемещение полигона
        if (this.draggedPolygon) {
            const dx = pos.x - this.draggedPolygon.startPos.x;
            const dy = pos.y - this.draggedPolygon.startPos.y;

            this.draggedPolygon.polygon.points = this.draggedPolygon.startPoints.map(point => {
                return [
                    Math.round(point[0] + dx),
                    Math.round(point[1] + dy)
                ]
            });
            console.log(this.draggedPolygon.polygon.points)

            this.redraw();
            return;
        }

        // Перетаскивание точки
        if (this.draggedPoint) {
            this.draggedPoint.point[0] = Math.round(pos.x)
            this.draggedPoint.point[1] = Math.round(pos.y)
            this.redraw();
            return;
        }

        // Поиск ближайшей точки и сегмента
        this.hoveredPoint = this.findPoint(pos.x, pos.y);
        this.hoveredSegment = this.findSegment(pos.x, pos.y);

        // Изменение курсора
        if (this.hoveredPoint) {
            this.canvas.style.cursor = 'move';
        } else if (this.hoveredSegment && (this.isDrawingMode || event.ctrlKey)) {
            this.canvas.style.cursor = 'cell';
        } else {
            this.canvas.style.cursor = 'default';
        }

        this.redraw();
    }

    handleMouseUp() {
        if (this.draggedPoint) {
            this.draggedPoint = null;
        }

        if (this.draggedPolygon) {
            this.draggedPolygon = null;
        }

        this.fireData()
    }

    handleContextMenu(event) {
        event.preventDefault();
        const pos = this.getMousePosition(event);

        if (!this.isDrawingMode) {
            const polygonIndex = this.findPolygonIndex(pos.x, pos.y);
            if (polygonIndex >= 0) {
                this.removePolygon(polygonIndex);
            }
            return;
        }

        const pointInfo = this.findPoint(pos.x, pos.y);
        if (pointInfo) {
            this.removePoint(pointInfo.polygon, pointInfo.pointIndex);
        }
    }

    handleDoubleClick(event) {
        if (event.button === 0 && this.currentPolygon?.points.length >= 3) {
            this.closeCurrentPolygon();
        }
    }

    // Поисковые методы
    findPoint(x, y) {
        const threshold = 10 / Math.min(this.scaleX(), this.scaleY());

        for (let pIdx = 0; pIdx < this.polygons.length; pIdx++) {
            const polygon = this.polygons[pIdx];
            for (let i = 0; i < polygon.points.length; i++) {
                const point = polygon.points[i];
                const distance = Math.sqrt(Math.pow(point[0] - x, 2) + Math.pow(point[1] - y, 2));
                if (distance < threshold) {
                    return {
                        polygon,
                        pointIndex: i,
                        point
                    };
                }
            }
        }
        return null;
    }

    findSegment(x, y) {
        const threshold = 15 / Math.min(this.scaleX(), this.scaleY());
        const thresholdSq = threshold * threshold;

        for (let pIdx = 0; pIdx < this.polygons.length; pIdx++) {
            const polygon = this.polygons[pIdx];
            if (polygon.points.length < 2) continue;

            for (let i = 0; i < polygon.points.length; i++) {
                const p1 = polygon.points[i];
                const p2 = polygon.points[(i + 1) % polygon.points.length];

                // Пропускаем последний сегмент, если полигон не замкнут
                if (!polygon.isClosed && i === polygon.points.length - 1) break;

                const d = this.distanceToSegmentSquared(x, y, p1[0], p1[1], p2[0], p2[1]);
                if (d < thresholdSq) {
                    return {
                        polygon,
                        segmentIndex: i,
                        distance: Math.sqrt(d)
                    };
                }
            }
        }
        return null;
    }

    findPolygonIndex(x, y) {
        if (!this.ctx) return -1;

        // Проверяем попадание в полигон
        for (let i = 0; i < this.polygons.length; i++) {
            const polygon = this.polygons[i];
            if (polygon.points.length < 3 || !polygon.isClosed) continue;

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(
                polygon.points[0][0] * this.scaleX(),
                polygon.points[0][1] * this.scaleY()
            );

            for (let j = 1; j < polygon.points.length; j++) {
                this.ctx.lineTo(
                    polygon.points[j][0] * this.scaleX(),
                    polygon.points[j][1] * this.scaleY()
                );
            }

            this.ctx.closePath();
            const isPointInPath = this.ctx.isPointInPath(
                x * this.scaleX(),
                y * this.scaleY()
            );
            this.ctx.restore();

            if (isPointInPath) return i;
        }
        return -1;
    }

    distanceToSegmentSquared(px, py, x1, y1, x2, y2) {
        const l2 = Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
        if (l2 === 0) return Math.pow(px - x1, 2) + Math.pow(py - y1, 2);

        let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
        t = Math.max(0, Math.min(1, t));

        return Math.pow(px - (x1 + t * (x2 - x1)), 2) +
            Math.pow(py - (y1 + t * (y2 - y1)), 2);
    }

    // Методы работы с точками
    addPoint(polygon, x, y) {
        polygon.points.push([Math.round(x), Math.round(y)]);
        polygon.isClosed = false;
        this.redraw();
        this.updateOutput(`Добавлена точка: (${Math.round(x)}, ${Math.round(y)})`);

        this.fireData()
    }

    insertPoint(polygon, index, x, y) {
        polygon.points.splice(index, 0, [Math.round(x), Math.round(y)]);
        polygon.isClosed = false;
        this.redraw();
        this.updateOutput(`Вставлена точка между ${index - 1} и ${index}`);

    }

    removePoint(polygon, index) {
        const removedPoint = polygon.points.splice(index, 1)[0];
        polygon.isClosed = false;
        this.redraw();
        this.updateOutput(`Удалена точка: (${Math.round(removedPoint[0])}, ${Math.round(removedPoint[1])})`);

    }

    removePolygon(index) {
        const removed = this.polygons.splice(index, 1)[0];
        if (this.currentPolygon === removed) {
            this.currentPolygon = this.polygons[this.polygons.length - 1] || null;
            this.selectedPolygonIndex = this.polygons.length - 1;
        }
        this.redraw();
        this.updateOutput(`Удален полигон с ${removed.points.length} точками`);

        this.fireData()
    }

    // Отрисовка
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Рисуем все полигоны
        this.polygons.forEach((polygon, index) => {
            this.drawPolygon(polygon, index === this.selectedPolygonIndex);
        });

        // Рисуем текущий полигон (если есть)
        if (this.currentPolygon && !this.polygons.includes(this.currentPolygon)) {
            this.drawPolygon(this.currentPolygon, true);
        }

        // Рисуем hovered сегмент
        if (this.hoveredSegment && (this.isDrawingMode || this.hoveredSegment.polygon === this.currentPolygon)) {
            const p1 = this.hoveredSegment.polygon.points[this.hoveredSegment.segmentIndex];
            const p2 = this.hoveredSegment.polygon.points[
            (this.hoveredSegment.segmentIndex + 1) % this.hoveredSegment.polygon.points.length
                ];

            this.ctx.strokeStyle = 'rgba(255, 150, 0, 0.7)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(p1[0] * this.scaleX(), p1[1] * this.scaleY());
            this.ctx.lineTo(p2[0] * this.scaleX(), p2[1] * this.scaleY());
            this.ctx.stroke();
        }

        // Рисуем hovered точку
        if (this.hoveredPoint && (this.isDrawingMode || this.hoveredPoint.polygon === this.currentPolygon)) {
            const x = this.hoveredPoint.point[0] * this.scaleX();
            const y = this.hoveredPoint.point[1] * this.scaleY();

            this.ctx.fillStyle = 'rgba(103,0,0,0.66)';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 9, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            this.ctx.lineWidth = 5;
            this.ctx.stroke();
        }
    }

    fireData() {
        const event = new CustomEvent('on-redraw', {
            bubbles: true,
            detail: this.exportToJSON()
        })
        this.canvas.dispatchEvent(event)
    }

    drawPolygon(polygon, isSelected) {
        if (polygon.points.length < 1) return;

        // Заливка полигона
        if (polygon.points.length >= 3 && polygon.isClosed) {
            this.ctx.fillStyle = this.adjustAlpha(polygon.color, 0.3);
            this.ctx.beginPath();
            this.ctx.moveTo(
                polygon.points[0][0] * this.scaleX(),
                polygon.points[0][1] * this.scaleY()
            );

            for (let i = 1; i < polygon.points.length; i++) {
                this.ctx.lineTo(
                    polygon.points[i][0] * this.scaleX(),
                    polygon.points[i][1] * this.scaleY()
                );
            }

            this.ctx.closePath();
            this.ctx.fill();
        }

        // Контур полигона
        this.ctx.strokeStyle = isSelected ?
            this.adjustAlpha(polygon.color, 0.9) :
            this.adjustAlpha(polygon.color, 0.5);
        this.ctx.lineWidth = isSelected ? 4 : 2;
        this.ctx.beginPath();
        this.ctx.moveTo(
            polygon.points[0][0] * this.scaleX(),
            polygon.points[0][1] * this.scaleY()
        );

        for (let i = 1; i < polygon.points.length; i++) {
            this.ctx.lineTo(
                polygon.points[i][0] * this.scaleX(),
                polygon.points[i][1] * this.scaleY()
            );
        }

        if (polygon.isClosed && polygon.points.length >= 3) {
            this.ctx.closePath();
        }
        this.ctx.stroke();

        // Точки полигона
        polygon.points.forEach(point => {
            const x = point[0] * this.scaleX();
            const y = point[1] * this.scaleY();

            this.ctx.fillStyle = polygon === this.currentPolygon ? '#ff0000' : '#aa0000';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 5, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    // Вспомогательные методы
    changePolygonColor(i, color) {
        if (this.currentPolygon) {
            this.polygons[i].color = color;
            this.redraw();

        }
    }

    updateName(name) {
        this.currentPolygon.name = name;
        this.redraw();
    }

    getMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) / this.scaleX(),
            y: (event.clientY - rect.top) / this.scaleY()
        };
    }

    resizeCanvas() {
        const rect = this.image.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        this.redraw();
    }

    updateOutput(message) {
        //this.output.textContent = message;
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
            this.polygons = json.map(polygon => ({
                id: polygon?.id,
                active: polygon.active,
                name: polygon.name,
                points: polygon.points,
                options: polygon.options,
                priority: polygon.priority,
                isClosed: true, //fix
                color: polygon.color || this.getRandomColor()
            }));

            this.currentPolygon = this.polygons[this.polygons.length - 1] || null;
            this.selectedPolygonIndex = this.polygons.length - 1;
            this.updateOutput(`Импортировано ${this.polygons.length} полигонов`);
            this.redraw();
            this.fireData()
        } catch (e) {
            alert("Ошибка при разборе JSON: " + e.message);
        }
    }

    // Вспомогательные
    getRandomColor() {
        return `#2192D143`;
    }

    adjustAlpha(color, alpha) {
        if (color.startsWith('hsl')) {
            return color.replace(')', `, ${alpha})`).replace('hsl', 'hsla');
        }
        return color;
    }

    scaleX() {
        return this.image.getBoundingClientRect().width / this.image.naturalWidth;
    }

    scaleY() {
        return this.image.getBoundingClientRect().height / this.image.naturalHeight;
    }
}