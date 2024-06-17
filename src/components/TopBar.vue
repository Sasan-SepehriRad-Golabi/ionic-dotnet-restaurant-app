<template>
  <div style="position: fixed" class="top-bar-container" :class="{ iphone }">
    <div class="action-block flex-row">
      <v-spacer></v-spacer>
      <v-icon v-if="showButton" @click="closeModal()" class="icon" :class="{ 'active-btn-close': true }"
        color="#CE2B26">mdi-close
      </v-icon>
    </div>
    <div class="content-block">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TopBar',
  data() {
    return {
      isActive: false
    }
  },
  props: ['showButton'],
  methods: {
    routeBack() {
      this.isActive = true
      setTimeout(() => {
        this.isActive = false
      }, 300)
    },
    closeModal() {
      this.isActive = true
      setTimeout(() => {
        this.isActive = false
        this.$emit('closeInfoBar')
      }, 500)
    }
  },
  computed: mapState(['iphone'])
}
</script>

<style lang="scss" scoped>
.top-bar-container {
  width: 100%;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10px;

  &.iphone {
    padding-top: 35px;
  }

  .action-block {
    justify-content: space-between;
    padding: 0 10px;

    .icon {
      z-index: 100;
    }

    .active-btn-arrow {
      transition: all .3s ease-in-out;
      margin-left: -10px;
    }

    .active-btn-close {
      transition: all .8s ease-in-out;
      transform: scale(0.8)
    }
  }
}
</style>
