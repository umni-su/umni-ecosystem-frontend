<template>
  <div class="timeline-container">
    <div
      ref="scrollContainer"
      class="timeline-scroll-container"
      @scroll="handleScroll"
    >
      <div
        class="timeline-content"
        :style="{ width: timelineWidth + 'px' }"
        @mousedown="startDrag"
        @mousemove="handleDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
      >
        <div
          v-if="playback.date !== null"
          v-tooltip="playback.date.toISOString()"
          class="current-time-indicator"
          :style="{ left: playbackLeft + 'px' }"
        />
        <!-- Горизонтальная шкала времени -->
        <div class="timeline-ruler">
          <div
            v-for="tick in visibleTicks"
            :key="tick.key"
            class="tick"
            :class="[
              'tick-' + tick.type,
              { 'tick-major': tick.isMajor }
            ]"
            :style="{ left: getPosition(tick.time) + 'px' }"
          >
            <span
              v-if="tick.label"
              class="tick-label"
              :class="'label-' + tick.type"
            >
              {{ tick.label }}
            </span>
          </div>
        </div>
        <VSheet
          color="grey"
          class="video-clip video-empty opacity-50"
        />

        <!-- Видео-клипы в одну строку -->
        <VSheet
          v-for="clip in visibleClips"
          :key="clip.id"
          v-tooltip="clipTooltip(clip)"
          :class="clip.id!==event.id?'opacity-50':''"
          rounded="0"
          class="video-clip"
          :style="{
            left: getPosition(new Date(clip.start)) + 'px',
            width: getWidth(new Date(clip.start), new Date(clip.end)) + 'px',
          }"
          :color="mapColor(clip)"
          @click="$router.push({name:'event', params:{id:clip.id}})"
        />
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {debounce} from "vuetify/lib/util/index.js";

