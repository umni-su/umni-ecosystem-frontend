<script>
import DatePicker from '../DatePicker.vue'

export default {
  name: 'CameraEventsFilter',
  components: {DatePicker}
}
</script>

<template>
  <VBottomSheet>
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
        <VCardTitle>
          {{ $t('Events filter') }}
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <DatePicker/>
              </VCol>
              <VCol
                cols="12"
                md="6"
              >
                <DatePicker/>
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
        </VCardText>
      </VCard>
    </template>
  </VBottomSheet>
</template>

<style scoped>

</style>