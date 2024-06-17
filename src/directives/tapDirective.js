import Vue from 'vue'
import { pan } from './panDirective'

export const tap = {
  bind(el, binding) {
    if (typeof binding.value === "function") {
      const mc = new Hammer(el);
      mc.on("tap", binding.value);
    }
  }
}

Vue.directive('tap', tap)
