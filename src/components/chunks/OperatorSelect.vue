<script>
export default {
  name: 'OperatorSelect',
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  mounted() {
    if(this.modelValue === null){
      this.value = null
    } else {
      this.value = this.modelValue
    }
    this.$emit('update:model-value', this.value)
  },
  watch: {
    modelValue(newValue) {
      this.value = newValue
    },
    value(newValue) {
      this.$emit('update:model-value', newValue)
    }
  },
  data(){
    return {
      //**
      // LESS_THAN = "<"
      // GREATER_THAN = ">"
      // LESS_THAN_OR_EQUAL = "<="
      // GREATER_THAN_OR_EQUAL = ">="
      // EQUAL = "="
      // NOT_EQUAL = "!="
      items:[
        {
          key:'<',
          label:this.$t('Less than')
        },
        {
          key:'>',
          label:this.$t('Greater than')
        },
        {
          key:'<=',
          label:this.$t('Less than or equal')
        },
        {
          key:'>=',
          label:this.$t('Greater than or equal')
        },
        {
          key:'==',
          label:this.$t('Equal')
        },
        {
          key:'!=',
          label:this.$t('Not equal')
        }

      ],
      value:null

    }
  }
}
</script>

<template>
  <VSelect
    v-model="value"
    :label="$t('Comparison')"
    :items="items"
    item-title="label"
    item-value="key"
  />
</template>

<style scoped>

</style>