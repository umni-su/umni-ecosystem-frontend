<script>
import DeviceListItemSensor from "../DeviceListItemSensor.vue";
import SimpleBar from "simplebar-vue";

export default {
  name: "DeviceInfoSensorsCard",
  components: {
    SimpleBar,
    DeviceListItemSensor
  },
  props: {
    device: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showMore: false,
      sensors: []
    }
  },
  created() {
    if (this.device?.sensors !== null && this.device?.sensors !== undefined) {
      this.sensors = this.device?.sensors
    }
  }
}
</script>

<template>
  <VCard v-if="device !== null && device !== undefined">
    <template #title>
      {{ $t('Sensors') }}
    </template>
    <template #text>
      <SimpleBar
        class="hidden-list"
        :class="{more:showMore}"
      >
        <VList v-if="sensors.length > 0">
          <DeviceListItemSensor
            v-for="(sensor, key) in sensors"
            :key="key"
            v-model="sensors[key]"
            @click="$store.commit('setActiveSensor', sensor)"
          />
        </VList>
      </SimpleBar>

      <VBtn
        variant="plain"
        :prepend-icon="showMore ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        :text="showMore ? $t('Show less') : $t('Show more')"
        density="compact"
        block
        @click="showMore = !showMore"
      />
    </template>
  </VCard>
</template>

<style scoped lang="scss">
.hidden-list {
  height: 392px;

  &.more {
    height: auto;
  }
}
</style>