<script>
export default {
  name: 'WidgetCardItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <VCol>
    <VCard variant="tonal">
      <!--    {{ЭЛЕМЕНТ УПРАВЛЕНИЯ - переключатель, пипетка цвета или ничего, если witable}}-->
      <VCardText>
        <VIcon :icon="item.type_icon"/>
        {{ item.name }}
      </VCardText>
    </VCard>
  </VCol>
</template>

<style scoped>

</style>