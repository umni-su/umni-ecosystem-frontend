<script>
import ModalDialog from '../ModalDialog.vue'
import DeviceSensorSelect from '../device/DeviceSensorSelect.vue'
import WidgetCardItem from './WidgetCardItem.vue'

// Границы ширины карточки в колонках (из 12)
const MIN_SIZE = 1
const MAX_SIZE = 12
// Задержка перед отправкой изменений, чтобы не дёргать сервер на каждый пиксель
const COMMIT_DELAY = 150

export default {
  name: 'WidgetCard',
  components: {
    WidgetCardItem,
    DeviceSensorSelect,
    ModalDialog
  },
  props: {
    type: {
      type: String,
      required: true,
      validator(value) {
        return ['DEVICE', 'CAMERA'].includes(value)
      }
    },
    entity: {
      type: Object,
      required: true
    },
    widget: {
      type: Object,
      default: null
    }
  },
  computed: {
    // Ширина карточки в колонках (1..12)
    size() {
      const value = Number(this.widgetData?.size)
      if (!Number.isFinite(value)) return MAX_SIZE
      return Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)))
    },
    cols() {
      return this.size
    }
  },
  methods: {
    changeWidth(event) {
      if (event) event.preventDefault()
      this.dragging = true
      this.startX = this.pointerX(event)
      this.startSize = this.size
      this.pixelStep = this.calcPixelStep()
      window.addEventListener('pointermove', this.onPointerMove)
      window.addEventListener('pointerup', this.onPointerEnd)
      window.addEventListener('pointercancel', this.onPointerEnd)
    },
    onPointerMove(event) {
      if (!this.dragging) return
      if (event.cancelable) event.preventDefault()
      const diff = Math.round((this.pointerX(event) - this.startX) / this.pixelStep)
      this.applySize(this.startSize + diff)
    },
    onPointerEnd() {
      if (!this.dragging) return
      this.dragging = false
      window.removeEventListener('pointermove', this.onPointerMove)
      window.removeEventListener('pointerup', this.onPointerEnd)
      window.removeEventListener('pointercancel', this.onPointerEnd)
    },
    applySize(value) {
      const size = Math.min(MAX_SIZE, Math.max(MIN_SIZE, Math.round(value)))
      if (size === this.size) return
      this.widgetData.size = size
      this.scheduleCommit(size)
    },
    scheduleCommit(size) {
      clearTimeout(this.commitTimer)
      this.commitTimer = setTimeout(() => {
        this.$emit('update:size', size)
      }, COMMIT_DELAY)
    },
    pointerX(event) {
      return event.clientX ?? event.touches?.[0]?.clientX ?? 0
    },
    calcPixelStep() {
      const row = this.$el?.closest?.('.v-row')
      const width = row?.getBoundingClientRect().width ?? 0
      return Math.max(10, (width || 1200) / MAX_SIZE)
    }
  },
  data() {
    return {
      widgetData: {
        title: null,
        type: null,
        entity_id: null,
        size: 'full',
        sort_order: 0,
        items: []
      },
      dragging: false,
      startX: 0,
      startSize: MAX_SIZE,
      pixelStep: 100,
      commitTimer: null
    }
  },
  mounted() {
    this.widgetData.type = this.type
  },
  unmounted() {
    this.onPointerEnd()
    clearTimeout(this.commitTimer)
  }
}
</script>

<template>
  <VCol :cols="cols">
    <VSheet
      v-if="widget === null"
      :color="$vuetify.theme.name === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'"
      min-height="100"
      class="widget-card pa-4 border-md border-dashed"
      border="2"
    >

      <VSheet
        color="transparent"
        class="ma-n2"
      >
        <VContainer fluid>
          <VRow no-gutters>
            <WidgetCardItem
              v-for="item in widgetData.items"
              :key="item.id"
              class="ma-2"
              :item="item"
            />
          </VRow>
        </VContainer>
      </VSheet>

      <VMenu :close-on-content-click="false">
        <template #activator="{props}">
          <VBtn
            v-bind="props"
            color="grey"
            variant="tonal"
            :text="$t('Add widget item')"
            prepend-icon="mdi-plus"
            size="small"
          />
        </template>
        <VSheet>
          <DeviceSensorSelect
            v-if="widgetData.type === 'DEVICE'"
            v-model="widgetData.items"
            width="300"
          />
        </VSheet>
      </VMenu>

      <VSheet
        color="transparent"
        class="abs-actions pa-1"
      >
        <VBtn
          color="grey"
          variant="tonal"
          icon="mdi-arrow-split-vertical"
          size="small"
          density="comfortable"
          @pointerdown="changeWidth"
        />
      </VSheet>

    </VSheet>
  </VCol>
</template>

<style scoped lang="scss">
.widget-card {
  position: relative;
  user-select: none;

  .abs-actions {
    opacity: 0;
    transition: opacity 0.2s ease;
    position: absolute;
    right: -19px;
    top: 50%;
    margin-top: -20px;
    z-index: 2;
  }

  &:hover .abs-actions {
    opacity: 1;
  }

  :deep(.abs-actions .v-btn) {
    cursor: ew-resize;
    touch-action: none;
  }
}

.widget-card__size {
  position: absolute;
  right: 6px;
  top: 44px;
  z-index: 2;
}
</style>
