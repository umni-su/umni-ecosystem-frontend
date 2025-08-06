<template>
  <div class="position-relative">
    <VBtn
      v-if="edit"
      class="edit"
      density="compact"
      icon="mdi-pencil"
      variant="tonal"
      rounded="pill"
      size="sm"
      color="default"
      @mousedown.stop
      @click.capture.stop="editNode"
    />
    <VBtn
      class="close"
      density="compact"
      icon="mdi-close"
      variant="tonal"
      rounded="pill"
      size="sm"
      color="default"
      @mousedown.stop
      @click.capture.stop="removeNode"
    />
    <slot name="handle"/>
    <VCard
      hover
      density="compact"
      :variant="$attrs?.dragging ? 'tonal' :variant"
      :color="$attrs?.dragging ? 'secondary' : color"
      class="node-wrapper"
      :max-width="width"
      min-width="200"
    >
      <VCardSubtitle class="pt-3 text-center">
        <VIcon
          v-if="icon"
          :icon="icon"
          class="mr-2"
          size="sm"
        />{{title}}</VCardSubtitle>
      <VCardText class="pa-0 pb-3">
        <slot/>
      </VCardText>
    </VCard>
  </div>

</template>

<script>
import { Handle} from '@vue-flow/core'

export default {
  name: 'RuleNodeWrapper',
  components: {
    Handle
  },
  props: {
    id: String,
    title: String,
    icon: String,
    color: String,
    variant: String,
    edit:{
      type:Boolean,
      default:true
    },
    width: {
      type: Number,
      default: 300
    }
  },
  methods: {
    removeNode() {
      this.$store.commit('removeNode', this.id)
    },
    editNode() {
      this.$store.commit('selectNode', this.id)
    }
  }
}
</script>

<style scoped>
.close {
  position: absolute;
  top:-10px;
  right:-10px;
  z-index: 100;
}
.edit {
  position: absolute;
  top:-10px;
  left:-10px;
  z-index: 100;
}
::v-deep(.handler) {
  padding: 8px;
  border-radius: 50%
}
</style>