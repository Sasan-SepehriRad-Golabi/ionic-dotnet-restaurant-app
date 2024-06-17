<template>
  <ion-content
    color="#F8F8F8">
    <div :class="{iphone: getIsIphone}">
      <transition name="push">
        <TopBar @closeInfoBar="closeInfoBar" :showButton="false" v-if="showTopBar" class="top-bar">
          <h6 :class="{iphone: getIsIphone}">Your Order</h6>
          <div class="flex-row mb-2 mt-5">
            <div class="button-container flex-row">
              <div @click="checkChartType('CurrentOrder'); first = true" :class="{active: first}" class="current"
                   :style="[first?firstRender:null]">
                Current Order
              </div>
              <div @click="checkChartType('HistoryOrder') ; first = false" :class="{active: !first}" class="history">
                History Order
              </div>
            </div>
          </div>

        </TopBar>

      </transition>

      <transition name="fade">
        <component v-bind:is="currentTabComponent" class="component-info" :class="{historyActive: !first}">
        </component>
      </transition>

    </div>

  </ion-content>
</template>

<script>
export default {
  name: 'Bucket',
  components: {
    TopBar: () => import('../components/TopBar'),
    CurrentOrder: () => import('../components/CurrentOrder'),
    HistoryOrder: () => import('../components/HistoryOrder')
  },
  data () {
    return {
      currentTabComponent: 'CurrentOrder',
      showTopBar: false,
      first: true,
      firstRender: {
        backgroundColor: 'rgba(245, 199, 177, 0.2)',
        borderRadius: '5px',
        color: '#CE2B26'
      }
    }
  },
  computed: {
    getIsIphone () {
      return this.$store.state.iphone
    }
  },
  methods: {
    closeInfoBar () {
      this.showTopBar = !this.showTopBar
    },
    checkChartType (val) {
      this.currentTabComponent = val
    }
  },
  mounted () {
    setTimeout(() => (this.showTopBar = true), 400)
  }
}
</script>

<style lang="scss" scoped>
ion-content {
  background: #F8F8F8;
}

.top-bar {
  overflow-y: hidden;
}

.edit {
  position: absolute;
  top: 120px;
  right: 30px;

  h2 {
    @include fontMontserrat(14px, bold, 17px);
    color: $color-light-red;
    margin-top: 20px;
  }
}

h6 {
  text-align: center;
  //margin-top: -5px;
  font-weight: 600;
}

.button-container {
  width: 100%;
  justify-content: space-around;

  .current, .history {
    width: 140px;
    height: 42px;
    padding: 10px 5px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
  }

  .active {
    background-color: $color-red-tab;
    border-radius: 5px;
    color: $color-red;
  }
}

.component-info {
  margin: 140px 5px 0 5px;
  margin-top: 130px;
  padding-bottom: 35vh;
  position: absolute;
}

.historyActive {
  margin-bottom: 90px;
}
</style>
