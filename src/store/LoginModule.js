const loginModule = {
  state: () => ({
    currentUserId: null,
    isLogin: false
  }),
  getters: {
  },
  mutations: {
    changeLoginState (state) {
      state.isLogin = !state.isLogin
    },
    setCurrentUserId (state, id) {
      state.currentUserId = id
    }
  },
  actions: {
    changeLoginState ({ commit }) {
      commit('changeLoginState')
    },
    setCurrentUserId ({ commit }) {
      commit('setCurrentUserId')
    }
  }
}

export default loginModule
