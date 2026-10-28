<script>
import {useDisplay} from 'vuetify'
import ColorPicker from '../ColorPicker.vue'
import {
  getSensorIcon,
  getSensorRange,
  getSensorUiComponent,
  parseSensorValues
} from '../../../js/composables/useSensor.js'
import {useHorizontalResize, useVerticalResize} from '../../../js/composables/useResize.js'
import {MASONRY_GAP, MASONRY_ROW} from '../../../js/composables/useMasonry.js'
import ConfirmationDialog from '../ConfirmationDialog.vue'

// Типы ui_component, для которых рисуем переключатель
const TOGGLE_COMPONENTS = ['switch', 'lock', 'boolean']
// Типы ui_component, для которых рисуем пипетку цвета
const COLOR_COMPONENTS = ['rgb', 'rgba', 'color_hex']

function isTruthy(value) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

export default {
  name: 'WidgetDeviceCardItem',
  components: {ConfirmationDialog, ColorPicker},
  props: {
    item: {
      type: Object,
      required: true
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:size', 'update:height', 'update:color', 'delete-item'],
  data() {
    const {smAndUp, mdAndUp} = useDisplay()

    const {size, dragging, changeWidth} = useHorizontalResize({
      getSize: () => this.item?.options?.size,
      setSize: (value) => {
        this.item.options.size = value
      },
      commit: (value) => this.$emit('update:size', {id: this.item.id, size: value}),
      // Шаг ширины считаем по ширине masonry-сетки, а не страницы
      stepSelector: '.widget-masonry'
    })

    const {changeHeight} = useVerticalResize({
      getSize: () => this.item?.options?.height,
      setSize: (value) => {
        this.item.options.height = value
      },
      commit: (value) => this.$emit('update:height', {id: this.item.id, height: value}),
      measure: (event) =>
        event?.currentTarget?.closest?.('.widget-item')?.getBoundingClientRect().height
    })

    return {
      smAndUp,
      mdAndUp,
      size,
      dragging,
      changeWidth,
      changeHeight,
      measuredHeight: 0,
      resizeObserver: null,
      itemColor: '#ffffff',
      itemVariant: 'elevated'
    }
  },
  computed: {
    entity() {
      return this.item?.entity
    },
    // На узких экранах повторяем прежнее поведение VCol: 12 / 6 / size
    span() {
      if (!this.smAndUp) return 12
      if (!this.mdAndUp) return 6
      return this.size
    },
    // Явно заданная высота важнее измеренной по контенту
    contentHeight() {
      const height = Number(this.item?.options?.height)
      return Number.isFinite(height) && height > 0 ? height : this.measuredHeight
    },
    ready() {
      return this.contentHeight > 0
    },
    // Строка сетки — 10px. Округляем вверх, чтобы позиции границ были кратны 10px,
    // а не съезжали из-за добавленного вертикального отступа.
    rowSpan() {
      if (!this.ready) return 1
      const rows = this.contentHeight / MASONRY_ROW
      return Math.max(1, Math.ceil(rows - 0.01))
    },
    itemStyle() {
      const style = {
        gridColumn: `span ${this.span}`,
        gridRow: `span ${this.rowSpan}`
      }
      // Прячем только до первого измерения; после этого inline-opacity
      // не мешает ghost-классу Sortable
      if (!this.ready) style.opacity = 0
      return style
    },
    name() {
      return this.entity.visible_name ?? this.entity.name ?? this.item.title ?? this.$t('No name')
    },
    icon() {
      return this.entity.type_icon ?? this.entity.type_icon ?? getSensorIcon(this.entity.type)
    },
    componentType() {
      return this.entity.ui_component ?? getSensorUiComponent(this.entity.type)
    },
    writable() {
      return Boolean(this.entity.writable)
    },
    isToggle() {
      return TOGGLE_COMPONENTS.includes(this.componentType)
    },
    isColor() {
      return COLOR_COMPONENTS.includes(this.componentType)
    },
    showToggle() {
      return this.writable && this.isToggle
    },
    showColor() {
      return this.writable && this.isColor
    },
    // options сенсора: у Tuya это спецификация DP (code, dp_type, values, ...)
    spec() {
      return this.entity.options ?? {}
    },
    // values приходит JSON-строкой — разбираем её один раз
    specValues() {
      return parseSensorValues(this.spec)
    },
    // Числовой диапазон (min/max/step) для слайдера
    range() {
      return getSensorRange(this.entity)
    },
    // Список значений для Enum-сенсоров (режимы и т.п.)
    enumValues() {
      return Array.isArray(this.specValues) ? this.specValues : []
    },
    showSlider() {
      return this.writable && this.range !== null
    },
    showEnum() {
      return this.writable && this.enumValues.length > 0
    },
    // Если высота не задана — карточка занимает высоту по контенту
    heightStyle() {
      const height = Number(this.item.options.height)
      return Number.isFinite(height) && height > 0 ? {height: `${height}px`} : null
    },
    sliderValue: {
      get() {
        const value = Number(this.entity.value)
        if (Number.isFinite(value)) return value
        return this.range?.min ?? 0
      },
      set(value) {
        this.entity.value = value
        this.$store.dispatch('sensors/setSensorState', {
          id: this.entity.id,
          value: value
        })
      }
    },
    enumValue: {
      get() {
        return this.entity.value
      },
      set(value) {
        this.entity.value = value
        this.$store.dispatch('sensors/setSensorState', {
          id: this.entity.id,
          value: value
        })
      }
    },
    displayValue() {
      const value = this.entity.value
      if (value === null || value === undefined || value === '') return ''
      const unit = this.entity.unit ?? this.spec.unit ?? ''
      return unit ? `${value} ${unit}` : String(value)
    },
    checked: {
      get() {
        return isTruthy(this.entity.value)
      },
      set(value) {
        this.entity.value = value
        this.$store.dispatch('sensors/setSensorState', {
          id: this.entity.id,
          value: value
        })
      }
    },
    color: {
      get() {
        const value = this.entity.value
        if (typeof value === 'string' && /^#?[0-9a-f]{6}/i.test(value.trim())) {
          return value.startsWith('#') ? value : `#${value}`
        }
        return '#ffffff'
      },
      set(value) {
        this.entity.value = value
        this.$store.dispatch('sensors/setSensorState', {
          id: this.entity.id,
          value: value
        })
      }
    }
  },
  mounted() {
    if (this.item?.options?.color) {
      this.itemColor = this.item.options.color
    }
    if (!this.$refs.itemEl) return
    const el = this.$refs.itemEl
    this.resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      const height = entry?.contentRect?.height ?? entry?.borderBoxSize?.[0]?.blockSize ?? el.getBoundingClientRect().height ?? 0
      this.measuredHeight = Math.round(height)
    })
    this.resizeObserver.observe(el)
  },
  beforeUnmount() {
    this.resizeObserver?.disconnect()
  },
  methods: {
    async deleteSelected(id, entity_id) {
      const ok = await this.$refs.confirm.show({
        title: this.$t('Delete widget item'),
        message: this.$t('Widget item will be deleted'),
        okText: this.$t('Delete'),
        okIcon: 'mdi-trash-can'
      })
      if (ok) {
        this.$emit('delete-item', {id, entity_id})
      }
    }
  }
}
</script>

