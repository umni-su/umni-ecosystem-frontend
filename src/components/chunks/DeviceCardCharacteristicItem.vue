<script>
export default {
  name: "DeviceCardCharacteristicItem",
  props: {
    icon: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    }
  }
}
</script>

<template>
  <div class="characteristic">
    <div class="name">
      <VIcon
        class="mr-2"
        density="compact"
        variant="text"
        :icon="icon"
      />
      <span v-if="title">
        {{ title }}
      </span>
    </div>
    <div
      v-if="$slots.value"
      class="value w-50 text-right"
    >
      <slot
        name="value"
      />
    </div>
    <div
      v-else
      class="value"
    >
      {{ value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.characteristic {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
