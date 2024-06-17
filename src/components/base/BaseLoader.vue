<template>
  <div 
    class="loader">
  </div>
</template>

<script>
export default {
  name: 'Loader',
}
</script>

<style lang="scss" scoped>
@import '../../scss/variables.scss';
:root{
    --width: 30px!important;
}
.loader{
    border: 3px solid white!important;;
    border-top: 3px solid $color-light-red!important; 
    border-right: 3px solid $color-light-red!important; 
    border-radius: 50%;
    animation: spin .7s linear infinite;
    width: 30px!important;
    height: 30px!important;
    margin: 0!important;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
