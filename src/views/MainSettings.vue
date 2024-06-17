<template>
  <ion-content>
    <div class="wrapper">
      <div class="ava-block flex-column" :style="`margin-top: ${getIsIphone ? `110px` : `80px`}`">
      </div>
      <div class="cards-block">
        <ion-card>

          <ion-item button @click="$router.push({name: 'Settings'})">
            <ion-label>
              Personal Information
            </ion-label>
          </ion-item>
        </ion-card>

        <ion-card>
          <ion-item button @click="$router.push({name: 'CardMenu'})">
            <ion-label>
              Payment and Discount
            </ion-label>
          </ion-item>
        </ion-card>

        <ion-card>
          <ion-item button @click="$router.push({name: 'FAQ'})">
            <ion-label>
              FAQ
            </ion-label>
          </ion-item>
        </ion-card>

        <ion-card style="padding:0;">
          <button class="logout" @click="logout()">logout</button>
        </ion-card>

      </div>
    </div>
  </ion-content>
</template>

<script>
export default {
  name: 'MainSettings',
  computed: {
    getIsIphone () {
      return this.$store.state.iphone
    }
  },
  methods: {
    logout () {
      this.$store.commit('clearCardInformation')
      this.$store.dispatch('logout')
      this.$router.push({ name: 'Auth' })
    }
  }
}
</script>

<style lang="scss" scoped>
.ava-block {
  justify-content: center;
  align-items: center;
  margin-top: 80px;

  p {
    margin-top: 20px;
    color: $color-light-red;
    font-weight: 600;
  }

  ion-avatar {
    background-color: $color-grey;
    height: 90px;
    width: 90px;
    justify-content: center;
    align-items: center;

    .ava-placeholder {
      width: 50px;
      height: 50px;
    }
  }
}

ion-card {
  padding: 10px 0;

  ion-label {
    font-weight: 600;
  }

  .logout {
    @include fontMontserrat(12px, 500, 15px);
    background: $color-light-red;
    color: white;
    width: 100%;
    padding: 15px;
    border-radius: 5px;
  }

  ion-item {
    --border-style: auto;
    --detail-icon-color: #d55951;
    --detail-icon-opacity: 1;
    --color: #898989;
    --color-activated: #898989;

  }
}

</style>
