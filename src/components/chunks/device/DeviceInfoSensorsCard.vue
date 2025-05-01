<script>
import DeviceListItemSensor from "../DeviceListItemSensor.vue";
import SimpleBar from "simplebar-vue";

export default {
  name: "DeviceInfoSensorsCard",
  components: {
    SimpleBar,
    DeviceListItemSensor
  },
  data() {
    return {
      showMore: false
    }
  },
  computed: {
    device() {
      return this.$store.getters['getDevice']
    },
  }
}
</script>

<template>
  <VCard>
    <template #title>
      {{ $t('Sensors') }}
    </template>
    <template #text>
      <SimpleBar
        class="hidden-list"
        :class="{more:showMore}"
      >
        <VList>
          <DeviceListItemSensor
            v-for="(sensor, key) in device.sensors"
            :key="key"
            v-model="device.sensors[key]"
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