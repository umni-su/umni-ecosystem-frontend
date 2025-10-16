<script>
import InfiniteAutocomplete from '../InfiniteAutocomplete.vue'
import RuleConditionItem from './RuleConditionItem.vue'

export default {
  name: 'RuleConditionItems',
  components: {RuleConditionItem, InfiniteAutocomplete},
  props:{
    modelValue:{
      type:Array,
      default:[]
    }
  },
  emits: ['update:model-value'],
  data(){
    return {
      term:null,
      response:null,
      groups:[],
      selectedGroup:null,
      conditionsData:[]
    }
  },
  watch:{
    conditionsData:{
      deep: true,
      handler(val){
        this.$emit('update:model-value', val)
      }
    }
  },
  created(){
    this.conditionsData = this.modelValue
  },
  methods:{
    addCondition(){
      this.conditionsData.push({
        operand: 'and'
      })
    },
    removeConditionsData(condition){
      this.conditionsData = this.conditionsData.filter(item => condition !== item)
    }
  }
}
</script>

<template>
  <VSheet>
    <VExpansionPanels>
      <RuleConditionItem
        v-for="(condition, index) in conditionsData"
        :key="index"
        v-model="conditionsData[index]"
        @on-remove="removeConditionsData"
      />

    </VExpansionPanels>
    <VSheet class="text-center">
      <VBtn
        class="mt-4"
        prepend-icon="mdi-plus"
        variant="tonal"
        color="default"
        :text="$t('Add')"
        @click="addCondition"
      />
    </VSheet>
  </VSheet>

</template>

<style scoped>

</style>