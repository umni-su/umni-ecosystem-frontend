<script>
export default {
  name: 'InfiniteAutocomplete',
  props:{
    icon:{
      type:String,
      default:'mdi-magnify'
    },
    placeholder:{
      type:String,
      default:null
    },
    modelValue:{
      type:Array,
      default:[]
    },
    dataResponse:{
      type:Object,
      default:{}
    }
  },
  emits:[
    'load',
    'update-term',
    'update:model-value'
  ],
  mounted() {
    this.$emit('update:model-value', [])
    this.items = this.modelValue
  },
  watch: {
    items:{
      deep: true,
      handler(val) {
        this.$emit('update:model-value', val)
      }
    },
    modelValue(val){
      this.items = val
    }
  },
  computed:{
    label(){
      if(this.placeholder === null){
        return this.$t('Type a text')
      }
    }
  },
  data(){
    return {
      term:null,
      items:[]
    }
  },
  methods:{
    addEntity(item){
      const index = this.items.findIndex(v=>v.id === item.id)
      if(this.items.findIndex(v=>v.id === item.id) > -1){
        this.items[index] = item
      } else {
        this.items.push(item)
      }
    },
    deleteEntity(item){
      this.items = this.items.filter(v=>v.id !== item.id)
    },
    onLoad({done}){
      this.$emit('load', {done})
    }
  }
}
</script>

<template>
  <VMenu :close-on-content-click="false">
    <template #activator="{props}">
      <slot name="input">
        <VTextField
          v-bind="props"
          v-model="term"
          class="mt-4" 
          :label="label"
          :prepend-inner-icon="icon"
          @update:model-value="$emit('update-term', $event)"
        />
        <VChip
          v-for="item in items"
          class="mt-2 mr-2"
          :text="item.name"
          closable
          size="small"
          @click:close="deleteEntity(item)"
        />
      </slot>
    </template>
    <template #default>
      <VSheet
        color="default"
        max-height="300"
      >
        <VInfiniteScroll
          @load="onLoad"
        >
          <template #default>
            <VList v-if="dataResponse !== null">
              <VListItem
                v-for="value in dataResponse.items"
                :value="value"
                :title="value.name"
                :subtitle="value.title"
                @click="addEntity(value)"
              />
            </VList>
          </template>
        </VInfiniteScroll>

      </VSheet>
    </template>
  </VMenu>
</template>

<style scoped>

</style>