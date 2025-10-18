<script>
import InfiniteAutocomplete from '../InfiniteAutocomplete.vue'
import RuleConditionOperand from './RuleConditionOperand.vue'
import RuleConditionGroupAction from './RuleConditionGroupAction.vue'

export default {
  name: 'RuleConditionItem' ,
  components: {
    RuleConditionGroupAction,
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
    },
    currentItemByKey(){
      return this.itemsByGroup?.items?.find(_item=>_item.key === this.condition.key)
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
    async updateTerm(c,e){
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
  <VExpansionPanel :color="$vuetify.theme.name === 'light' ? 'grey-lighten-4': 'grey-darken-3'">
    <VExpansionPanelTitle class="pa-2">
      <RuleConditionOperand
        v-model="condition.operand"
        class="mr-2"
      />
      <VChip
        v-if="itemsByGroup?.label"
        :prepend-icon="itemsByGroup?.icon"
        variant="text"
        :text="itemsByGroup?.label"
      />
      <VIcon
        v-if="currentItemByKey"
        icon="mdi-arrow-right"
        size="small"
        class="mx-1"
      />
      <VChip
        v-if="currentItemByKey?.label"
        :prepend-icon="currentItemByKey?.icon"
        variant="text"
        :text="currentItemByKey?.label"
      />
      <template #actions="{ expanded }">
        <VBtn
          v-if="expanded"
          density="compact"
          variant="text"
          icon="mdi-close"
          color="red"
          @click.stop="$emit('on-remove', condition)"
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
    <VExpansionPanelText class="py-2">
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
        @update:model-value="condition.items = []"
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
        store-action="getConditionsEntities"
        :store-filter-options="{
          category:condition.group,
          condition:condition.key}"
      />
      <RuleConditionGroupAction
        v-if="condition.items?.length > 0"
        v-model="condition.action"
        class="mt-4"
        :condition="condition"
      />
    </VExpansionPanelText>
  </VExpansionPanel>
</template>

<style scoped>

</style>