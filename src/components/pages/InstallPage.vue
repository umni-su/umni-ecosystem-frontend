<script>
import UmniLogo from '../chunks/UmniLogo.vue'
import ThemeSwitcher from '../chunks/ThemeSwitcher.vue'
import InstallForm from '../chunks/InstallForm.vue'

export default {
  name: 'InstallPage',
  components: {
    InstallForm,
    ThemeSwitcher,
    UmniLogo
  },
  data() {
    return {
      show: false,
      start: false
    }
  },
  computed: {
    mobile() {
      return this.$vuetify.display.sm || this.$vuetify.display.xs
    },
    primary() {
      return this.$vuetify.theme.current.colors.primary
    },
    theme() {
      return this.$store.getters['getTheme']
    }
  },
  created() {
    setTimeout(() => {
      this.show = true
    }, 1000)
  },
  methods: {
    startInstall() {
      this.start = true
    }
  }
}
</script>

<template>
  <VLayout
    :theme="theme"
    full-height
    class="bg-default"
  >
    <VSheet
      v-if="!start"
      rounded="0"
      class="install fill-height d-flex flex-column align-center justify-center"
      :class="{show:show}"
      width="100%"
    >
      <UmniLogo
        class="d-block mb-6"
        :fill="theme === 'light' ? '#0486c2' : '#ffffff'"
        :size="160"
      />
      <div class="text-center mb-6">
        <div class="text-h5 mb-2">
          {{ $t('UMNI SERVER') }}
        </div>
        <div class="text-subtitle-2 w-75 mx-auto">
          {{
            $t('The first free open-source ecosystem of control' +
              ' of automation devices, access control systems and video surveillance')
          }}
        </div>
        <VBtn
          class="mt-8"
          size="x-large"
          :text="$t('Install ecosystem')"
          color="primary-darken"
          prepend-icon="mdi-send"
          rounded="lg"
          @click="startInstall"
        />
      </div>
      <VSheet
        class="mb-4 buttons-bottom"
        variant="tonal"
      >
        <VBtn
          color="default"
          prepend-icon="mdi-web"
          :text="$t('Site')"
          href="https://umni.su"
          target="_blank"
          class="mr-4"
        />
        <VBtn
          color="default"
          prepend-icon="mdi-book"
          href="https://docs.umni.su"
          target="_blank"
          :text="$t('Documentation')"
        />
        <ThemeSwitcher
          density="comfortable"
          class="ml-3"
        />
      </VSheet>
    </VSheet>
    <InstallForm v-else />
  </VLayout>
</template>

<style lang="scss" scoped>
.install {
  opacity: 0;

  &.show {
    transition: 2s;
    opacity: 1;
  }

  .buttons-bottom {
    position: absolute;
    bottom: 10px;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

}

</style>
