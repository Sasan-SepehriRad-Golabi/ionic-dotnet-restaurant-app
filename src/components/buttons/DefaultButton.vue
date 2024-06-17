<template >
  <div class="btn">
    <p :class="{buttonOrder: buttonOrder}">
     <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: 'DefaultButton',
  props: {
    buttonOrder: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang='scss' scoped>
  .btn{
    background-color:#ffffff;
    border-radius: 8px;
    height: 100%;
    width: 100%;
    max-width:300px;
    height:55px;
    display:flex;
    justify-content: center;
    align-items: center;
    -webkit-box-shadow: 0px 7px 10px -2px rgba(255,255,255,0.3);
    -moz-box-shadow: 0px 7px 10px -2px rgba(255,255,255,0.3);
    box-shadow: 0px 7px 10px -2px rgba(255,255,255,0.3);
    p{
      margin-top: 15px;
      font-weight:600;
      &.buttonOrder{
        width: 100%;
      }
    }
  }
</style>
