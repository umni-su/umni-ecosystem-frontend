export default function (bytes, decimals = 2) {
  if (!+bytes) return {
    val: 0,
    size: 'Bytes'
  }
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return {
    val: parseFloat((bytes / Math.pow(k, i)).toFixed(dm)),
    size: sizes[i]
  }
}