export default {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      timeIntervalHours: 4,
      clips: [],
      pixelsPerHour: 100,
      zoomLevel: 3,
      minZoom: 0.1,
      maxZoom: 20,
      timelineStart: new Date(),
      timelineEnd: new Date(),
      isDragging: false,
      dragStartX: 0,
      startScrollLeft: 0,
      loading: false,
      colors: ['grey', 'red', 'green', 'yellow']
    };
  },
  computed: {
    playbackLeft() {
      if (this.playback.date === null) return 0
      return this.getPosition(this.playback.date)
    },
    playback() {
      return this.$store.getters['getPlayback']
    },
    visibleTicks() {
      const ticks = [];
      const start = new Date(this.timelineStart);
      const end = new Date(this.timelineEnd);

      // Определяем шаг меток в зависимости от масштаба
      const zoom = this.zoomLevel;
      let minuteStep = 60; // по умолчанию 1 час

      if (zoom > 15) minuteStep = 1; // минуты при максимальном зуме
      else if (zoom > 10) minuteStep = 5;
      else if (zoom > 5) minuteStep = 10;
      else if (zoom > 2) minuteStep = 15;
      else if (zoom > 1) minuteStep = 30;

      // Выравниваем начало
      start.setMinutes(Math.floor(start.getMinutes() / minuteStep) * minuteStep, 0, 0);

      let lastDay = null;
      let lastHour = null;

      for (let time = new Date(start); time <= end; time.setMinutes(time.getMinutes() + minuteStep)) {
        const currentDay = time.getDate();
        const currentHour = time.getHours();
        const isNewDay = currentDay !== lastDay;
        const isNewHour = currentHour !== lastHour;
        lastDay = currentDay;
        lastHour = currentHour;

        // Определяем тип метки
        let type = 'minute';
        let isMajor = false;
        let label = '';

        if (isNewDay) {
          type = 'day';
          isMajor = true;
          label = time.toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'});
        } else if (time.getMinutes() === 0) {
          type = 'hour';
          isMajor = true;
          label = time.getHours() + ':00';
        } else if (minuteStep <= 15 && time.getMinutes() % 30 === 0) {
          type = 'halfhour';
          isMajor = zoom > 5;
          label = isMajor ? time.getHours() + ':' + time.getMinutes().toString().padStart(2, '0') : '';
        } else if (minuteStep <= 5) {
          type = 'minute';
          isMajor = time.getMinutes() % 15 === 0 && zoom > 10;
          label = isMajor ? time.getMinutes().toString().padStart(2, '0') : '';
        }

        ticks.push({
          key: time.getTime() + '-' + type, // Уникальный ключ
          time: new Date(time),
          type,
          isMajor,
          label,
          isNewDay
        });
      }

      return ticks;
    },

    timelineWidth() {
      const hours = (this.timelineEnd - this.timelineStart) / (1000 * 60 * 60);
      return hours * this.pixelsPerHour * this.zoomLevel;
    },
    visibleClips() {
      return this.clips.filter(clip => {
        const clipStart = new Date(clip.start);
        const clipEnd = new Date(clip.end);
        return clipEnd >= this.timelineStart && clipStart <= this.timelineEnd;
      });
    },
  },
  mounted() {
    this.calculateScale();
    window.addEventListener('resize', this.handleResize);
    this.initTimeline();
    this.$refs.scrollContainer.addEventListener('wheel', this.handleWheel, {passive: false});
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.$refs.scrollContainer.removeEventListener('wheel', this.handleWheel);
  },
  methods: {
    mapColor(clip) {
      /**
       * VIDEO = 1
       *     SCREENSHOTS = 2
       *     DETECTION_VIDEO = 3
       *     DETECTION_SCREENSHOTS = 4
       */
      switch (clip.type) {
        case 1:
          return 'success'
        case 2:
          return 'secondary'
        case 3:
          return 'error'
        case 4:
          return 'warning'

      }
      return 'red'
    },
    formatDateTooltip(date) {
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('ru-RU', options);
    },
    clipTooltip(clip) {
      return `Видео #${clip.id}\n${this.formatDateTooltip(new Date(clip.start))} - ${this.formatDateTooltip(new Date(clip.end))}`;
    },
    handleResize: debounce(function () {
      this.calculateScale();
      this.$nextTick(() => {
        this.scrollToNow();
        this.loadVisibleEvents();
      });
    }, 200),
    calculateScale() {
      this.$nextTick(() => {
        const container = this.$refs.scrollContainer;
        if (!container) return;

        const containerWidth = container.clientWidth || 800;
        this.pixelsPerHour = (containerWidth * 1.2) / this.timeIntervalHours;

        // Принудительное обновление размеров
        this.$forceUpdate();
      });
    },
    updateTimelineRange() {
      const now = new Date();
      this.timelineStart = new Date(now);
      this.timelineStart.setHours(now.getHours() - Math.floor(this.timeIntervalHours / 2));

      this.timelineEnd = new Date(this.timelineStart);
      this.timelineEnd.setHours(this.timelineEnd.getHours() + this.timeIntervalHours);
    },
    async initTimeline() {
      this.timelineStart = new Date(this.event.start);
      this.timelineStart.setHours(this.timelineStart.getHours() - 1);

      this.timelineEnd = new Date(this.event.start);
      this.timelineEnd.setHours(this.timelineEnd.getHours() + 1);

      await this.loadEvents();
      this.$nextTick(() => {
        this.scrollToNow();
      });
    },
    async loadEvents() {
      if (this.loading) return;
      this.loading = true;

      try {
        this.clips = await this.$store.dispatch('getCameraTimeline', {
          id: this.event.camera.id,
          start: moment(this.timelineStart).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(this.timelineEnd).format('YYYY-MM-DD HH:mm:ss'),
        });
      } finally {
        this.loading = false;
      }
    },
    // Модифицируем handleScroll для загрузки только видимых событий
    handleScroll() {
      const container = this.$refs.scrollContainer;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const timelineWidth = this.timelineWidth;

      const threshold = 0.2;

      if (scrollLeft + containerWidth > timelineWidth - containerWidth * threshold) {
        this.extendTimeline('end');
      } else if (scrollLeft < containerWidth * threshold) {
        this.extendTimeline('start');
      } else {
        // При обычном скролле без достижения границ загружаем только видимые события
        //this.loadVisibleEvents();
      }
    },
    async extendTimeline(direction) {
      if (this.loading) return;

      const oldStart = new Date(this.timelineStart);
      const oldEnd = new Date(this.timelineEnd);

      if (direction === 'start') {
        this.timelineStart = new Date(oldStart);
        this.timelineStart.setHours(this.timelineStart.getHours() - 1);
      } else {
        this.timelineEnd = new Date(oldEnd);
        this.timelineEnd.setHours(this.timelineEnd.getHours() + 1);
      }

      await this.loadEvents();

      this.$nextTick(() => {
        const container = this.$refs.scrollContainer;
        if (direction === 'start') {
          const hoursDiff = (oldStart - this.timelineStart) / (1000 * 60 * 60);
          container.scrollLeft += hoursDiff * this.pixelsPerHour * this.zoomLevel;
        }
      });
    },
    getPosition(time) {
      const hours = (time - this.timelineStart) / (1000 * 60 * 60);
      return hours * this.pixelsPerHour * this.zoomLevel;
    },
    getWidth(start, end) {
      const hours = (end - start) / (1000 * 60 * 60);
      return Math.max(10, hours * this.pixelsPerHour * this.zoomLevel);
    },
    startDrag(e) {
      if (e.target.closest('.video-clip')) return;
      this.isDragging = true;
      this.dragStartX = e.clientX;
      this.startScrollLeft = this.$refs.scrollContainer.scrollLeft;
      this.$refs.scrollContainer.style.cursor = 'grabbing';
      e.preventDefault();
    },
    handleDrag(e) {
      if (!this.isDragging) return;
      const dx = e.clientX - this.dragStartX;
      this.$refs.scrollContainer.scrollLeft = this.startScrollLeft - dx;

      if (this.$refs.scrollContainer.scrollLeft < 0) {
        const extendHours = 12;
        this.timelineStart = new Date(this.timelineStart.getTime() - extendHours * 60 * 60 * 1000);
        this.$refs.scrollContainer.scrollLeft += extendHours * this.pixelsPerHour * this.zoomLevel;
      }
    },
    stopDrag() {
      this.isDragging = false;
      this.$refs.scrollContainer.style.cursor = 'grab';

      // После окончания перетаскивания загружаем события только для видимой области
      this.loadVisibleEvents();
    },
    // Модифицируем handleWheel для загрузки только видимых событий после зума
    handleWheel(e) {
      e.preventDefault();

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const oldZoom = this.zoomLevel;
      this.zoomLevel = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel * delta));

      const container = this.$refs.scrollContainer;
      const mouseX = e.clientX - container.getBoundingClientRect().left;
      const scrollX = container.scrollLeft + mouseX;
      container.scrollLeft = scrollX * (this.zoomLevel / oldZoom) - mouseX;

      // После изменения зума загружаем события только для видимой области
      this.loadVisibleEvents();
    },
    scrollToNow() {
      const now = this.playback.date !== null ? this.playback.date : new Date(this.event.start);
      if (now < this.timelineStart) {
        this.timelineStart = new Date(now);
        this.timelineStart.setHours(this.timelineStart.getHours() - 2);
      }

      const pos = this.getPosition(now);
      const containerWidth = this.$refs.scrollContainer.clientWidth;
      this.$refs.scrollContainer.scrollLeft = pos - containerWidth / 2;
    },
    getVisibleTimeRange() {
      const container = this.$refs.scrollContainer;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      // Вычисляем время начала и конца видимой области
      const startPixel = scrollLeft;
      const endPixel = scrollLeft + containerWidth;

      const startTime = new Date(this.timelineStart.getTime() + (startPixel / (this.pixelsPerHour * this.zoomLevel)) * 3600000);
      const endTime = new Date(this.timelineStart.getTime() + (endPixel / (this.pixelsPerHour * this.zoomLevel)) * 3600000);

      return {start: startTime, end: endTime};
    },

    async loadVisibleEvents() {
      if (this.loading) return;
      this.loading = true;

      try {
        const visibleRange = this.getVisibleTimeRange();

        // Добавляем небольшой буфер по краям (1 час с каждой стороны)
        const bufferHours = 1;
        const start = new Date(visibleRange.start);
        start.setHours(start.getHours() - bufferHours);

        const end = new Date(visibleRange.end);
        end.setHours(end.getHours() + bufferHours);

        this.clips = await this.$store.dispatch('getCameraTimeline', {
          id: this.event.camera.id,
          start: moment(start).format('YYYY-MM-DD HH:mm:ss'),
          end: moment(end).format('YYYY-MM-DD HH:mm:ss')
        });
      } finally {
        this.loading = false;
      }
    },
  }
};
</script>

