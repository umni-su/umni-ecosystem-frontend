<script>
export default {
  name: 'RuleGroups',
  computed:{
    flow(){
      return this.$store.getters['getFlow']
    }
  },
  data(){
    return {
      list:{
        triggers:{
          label: this.$t('Triggers'),
          items:[
            {
              type: 'trigger',
              title: this.$t('Sensor data'),
              icon: 'mdi-database-import',
              key: 'sensors.changes.data'
            },
            {
              type: 'trigger',
              title: this.$t('State changes'),
              icon: 'mdi-swap-horizontal',
              key: 'device.changes.state'
            },
            {
              type: 'trigger',
              title: this.$t('Camera motion start'),
              icon: 'mdi-motion-sensor',
              key: 'camera.motion.start'
            },
            {
              type: 'trigger',
              title: this.$t('Camera motion end'),
              icon: 'mdi-motion-sensor-off',
              key: 'camera.motion.end'
            }
          ]
        },
        conditions:{
          label:this.$t('Conditions'),
          items:[
            {
              type: 'start',
              title: this.$t('Start'),
              icon:'mdi-ray-start',
              key: 'rule.start'
            },
            {
              type: 'finish',
              title: this.$t('End'),
              icon:'mdi-ray-end',
              key: 'rule.end'
            },
            {
              type: 'condition',
              title: this.$t('State'),
              icon:'mdi-circle-outline',
              key: 'rule.condition'
            }
          ]
        },
        entities:{
          label:this.$t('Entities'),
          items:[
            {
              type: 'camera',
              title: this.$t('Camera'),
              icon:'mdi-video',
              key: 'entities.camera'
            },
            {
              type: 'device',
              title: this.$t('Device'),
              icon:'mdi-chip',
              key: 'entities.device'
            }
          ]
        },
        actions:{
          label:this.$t('Actions'),
          items:[
            {
              type: 'action',
              title: this.$t('Enable alarm'),
              icon:'mdi-alarm-light',
              key: 'action.alarm.on'
            },
            {
              type: 'action',
              title: this.$t('Disable alarm'),
              icon:'mdi-alarm-light-off',
              key: 'action.alarm.off'
            },
            {
              type: 'action',
              title: this.$t('Webhook'),
              icon:'mdi-gesture-tap',
              key: 'action.webhook'
            },
            {
              type: 'action',
              title: this.$t('Email'),
              icon:'mdi-email',
              key: 'action.email'
            },
            {
              type: 'action',
              title: this.$t('Telegram'),
              icon:'mdi-send',
              key: 'action.telegram'
            },
            {
              type: 'action',
              title: this.$t('Start record'),
              icon:'mdi-record',
              key: 'action.record'
            },
            {
              type: 'action',
              title: this.$t('Take screenshot'),
              icon:'mdi-camera',
              key: 'action.camera.screenshot'
            }
          ]
        }
      }
    }
  },
  methods: {
    onDragStart(event, el, index, group) {
      event.dataTransfer.setData('application/vueflow', el.type)
      event.dataTransfer.effectAllowed = 'move'
      this.$store.commit('setFlowDragging', true)
      this.$store.commit('setFlowType', el.type)
      this.$store.commit('setFlowRuleIndex', index)
      this.$store.commit('setFlowRuleGroup', group)
      event.dataTransfer.setData('flow',JSON.stringify({
        el,
        index,
        group
      })
      )
    }
  }
}
</script>

<template>
  <VSheet  @dragend="$store.commit('setFlowDragging', false)">
    <VList
      v-for="(item, _key) in list"
      density="compact"
    >
      <VListItemSubtitle >{{item.label}}</VListItemSubtitle>
      <VListItem
        v-for="(el, _index) in list[_key].items"
        :key="el.type"
        rounded="lg"
        :prepend-icon="el.icon"
        :active="flow.ruleIndex === _index && flow.groupIndex === _key"
        :class="`vue-flow__node-${el.type}`"
        :draggable="true"
        @dragstart="onDragStart($event, el, _index, _key)"
      >
        {{ el.title }}
      </VListItem>
    </VList>
  </VSheet>

</template>

<style scoped>
</style>