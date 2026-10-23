<script>
import {reactive} from 'vue'
import Draggable from 'vuedraggable'
import ModalDialog from '../ModalDialog.vue'
import DeviceSensorSelect from '../device/DeviceSensorSelect.vue'
import WidgetCardItem from './WidgetCardItem.vue'
import {useHorizontalResize} from '../../../js/composables/useResize.js'
import {MASONRY_GAP, MASONRY_ROW} from '../../../js/composables/useMasonry.js'

export default {
  name: 'WidgetCard',
  components: {
    WidgetCardItem,
    DeviceSensorSelect,
    ModalDialog,
    Draggable
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
  emits: ['update:size'],
  setup(props, {emit}) {
    const widgetData = reactive({
      title: null,
      type: props.type,
      entity_id: null,
      size: 'full',
      sort_order: 0,
      items: []
    })

    const {size, dragging, changeWidth} = useHorizontalResize({
      getSize: () => widgetData.size,
      setSize: (value) => {
        widgetData.size = value
      },
      commit: (value) => emit('update:size', value)
    })

    // Высота строки и отступ задаются из JS, чтобы совпадать с расчётом span
    const masonryStyle = {
      '--masonry-gap': `${MASONRY_GAP}px`,
      '--masonry-row': `${MASONRY_ROW}px`
    }

    return {widgetData, size, dragging, changeWidth, masonryStyle}
  }
}
</script>

<template>
  <VCol :cols="size">
    <VSheet
      v-if="widget === null"
      :color="$vuetify.theme.name === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'"
      min-height="100"
      class="widget-card pa-4 border-md border-dashed"
      border="2"
    >

      <VSheet
        color="transparent"
        class="text-center mb-4"
      >
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
      </VSheet>

      <Draggable
        v-model="widgetData.items"
        item-key="id"
        tag="div"
        class="widget-masonry"
        :style="masonryStyle"
        :animation="150"
        handle=".widget-item__drag-handle"
        ghost-class="widget-masonry__ghost"
      >
        <template #item="{element}">
          <WidgetCardItem :item="element" />
        </template>
      </Draggable>


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

.widget-masonry {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  grid-auto-rows: var(--masonry-row, 10px);
  grid-auto-flow: row dense;
  align-items: start;
  column-gap: var(--masonry-gap, 16px);

  :deep(.widget-masonry__ghost) {
    opacity: 0.35;
  }
}

.widget-card__size {
  position: absolute;
  right: 6px;
  top: 44px;
  z-index: 2;
}
</style>
