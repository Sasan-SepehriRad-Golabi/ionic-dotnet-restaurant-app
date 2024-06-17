<template>
  <div @click="$router.push('/restaurant/1')" class="image">
     <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'DefaultButton',
  }
</script>

<style lang='scss' scoped>
  .btn{
    background-color:#ffffff;
    border-radius: 8px;
    max-width:299px;
    max-height:55px;
    width:100%;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    -webkit-box-shadow: 0px 7px 10px -2px rgba(255,255,255,0.3);
    -moz-box-shadow: 0px 7px 10px -2px rgba(255,255,255,0.3);
    box-shadow: 0px 7px 10px -2px rgba(255,255,255,0.3);
    p{
      margin-top: 15px;
      font-weight:600;
    }
  }
</style>