<template>
  <div
    ref="itemEl"
    class="widget-masonry__item"
    :style="itemStyle"
  >
    <VCard
      :color="itemColor"
      class="widget-item  d-flex flex-column align-items-center justify-center"
      :variant="itemVariant"
      :style="heightStyle"
    >
      <div
        v-if="edit"
        class="widget-item__drag-handle"
      >
        <VIcon
          icon="mdi-drag"
          size="18"
        />
      </div>
      <VCardText class="d-flex flex-column justify-center align-center">
        <VIcon
          :size="40"
          :icon="entity.type_icon"
          class="mb-4"
        />

        <VSwitch
          v-if="showToggle"
          v-model="checked"
          color="primary"
          density="compact"
          hide-details
        />
        <ColorPicker
          v-else-if="showColor"
          v-model="color"
        />
        <VSlider
          v-else-if="showSlider"
          v-model="sliderValue"
          :min="range.min"
          :max="range.max"
          :step="range.step"
          color="primary"
          density="compact"
          hide-details
          class="widget-item__slider"
        />
        <VSelect
          v-else-if="showEnum"
          v-model="enumValue"
          :items="enumValues"
          density="compact"
          hide-details
          variant="outlined"
          class="widget-item__select"
        />

        <span
          v-if="displayValue && !showToggle && !showColor"
          class="mb-4"
        >
          {{ displayValue }}
        </span>
        <span>
          {{ name }}
        </span>
        <div
          v-if="edit"
          class="position-absolute top-0 right-0"
        >
          <ColorPicker
            v-model="itemColor"
            @update:model-value="$emit('update:color', $event)"
          />
          <VBtn
            color="default"
            variant="plain"
            density="comfortable"
            icon="mdi-close"
            size="small"
            @click="deleteSelected(item.id,item.entity_id)"
          />
        </div>
      </VCardText>
      <VSheet
        v-if="edit"
        color="transparent"
        class="abs-actions pa-1"
      >
        <VBtn
          rounded="e-0"
          class="trigger"
          color="grey"
          variant="tonal"
          icon="mdi-arrow-split-vertical"
          size="x-small"
          density="comfortable"
          @pointerdown="changeWidth"
        />
      </VSheet>
      <VSheet
        v-if="edit"
        color="transparent"
        class="abs-actions-y pa-1"
      >
        <VBtn
          rounded="b-0"
          class="trigger"
          color="grey"
          variant="tonal"
          icon="mdi-arrow-split-horizontal"
          size="x-small"
          density="comfortable"
          @pointerdown="changeHeight"
        />
      </VSheet>
    </VCard>
    <ConfirmationDialog ref="confirm"/>
  </div>
</template>

<style scoped lang="scss">
.widget-masonry__item {
  min-width: 0;
  // Обязательно: иначе grid растянет айтем до высоты row span и ResizeObserver зациклится
  align-self: start;
  transition: opacity 0.15s ease;
}

.widget-item {
  .widget-item__drag-handle {
    position: absolute;
    left: 4px;
    top: 4px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    color: rgba(var(--v-theme-on-surface), 0.65);
    background: rgba(var(--v-theme-surface), 0.85);
    cursor: grab;
    touch-action: none;
  }

  .widget-item__drag-handle:active {
    cursor: grabbing;
  }

  @media (hover: none) {
    .widget-item__drag-handle {
      opacity: 0.7;
    }
  }

  .abs-actions,
  .abs-actions-y {
    opacity: 0;
    transition: opacity 0.2s ease;
    position: absolute;
    z-index: 2;
  }

  .abs-actions {
    right: -6px;
    top: 50%;
    margin-top: -20px;
  }

  .abs-actions-y {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
  }

  &:hover .abs-actions,
  &:hover .abs-actions-y {
    opacity: 1;
  }

  :deep(.abs-actions .v-btn) {
    cursor: ew-resize;
    touch-action: none;
  }

  :deep(.abs-actions-y .v-btn) {
    cursor: ns-resize;
    touch-action: none;
  }

  // Фиксированная высота не должна давать контенту вылезать за карточку
  :deep(.v-card-text) {
    width: 100%;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
  }
}

.widget-item__slider,
.widget-item__select {
  width: 100%;
}
</style>