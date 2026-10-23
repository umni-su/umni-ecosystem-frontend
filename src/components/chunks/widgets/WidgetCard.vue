<script>
import {reactive} from 'vue'
import ModalDialog from '../ModalDialog.vue'
import DeviceSensorSelect from '../device/DeviceSensorSelect.vue'
import WidgetCardItem from './WidgetCardItem.vue'
import {useHorizontalResize} from '../../../js/composables/useHorizontalResize.js'

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

    return {widgetData, size, dragging, changeWidth}
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
        class="text-center"
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

      <VSheet
        color="transparent"
        class="ma-n2"
      >
        <VContainer fluid>
          <VRow>
            <WidgetCardItem
              v-for="item in widgetData.items"
              :key="item.id"
              :item="item"
            />
          </VRow>
        </VContainer>
      </VSheet>


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
