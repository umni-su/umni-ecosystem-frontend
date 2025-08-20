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
      color="error"
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
        />{{title}}</VCardSubtitle>
      <VCardText class="pa-0 pb-3">
        <slot/>
      </VCardText>
    </VCard>
    <ConfirmationDialog ref="confirm"/>
  </div>

</template>

<script>
import { Handle} from '@vue-flow/core'
import ConfirmationDialog from '../ConfirmationDialog.vue'

export default {
  name: 'RuleNodeWrapper',
  components: {
    ConfirmationDialog,
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
    async removeNode() {
      const ok = await this.$refs.confirm.show({
        title: this.$t('Delete node'),
        message: this.$t('Node with edges will be deleted'),
        okText: this.$t('Delete'),
        okIcon: 'mdi-trash-can'
      })
      if(ok){
        this.$store.commit('removeNode', this.id)
      }
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
  right:calc(50% - 12px);
  z-index: 100;
}
.edit {
  position: absolute;
  bottom:-10px;
  right:calc(50% - 12px);
  z-index: 100;
}
::v-deep(.handler) {
  padding: 8px;
  border-radius: 50%
}
</style>