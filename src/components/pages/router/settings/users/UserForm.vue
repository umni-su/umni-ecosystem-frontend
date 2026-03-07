<script>
export default {
  name: 'UserForm',
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      change_password: false,
      password: null,
      password_repeat: null,
      user: {}
    }
  },
  computed: {
    hasId() {
      return this.id > 0
    }
  },
  async created() {
    if (this.hasId) {
      await this.getUser()
    }
  },
  watch: {
    async id() {
      if (this.hasId) {

      } else {
        this.user = this.empty()
      }
    }
  },
  methods: {
    async getUser() {
      this.user = await this.$store.dispatch('users/getUser', this.id)
    },
    empty() {
      return {
        username: null,
        email: null,
        firstname: null,
        lastname: null,

        is_superuser: false,
        is_active: true
      }
    }
  }
}
</script>

<template>
  {{ id }}
  {{ user }}
  <VSheet>
    <VForm>
      <VTextField
        v-model="user.username"
        :label="$t('Username')"
      />
      <VSwitch
        v-if="hasId"
        v-model="change_password"
        :label="$t('Change password')"
      />
      <VTextField
        v-if="change_password"
        v-model="password"
        type="password"
        :label="$t('Password')"
      />
      <VTextField
        v-if="change_password"
        v-model="password_repeat"
        class="mt-4"
        type="password"
        :label="$t('Password confirmation')"
      />
    </VForm>
  </VSheet>
</template>

<style scoped>

</style>