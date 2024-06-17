<template>
  <ion-content>
    <div class="wrapper">
      <ion-card :class="{ blur: !checkFillingDataOfUser }" style="visibility: visible">
        <BarChart class="barchart" :chart-data="chartData1" :options="options1" />
        <ion-item lines="none">
          <div @click="checkChartType($event.target)" class="button-container flex-row">
            <div id="month" :class="{ selectType: chartType === 'month' }">
              Month
            </div>
            <div id="week" :class="{ selectType: chartType === 'week' }">
              Week
            </div>
            <div id="day" :class="{ selectType: chartType === 'day' }">Day</div>
          </div>
        </ion-item>
      </ion-card>
      <Loader class="loader" v-if="loading" />

      <div :class="{ 'text-blur': !checkFillingDataOfUser }" v-show="!checkFillingDataOfUser">
        <p>Please fill in your date of birth,</p>
        <p>height and weight</p>
      </div>
      <ion-card>
        <!-- <ion-card-content> -->
        <p> <span style="color:#90E0EF">Dark Blue</span> is your BMR: Basal metabolic rate</p>
        <!-- </ion-card-content> -->
        <!-- <ion-card-content> -->
        <p><span style="color:#90E0EF">Light Blue</span> is your TDEE: Total daily energy expenditure</p>

        <!-- </ion-card-content>
        <ion-card-content> -->
        <p><span style="color: #F77F00;">Orange</span> is your Calorie intake based on your orders</p>

        <!-- </ion-card-content> -->
        <ion-button expand="block" color="light" shape="round" @click="$router.push({ name: 'FAQ' })">Details...
        </ion-button>
      </ion-card>
      <ion-card>
        <ion-item class="text-label">Nutritional values consumed based on the orders per
          {{ chartType }}</ion-item>
        <ion-item v-for="(count, title) in additionalCompositions" :key="title">
          <ion-text class="flex-row" :class="{ 'font-weight-bold': count.bold }">
            <p class="nutrit-title">Total {{ title }}</p>
            <p>{{ count.count }} {{ count.unit }}</p>
          </ion-text>
          <v-divider></v-divider>
        </ion-item>
      </ion-card>
    </div>
  </ion-content>
</template>

<script>
import api from "@/service/api";
import { mapState } from "vuex";
import Loader from "@/components/base/BaseLoader";
import { Account } from "@/service/routes";

