import Vue from 'vue'
import MinionManager from '@/components/MinionManager'

describe('MinionManager.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(MinionManager)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .toEqual('Welcome to Your Vue.js App')
  })
})
