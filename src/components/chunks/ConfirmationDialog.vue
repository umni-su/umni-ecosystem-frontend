<template>
  <VDialog
    v-model="isVisible"
    persistent
    width="400"
  >
    <template #default="{ isActive }">
      <VCard
        :color="color"
        :title="title"
      >
        <VCardText>
          {{ message }}
          <slot />
        </VCardText>

        <VCardActions>
          <VSpacer />

          <VBtn
            :disabled="disabled"
            :prepend-icon="okIcon"
            :color="okColor"
            :text="okText"
            @click="_confirm(isActive)"
          />
          <VBtn
            color="default"
            :prepend-icon="cancelIcon"
            :text="cancelText"
            @click="_cancel(isActive)"
          />
        </VCardActions>
      </VCard>
    </template>
  </VDialog>
</template>
<script>
export default {
  name: 'ConfirmationDialog',
  props: {
    color: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['on-dialog-confirm'],

  data: () => ({
    // Parameters that change depending on the type of dialogue
    isVisible: false,
    title: undefined,
    message: undefined, // Main text content
    okText: undefined, // Text for confirm button; leave it empty because we don't know what we're using it for
    cancelText: undefined, // Text for confirm button; leave it empty because we don't know what we're using it for
    okIcon: 'mdi-check',
    okColor: 'error',
    cancelIcon: 'mdi-close',
    // Private variables
    resolvePromise: undefined,
    rejectPromise: undefined
  }),

  methods: {
    open() {
      this.isVisible = true
    },

    close() {
      this.isVisible = false
    },
    show(opts = {}) {

      this.title = opts.title
      this.message = opts.message
      this.okText = opts.okText
      if (opts.okIcon) {
        this.okIcon = opts.okIcon
      }
      if (opts.okColor) {
        this.okColor = opts.okColor
      }
      if (opts.cancelIcon) {
        this.cancelIcon = opts.cancelIcon
      }
      if (opts.cancelText) {
        this.cancelText = opts.cancelText
      } else {
        this.cancelText = this.$t('Cancel')
      }
      // Once we set our config, we tell the popup modal to open
      this.open()
      // Return promise so the caller can get results
      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve
        this.rejectPromise = reject
      })
    },

    _confirm(isActive) {
      this.$emit('on-dialog-confirm')
      isActive = false
      this.close()
      this.resolvePromise(true)
    },

    _cancel(isActive) {
      isActive.value = false
      this.close()
      //this.resolvePromise(false)
      // Or you can throw an error
      //this.rejectPromise(new Error('User cancelled the dialogue'))
    }
  }
}
</script>