<script>
import {useSensor, getSensorUiComponent} from '../../../js/composables/useSensor.js'
import {computed} from 'vue'
import {debounce} from '../../../js/helpers/debounce.js'
import ColorPicker from '../ColorPicker.vue'

export default {
  name: 'DeviceSensorValue',
  components: {ColorPicker},
  props: {
    modelValue: {
      default: null
    },
    sensor: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    // Создаём реактивную ссылку на value
    const value = computed({
      get: () => props.sensor.value,
      set: (val) => {
      } // только чтение
    })

    const {valueByType, colorByType} = useSensor(props.sensor, value)
    return {valueByType, colorByType}
  },
  data() {
    return {
      value: null,
      init: false
    }
  },
  computed: {
    icon() {
      return this.sensor.icon ?? 'mdi-help-circle'
    },
    component() {
      return getSensorUiComponent(this.sensor.type)
    },
    isToggle() {
      return this.component === 'switch' || this.component === 'lock'
    },
    isBrightness() {
      return this.component === 'brightness'
    },
    isColorTemp() {
      return this.component === 'color_temp'
    },
    isColor() {
      return this.component === 'color_hex' ||
          ((this.component === 'rgb' || this.component === 'rgba') &&
              typeof this.sensor.value === 'string' &&
              /^#?[0-9a-f]{6}/i.test(this.sensor.value))
    },
    colorTempMin() {
      return this.sensor.options?.values?.min ?? 0
    },
    colorTempMax() {
      return this.sensor.options?.values?.max ?? 1000
    }
  },
  watch: {
    value(val) {
      if (this.init) {
        this.$emit('update:model-value', val)
      }
    },
    modelValue(val) {
      this.value = val
    }
  },
  created() {
    this.init = false
    this.value = this.valueByType
    this.debouncedSetColor = debounce((e) => {
      this.$store.dispatch('setSensorState', {
        id: this.sensor.id,
        value: e
      })
    }, 500)
    this.debouncedSetBrightness = debounce((e) => {
      this.$store.dispatch('setSensorState', {
        id: this.sensor.id,
        value: e
      })
    }, 400)
    this.debouncedSetColorTemp = debounce((e) => {
      this.$store.dispatch('setSensorState', {
        id: this.sensor.id,
        value: e
      })
    }, 400)
    this.$nextTick(() => {
      this.init = true
    })

  },
  methods: {
    async changeRelayState(e) {
      await this.$store.dispatch('setSensorState', {
        id: this.sensor.id,
        value: e
      })
    },
    changeBrightness(e) {
      if (this.init) {
        this.debouncedSetBrightness(e)
      }

    },
    changeColorTemp(e) {
      if (this.init) {
        this.debouncedSetColorTemp(e)
      }
    },
    changeColor(e) {
      if (this.init) {
        this.debouncedSetColor(e)
      }

    }
  }
}
</script>

<template>
  <VSwitch
    v-if="isToggle"
    v-model="value"
    color="primary"
    class="pa-0 mr-5"
    density="compact"
    :value="true"
    :true-value="true"
    :false-value="false"
    @click.stop
    @update:model-value="changeRelayState"
  />
  <VMenu
    v-else-if="isBrightness"
    :close-on-content-click="false"
    width="100%"
    max-width="500"
  >
    <template #activator="{props}">
      <VBtn
        v-bind="props"
        density="compact"
        variant="text"
        class="mr-5 brightness-btn"
        @click.stop
      >
        <VIcon
          icon="mdi-brightness-7"
          class="mr-1"
        />
        <span class="text-caption">{{ valueByType }}</span>
      </VBtn>
    </template>
    <VSheet
      color="default"
      class="pa-4"
    >
      <VSlider
        v-model="value"
        min="0"
        max="100"
        step="1"
        density="compact"
        class="brightness-slider"
        @update:model-value="changeBrightness"
      />
    </VSheet>
  </VMenu>
  <VMenu
    v-else-if="isColorTemp"
    :close-on-content-click="false"
    width="100%"
    max-width="500"
  >
    <template #activator="{props}">
      <VBtn
        v-bind="props"
        density="compact"
        variant="text"
        class="mr-5 brightness-btn"
        @click.stop
      >
        <VIcon
          icon="mdi-white-balance-sunny"
          class="mr-1"
        />
        <span class="text-caption">{{ valueByType }}</span>
      </VBtn>
    </template>
    <VSheet
      color="default"
      class="pa-4"
    >
      <VSlider
        v-model="value"
        :min="colorTempMin"
        :max="colorTempMax"
        step="1"
        density="compact"
        class="brightness-slider"
        @update:model-value="changeColorTemp"
      />
    </VSheet>
  </VMenu>
  <ColorPicker
    v-else-if="isColor"
    v-model="value"
    class="mr-5"
    @update:model-value="changeColor"
  />
  <VBtn
    v-else
    readonly
    class="text-center"
    variant="text"
    color="default"
    :text="valueByType"
  />
</template>

<style scoped>
.brightness-slider {
  min-width: 180px;
}
</style>
