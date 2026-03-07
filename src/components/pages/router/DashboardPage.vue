<script>
import DiskUsageItem from '../../chunks/systeminfo/DiskUsageItem.vue'
import SystemInfoSparkline from '../../chunks/systeminfo/SystemInfoSparkline.vue'
import AlarmToggleWidget from '../../chunks/dashboard/AlarmToggleWidget.vue'
import SecurityToggleWidget from '../../chunks/dashboard/SecurityToggleWidget.vue'

export default {
  name: 'DashboardPage',
  components: {SecurityToggleWidget, AlarmToggleWidget, SystemInfoSparkline, DiskUsageItem},
  data() {
    return {
      handler: null
    }
  },
  computed: {
    interval() {
      return this.$store.getters['getInterval']
    },
    systemInfo() {
      return this.$store.getters['getSystemInfo']
    },
    disks() {
      return this.systemInfo?.disks
    },
    memory() {
      return this.systemInfo?.memory
    },
    cpu() {
      return this.systemInfo?.cpu
    }
  },
  mounted() {
    this.$store.commit('setTitle', this.$t('Dashboard'))
  },
  async created() {
    this.handler = setInterval(async () => {
      await this.getSystemInfo()
    }, this.interval)
    this.$store.commit('setTitle', this.$t('Dashboard'))
    await this.getSystemInfo()
  },
  unmounted() {
    clearInterval(this.handler)
  },
  methods: {
    async getSystemInfo() {
      await this.$store.dispatch('getSystemInfo')
    }
  }
}
</script>

<template>
  <VSheet class="fill-height pa-4">
    <VContainer class="pa-0 fill-height">
      <VRow class="fill-height">
        <VCol
          cols="12"
          md="11"
          :order="$vuetify.display.xs || $vuetify.display.sm ? 2 : null"
        >
          <VCard
            v-if="systemInfo"
            class="fill-height"
            cols="12"
            md="6"
          >
            <VContainer>
              <VRow>
                <VCol
                  cols="12"
                  sm="6"
                >
                  <SystemInfoSparkline
                    :title="$t('Cpu')"
                    :values="cpu.values"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="6"
                >
                  <SystemInfoSparkline
                    :title="$t('Ram')"
                    :values="memory.virtual.values"
                  />
                </VCol>
                <VCol
                  cols="12"
                  sm="6"
                >
                  <SystemInfoSparkline
                    :title="$t('Swap')"
                    :values="memory.swap.values"
                  />
                </VCol>
                <VCol
                  v-if="disks"
                  cols="12"
                  sm="6"
                >
                  <VCard
                    elevation="0"
                    class="fill-height"
                    variant="text"
                    :title="$t('Disks usage')"
                  >
                    <template #text>
                      <DiskUsageItem
                        v-for="disk in disks"
                        :key="disk.mountpoint"
                        class="mb-4"
                        :disk="disk"
                      />
                    </template>
                  </VCard>
                </VCol>
              </VRow>
            </VContainer>
          </VCard>
        </VCol>
        <VCol
          cols="12"
          md="1"
          :order="$vuetify.display.xs || $vuetify.display.sm  ? 1 : null"
        >
          <AlarmToggleWidget/>
          <SecurityToggleWidget class="mt-4"/>
        </VCol>
      </VRow>
    </VContainer>

  </VSheet>

</template>

<style scoped>

</style>
