<script>
export default {
  name: 'UserListItem',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    initials() {
      return `${this.user.firstname[0]}${this.user.lastname[0]}`
    }
  },
  methods: {
    editUser() {

    }
  }
}
</script>

<template>
  <VListItem>
    <template #prepend>
      <VAvatar
        variant="tonal"
        :text="initials"
        color="primary"
      />
    </template>
    <template #title>
      {{ user.firstname }} {{ user.lastname }}
    </template>
    <template #subtitle>
      {{ user.email }}
    </template>
    <template #append>
      <VMenu width="200">
        <template #activator="{props}">
          <VBtn
            v-bind="props"
            color="default"
            icon="mdi-dots-horizontal"
            variant="plain"
            density="comfortable"
          />
        </template>
        <VList slim>
          <VListItem
            :to="{name: 'user', params: {id: user.id}}"
            prepend-icon="mdi-pencil"
            :title="$t('Edit')"
          />
          <VListItem
            prepend-icon="mdi-trash-can"
            :title="$t('Delete')"
            base-color="error"
            @click="editUser"
          />
        </VList>
      </VMenu>
    </template>
  </VListItem>
</template>

<style scoped>

</style>