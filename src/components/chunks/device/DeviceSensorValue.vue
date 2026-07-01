<script>
import {useSensor} from '../../../js/composables/useSensor.js'
import {computed} from 'vue'


export default {
  name: 'DeviceSensorValue',
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
      value: null
    }
  },
  created() {
    this.value = this.valueByType
  },
  watch: {
    value(val) {
      this.$emit('update:model-value', val)
    },
    modelValue(val) {
      this.value = val
    }
  },
  computed: {
    icon() {
      return this.sensor.icon ?? 'mdi-help-circle'
    }
  },
  methods: {
    async changeRelayState(e) {
      await this.$store.dispatch('setRelayState', {
        id: this.sensor.id,
        value: e
      })
    }
  }
}
</script>

<template>
  <VSwitch
    v-if="sensor.type === 100"
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

</style>