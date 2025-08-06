export function eventTypeToColor(type) {
  switch (type) {
  case 1:
    return 'success'
  case 2:
    return 'secondary'
  case 3:
    return 'error'
  case 4:
    return 'warning'

  }
  return 'red'
}
