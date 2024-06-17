<template>
  <ion-content>
    <div class="add-discount">
      <div class="text-fil">
        <v-text-field
          label="Discount codes"
          v-model="discountcode"
          type="text"
          color="#d55951"
        ></v-text-field>
      </div>
      <div class="text-center">
        <v-btn rounded color="#d55951" dark @click="addDiscount"> add </v-btn>
      </div>
    </div>
  </ion-content>
</template>

<script>
import api from "@/service/api";
import { Account } from "@/service/routes";
import { mapState } from "vuex";
export default {
  name: "AddDiscount",
  mounted() {
    console.log(this.$route.name);
  },
  data() {
    return {
      discountcode: "",
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  methods: {
    async addDiscount() {
      console.log(Account.ListCoupons);
      try {
        const body = {
          couponId: this.discountcode,
          enable: true,
        };
        await api.POST(Account.AddCoupons, body, this.token);
        this.$router.push({ name: "CardMenu" });
      } catch (e) {
        alert(`No such coupon: ${this.discountcode}`);
      }
    },
  },
};
</script>

