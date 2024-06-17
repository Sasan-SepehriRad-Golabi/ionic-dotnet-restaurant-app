<template>
  <div>
    <div class="welcome-container">
      <div class="btn-block">
        <div @click="$emit('emitAction','Login')" >
           <DefaultButton class="login btn">Log In</DefaultButton>
        </div>
        <div @click="$emit('emitAction','Registration')" >
           <DefaultButton class="mt-5">Register</DefaultButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import DefaultButton from './buttons/DefaultButton'
  export default {
    name: 'Welcome',
    components:{
      DefaultButton
    },
  }
</script>

<style lang="scss" scoped>
  .welcome-container {
    padding:5%;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    p{
       color:$color-light-red;
    }
    .to-back{
      position: fixed;
      top: 20px;
      left: 20px;
    }
    .btn-block{
      display:flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      margin-top: 8%;
      div{
        width:100%;
        display:flex;
        justify-content: center;
        align-items: center;
        .btn:hover{
          background-color: $color-light-red;
          color:#ffffff;
          -webkit-box-shadow: 0px 7px 10px -2px rgba(213,89,81,0.3);
          -moz-box-shadow: 0px 7px 10px -2px rgba(213,89,81,0.3);
          box-shadow: 0px 7px 10px -2px rgba(213,89,81,0.3);
        }
      }
      .login{
        color: $color-light-red;
      }
    }
    .or{
      color: white;
      padding: 10px 0;
    }
    .social-block{
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
      width:300px;
      margin-left: 50%;
      transform: translateX(-50%);
      .icon-container{
        display: flex;
        justify-content: center;
        align-items:center;
        background-color: $color-red-button;
        width:50px;
        height:50px;
        border-radius:50%;
      }
      .icon-container:hover{
        border: 2px solid $color-red-button;
        -webkit-box-shadow: 2px 7px 10px -2px rgba(213,89,81,0.3);
        -moz-box-shadow: 2px 7px 10px -2px rgba(213,89,81,0.3);
        box-shadow: 2px 7px 10px -2px rgba(213,89,81,0.3);
      }
    }
  }
  p{
    text-align: center;
    font-weight:600;
    margin-top: 10px;
  }
</style>
