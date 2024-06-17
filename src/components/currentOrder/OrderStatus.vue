<template>
  <div class="being-prepared">
    <h3>Your order</h3>
    <div class="progressOrder">
      <div class="progressOrder-images-bars">
        <img src="../../assets/order/received.svg" class="circle1">

        <div class="bar bar12"
             :class="{activeStatusIcon: statusOrder !== 'not' ? (statusOrder === 1 || statusOrder === 2 || statusOrder === 3) : false}"></div>

        <img v-if="statusOrder !== 'not' ? (statusOrder === 1 || statusOrder === 2 || statusOrder === 3) : false"
             class="circle-card"
             src="../../assets/order/creditCard.svg">
        <img v-else class="circle-card" src="../../assets/order/not-creditCard.svg">

        <div class="bar bar-pay"
             :class="{activeStatusIcon: statusOrder !== 'not' ? (statusOrder === 2 || statusOrder === 3) : false}"></div>

        <img v-if="statusOrder !== 'not' ? (statusOrder === 2 || statusOrder === 3) : false"
             class="circle2"
             src="../../assets/order/beingPrepared.svg">
        <img v-else class="circle2" src="../../assets/order/not-beingPrepared.svg">

        <div class="bar bar23"
             :class="{activeStatusIcon: statusOrder !== 'not' ? statusOrder === 3 : false}"></div>

        <img v-if="statusOrder !== 'not' ? statusOrder === 3 : false" class="circle3"
             src="../../assets/order/ruddyForPickup.svg">
        <img v-else class="circle3" src="../../assets/order/not-ruddyForPickup.svg">
      </div>
      <div class="progressOrder-status">
        <p class="step1 activeStatusText">Is received</p>
        <p class="stepPaid"
           :class="{activeStatusText: statusOrder !== 'not' ? (statusOrder === 1 || statusOrder === 2 || statusOrder === 3) : false}">
          Successful payment</p>
        <p class="step2"
           :class="{activeStatusText: statusOrder !== 'not' ? (statusOrder === 2 || statusOrder === 3) : false}">
          Being prepared</p>
        <p class="step3" :class="{activeStatusText: statusOrder !== 'not' ? statusOrder === 3 : false}">Ruddy for
          pickup</p>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
name: "OrderStatus",
  computed: {
    statusOrder() {
      if (this.isLastOrderNotFinished) {
        return this.getLastOrder.orderStatus
      } else {
        return 'not'
      }
    },//true
  ...mapGetters(['isLastOrderNotFinished', 'getLastOrder'])
  }
}
</script>


<style scoped lang="scss">
.being-prepared {
  position: absolute;
  width: 100%;
  text-align: center;
  padding: 0 20px;

  h3 {
    //font-family: Montserrat;
    @include fontMontserrat(18px, bold, 22px);
    color: #2F3741;
  }

  .progressOrder {
    margin-top: 20px;

    &-images-bars {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 0 10px;

      img {
        //z-index: 20;
        //position: absolute;
        //display: inline-block;
      }

      .circle1 {
        //left: 25px;
      }

      .circle-card {
        //left: calc(35%);
        //transform: translate(-50%, 0%);
      }

      .circle2 {
        //left: calc(65%);
        //transform: translate(-50%, -20%);

        //background: $color-light-red;
        //background: $color-strong-grey;
      }

      .circle3 {
        //right: 25px;
        //transform: translateY(-20%);
      }

      .bar {
        z-index: 10;
        //position: absolute;
        height: 3px;
        //transform: translateY(12px);
        background: $color-strong-grey;
      }

      .bar12 {
        width: 13vw;
        //width: calc(21vw - 20px);
        //left: calc(52px);
        background: $color-strong-grey;
      }

      .bar-pay {
        width: 13vw;
        //width: calc(24vw - 20px);
        //left: calc(52px + 21vw + 20px);
      }

      .bar23 {
        width: 13vw;
        //width: calc(18vw - 20px);
        //right: 60px;
      }

      .bar4 {
        width: 13vw;
      }

      .activeStatusIcon {
        background: $color-light-red;
      }
    }

    &-status {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 10px;

      .activeStatusText {
        color: $color-light-red;
      }

      p {
        max-width: 70px;
        @include fontMontserrat(12px, 600, 14px);
        //@include fontMontserrat(0.75em, 600, 14px);
        color: $color-strong-grey;
      }

      .active {
        font-weight: bold;
        color: $color-light-red;
      }

      //.step1{
      //  left: 20px;
      //  top: 103px;
      //}
      //.stepPaid {
      //  left: 35%;
      //  transform: translateX(-50%);
      //}
      //.step2{
      //  left: 65%;
      //  transform: translateX(-50%);
      //}
      //.step3{
      //  right: 10px;
      //}
    }
  }
}
</style>
