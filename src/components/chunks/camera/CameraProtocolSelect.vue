<script>
export default {
  name: "CameraProtocolSelect",
  props: {
    modelValue: {
      type: String,
      default: 'RTSP',
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      selected: 'RTSP',
      items: [
        'RTSP',
        'RTMP',
        'HTTP',
        'HTTPS',
        'USB'
      ]
    }
  },
  created() {
    if (this.modelValue !== undefined) {
      this.selected = this.modelValue;
    }
    this.$emit('update:model-value', this.selected);
  }
}
</script>

<template>
  <VSelect
    v-model="selected"
    :items="items"
    :label="$t('Protocol')"
    @update:model-value="$emit('update:model-value', selected)"
  />
</template>

<style scoped>

</style>