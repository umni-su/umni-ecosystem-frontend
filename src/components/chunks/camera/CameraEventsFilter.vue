<script>
import DatePicker from '../DatePicker.vue'
import CameraAreaSelect from './CameraAreaSelect.vue'

export default {
  name: 'CameraEventsFilter',
  components: {CameraAreaSelect, DatePicker},
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    camera: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      open: false,
      filter: {}
    }
  },
  created() {
    this.filter = this.modelValue
  }
}
</script>

<template>
  <VBottomSheet
    v-model="open"
    max-width="1200"
  >
    <template #activator="{props}">
      <VBtn
        density="comfortable"
        variant="plain"
        icon="mdi-filter"
        v-bind="props"
      />
    </template>
    <template #default>
      <VCard rounded="t-lg">
        <template #append>
          <VBtn
            density="comfortable"
            variant="plain"
            color="default"
            icon="mdi-close"
            @click="open = !open"
          />
        </template>
        <template #title>
          {{ $t('Events filter') }}
        </template>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <DatePicker :label="$t('Start')"/>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <DatePicker :label="$t('End')"/>
              </VCol>
              <VCol
                cols="12"
                md="12"
              >
                <CameraAreaSelect
                  v-model="filter.area"
                  :camera="camera"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VBtn
                  prepend-icon="mdi-send"
                  :text="$t('Apply')"
                />
              </VCol>
            </VRow>
          </VContainer>
          {{ filter }}
        </VCardText>
      </VCard>
    </template>
  </VBottomSheet>
</template>

<style scoped>

</style>