export default {
  name: "Profile",
  components: {
    Loader,
    BarChart: () => import("../components/BarChart"),
  },
  data() {
    return {
      loading: false,
      additionalCompositions: {
        Calories: {
          count: 0,
          unit: "kcal",
          bold: true,
          nameInDatabase: "energy_KCal",
        },
        Fat: {
          count: 0,
          unit: "g",
          bold: true,
          nameInDatabase: "fat_G",
        },
        Proteins: {
          count: 0,
          unit: "g",
          bold: true,
          nameInDatabase: "proteins_G",
        },
        Carbs: {
          count: 0,
          unit: "g",
          bold: true,
          nameInDatabase: "carbohydrates_G",
        },
        "Saturated Fat": {
          count: 0,
          unit: "g",
          bold: false,
          nameInDatabase: "fattyAcidsSaturated_G",
        },
        "Trans Fat": {
          count: 0,
          unit: "g",
          bold: false,
          nameInDatabase: "fA_trans_sum_G",
        },
        "Monounsaturated Fat": {
          count: 0,
          unit: "g",
          bold: false,
          nameInDatabase: "fA_monounsat_sum_G",
        },
        "Polyunsaturated Fat": {
          count: 0,
          unit: "g",
          bold: false,
          nameInDatabase: "fA_polyunsat_sum_G",
        },
        "Omega 3 Fat": {
          count: 0,
          unit: "g",
          bold: false,
          nameInDatabase: "fA_omega_3_sum_G",
        },
        Cholesterol: {
          count: 0,
          unit: "mg",
          bold: true,
          nameInDatabase: "cholesterol_MG",
        },
        Sodium: {
          count: 0,
          unit: "mg",
          bold: true,
          nameInDatabase: "sodium_MG",
        },
        "Dietary Fiber": {
          count: 0,
          unit: "g",
          bold: false,
          nameInDatabase: "fibresSum_G",
        },
        Sugar: {
          count: 0,
          unit: "g",
          bold: false,
          nameInDatabase: "sugars_G",
        },
        Calcium: {
          count: 0,
          unit: "mg",
          bold: false,
          nameInDatabase: "calcium_MG",
        },
        Potassium: {
          count: 0,
          unit: "mg",
          bold: true,
          nameInDatabase: "potassium_MG",
        },
        Magnesium: {
          count: 0,
          unit: "mg",
          bold: false,
          nameInDatabase: "magnesium_MG",
        },
        Iron: {
          count: 0,
          unit: "mg",
          bold: false,
          nameInDatabase: "iron_MG",
        },
        Zinc: {
          count: 0,
          unit: "mg",
          bold: false,
          nameInDatabase: "zinc_MG",
        },
        "Vitamin A": {
          count: 0,
          unit: "μg",
          bold: false,
          nameInDatabase: "vitA_Activity_MCG",
        },
        "Vitamin C": {
          count: 0,
          unit: "mg",
          bold: false,
          nameInDatabase: "vitC_MG",
        },
      },
      levelActivityValue: [1.375, 1.55, 1.725],
      chartData1: {
        labels: [],
        datasets: [
          {
            backgroundColor: "green",
            data: [],
            order: 1,
          },
        ],
      },
      options1: {
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                autoSkip: false,
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
      chartType: "day",
      statistic: null,
    };
  },
  async created() {
    this.loading = true;
    await this.getStatistics();
    await this.getCalories("day");
  },
  watch: {
    chartType(val) {
      this.getCalories(val);
    },
  },
  computed: {
    levelActivity() {
      return this.statistic?.levelOfActivity;
    },
    BMRActivity() {
      return this.statistic?.gender
        ? 655.1 +
        9.563 * this.statistic?.weight +
        1.85 * this.statistic?.height -
        4.676 * this.getAge(this.statistic?.birthDate)
        : 66.47 +
        13.75 * this.statistic?.weight +
        5.003 * this.statistic?.height -
        6.755 * this.getAge(this.statistic?.birthDate);
    },
    TDEEActivity() {
      let res = 0;
      res = +(
        this.BMRActivity * this.levelActivityValue[this.levelActivity] -
        this.BMRActivity
      ).toFixed();
      return res;
    },
    checkFillingDataOfUser() {
      return !!(
        this.statistic?.weight &&
        this.statistic?.birthDate &&
        this.statistic?.height
      );
    },
    ...mapState(["token"]),
  },
  methods: {
    async getStatistics() {
      await api
        .GET(Account.statistics, this.token)
        .then((res) => { console.log("nnn"); this.statistic = res.data; console.log(this.statistic) })
        .catch(console.dir);
    },
    fillCompositions(compositions) {
      for (const comp in this.additionalCompositions) {
        this.additionalCompositions[comp].count =
          compositions[
            this.additionalCompositions[comp].nameInDatabase
          ].toFixed(2);
      }
    },
    getAge(dateString) {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    fillData(val, calories, dates, composition) {
      let labels = [];
      const dataBMR = [];
      const dataTDEE = [];
      this.fillCompositions(composition);
      switch (val) {
        case "day":
          labels = ["6h", "12h", "18h", "24h"];
          for (let i = 0; i < labels.length; i++)
            dataBMR.push(this.BMRActivity);
          for (let i = 0; i < labels.length; i++)
            dataTDEE.push(this.TDEEActivity);
          break;
        case "week":
          labels = dates.map((el) => el.toString().substring(0, 3));
          for (let i = 0; i < labels.length; i++)
            dataBMR.push(this.BMRActivity);
          for (let i = 0; i < labels.length; i++)
            dataTDEE.push(this.TDEEActivity);
          break;
        case "month":
          labels = dates.map((el) => {
            const month = el.getMonth() + 1 + "";
            if (el.toString().substring(0, 3) === "Mon") {
              return `${el.getDate()}/${month.length === 1 ? `0${month}` : month
                }`;
            } else {
              return "";
            }
          });
          for (let i = 0; i < labels.length; i++)
            dataBMR.push(this.BMRActivity);
          for (let i = 0; i < labels.length; i++)
            dataTDEE.push(this.TDEEActivity);
          break;
      }
      this.chartData1 = {
        labels: labels,
        datasets: [
          {
            backgroundColor: "#48CAE4",
            data: dataBMR,
            order: 2,
          },
          {
            backgroundColor: "#90E0EF",
            data: dataTDEE,
            order: 3,
          },
          {
            label: "Line Dataset",
            data: calories,
            borderColor: "#F77F00",
            backgroundColor: "transparent",
            pointBackgroundColor: "#F77F00",
            lineTension: 0,
            type: "line",
            order: 1,
          },
        ],
      };
      this.loading = false;
    },
    checkChartType(event) {
      if (!this.loading) {
        if (event.id) {
          this.chartType = event.id;
        }
      }
    },
    getCalories(period) {
      let res = [];
      const compositionRes = {
        energy_KCal: 0,
        fat_G: 0,
        carbohydrates_G: 0,
        proteins_G: 0,
        fattyAcidsSaturated_G: 0,
        fA_trans_sum_G: 0,
        fA_monounsat_sum_G: 0,
        fA_polyunsat_sum_G: 0,
        fA_omega_3_sum_G: 0,
        cholesterol_MG: 0,
        sodium_MG: 0,
        fibresSum_G: 0,
        sugars_G: 0,
        calcium_MG: 0,
        potassium_MG: 0,
        magnesium_MG: 0,
        iron_MG: 0,
        zinc_MG: 0,
        vitA_Activity_MCG: 0,
        vitC_MG: 0,
      };
      let dates = [];
      if (period === "day") {
        const currentHour = new Date().getHours();
        if (currentHour < 6) {
          res = [0];
        } else if (currentHour < 12) {
          res = [0, 0];
        } else if (currentHour < 18) {
          res = [0, 0, 0];
        } else if (currentHour < 24) {
          res = [0, 0, 0, 0];
        }
        for (const order of this.statistic.orderСharacteristics) {
          if (
            new Date(order.orderDate).toDateString() ===
            new Date().toDateString()
          ) {
            var tempTime = new Date(order.orderDate)
              .toLocaleTimeString();
            const time = +tempTime.substring(0, tempTime.substring(0, 2).indexOf(":"));
            if (time < 6) {
              res[0] += order.energy_KCal;
            } else if (time < 12) {
              res[1] += order.energy_KCal;
            } else if (time < 18) {
              res[2] += order.energy_KCal;
            } else if (time < 24) {
              res[3] += order.energy_KCal;
            }
            for (const comp in compositionRes) {
              compositionRes[comp] += order[comp];
            }
          }
        }
        let sum = 0;
        for (let i = 0; i < res.length; i++) {
          sum += res[i];
          res[i] = sum;
        }
      } else if (period === "week") {
        res = [0, 0, 0, 0, 0, 0, 0];
        const datesWeek = this.getLastWeek();
        for (const order of this.statistic.orderСharacteristics) {
          for (let i = 0; i < datesWeek.length; i++) {
            if (
              new Date(order.orderDate).toDateString() ===
              datesWeek[i].toDateString()
            ) {
              res[i] += order.energy_KCal;
              for (const comp in compositionRes) {
                compositionRes[comp] += order[comp];
              }
            }
          }
        }
        dates = datesWeek;
      } else if (period === "month") {
        const month = this.getMonthWithMondays();
        for (let i = 0; i < 30; i++) res[i] = 0;
        const datesMonth = month.map((el) => el.date);
        for (const order of this.statistic.orderСharacteristics) {
          for (let i = 0; i < month.length; i++) {
            if (
              new Date(order.orderDate).toLocaleDateString() ===
              month[i].date.toLocaleDateString()
            ) {
              res[i] += order.energy_KCal;
              for (const comp in compositionRes) {
                compositionRes[comp] += order[comp];
              }
            }
          }
        }
        dates = datesMonth;
      }
      this.fillData(period, res, dates, compositionRes);
    },
    getLastWeek() {
      const today = new Date();
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.unshift(new Date(today.getTime() - i * 24 * 3600 * 1000));
      }
      return week;
    },
    getMonthWithMondays() {
      let today = new Date();
      const month = [];
      for (let i = 0; i < 30; i++) {
        month.unshift({
          day: today.toString().substring(0, 3),
          date: new Date(today),
        });
        today = new Date(today - 24 * 3600 * 1000);
      }
      return month;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  margin-bottom: 120px;
  margin-top: 100px;
  position: relative;

  .loader {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
  }

  ion-card {
    padding: 20px 15px 25px 15px;

    &.blur {
      filter: blur(4px);
      pointer-events: none;
    }

    &-content {
      text-align: left;

      .description-bmr {
        font-weight: 200;
        color: $color-dark-blue;
      }

      .description-tdee {
        font-weight: 200;
        color: $color-light-blue;
      }

      .description-calorie {
        font-weight: 200;
        color: $color-orange;
      }
    }

    .barchart {
      width: 100%;
      height: 200px;
      //margin: 10px;
    }

    ion-item.text-label {
      font-weight: 600;
      text-align: center;
    }

    ion-label {
      font-weight: 600;
      text-align: center;
    }

    ion-text {
      width: 100%;
      font-size: 14px;
      justify-content: space-between;
      margin-top: 15px;
    }

    .button-container {
      width: 100%;
      justify-content: space-around;

      #month,
      #week,
      #day {
        width: 90px;
        height: 35px;
        padding-top: 5px;
        text-align: center;

        &.selectType {
          background-color: $color-red-tab;
          border-radius: 5px;
          color: $color-red;
        }
      }
    }
  }

  .text-blur {
    text-align: center;
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    @include fontMontserrat(16px, bold, 20px);
    color: #2f3741;

    p {
      margin: 0;
    }
  }
}
</style>
