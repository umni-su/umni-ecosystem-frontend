<script>
import Draggable from 'vuedraggable'
import ModalDialog from '../ModalDialog.vue'
import DeviceSensorSelect from '../device/DeviceSensorSelect.vue'
import WidgetDeviceCardItem from './WidgetDeviceCardItem.vue'
import {useHorizontalResize} from '../../../js/composables/useResize.js'
import {MASONRY_GAP, MASONRY_ROW} from '../../../js/composables/useMasonry.js'
import {createErrorNotification, createSuccessNotification} from '../../../js/helpers/notificationHelper.js'

export default {
  name: 'WidgetCard',
  components: {
    WidgetDeviceCardItem,
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
      default: {}
    }
  },
  emits: [
    'update:size',
    'on-delete',
    'on-create'
  ],
  data() {
    return {
      edit: false,
      selected: [],
      size: null,
      dragging: null,
      changeWidth: null,
      masonryStyle: null,
      widgetData: {
        title: null,
        type: this.type,
        entity_id: null,
        size: 'full',
        sort_order: 0,
        items: []
      }
    }
  },
  computed: {
    isNew() {
      return this.widget.id === undefined || this.widget.id < 1
    },
    widgetServerData() {
      return {
        ...this.widgetData,
        items: this.widgetData.items.map(({entity, ...rest}) => rest)
      }
    }
  },
  beforeMount() {
    const {size, dragging, changeWidth} = useHorizontalResize({
      getSize: () => this.widgetData.size,
      setSize: (value) => {
        this.widgetData.size = value
      },
      commit: (value) => this.$emit('update:size', value)
    })

    this.size = size
    this.dragging = dragging
    this.changeWidth = changeWidth

    // Высота строки и отступ задаются из JS, чтобы совпадать с расчётом span
    this.masonryStyle = {
      '--masonry-gap': `${MASONRY_GAP}px`,
      '--masonry-row': `${MASONRY_ROW}px`
    }
  },
  mounted() {
    this.widgetData = {...this.createEmptyWidget(), ...this.widget}
    this.selected = this.widget?.items?.map(item => item.entity_id) ?? []
  },
  methods: {
    createEmptyWidget() {
      return {
        title: this.entity.title,
        type: this.type,
        entity_id: this.entity.id,
        size: this.size ?? 12,
        active: true,
        sort_order: this.widget?.items?.length ?? 0,
        items: []
      }
    },
    createEmptyWidgetItem(id, title, entity_id, options, entity = null) {
      const existingWidgetItem = this.widgetData.items.findIndex(item => item.id === id && item.entity_id === entity_id)
      if (existingWidgetItem > -1) {
        this.widgetData.items[existingWidgetItem] = {
          ...this.widgetData.items[existingWidgetItem],
          ...{id, title, entity_id, options}
        }
      } else {
        this.widgetData.items.push({id, title, entity_id, options, entity})
      }
    },
    addWidgetItem(item) {
      this.createEmptyWidgetItem(
        0,
        item.name,
        item.id,
        {
          size: 12,
          height: 140
        },
        item
      )
    },
    async onDeleteSelected({id, entity_id}) {
      if (this.widget?.id > 0 && id > 0) {
        const res = await this.$store.dispatch('widgets/deleteWidgetItem', {
          widget_id: this.widget.id,
          item_id: id
        }).catch(e => {
          this.$store.commit('addNotification', createErrorNotification(e.response.data.message))
        })
        if (res) {
          this.$store.commit('addNotification', createSuccessNotification(this.$t('Success')))
        }
      }
      this.sliceWidgetByEntityId(entity_id)

    },
    sliceWidgetByEntityId(entity_id) {
      this.selected.splice(this.selected.indexOf(entity_id), 1)
      this.widgetData.items = this.widgetData.items.filter(item => {
        return item.entity_id !== entity_id
      })
    },
    async saveWidget() {
      const method = this.widget?.id > 0 ? 'widgets/updateWidget' : 'widgets/addWidget'
      const res = await this.$store.dispatch(method, this.widgetServerData).catch(e => {
        this.$store.commit('addNotification', createErrorNotification(e.response.data.message))
      })
      if (res) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
      }
      this.$emit('on-create', res)
    }
  }
}
</script>

<template>
  <VCol :cols="size">
    <VCard
      min-height="100"
      :variant="isNew || edit ? 'flat' : 'elevated'"
      :elevation="isNew || edit ? 2 : 0"
      color="default"
      class="widget-card"
      :class="[{'border-dashed  border-md': isNew || edit}, isNew || edit ? 'pa-4' : 'pa-4']"
    >
      <VCardText class="pa-0">
        <div class="text-body-large mb-2 font-weight-bold opacity-70">
          {{ widgetData.title }}
        </div>
        <VSheet
          class="text-right mb-2 position-absolute top-0 right-0 ma-2"
          color="transparent"
        >
          <VBtn
            v-if="!isNew"
            :icon="edit ? 'mdi-chevron-right' : 'mdi-pencil'"
            variant="tonal"
            color="grey"
            size="small"
            class="mr-2"
            density="comfortable"
            @click="edit = !edit"
          />
          <VMenu
            v-if="isNew || edit"
            :close-on-content-click="false"
          >
            <template #activator="{props}">
              <VBtn
                v-tooltip="$t('Add widget item')"
                v-bind="props"
                color="grey"
                variant="tonal"
                icon="mdi-plus"
                density="comfortable"
                size="small"
                class="mr-2"
              />
            </template>
            <VSheet>
              <DeviceSensorSelect
                v-if="widgetData.type === 'DEVICE'"
                v-model="selected"
                width="300"
                @on-select-sensor="addWidgetItem"
              />
            </VSheet>
          </VMenu>
          <VBtn
            v-if="isNew || edit"
            icon="mdi-content-save"
            variant="tonal"
            size="small"
            density="comfortable"
            @click="saveWidget"
          />
          <VBtn
            v-if="isNew || edit"
            icon="mdi-close"
            variant="tonal"
            size="small"
            color="error"
            density="comfortable"
            class="ml-2"
            @click="$emit('on-delete', this.widget)"
          />
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
          <template
            #item="{element}"
            v-if="type==='DEVICE'"
          >
            <WidgetDeviceCardItem
              :item="element"
              @delete-item="onDeleteSelected"
            />
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
            rounded="e-0"
            density="comfortable"
            @pointerdown="changeWidth"
          />
        </VSheet>
      </VCardText>

    </VCard>
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
    right: -6px;
    bottom: -4px;
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
  grid-template-columns: repeat(12, minmax(0, 2fr));
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
