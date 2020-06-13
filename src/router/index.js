import Vue from 'vue'
import Router from 'vue-router'
import MinionManager from '@/components/MinionManager'
import MainComponent from '@/components/MainComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/old',
      name: 'MinionManager',
      component: MinionManager
    },
    {
      path: '',
      name: 'Minion Manager',
      component: MainComponent
    }
  ]
})
