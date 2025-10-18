<script>
export default {
  name: 'RuleEntitySelect',
  props: {
    modelValue: {
      type: Number
    },
    list:{
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue','update:model-value'],
  data(){
    return {
      selected:null
    }
  },
  created() {
    this.selected = this.list.find(item=>item.id === this.modelValue)
  },
  methods: {
    onUpdate(value) {
      this.$emit('update:model-value', value)
    }
  }
}
</script>

<template>
  <VAutocomplete
    v-model="selected"
    clearable
    :clear-on-select="true"
    persistent-clear
    :items="list"
    item-title="name"
    item-value="id"
    :label="$t('Select entity')"
    @update:modelValue="onUpdate"
  >
    <template #item="{item,props}">
      <VListItem
        :prepend-icon="item.raw.icon"
        :title="item.raw.name"
        :subtitle="item.raw.description"
        v-bind="props"
      />
    </template>
  </VAutocomplete>
</template>

<style scoped>

</style>