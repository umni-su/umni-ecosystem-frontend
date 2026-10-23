<script>
import ColorPicker from '../ColorPicker.vue'
import {
  getSensorIcon,
  getSensorRange,
  getSensorUiComponent,
  parseSensorValues
} from '../../../js/composables/useSensor.js'
import {useHorizontalResize, useVerticalResize} from '../../../js/composables/useResize.js'

// Типы ui_component, для которых рисуем переключатель
const TOGGLE_COMPONENTS = ['switch', 'lock', 'boolean']
// Типы ui_component, для которых рисуем пипетку цвета
const COLOR_COMPONENTS = ['rgb', 'rgba', 'color_hex']

function isTruthy(value) {
  return value === true || value === 1 || value === '1' || value === 'true'
}

export default {
  name: 'WidgetCardItem',
  components: {ColorPicker},
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['update:size', 'update:height'],
  setup(props, {emit}) {
    const {size, dragging, changeWidth} = useHorizontalResize({
      getSize: () => props.item?.size,
      setSize: (value) => {
        props.item.size = value
      },
      commit: (value) => emit('update:size', {id: props.item.id, size: value})
    })

    const {changeHeight} = useVerticalResize({
      getSize: () => props.item?.height,
      setSize: (value) => {
        props.item.height = value
      },
      commit: (value) => emit('update:height', {id: props.item.id, height: value}),
      measure: (event) =>
        event?.currentTarget?.closest?.('.widget-item')?.getBoundingClientRect().height
    })

    return {size, dragging, changeWidth, changeHeight}
  },
  computed: {
    name() {
      return this.item.visible_name ?? this.item.name ?? this.item.title ?? this.$t('No name')
    },
    icon() {
      return this.item.type_icon ?? this.item.icon ?? getSensorIcon(this.item.type)
    },
    componentType() {
      return this.item.ui_component ?? getSensorUiComponent(this.item.type)
    },
    writable() {
      return Boolean(this.item.writable)
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
      return this.item.options ?? {}
    },
    // values приходит JSON-строкой — разбираем её один раз
    specValues() {
      return parseSensorValues(this.spec)
    },
    // Числовой диапазон (min/max/step) для слайдера
    range() {
      return getSensorRange(this.item)
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
    // Если высота не задана — карточка растягивается на ячейку (h-100)
    heightStyle() {
      const height = Number(this.item.height)
      return Number.isFinite(height) && height > 0 ? {height: `${height}px`} : null
    },
    sliderValue: {
      get() {
        const value = Number(this.item.value)
        if (Number.isFinite(value)) return value
        return this.range?.min ?? 0
      },
      set(value) {
        // Пока меняем значение только локально, без запроса к API.
        this.item.value = value
      }
    },
    enumValue: {
      get() {
        return this.item.value
      },
      set(value) {
        // Пока меняем значение только локально, без запроса к API.
        this.item.value = value
      }
    },
    displayValue() {
      const value = this.item.value
      if (value === null || value === undefined || value === '') return ''
      const unit = this.item.unit ?? this.spec.unit ?? ''
      return unit ? `${value} ${unit}` : String(value)
    },
    checked: {
      get() {
        return isTruthy(this.item.value)
      },
      set(value) {
        // Пока меняем значение только локально, без запроса к API.
        this.item.value = value
      }
    },
    color: {
      get() {
        const value = this.item.value
        if (typeof value === 'string' && /^#?[0-9a-f]{6}/i.test(value.trim())) {
          return value.startsWith('#') ? value : `#${value}`
        }
        return '#ffffff'
      },
      set(value) {
        // Пока меняем значение только локально, без запроса к API.
        this.item.value = value
      }
    }
  }
}
</script>

<template>
  <VCol
    sm="6"
    :md="size"
    cols="12"
  >
    <VCard
      class="widget-item overflow-visible d-flex flex-column align-items-center justify-center"
      :class="{'h-100': !heightStyle}"
      :style="heightStyle"
    >
      <VCardText class="d-flex flex-column justify-center align-center">
        <VIcon
          :size="40"
          :icon="item.type_icon"
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
      </VCardText>
      <VSheet
        color="transparent"
        class="abs-actions pa-1"
      >
        <VBtn
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
        color="transparent"
        class="abs-actions-y pa-1"
      >
        <VBtn
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
  </VCol>
</template>

<style scoped lang="scss">
.widget-item {
  .abs-actions,
  .abs-actions-y {
    opacity: 0;
    transition: opacity 0.2s ease;
    position: absolute;
    z-index: 2;
  }

  .abs-actions {
    right: -14px;
    top: 50%;
    margin-top: -20px;
  }

  .abs-actions-y {
    bottom: -14px;
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
