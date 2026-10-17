<script>
export default {
  name: 'SidebarPanel',
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
      open: false
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
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.display.mobile
    }
  },
  created() {
    this.open = this.modelValue
  }
}
</script>

<template>
  <component
    :is="mobile ? 'VSheet' : 'VNavigationDrawer'"
    v-model="open"
    rounded="0"
    :width="mobile ? '100%' :500"
    :location="mobile ? null : 'right'"
  >
    <template #default>
      <VSheet
        class="pa-4"
        color="default"
      >
        <VSheet class="text-h6 mb-4 d-flex justify-space-between">
          <div class="font-weight-bold">{{ title }}</div>
          <div>
            <slot name="prepend">
              <VBtn
                v-if="!mobile"
                icon="mdi-close"
                variant="plain"
                color="default"
                density="compact"
                @click="open = !open"
              />
            </slot>
          </div>
        </VSheet>
        <slot/>
      </VSheet>
    </template>
    <template #append>
      <VSheet
        v-if="$slots.append"
        class="pa-4"
      >
        <slot name="append"/>
      </VSheet>
    </template>
  </component>
</template>

<style scoped>

</style>