<script>
export default {
  name: 'RuleConditionOperand',
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  mounted() {
    this.update()
  },
  watch: {
    modelValue: {
      deep: true,
      handler(val) {
        this.operand = val
        this.update()
      }
    }
  },
  data(){
    return {
      items:[],
      opened: false,
      operand: null,
      index: 0,
      types:[
        {
          label:this.$t('And'),
          key: 'and',
          icon:'mdi-gate-and',
          color:'green'
        },
        {
          label:this.$t('Or'),
          key: 'or',
          icon:'mdi-gate-or',
          color:'warning'
        },
        {
          label:this.$t('Not'),
          key: 'not',
          icon:'mdi-gate-not',
          color:'error'
        }
      ]
    }
  },
  computed:{
    label(){
      return this.types[this.index].label
    },
    icon(){
      return this.types[this.index].icon
    },
    color(){
      return this.types[this.index].color ?? 'grey'
    },
    operand(){
      return this.types[this.index].key ?? 'and'
    }
  },
  methods:{
    update(){
      const founded = this.types.findIndex(t=>t.key === this.modelValue)
      if (founded > -1) {
        this.index = founded
      }
      this.operand = this.modelValue
    },
    changeType(e) {
      this.index = this.index >= (this.types.length - 1) ? 0 : this.index+1
      this.$emit('update:model-value',this.operand)
    }
  }
}
</script>

<template>
  <VBtn
    v-if="typeof icon === 'string' && typeof label === 'string'"
    v-tooltip="label"
    variant="tonal"
    density="comfortable"
    :color="color"
    :icon="icon"
    @click.capture.stop="changeType"
  />
</template>

<style scoped>

</style>