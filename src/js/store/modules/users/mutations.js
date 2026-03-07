export default {
  setPermissions(state, p) {
    state.permissions = p
  },
  setUsers(state, u) {
    state.users = u
  },
  saveUser(state, u) {
    const index= state.users.findIndex(user => user.id === u.id)
    if (index >= 0) {
      state.users[index] = u
    } else {
      state.users.push(u)
    }
  },
  deleteUser(state, u) {
    state.users = state.users.filter(user => user.id !== u.id)
  }
}