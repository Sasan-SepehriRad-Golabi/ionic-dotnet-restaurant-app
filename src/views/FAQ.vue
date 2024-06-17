<template>
  <ion-content>
    <div class="wrapper">
      <ion-card>
        <ion-card-content>
          <span class="description-bmr">Dark Blue</span> is your BMR: Basal metabolic rate (BMR) is the amount of energy
          the body burns to accomplish basic life functions.
        </ion-card-content>
        <ion-card-content>
          <span class="description-tdee">Light Blue</span> is your TDEE: The daily energy expenditure (TDEE), reflects
          the total amount of energy your body burns while working,
          exercising, and doing all kinds of activities. This measure is estimated based on your level of daily
          activity.
        </ion-card-content>
        <ion-card-content>
          <span class="description-calorie">Orange</span> is your Calorie intake: Calorie intake is defined as the
          amount of energy consumed via food and beverage.
          This number is based on the dishes ordered through our app.
        </ion-card-content>
      </ion-card>
    </div>
  </ion-content>
</template>

<script>
export default {
  name: 'FAQ'
}
</script>

<style scoped lang="scss">
.wrapper {
  margin-bottom: 120px;
  margin-top: 100px;
  position: relative;

  ion-card {
    padding: 20px 15px 25px 15px;

    &-content {
      text-align: justify;

      .description-bmr {
        font-weight: 500;
        color: $color-dark-blue;
      }

      .description-tdee {
        font-weight: 500;
        color: $color-light-blue;
      }

      .description-calorie {
        font-weight: 500;
        color: $color-orange;
      }
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
  }
}
</style>
