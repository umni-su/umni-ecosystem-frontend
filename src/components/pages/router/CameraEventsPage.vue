<script>
import CameraEventItem from '../../chunks/camera/CameraEventItem.vue'
import PageActions from '../../chunks/PageActions.vue'
import CameraEventsFilter from '../../chunks/camera/CameraEventsFilter.vue'

export default {
  name: 'CameraEventsPage',
  components: {CameraEventsFilter, PageActions, CameraEventItem},
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      camera: null,
      events: [],
      selected: [],
      total: 0,
      pages: 0,
      filter: {
        id: null,
        type: null,
        page: 1,
        size: 20
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters['isLoading']
    }
  },
  watch: {
    async id() {
      if (this.id !== null) {
        this.events = []
        await this.getCamera()
        await this.getEvents()
      }
    }
  },
  mounted() {
    this.events = []
  },
  async created() {
    await this.getCamera()
    await this.getEvents()
  },
  methods: {
    async getCamera() {
      this.camera = await this.$store.dispatch('getCamera', this.id)
      this.filter.id = this.camera.id
      this.$store.commit('setTitle', this.$t('Camera {name} events', {name: this.camera.name}))
    },
    async getEvents() {
      const res = await this.$store.dispatch('getCameraEvents', this.filter)
      this.events = [...this.events, ...res.items]
      this.total = res.total
      this.pages = res.pages

      return res.items
    },
    async updatePage({done}) {
      this.filter.page += 1
      const items = await this.getEvents()
      done(items.length > 0 ? 'ok' : 'empty')
    },
    async getEventsFromStart() {
      this.events = []
      this.filter.page = 1
      await this.getEvents()
    },
    onEventCheck(id, state) {
      if (state) {
        this.selected.push(id)
      } else {
        this.selected.splice(this.selected.indexOf(id), 1)
      }
    }
  }
}
</script>

<template>
  <VSheet
    v-if="camera"
    elevation="1"
    color="default"
  >
    <VInfiniteScroll
      mode="manual"
      direction="vertical"
      @load="updatePage"
    >
      <template #load-more="{props}">
        <VBtn
          v-bind="props"
          :text="$t('Load more')"
          prepend-icon="mdi-dots-horizontal"
        />
      </template>
      <PageActions>
        <template #prepend>
          <VBtn
            readonly
            icon="mdi-calendar-alert"
            variant="text"
            color="default"
            density="compact"
          />
        </template>
        <template #title>
          {{ $t('Events total: {count}', {count: total}) }}
        </template>
        <template #subtitle>
          <RouterLink
            class="text-primary text-decoration-none"
            :to="{name:'camera', params: {id:camera.id}}"
          >
            <VIcon
              icon="mdi-arrow-left"
              size="small"
            />
            {{ camera.name }}
          </RouterLink>
        </template>
        <template #append>
          <CameraEventsFilter/>
          <VBtnToggle
            v-model="filter.type"
            rounded="pill"
            color="primary"
            variant="elevated"
            density="compact"
            @update:model-value="getEventsFromStart"
          >
            <VBtn
              value="stream"
              :text="$t('Stream')"
            >
              <template #prepend>
                <VIcon
                  icon="mdi-circle"
                  color="success"
                />
              </template>
            </VBtn>
            <VBtn
              value="events"
              :text="$t('Events')"
            >
              <template #prepend>
                <VIcon
                  icon="mdi-circle"
                  color="red"
                />
              </template>
            </VBtn>
          </VBtnToggle>
          <VBtn
            class="ml-2"
            :loading="loading"
            icon="mdi-reload"
            variant="text"
            color="default"
            density="comfortable"
            @click="getEventsFromStart"
          />
        </template>
      </PageActions>
      <VTable
        hover
        striped="even"
      >
        <thead>
          <tr>
            <th width="50"/>
            <th
              width="100"
            />
            <th class="font-weight-bold">
              ID
            </th>
            <th class="font-weight-bold">
              {{ $t('Area') }} / {{ $t('Storage') }}
            </th>
            <th class="text-right font-weight-bold">
              {{ $t('Details') }}
            </th>
            <th/>
          </tr>
        </thead>
        <tbody>
          <CameraEventItem
            v-for="event in events"
            :key="event.id"
            :event="event"
            mode="row"
            @on-check="onEventCheck(event.id,$event)"
          >
            <td>
              {{ event.id }}
            </td>

          </CameraEventItem>
        </tbody>
      </VTable>
      <template #empty>
        <VBtn
          color="default"
          variant="text"
          readonly
          :text="$t('No more events')"
        />
      </template>
    </VInfiniteScroll>
  </VSheet>
</template>

<style scoped>

</style>