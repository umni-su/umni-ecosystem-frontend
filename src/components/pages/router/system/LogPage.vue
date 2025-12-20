<script>
import PageActions from '../../../chunks/PageActions.vue'
import LogItem from '../../../chunks/LogItem.vue'
import LogFilter from '../../../chunks/logs/LogFilter.vue'

export default {
  name: 'LogPage',
  components: {
    LogFilter,
    LogItem,
    PageActions
  },
  data(){
    return {
      filter:null,
      params: {
        page:1,
        size:25
      }
    }
  },
  computed: {
    theme() {
      return this.$store.getters['getTheme']
    },
    logs() {
      return this.$store.getters['logs/getLogs']
    },
    loading() {
      return this.$store.getters['logs/isLoading']
    }
  },
  async mounted() {
    await this.getLogs()
  },
  methods: {
    async getLogs() {
      await this.$store.dispatch('logs/getLogs', this.params)
    },
    async applySearch(){
      await this.$store.dispatch('logs/getLogs', {...this.filter,...this.params})
    },
    async changePage(e){
      this.params.page = e
      await this.applySearch()
    }
  }
}
</script>

<template>
  <VSheet
    color="default"
    max-width="1000"
    class="ma-auto pa-4"
  >
    <PageActions>
      <template #title>
        {{$t('Event log')}}
      </template>
      <template #append>
        <VBtn
          density="comfortable"
          :loading="loading"
          :disabled="loading"
          variant="plain"
          icon="mdi-reload"
          @click="getLogs()"
        /></template>
    </PageActions>
    <LogFilter
      v-model="filter"
      @update:model-value="applySearch"
    />
    <VPagination
      v-model="params.page"
      :length="logs.pages"
      :total-visible="10"
      @update:model-value="changePage"
    />
    <VList v-if="logs?.items">
      <LogItem
        v-for="log in logs.items"
        :key="log.id"
        :log="log"
      />
    </VList>
    <VPagination
      v-model="params.page"
      :length="logs.pages"
      :total-visible="10"
      @update:model-value="changePage"
    />
  </VSheet>
</template>

<style scoped>

</style>