<style scoped>
.timeline-container {
  width: 100%;
  position: relative;
  font-family: Arial, sans-serif;
}

.timeline-scroll-container {
  width: 100%;
  height: 100px;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: grab;
  background: #f8f8f8;
  white-space: nowrap; /* Важно для корректного скролла */
  user-select: none; /* Блокируем выделение при перетаскивании */
}

.timeline-content {
  height: 100%;
  position: relative;
  min-width: 100%;
}

.timeline-ruler {
  height: 20px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  border-bottom: 2px solid #333;
}

/* Стили для меток */
.tick {
  position: absolute;
  top: 0;
  height: 100%;
  width: 1px;
  background: #eee;
}

.tick-day {
  background: #333;
  width: 2px;
}

.tick-hour {
  background: #666;
  width: 1.5px;
}

.tick-halfhour {
  background: #999;
  width: 1px;
}

.tick-minute {
  background: #ccc;
  width: 0.5px;
}

/* Стили для подписей */
.tick-label {
  position: absolute;
  bottom: 15px;
  transform: translateX(-50%);
  background: white;
  padding: 2px 0;
  font-size: 11px;
  white-space: nowrap;
}

.label-day {
  font-weight: bold;
  font-size: 13px;
  color: #333;
}

.label-hour {
  font-size: 12px;
  color: #666;
}

.label-halfhour,
.label-minute {
  font-size: 11px;
  color: #999;
}

.video-clip {
  position: absolute;
  height: 40px;
  min-width: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
  color: black;
  cursor: pointer;
  transition: all 0.2s;
  top: 0;

  &:not(.video-empty):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &.video-empty {
    cursor: default;
    left: 0;
    right: 0;
  }
}

.current-time-indicator {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: red;
  z-index: 10;
}

.clip-label {
  padding: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transform-origin: left top;
}

/* Горизонтальный скроллбар */
.timeline-scroll-container::-webkit-scrollbar {
  height: 12px;
}

.timeline-scroll-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.timeline-scroll-container::-webkit-scrollbar-thumb {
  background: #95a5a6;
  border: 2px solid #f1f1f1;
}

.timeline-scroll-container::-webkit-scrollbar-thumb:hover {
  background: #7f8c8d;
}
</style>