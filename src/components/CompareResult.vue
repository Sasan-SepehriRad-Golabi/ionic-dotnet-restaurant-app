<template>
    <div class="content-wrapper">
      <ion-list>
        <ion-item lines="none">
          <ion-label>
                 Comparison Result
            <v-icon
              @click="closeModal"
              :class="{'active-btn-close':isActive,'close-icon':true}"
              color="#CE2B26">
                mdi-close
            </v-icon>
          </ion-label>
        </ion-item>
          <v-divider></v-divider>
        <ion-item class="flex-row content" lines="none">
          <div
            v-for="(dish,index) in compareFoods"
            :key="index"
            class="flex-column content">
            <img
              class="dish-image"
              :src="dish.image || require('../assets/default43.svg')"
              @click="routeToDish(dish)">

            <div class="content__food-types flex-row">
              <img
                  v-for="(type, indtype) in dish.dietaryType"
                  :key="indtype"
                  :src="require(`../assets/filter/${dietaryTypes[type.dietary]}.svg`)">
            </div>

            <p class="content__name-food">{{dish.name}}</p>
            <p class="content__price-food">€ {{dish.price}}</p>

            <v-divider></v-divider>
            <div class="chart-wrapper">
              <PieChart class="chart" :chart-data="chartData[index]" :options="options"/>
              <p>{{dish.calories}}</p>
              <p class="point">kcal</p>
            </div>
          </div>
        </ion-item>
        <ion-item>
          <div class="bar-chart-wrapper">
            <BarChart class="bar-chart" :chart-data="barChartData" :options="barOptions"/>
          </div>
        </ion-item>

      </ion-list>
    </div>
</template>

<script>
import api from "@/service/api";
import {Restaurants} from "@/service/routes";

export default {
    name: 'CompareResult',
    data(){
      return{
        restaurants: [],
        isActive:false,
        options: {
          type: 'doughnut',
          cutoutPercentage:80,
        },
        barOptions:{
          type:'bar',
          maintainAspectRatio: false,
          responsive: true,
        },
        chartData:[],
        chartData2:null,
        barChartData: null,
        barChartDataCopy: {
          labels:['Carb','Prot','Fat'],
          datasets: [],
        },
        dietaryTypes: [
          'vegan',
          'vegetarian',
          'halal',
          'gluten-free',
          'dairy-free',
          'nut-free',
          'kosher'
        ]
      }
    },
    components:{
      PieChart: () => import('../js/PieChart'),
      BarChart: () => import('./BarChart')
    },
    props:['compareFoods'],
    computed:{
      whereIsMore(){
        let res = 0
        this.compareFoods.map( food => {
          food.calories > res && (res = food.calories)
        })
        return res
      }
    },
    mounted(){
      this.setAllRest()
      this.setCalories()
      this.fillChart()
      Chart.defaults.global.legend.display = false;
    },
    methods:{
      async setRestaurant(id){
        let vm = this
        await api.GET(`${Restaurants.restaurants}/${id}`, this.$store.state.token)
        .then( res => {
          vm.restaurants.push(res.data)
        })
        .catch( err => {
          console.log(err)
        })
      },
      setAllRest(){
        this.compareFoods.map( async dish => {
          await this.setRestaurant(dish.restaurantId)
        })
      },
      closeModal(){
        this.isActive=true
        setTimeout(()=>{
          this.isActive=false
          this.$emit('closeCompareResult')
        },500)
      },
      setCalories(){
        this.compareFoods.map( f => {
          if(!f.calories){
            let res = 0
            f.components.map( c => {
              c.ingredientType === 0 && (res += c.ingredient.energy_KCal)
            })

            let groups = []
            for(let ingr of f.components) {
              if(ingr.ingredientType === 1) {
                groups.push(ingr.substituteGroup)
              }
            }
            let uniq = new Set(groups)
            let uniqArr = [...uniq]

            for(let group of uniqArr) {
              for(let c of f.components) {
                if(c.ingredientType === 1){
                  if(c.substituteGroup === group) {
                    c.ingredientType === 0 && (res += c.ingredient.energy_KCal)
                    break;
                  }
                }
              }
            }

            f.calories = res
          }
        })
      },
      fillChart(){
        this.chartData=[
          {
            datasets: [{
              data: [this.compareFoods[0].calories,this.whereIsMore - this.compareFoods[0].calories],
              backgroundColor:['#65D0F1','#D4D4D4'],
            }],
          },
          {
            datasets: [{
               data: [this.compareFoods[1].calories,this.whereIsMore - this.compareFoods[1].calories],
              backgroundColor:['#7BDE86','#D4D4D4'],
            }],
          }
        ]
          this.fillChartByIngredients()
          setTimeout(()=>{
            this.barChartData = this.barChartDataCopy
          },600)
      },
      fillChartByIngredients(){
        this.compareFoods.map( (dish, index) => {
          let carb = 0
          let prot = 0
          let fat = 0
          dish.components.map( comp => {
            if(comp.ingredientType === 0){
              carb += comp.ingredient.carbohydrates_G * comp.weight / 100
              prot += comp.ingredient.proteins_G * comp.weight / 100
              fat += comp.ingredient.fat_G * comp.weight / 100
            }
          })
          // for (let comp of dish.components) {
          //   if(comp.ingredientType === 1){
          //     carb += comp.ingredient.carbohydrates_G * comp.weight / 100
          //     prot += comp.ingredient.proteins_G * comp.weight / 100
          //     fat += comp.ingredient.fat_G * comp.weight / 100
          //     break;
          //   }
          // }

          let groups = []
          for(let ingr of dish.components) {
            if(ingr.ingredientType === 1) {
              groups.push(ingr.substituteGroup)
            }
          }
          let uniq = new Set(groups)
          let uniqArr = [...uniq]

          for(let group of uniqArr) {
            for(let comp of dish.components) {
              if(comp.ingredientType === 1){
                if(comp.substituteGroup === group) {
                  carb += comp.ingredient.carbohydrates_G * comp.weight / 100
                  prot += comp.ingredient.proteins_G * comp.weight / 100
                  fat += comp.ingredient.fat_G * comp.weight / 100
                  break;
                }
              }
            }
          }

          setTimeout(()=>{
            this.barChartDataCopy.datasets.push({
              label: dish.name,
              data: [carb.toFixed(0),prot.toFixed(0),fat.toFixed(0), 0],
              backgroundColor:[
                index ? '#7BDE86' : '#65D0F1',
                index ? '#7BDE86' : '#65D0F1',
                index ? '#7BDE86' : '#65D0F1'
              ],
            })
          },600)
        })
      },
      routeToDish (dish) {
        this.$router.push({name: 'Dish', params:{dishID:dish.id}})
        this.closeModal()
      }
    },

  }
