<script>
import InfiniteAutocomplete from '../InfiniteAutocomplete.vue'
import RuleConditionOperand from './RuleConditionOperand.vue'

export default {
  name: 'RuleConditionItem' ,
  components: {
    RuleConditionOperand,
    InfiniteAutocomplete
  },
  props: {
    modelValue: {
      type: Object,
      default: {}
    }
  },
  async mounted(){
    // this.condition.group = null
    // this.condition.items = []
    // this.condition.key =  null
    this.groups = await this.$store.dispatch('getConditionsList')
    this.condition = this.modelValue

  },
  data(){
    return {
      groups:[],
      condition:{},
      conditionKey:null,
      page:1,
      size: 20,
      entitiesPaginated:null
    }
  },
  computed:{
    itemsByGroup(){
      return this.groups.find(_group => this.condition?.group === _group.key)
    }
  },
  watch:{
    conditionKey(){
      this.entitiesPaginated = null
      this.page = 1
      if(this.$refs.autocomplete){
        this.$refs.autocomplete.items = []
      }
    },
    modelValue(val){
      this.$emit('update:model-value', val)
    },
    condition:{
      handler(val){
        this.$emit('update:model-value', val)
      },
      deep:true
    }
  },
  emits:['update:model-value','on-remove'],
  methods:{
    async updateTerm(e){
      this.page = 1
      this.term = e
      this.entitiesPaginated = null
      await this.getTargetEntities()
    },
    async onLoad(condition, {done}){
      await this.getTargetEntities(condition)
      this.page = this.page + 1
      return done(this.response.items.length > 0 ? 'ok' : 'empty')
    },
    async getTargetEntities(condition){
      const res = await this.$store.dispatch('getConditionsEntities',{
        term:this.term,
        category:condition.group,
        condition:condition.key,
        page: this.page,
        size: this.size
      })
      if(res){
        this.response = res
        if(this.entitiesPaginated === null){
          this.entitiesPaginated = res
        } else {
          this.entitiesPaginated.items = [...this.entitiesPaginated.items,...res.items]
        }
      }
    }

  }
}
</script>

<template>
  <VExpansionPanel>
    <VExpansionPanelTitle class="pa-2">
      <RuleConditionOperand
        v-model="condition.operand"
        class="mr-2"
      />
      {{$t('Condition')}}
      <template #actions="{ expanded }">
        <VBtn
          v-if="expanded"
          density="compact"
          variant="text"
          icon="mdi-close"
          color="red"
          @click.stop="$emit('on-remove',condition)"
        />
        <VBtn
          readonly
          density="compact"
          variant="text"
          color="default"
          :icon="expanded?'mdi-chevron-up':'mdi-chevron-down'"
        />
      </template>
    </VExpansionPanelTitle>
    <VExpansionPanelText>
      <VAutocomplete
        v-model="condition.group"
        autocomplete="off"
        :items="groups"
        item-value="key"
        :label="$t('Choose category')"
        @update:model-value="condition.key = null"
      >
        <template #selection="{item}">
          <VIcon
            class="mr-2"
            :icon="item.raw.icon"
          />
          {{item.raw.label}}
        </template>
        <template #item="{props, item}">
          <VListItem
            v-bind="props"
            :title="item.raw.label"
            :prepend-icon="item.raw.icon"
          />
        </template>
      </VAutocomplete>
      <VAutocomplete
        v-if="condition.group !== null && condition.group !== undefined"
        v-model="condition.key"
        autocomplete="off"
        class="mt-4"
        item-value="key"
        :label="$t('Choose condition')"
        :items="itemsByGroup.items"
      >
        <template #selection="{item}">
          <VIcon
            class="mr-2"
            :icon="item.raw.icon"
          /> {{item.raw.label}}
        </template>
        <template #item="{props, item}">
          <VListItem
            v-bind="props"
            :title="item.raw.label"
            :prepend-icon="item.raw.icon"
          />
        </template>
      </VAutocomplete>
      <InfiniteAutocomplete
        v-if="condition.key !== null && condition.key !== undefined"
        ref="autocomplete"
        v-model="condition.items"
        :data-response="entitiesPaginated"
        @update-term="updateTerm(condition)"
        @load="onLoad(condition, $event)"
      />
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style scoped>

</style>