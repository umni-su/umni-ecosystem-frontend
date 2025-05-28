<script>
export default {
  name: "ServiceItem",
  props: {
    service: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <VListItem density="compact">
    <template #prepend>
      <VBtn
        readonly
        class="opacity-100"
        :icon="service.process.alive ? 'mdi-check-circle' : 'mdi-close-circle'"
        :color="service.process.alive ? 'success': 'error'"
        variant="plain"
        density="comfortable"
      />
    </template>
    <template #title>
      {{ service.name }}
    </template>
    <template #append>
      <VTooltip
        v-if="service.autorun"
        open-on-hover
      >
        <template #activator="{props}">
          <VBtn
            v-bind="props"
            icon="mdi-run"
            variant="plain"
            density="comfortable"
            color="orange"
          />
        </template>
        {{ $t('Autorun') }}
      </VTooltip>
      <VBtn
        :disabled="service.process.alive"
        icon="mdi-play"
        variant="plain"
        density="comfortable"
        color="default"
      />
      <VBtn
        :disabled="!service.process.alive"
        icon="mdi-stop"
        variant="plain"
        density="comfortable"
        color="default"
      />
      <VBtn
        icon="mdi-play-pause"
        variant="plain"
        density="comfortable"
        color="default"
      />
    </template>
  </VListItem>
</template>

<style scoped>

</style>