</script>

<style lang="scss" scoped>

  ion-list{
    // max-height:70vh!important;
    overflow-y: scroll;
    border-bottom-left-radius:15px!important;
    border-bottom-right-radius:15px!important;

  }
  .content-wrapper{
    background-color:#ffffff;
    padding-top: 30px;
    padding-bottom: 100px;
    // max-height:70vh!important;
    ion-label{
      width:100%;
      font-weight:600;
      text-align: center;
      margin-left: 50px;
      .close-icon{
        margin-left: 50px;
        margin-top: -1px;
      }
    }
    .content{
      justify-content: center;
      align-items:center;
      width:100%;
      .dish-image{
        height: 74px;
        max-width: 120px;
        margin-top: 20px;
        border-radius: 5px;
      }
      &__adress{
        width:100%;
        justify-content: center;
        align-items: center;
        img{
          width:25px!important;
        }
        p{
          font-size:12px;
          margin-top: 13px;
          margin-left: 5px;
          color:$color-strong-grey;
        }
      }
      &__food-types{
        margin-top: 10px;
        width:100%;
        height: 25px;
        justify-content: center;
        img{
          height: 25px;
          // margin: 0 2px;
        }
      }
      &__name-food{
        @include fontMontserrat(13px, bold, 16px);
        color: #3A3A3A;
        text-align: center;
        margin-top: 10px;
        height: 40px;
      }
      &__price-food{
        @include fontMontserrat(16px, bold, 20px);
        color: #2F3741;
        text-align: center;
        font-weight:600;
      }
    }
  }
  .chart-wrapper{
    position:relative;
    .chart{
      width:80px!important;
    }
    p{
      position: absolute;
      top:28px;
      width:100%;
      text-align: center;
      font-weight: 600;
      color:black;
      font-size:18px;
    }
    .point{
      position: absolute;
      top:43px;
      width:100%;
      font-weight: 500;
      text-align: center;
      color:$color-grey;
      font-size:14px;
    }
  }
  .bar-chart-wrapper{
    position:relative;
    width:99%;
    margin-top:20px;
    .bar-chart{
      height: 150px;
      width:100%!important;
    }
  }
  .active-btn-close{
    transition: all .8s ease-in-out;
    transform:scale(0.8)
  }
</style>
