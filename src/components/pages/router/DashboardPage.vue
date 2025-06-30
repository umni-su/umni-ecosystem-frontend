<script>
import DiskUsageItem from "../../chunks/systeminfo/DiskUsageItem.vue";
import SystemInfoSparkline from "../../chunks/systeminfo/SystemInfoSparkline.vue";

export default {
  name: 'DashboardPage',
  components: {SystemInfoSparkline, DiskUsageItem},
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
    },
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
  <VCard
    v-if="disks"
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
            color="rgba(0,0,0,0.05)"
            height="200"
            variant="elevated"
            :title="$t('Disks usage')"
          >
            <template #text>
              <DiskUsageItem
                v-for="disk in disks"
                :key="disk.mountpoint"
                :disk="disk"
              />
            </template>
          </VCard>
        </VCol>
      </VRow>
      {{ systemInfo }}
    </VContainer>
  </VCard>
</template>

<style scoped>

</style>
