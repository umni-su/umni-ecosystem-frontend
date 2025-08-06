const ruleTypes = {
  triggers:{
    camera: [
      'camera.motion.start',
      'camera.motion.end'
    ],
    device:[
      'sensors.changes.data',
      'device.changes.state'
    ]
  }
}
export function isCameraTrigger(trigger){
  return ruleTypes.triggers.camera.indexOf(trigger) > -1
}
export function isDeviceTrigger(trigger){
  return ruleTypes.triggers.device.indexOf(trigger) > -1
}