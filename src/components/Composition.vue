<template functional>
  <div class="item">
    <p>{{ props.elem }}</p>
    <p>{{ props.count.toFixed(2) }} {{ props.unit }}</p>
  </div>
</template>

<style lang="scss" scoped>
.item {
  width: 80vw;
  height: 40px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  @include fontMontserrat(14px, 600, 35px);
  color: #898989;

  p {
    margin: 0;
    height: 40px;
  }
}
</style>
