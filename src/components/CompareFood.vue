<template>
  <div>
    <ion-card>
      <ion-card-header>
        <div class="flex-row header">
          <ion-card-subtitle>Select a new dish to compare with</ion-card-subtitle>
          <v-icon @click="deleteFood(index)" class="close" :class="{'active-btn-close':isActive}" color="#CE2B26">
            mdi-close
          </v-icon>
        </div>
        <v-divider></v-divider>
      </ion-card-header>

      <ion-card-content>
        <div v-for="(dish,index) in compareFoods" :key="index" class="flex-row description">
          <img :src="dish.image || require('../assets/default43.svg')" alt="">
          <p>{{ dish.name }}</p>
          <p class="price">€ {{ dish.price }}</p>

        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script>
export default {
  name: 'CompareFood',
  data () {
    return {
      isActive: false,
      buttonShow: false
    }
  },
  props: ['compareFoods'],
  methods: {
    closeModal () {
      this.isActive = true
      setTimeout(() => {
        this.isActive = false
        this.$emit('closeInfoBar')
      }, 500)
    },
    deleteFood (index) {
      this.$emit('deleteItem', index)
    }
  },
  watch: {
    compareFoods (val) {
      (val.length > 1) ? this.buttonShow = true : this.buttonShow = false
    }
  }
}
</script>

<style lang="scss" scoped>

ion-card {
  border-radius: 15px;
  background-color: #ffffff;

  .header {
    justify-content: center;
    align-items: center;
    height: 30px;
    // position: relative;
    ion-card-subtitle {
      color: $color-light-red;
      font-size: 10px;
    }

    .close {
      position: absolute;
      right: 10px;
    }
  }

  ion-card-content {
    padding: 15px;
  }

  .active-btn-close {
    transition: all .8s ease-in-out;
    transform: scale(0.8)
  }

  .description {
    justify-content: space-between;
    align-items: center;

    img {
      width: 80px;
      margin-right: 15px;
    }

    .price {
      padding-right: 20px;
      font-weight: 600;
      color: black;
      margin-bottom: 0 !important;
    }
  }
}
</style>
