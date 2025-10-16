<script>
import AvailabilitySelect from '../AvailabilitySelect.vue'
import OperatorSelect from '../OperatorSelect.vue'

export default {
  name: 'RuleConditionGroupAction',
  components: {OperatorSelect, AvailabilitySelect},
  props: {
    condition:{
      type: Object,
      required: true
    },
    modelValue:{
      type:Object,
      default:{}
    }
  },
  data(){
    return {
      value:{}
    }
  },
  emits: ['update:model-value'],
  mounted(){
    this.updateModelValue()
    //this.value = this.modelValue
  },
  watch:{
    // modelValue(newValue){
    //   this.value = newValue
    // },
    value(){
      this.$emit('update:model-value',this.value)
    }
  },
  methods:{
    updateModelValue(){
      this.value = this.modelValue
    }
  },
  computed: {
    group(){
      return this.condition.group
    }
  }
}
</script>

<template>
  <VSheet>
    <VSheet v-if="group === 'availability'">
      <AvailabilitySelect v-model.number="value.state"/>
    </VSheet>
    <VContainer
      v-if="group === 'is'"
      class="pa-0"
    >
      <VRow>
        <VCol
          cols="12"
          :md="value.operator !== null ? 6 : 12"
        >
          <OperatorSelect v-model="value.operator"/>
        </VCol>
        <VCol
          v-if="value.operator"
          cols="12"
          md="6"
        >
          <VTextField
            v-model.number="value.value"
            :label="$t('Value')"
          />
        </VCol>
      </VRow>

    </VContainer>
    <VSheet v-if="group === 'state'">state</VSheet>
  </VSheet>

</template>

<style scoped>

</style>