<script>
import ColorPicker from "../ColorPicker.vue";
import PriorityMenu from "../PriorityMenu.vue";
import {createSuccessNotification} from "../../../js/helpers/notificationHelper.js";

export default {
  name: "CameraAreas",
  components: {PriorityMenu, ColorPicker},
  props: {
    camera: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      disabled: false,
      polygons: [],
    }
  },
  computed: {
    areas() {
      return this.camera.areas;
    },
    tracker() {
      return this.$store.getters['getTracker']
    },
    drawingMode() {
      return this.tracker.isDrawingMode
    }
  },
  watch: {
    polygons: {
      deep: true,
      immediate: true,
      handler(val) {
        this.updateDisabled()
      }
    },
    areas: {
      deep: true,
      immediate: true,
      handler(val) {
        this.polygons = val
        this.tracker.importFromJSON(val)
      }
    }
  },
  created() {
    document.addEventListener('on-redraw', e => {
      this.polygons = e.detail
      this.updateDisabled()
    })
  },
  methods: {
    updateDisabled() {
      let ok = false
      this.polygons.map(polygon => {
        if (
            polygon.name === null ||
            polygon.name === '' ||
            polygon.points?.length < 3
        ) {
          ok = true
        }
      })
      this.disabled = ok
    },
    addNewArea() {
      this.tracker.startNewPolygon()
    },
    toggleDrawingMode() {
      this.tracker.toggleMode()
    },
    deleteArea(i) {
      this.tracker.removePolygon(i)
    },
    selectPolygon(i) {
      console.log('Select Polygon', i);
      this.tracker.selectedPolygonIndex = i
      this.tracker.currentPolygon = this.tracker.polygons[i]
      this.tracker.updateUI()
      this.tracker.redraw()
    },
    updateName(name) {
      this.tracker.updateName(name)
    },
    updateColor(i, color) {
      this.tracker.changePolygonColor(i, color)
    },
    async saveAreas() {
      const res = await this.$store.dispatch('saveCameraAreas', {
        id: this.camera.id,
        areas: this.polygons
      })
      if (res) {
        this.polygons = res
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
      }
    }
  }
}
</script>

<template>
  <VSheet>
    <VBtn
      v-tooltip="drawingMode ? $t('Switch to selection mode'): $t('Switch to drawing mode')"
      variant="tonal"
      density="compact"
      :icon="!drawingMode ? 'mdi-pencil' : 'mdi-cursor-pointer'"
      :color="drawingMode ? 'primary' : 'secondary'"
      class="mx-2"
      @click="toggleDrawingMode"
    />
    <VBtn
      v-if="drawingMode"
      v-tooltip="$t('New zone')"
      variant="tonal"
      density="compact"
      icon="mdi-plus"
      class="mr-2"
      @click="addNewArea"
    />
    <VSheet class="mt-4">
      <VList
        selectable
      >
        <VListItem
          v-for="(poly,i) in polygons"
          :key="poly"
          :value="i"
          class="py-2"
          @click="selectPolygon(i)"
        >
          <VTextField
            v-model="poly.name"
            single-line
            :label="$t('Name')"
            density="compact"
            @update:model-value="updateName"
          >
            <template #prepend>
              <ColorPicker
                v-model="poly.color"
                @update:model-value="updateColor(i,poly.color)"
              />
            </template>
            <template #append>
              <PriorityMenu v-model="poly.priority" />
              <VBtn
                icon="mdi-trash-can"
                variant="plain"
                color="error"
                density="compact"
                @click="deleteArea(i)"
              />
            </template>
          </VTextField>
        </VListItem>
      </VList>
    </VSheet>
    <VBtn
      :disabled="disabled"
      :text="$t('Save')"
      prepend-icon="mdi-content-save"
      @click="saveAreas"
    />
  </VSheet>
</template>

<style scoped>

</style>