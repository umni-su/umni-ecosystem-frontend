<script>
import VueDatePicker from '@vuepic/vue-datepicker'

export default {
  name: 'DatePicker',
  components: {
    VueDatePicker
  },
  props: {
    modelValue: {
      type: Array,
      default: null
    },
    canClear: {
      type: Boolean,
      default: false
    },
    inputWidth: {
      type: [String, Number],
      default: '100%'
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      date: [Date.now(), Date.now()]
    }
  },
  computed: {
    format() {
      return this.$store.getters['getDateTimeFormat']
    }
  },
  watch: {
    date() {
      this.$emit('update:modelValue', this.date)
    }
  },
  created() {
    this.date = this.modelValue
  },
  methods: {
    resetDate() {
      this.date = [null, null]
    },
    formatDates(date) {
      return this.date?.map(d => {
        return this.$moment(d).format(this.format)
      }).join(' - ')
    }
  }
}
</script>

<template>
  <VueDatePicker
    v-model="date"
    :clearable="false"
    :format="formatDates"
    :range="{ partialRange: false }"
  >
    <template #dp-input="{value}">
      <VBtn
        variant="text"
        color="default"
        :text="date !== null? value : $t('Select date')"
        prepend-icon="mdi-calendar"
        class="pr-4"
      />
      <VBtn
        v-if="canClear"
        icon="mdi-close"
        variant="text"
        color="default"
        density="comfortable"
        class="ml-1"
        @click.stop="resetDate"
      />
    </template>
  </VueDatePicker>
</template>

<style scoped>

</style>