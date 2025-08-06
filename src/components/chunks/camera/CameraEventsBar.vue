<script>
import CameraEventItem from './CameraEventItem.vue'

export default {
  name: 'CameraEventsBar',
  components: {CameraEventItem},
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      emptyRight: false,
      emptyLeft: false,
      events: [],
      filter: {
        id: null,
        event_id: null,
        direction: null,
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
    event: {
      deep: true,
      async handler(ev) {
        await this.init()
      }
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init() {
      this.filter.id = this.event.camera.id
      this.filter.event_id = this.event.id
      this.events = await this.getEvents()
    },
    async getEvents() {
      const res = await this.$store.dispatch('getCameraEvents', this.filter)
      this.events = [...this.events, ...res.items]
      this.total = res.total
      this.pages = res.pages

      return res.items
    },
    async loadEvents(direction) {
      if (this.events.length < 1) return false
      if (direction === 'start') {
        this.filter.event_id = this.events[0]?.id
      } else if (direction === 'end') {
        this.filter.event_id = this.events[this.events.length - 1]?.id
      }

      this.filter.direction = direction

      const events = await this.getEvents()
      if (events.length > 0) {
        this.events = events
      }
      this.emptyRight = direction === 'end' && events.length === 0
      this.emptyLeft = direction === 'start' && events.length === 0
    }
  }
}
</script>

<template>
  <VSheet class="d-flex overflow-x-auto mx-12">
    <VBtn
      :disabled="emptyLeft"
      class="my-4 position-absolute top-0 left-0"
      style="z-index: 10"
      color="default"
      width="40"
      height="100"
      icon="mdi-chevron-left"
      @click="loadEvents('start')"
    />

    <VSheet
      v-for="ev in events"
      :key="ev.id"
    >
      <CameraEventItem
        :class="event.id !== ev.id? 'opacity-70':''"
        class="my-4 mx-2"
        width="170"
        height="100"
        :event="ev"
      />
    </VSheet>
    <VBtn
      style="z-index: 10"
      :disabled="emptyRight"
      class="my-4 position-absolute top-0 right-0"
      color="default"
      width="40"
      height="100"
      icon="mdi-chevron-right"
      @click="loadEvents('end')"
    />
  </VSheet>
</template>

<style scoped>

</style>