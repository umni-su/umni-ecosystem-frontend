<script>
import {DEVICE_TYPES, mapType} from '../../js/helpers/mapDeviceType.js'

export default {
  name: 'SystemNotificationMenuItem',
  props: {
    noty: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      types: DEVICE_TYPES
    }
  },
  computed: {
    type() {
      return this.noty.type
    },
    message() {
      return this.noty.message
    },
    name() {
      return `${this.message.name}`
    }
  },
  methods: {
    mapType
  }
}
</script>

<template>
  <VListItem
    rounded="0"
    class="pa-2"
    :value="noty"
  >
    <template #append>
      <VBtn
        color="error"
        icon="mdi-trash-can"
        variant="text"
      />
    </template>
    <template #title>
      <div class="text-small">
        {{ message.last_update }}
      </div>
      {{ $t(type) }}
    </template>
    <template #subtitle>
      <VChip
        variant="tonal"
        color="primary"
        :text="$t(mapType(message.type))"
      />
      <VChip
        variant="tonal"
        class="ml-2"
        :text="name"
      />
    </template>
  </VListItem>
</template>

<style scoped lang="scss">
.text-small {
    font-size: 80%;
}
</style>
