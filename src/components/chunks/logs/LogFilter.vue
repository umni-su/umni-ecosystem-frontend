<script>
import { VDateInput } from 'vuetify/labs/VDateInput'
export default {
  name: 'LogFilter',
  props: {
    modelValue: {
      type:Object
    }
  },
  components: {
    VDateInput
  },
  emits: ['update:model-value'],
  created () {
    this.updateByModelValue()
  },
  data(){
    return {
      entity_id: null,
      start: null,
      end: null,
      page: 1,
      size:25,
      code: null,
      term: null,
      level: null,
      logger_type: null
    }
  },
  watch:{
    modelValue() {
      this.updateByModelValue()
    }
  },
  computed: {
    filter(){
      return {
        start: this.start !== null ? this.$moment(this.start).format('YYYY-MM-DD 00:00:00') :null,
        end: this.end !== null ? this.$moment(this.end).format('YYYY-MM-DD 23:59:59') : null,
        page: this.page,
        size: this.size,
        term: this.term,
        level: this.level,
        logger_type: this.logger_type
      }
    }
  },
  methods: {
    onSave(){
      this.$emit('update:model-value', this.filter)
    },
    updateByModelValue(){
      if(this.modelValue !== undefined && this.modelValue !== null) {
        try {
          Object.keys(this.modelValue).map(key => {
            if(this.filter.hasOwnProperty(key)){
              this[key] = this.modelValue[key]
            }
          })
        } catch(e) {
          console.log(e)
        }
      }
    }
  }
}
</script>

<template>
  <VSheet>
    <VContainer class="pa-0">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VDateInput
            v-model="start"
            autocomplete="off"
            :label="$t('Select date')"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VDateInput
            v-model="end"
            autocomplete="off"
            :label="$t('Select date')"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VTextField
            v-model="term"
            :label="$t('Search')"
            autocomplete="off"
            clearable
            prepend-inner-icon="mdi-magnify"
          />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="level"
            clearable
            :label="$t('Level')"
            :items="['INFO', 'DEBUG', 'ERROR', 'WARNING']"
          />
        </VCol>
      </VRow>
      <VRow>
        <VCol>
          <VBtn
            :text="$t('Apply')"
            prepend-icon="mdi-magnify"
            @click="onSave"
          />
        </VCol>
      </VRow>
    </VContainer>
  </VSheet>
</template>

<style scoped>

</style>