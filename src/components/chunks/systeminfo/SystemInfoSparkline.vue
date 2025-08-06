<script>
export default {
  name: 'SystemInfoSparkline',
  props: {
    values: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      default: 100
    },
    title: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'rgba(0,0,0,0.1)'
    },
    gradient: {
      type: Array[String],
      default: ['rgba(244,47,54,1)', 'rgba(251,140,0,1)', 'rgba(76,175,80,1)']
    }
  }
}
</script>

<template>
  <VCard
    variant="elevated"
    elevation="0"
    class="position-relative"
    color="rgba(0,0,0,0.05)"
  >
    <template #title>
      {{ title }}
    </template>
    <template #append>
      <slot name="value">
        {{ values[values.length - 1] }}%
      </slot>
    </template>
    <VSparkline
      :model-value="values"
      padding="0"
      smooth
      max="100"
      min="0"
      :color="color"
      :height="height"
      auto-line-width
      :gradient="gradient"
      fill
    />
  </VCard>
</template>

<style lang="scss" scoped>
</style>