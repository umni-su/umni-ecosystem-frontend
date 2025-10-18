<script>
export default {
  name: 'InfiniteAutocomplete',
  props:{
    icon:{
      type:String,
      default:'mdi-magnify'
    },
    storeAction:{
      type:String,
      required:true
    },
    storeActionOptions:{
      type:Object,
      default:{}
    },
    storeFilterOptions:{
      type:Object,
      default:{}
    },
    placeholder:{
      type:String,
      default:null
    },
    modelValue:{
      type:Array,
      default:[]
    }
  },
  emits:[
    'load',
    'update-term',
    'update:model-value'
  ],
  mounted() {
    //this.$emit('update:model-value', [])
    this.items = this.modelValue
  },
  watch: {
    async term(){
      this.page = 1
      this.responseList = []
      await this.gePaginated()
    },
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
    },
    filter(){
      return{
        page: this.page,
        size: this.size,
        term:this.term
      }
    }
  },
  data(){
    return {
      response:null,
      responseList:[],
      opened: false,
      items:[],
      page:1,
      size:25,
      term:null
    }
  },
  methods:{
    addEntity(item){
      const index = this.items.findIndex(v=>v.id === item.id)
      if(index > -1){
        this.items[index] = item
      } else {
        this.items.push(item)
      }
    },
    deleteEntity(item){
      this.$nextTick(()=>{
        console.log(item)
        this.items = this.items.filter(v=>v.id !== item.id)
        console.log(this.items)
      })
    },
    async gePaginated(){
      const paginatedResponse = await this.$store.dispatch(this.storeAction,{
        ...this.storeActionOptions,
        ...{
          filter:{...this.filter,...this.storeFilterOptions}
        }
      })
      this.response = paginatedResponse
      this.responseList = [
        ...this.responseList,
        ...paginatedResponse.items
      ]
    },
    async onLoad({done}){
      await this.gePaginated()
      this.page = this.page + 1
      return done(this.response.items.length > 0 ? 'ok' : 'empty')
    }
  }
}
</script>

<template>
  <VMenu
    v-model="opened"
    :close-on-content-click="false"
  >
    <template #activator="{props}">
      <slot name="input">
        <VTextField
          v-bind="props"
          v-model="term"
          class="mt-4"
          :label="label"
          :prepend-inner-icon="icon"
          @keyup="opened = true"
          @update:model-value="$emit('update-term', $event)"
        />
        <VBtn
          v-for="item in items"
          :key="item.id"
          rounded="pill"
          color="default"
          variant="tonal"
          class="mt-2 mr-2 px-1"
          :prepend-icon="item.icon"
          :text="`${item.name} (${item.id})`"
          size="small"
        >
          <template #append>
            <VBtn
              color="error"
              rounded="pill"
              variant="text"
              size="small"
              density="comfortable"
              icon="mdi-trash-can"
              @click="deleteEntity(item)"
            />
          </template>
          <template #prepend>
            <VBtn
              variant="text"
              size="small"
              density="comfortable"
              readonly
              :color="item.color"
              :icon="item.icon"
            />
          </template>
        </VBtn>
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
            <VList v-if="responseList !== null">
              <VListItem
                v-for="value in responseList"
                :active="items?.indexOf(value) > -1"
                :value="value"
                :title="value.name"
                :subtitle="value.description"
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