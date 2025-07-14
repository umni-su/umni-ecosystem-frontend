<script>
export default {
  name: "SidebarPanel",
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      open: false,
    }
  },
  watch: {
    modelValue: {
      deep: true,
      handler(newVal, oldVal) {
        this.open = this.modelValue
      }
    },
    open() {
      this.$emit('update:model-value', this.open)
    },
  },
  created() {
    this.open = this.modelValue
  }
}
</script>

<template>
  <VNavigationDrawer
    v-model="open"
    rounded="0"
    width="500"
    location="right"
  >
    <template #default>
      <VSheet class="pa-4">
        <div class="text-h6 mb-4">
          {{ title }}
        </div>
        <slot />
      </VSheet>
    </template>
    <template #append>
      <VSheet
        v-if="$slots.append"
        class="pa-4"
      >
        <slot name="append" />
      </VSheet>
    </template>
  </VNavigationDrawer>
</template>

<style scoped>

</style>