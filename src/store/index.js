import { createStore } from 'vuex'
import loginModule from './LoginModule'

const store = createStore({})

store.registerModule('loginModule', loginModule)

export default store
