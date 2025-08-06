<script>
export default {
  name: 'PriorityMenu',
  props: {
    modelValue: {
      type: Number,
      default: 2
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      value: 1,
      priorities: [
        {
          label: this.$t('Normal'),
          value: 0,
          color: 'red-lighten-4'
        },
        {
          label: this.$t('Light'),
          value: 1,
          color: 'red-lighten-2'
        },
        {
          label: this.$t('Average'),
          value: 2,
          color: 'red-lighten-1'
        },
        {
          label: this.$t('High'),
          value: 3,
          color: 'red-lighten-1'
        },
        {
          label: this.$t('Danger'),
          value: 4,
          color: 'red-darken-4'
        }
      ]
    }
  },
  computed: {
    selected() {
      return this.priorities.find(p => p?.value === this.value)
    }
  },
  watch: {
    modelValue() {
      this.value = this.modelValue
    },
    value(val) {
      this.$emit('update:model-value', val)
    }
  },
  created() {
    this.value = this.modelValue
  },
  methods: {
    onClickValue(e) {
      this.value = e
    }
  }
}
</script>

<template>
  <VMenu
    :close-on-content-click="false"
  >
    <template #activator="{props}">
      <VBtn
        icon="mdi-bell"
        :color="selected?.color"
        v-bind="props"
        density="compact"
        variant="text"
      />
    </template>
    <VSheet>
      <VList
        v-model="value"
        selectable
        density="compact"
      >
        <VListItem
          v-for="pr in priorities"
          :key="pr.value"
          :active="value === pr.value"
          :value="pr.value"
          :title="pr.label"
          @click="onClickValue(pr.value)"
        >
          <template #prepend>
            <VBtn
              readonly
              variant="flat"
              icon
              :color="pr.color"
              density="compact"
              class="mr-2"
            />
          </template>
        </VListItem>
      </VList>
    </VSheet>
  </VMenu>
</template>

<style scoped>

</style>