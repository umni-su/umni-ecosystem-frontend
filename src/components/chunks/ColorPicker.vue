<script>
export default {
  name: "ColorPicker",
  props: {
    modelValue: {
      type: String,
      default: '#fff'
    }
  },
  emits: ['update:model-value', 'update:on-click'],
  data() {
    return {
      color: '#fff'
    }
  },
  watch: {
    color() {
      this.$emit('update:model-value', this.color)
    },
    modelValue() {
      this.color = this.modelValue
    }
  },
  created() {
    this.color = this.modelValue
  }
}
</script>

<template>
  <VMenu :close-on-content-click="false">
    <template #activator="{props}">
      <VBtn
        v-bind="props"
        density="compact"
        icon="mdi-brush-variant"
        :color="color"
        @click="$emit('update:on-click')"
      />
    </template>
    <VSheet
      color="default"
    >
      <VColorPicker
        v-model="color"
        mode="hexa"
      />
    </VSheet>
  </VMenu>
</template>

<style scoped>

</style>