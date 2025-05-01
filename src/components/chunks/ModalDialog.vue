<script>
export default {
  name: "ModalDialog",
  props: {
    title: {
      type: String,
      default: null
    },
    subtitle: {
      type: String,
      default: null
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      open: false
    }
  },
  watch: {
    modelValue() {
      this.open = this.modelValue
    },
    open() {
      this.$emit('update:model-value', this.open)
    }
  },
  created() {
    this.open = this.modelValue
  }
}
</script>

<template>
  <VDialog
    v-model="open"
    persistent
    width="600"
  >
    <VCard>
      <template #title>
        {{ title }}
      </template>
      <template #subtitle>
        {{ subtitle }}
      </template>
      <template #text>
        <slot />
      </template>
      <template
        v-if="$slots.actions"
        #actions
      >
        <slot name="actions" />
      </template>
      <template #append>
        <VBtn
          density="comfortable"
          icon="mdi-close"
          variant="plain"
          color="default"
          @click="open = false"
        />
      </template>
    </VCard>
  </VDialog>
</template>

<style scoped>

</style>
