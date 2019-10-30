import Vue from 'vue'
import LoadingVue from './Loading.vue'

const LoadingComponent = Vue.extend(LoadingVue)

let lc = new LoadingComponent({
  el: document.createElement('div')
})

// document.body.appendChild(lc.$el)

const show = () => {
  Vue.nextTick(() => {
    if (document.querySelectorAll('.mimeloading-box').length <= 0) {
      document.body.appendChild(lc.$el)
    }
    setTimeout(() => {
      lc.show = true
      lc.status = 'starting'
    })
  })
}

const hide = () => {
  let node = lc.$el
  Vue.nextTick(() => {
    setTimeout(() => {
      lc.status = 'ending'
      setTimeout(() => {
        lc.show = false
        if (node && node.parentNode) node.parentNode.removeChild(node)
      }, 300)
    })
  })
}

export default {
  show,
  hide
}
