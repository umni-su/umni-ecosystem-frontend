<script>
import ColorPicker from '../ColorPicker.vue'
import PriorityMenu from '../PriorityMenu.vue'
import {createSuccessNotification} from '../../../js/helpers/notificationHelper.js'
import ConfirmationDialog from '../ConfirmationDialog.vue'

export default {
  name: 'CameraAreas',
  components: {ConfirmationDialog, PriorityMenu, ColorPicker},
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
      selected: null
    }
  },
  computed: {
    areas() {
      return this.camera.areas
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
        this.polygons = val.map(polygon => {
          if (polygon.options === null) {
            polygon.options = {
              enabled: true,
              sensitivity: 1.0,
              min_area: 10,
              min_aspect_ratio: 0.5,
              max_aspect_ratio: 2.0
            }
          }
          return polygon
        })
      }
    }
  },

  mounted() {
    document.addEventListener('on-redraw', e => {
      this.polygons = e.detail
      this.updateDisabled()
    })
    this.tracker.redraw()
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
    async deleteArea(i) {
      const ok = await this.$refs.confirm.show({
        title: this.$t('Delete area'),
        message: this.$t('Area will be deleted'),
        okText: this.$t('Delete'),
        okIcon: 'mdi-trash-can'
      })
      if (ok) {
        if (this.polygons[i]?.id) {
          const areas = await this.$store.dispatch('deleteCameraArea', {
            area_id: this.polygons[i].id,
            camera_id: this.camera.id
          })
          //this.tracker.importFromJSON(areas)
        }
        this.tracker.removePolygon(i)
      }
    },
    selectPolygon(i) {
      this.selected = i
      this.tracker.selectedPolygonIndex = i
      this.tracker.currentPolygon = this.tracker.polygons[i]
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
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Saved')))
        this.tracker.importFromJSON(res)
        //this.tracker.redraw()
      }
    },
    openAreaSettings(poly) {
      console.log(poly)
    },
    toggleTrackerMode() {
      if (this.tracker !== null) {
        this.tracker.toggleMode()
      }
    }
  }
}
</script>

<template>
  <VSheet>
    <VBtn
      v-if="tracker"
      variant="tonal"
      density="comfortable"
      :prepend-icon="tracker.isDrawingMode ? 'mdi-pencil' : 'mdi-cursor-move'"
      :text="tracker.isDrawingMode ? $t('Editing') : $t('Dragging')"
      @click="toggleTrackerMode"
    />
    <VBtn
      v-if="tracker && tracker.isDrawingMode"
      v-tooltip="$t('New zone')"
      variant="tonal"
      density="comfortable"
      prepend-icon="mdi-plus"
      class="ml-4"
      :text="$t('Add area')"
      @click="tracker.startNewPolygon()"
    />
    <VSheet class="mt-2">
      <VList
        v-model="selected"
        selectable
      >
        <VListItem
          v-for="(poly,i) in polygons"
          :key="poly"
          :active="i === selected"
          :class="{'opacity-50':!polygons[i].options.enabled}"
          density="compact"
          variant="tonal"
          base-color="primary"
          rounded="lg"
          :value="i"
          class="mb-2"
          @click="selectPolygon(i)"
        >
          <template #prepend>
            <VSwitch
              v-model="polygons[i].options.enabled"
              v-tooltip="$t('Area is enabled')"
              density="compact"
            />
          </template>
          <template #title>
            <VSheet class="ml-4">
              {{ poly.name ?? $t('No name') }}
            </VSheet>
          </template>
          <template #append>
            <div v-if="i === selected">
              <VMenu
                :close-on-content-click="false"
                width="600"
              >
                <template #activator="{props}">
                  <VBtn
                    v-bind="props"
                    icon="mdi-cog"
                    variant="plain"
                    density="compact"
                    @click="openAreaSettings(poly)"
                  />
                </template>
                <VSheet>
                  <VCard>
                    <template #append>
                      <VSwitch
                        v-model="polygons[i].options.enabled"
                        v-tooltip="$t('Area is enabled')"
                      />
                    </template>
                    <template #title>
                      {{ poly.name }}
                    </template>
                    <template #subtitle>
                      {{ $t('Extended area settings') }}
                    </template>
                    <template #text>
                      <VTextField
                        v-model="poly.name"
                        class="ma-2"
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
                      </VTextField>
                      <VSlider
                        v-model="polygons[i].options.sensitivity"
                        thumb-label
                        :label="$t('Sensitivity')"
                        :step="0.1"
                        :min="0.1"
                        :max="5"
                      />
                      <VSlider
                        v-model="polygons[i].options.min_area"
                        thumb-label
                        :label="$t('Min area')"
                        :step="1"
                        :min="10"
                        :max="2000"
                      />
                      <VSlider
                        v-model="polygons[i].options.min_aspect_ratio"
                        thumb-label
                        :label="$t('Min aspect ratio')"
                        :step="0.1"
                        :min="0.1"
                        :max="5"
                      />
                      <VSlider
                        v-model="polygons[i].options.max_aspect_ratio"
                        thumb-label
                        :label="$t('Max aspect ratio')"
                        :step="0.1"
                        :min="0.1"
                        :max="5"
                      />
                    </template>
                  </VCard>
                </VSheet>
              </VMenu>
              <PriorityMenu v-model.number="poly.priority" />
              <VBtn
                icon="mdi-trash-can"
                variant="plain"
                color="error"
                density="compact"
                @click="deleteArea(i)"
              />
            </div>
          </template>
        </VListItem>
      </VList>
    </VSheet>
    <VBtn
      :disabled="disabled"
      :text="$t('Save')"
      prepend-icon="mdi-content-save"
      @click="saveAreas"
    />
    <ConfirmationDialog ref="confirm" />
  </VSheet>
</template>

<style scoped>

</style>