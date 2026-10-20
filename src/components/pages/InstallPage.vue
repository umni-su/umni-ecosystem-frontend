<script>
import UmniLogo from '../chunks/UmniLogo.vue'
import InstallForm from '../chunks/InstallForm.vue'

export default {
  name: 'InstallPage',
  components: {
    InstallForm,
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
    class="bg-primary image-bg"
  >
    <VSheet
      v-if="!start"
      color="transparent"
      rounded="0"
      class="install fill-height d-flex flex-column align-center justify-center"
      :class="{show:show}"
      width="100%"
    >
      <UmniLogo
        class="d-block mb-2"
        fill="#ffffff"
        :width="280"
        :short="false"
      />
      <div class="text-center mb-2">
        <div class="text-headline-medium mb-2">
          {{ $t('SERVER') }}
        </div>
        <div class="text-subtitle-2 w-75 mx-auto">
          {{
            $t('An open‑source software system for smart home devices, video analytics, and access control')
          }}
        </div>
        <VBtn
          append-icon="mdi-arrow-right"
          class="mt-8"
          size="x-large"
          :text="$t('Install ecosystem')"
          color="primary-darken"
          rounded="lg"
          variant="elevated"
          @click="startInstall"
        />
      </div>
      <VSheet
        color="transparent"
        class="mb-4 buttons-bottom"
        variant="tonal"
      >
        <VBtn
          rounded="lg"
          color="default"
          variant="elevated"
          prepend-icon="mdi-web"
          :text="$t('Site')"
          href="https://umni.su"
          target="_blank"
          class="mr-4"
        />
        <VBtn
          rounded="lg"
          color="default"
          variant="elevated"
          prepend-icon="mdi-book"
          href="https://docs.umni.su"
          target="_blank"
          :text="$t('Documentation')"
        />
      </VSheet>
    </VSheet>
    <InstallForm v-else/>
  </VLayout>
</template>

<style lang="scss" scoped>
.image-bg {
  background-image: url("../../assets/img/eco-bg.jpg");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

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
