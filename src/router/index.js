import Vue from 'vue'
import Router from 'vue-router'
import MinionManager from '@/components/MinionManager'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MinionManager',
      component: MinionManager
    }
  ]
})
