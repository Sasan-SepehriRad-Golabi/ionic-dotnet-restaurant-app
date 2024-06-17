<template>
  <ion-content>
    <div class="wrapper">
      <div class="ava-block flex-column" :style="`margin-top: ${getIsIphone ? `110px` : `80px`}`">
        <ion-avatar class="flex-row">
          <img v-if="profile.profileImage" :src="profile.profileImage">
          <img v-else class="ava-placeholder" src="../assets/userAva.svg">
        </ion-avatar>

        <transition name="fadeInAndSlide">
          <p @click="setActionMessage(true)" v-if="!edit">Add photo</p>
        </transition>

      </div>

      <v-spacer></v-spacer>

      <div class="edit-button">
        <span @click="changeProfile">{{ edit? 'Edit': 'Save' }}</span>
      </div>

      <div class="cards-block">
        <ion-card>

          <ion-item>
            <ion-label>Name:</ion-label>
            <input type="text" :class="{ editMode: !edit }" :readonly="edit" v-model="profile.firstName">
          </ion-item>

          <ion-item>
            <ion-label>Last Name:</ion-label>
            <input :readonly="edit" :class="{ editMode: !edit }" type="text" v-model="profile.lastName">
          </ion-item>

          <ion-item>
            <ion-label>Birth Date:</ion-label>
            <input type="date" :disabled="edit" :class="{ editMode: !edit, dateInput: !edit }"
              v-model="profile.birthDate">
          </ion-item>

          <ion-item>
            <ion-label>Gender:</ion-label>
            <v-radio-group :readonly="edit" v-model.number="profile.gender" row>
              <v-radio label="Man" color="red" :value="0"></v-radio>
              <v-radio label="Woman" color="red" :value="1"></v-radio>
            </v-radio-group>
          </ion-item>

          <ion-item>
            <ion-label>Height (cm):</ion-label>
            <input class="height" type="number" pattern="^[0-9]*" :readonly="edit" :class="{ editMode: !edit }"
              v-model.number="profile.height">
          </ion-item>

          <ion-item>
            <ion-label>Weight (kg):</ion-label>
            <input class="weight" type="number" pattern="^[0-9]*" :readonly="edit" :class="{ editMode: !edit }"
              v-model.number="profile.weight">
          </ion-item>

          <ion-item lines="none">
            <ion-label class="level-activity">Level of Activity:</ion-label>
          </ion-item>
          <ion-item>
            <v-radio-group :readonly="edit" v-model.number="profile.levelOfActivity" row>
              <v-radio label="Low" color="red" :value="0"></v-radio>
              <v-radio label="Medium" color="red" :value="1"></v-radio>
              <v-radio label="High" color="red" :value="2"></v-radio>
            </v-radio-group>
          </ion-item>
        </ion-card>

        <ion-card>

          <ion-item>
            <ion-label>Tel.:</ion-label>
            <input class="level-activity" type="number" :readonly="edit" :class="{ editMode: !edit }"
              v-model="profile.phoneNumber">
          </ion-item>

          <ion-item>
            <ion-label>Email:</ion-label>
            <input class="email" :readonly="edit" :class="{ editMode: !edit }" v-model="profile.email">
          </ion-item>

          <ion-item>
            <ion-label>Password:</ion-label>
            <input v-if="edit" readonly value="********">
            <input v-else :class="{ editMode: !edit }" v-model="profile.password">
          </ion-item>
        </ion-card>
      </div>
    </div>
  </ion-content>
</template>

<script>
import api from '@/service/api'

import { mapGetters, mapState } from 'vuex'
import { Account } from '@/service/routes'

export default {
  name: 'Settings',
  data() {
    return {
      modal: false,
      date: '',
      edit: true,
      profile: {
        birthDate: null,
        email: null,
        firstName: null,
        gender: null,
        height: null,
        last4: null,
        lastName: null,
        levelOfActivity: null,
        phoneNumber: null,
        profileImage: null,
        weight: null,
        password: null
      },
      imageFile: ''
    }
  },
  created() {
    this.getProfileInfo()
  },
  watch: {
    getProfilePhoto(val) {
      this.profile.profileImage = val
      this.imageFile = this.dataURLtoFile(val, 'image.jpg')
    }
  },
  computed: {
    getAge() {
      const today = new Date()
      const birthDate = new Date(this.profile.birthDate)
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },
    getIsIphone() {
      return this.$store.state.iphone
    },
    checkEmail() {
      return !!this.profile.email
    },
    checkPassword() {
      return !!this.profile.password
    },
    ...mapGetters('dataModule', ['getProfilePhoto']),
    ...mapGetters(['getUserInfo']),
    ...mapState(['token'])
  },
  methods: {
    setActionMessage(val) {
      this.$store.dispatch('dataModule/setActionMessage', val)
    },
    changeProfile() {
      if (this.edit) {
        this.edit = false
      } else {
        if (this.getAge > 15) {
          this.postAccount()
          this.edit = !this.edit
        } else {
          alert('Your age should be from 16 years to 100 years old!')
        }
      }
    },
    getProfileInfo() {
      for (const prop in this.profile) {
        this.profile[prop] = this.getUserInfo[prop]
      }
    },
    async postAccount() {
      try {
        await this.setNewEmailAndPassword()
        if (this.imageFile) await this.postProfileImage(this.imageFile)
        await api.PUT(Account.updateUser, this.profile, this.token)
        await this.$store.dispatch('getUser', this.token)
      } catch (e) {
      }
      this.getProfileInfo()
    },
    async postProfileImage(image) {
      try {
        const formdata = new FormData()
        formdata.append('image', image)
        const { data } = await api.POST(Account.uploadImage, formdata, this.token, true)
        this.profile.profileImage = data
      } catch (e) {
      }
    },
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    async setNewEmailAndPassword() {
      if (this.checkEmail && this.checkPassword) {
        const data = {
          email: this.profile.email,
          password: this.profile.password
        }
        try {
          const { data: { token } } = await api.PUT(Account.credentials, data, this.token)
          this.$store.commit('changeCredentials', token)
        } catch (e) {
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
input,
select {
  outline: none;
}

input {
  text-align: left;
  display: inline;
  max-width: 130px;
  margin: 5px 0;

  &.editMode {
    border-bottom: 1px solid $color-light-grey;
  }
}

.email {
  max-width: 190px;
}

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

.edit-button {
  text-align: right;
  margin: 25px 0;

  span {
    margin-right: 30px;
    color: $color-light-red;
    font-weight: 600;
    background: #F5C7B120;
    padding: 10px 20px;
    border-radius: 10px;
  }
}

ion-card {
  padding: 3px 15px 25px 15px;

  ion-label {
    font-weight: 600;
  }

  ion-input {
    margin-left: 5px;
  }

  .radio-block {
    width: 200px;
    height: 10px;
    justify-content: center;
    align-items: center;

    p {
      margin: 0 10px;
    }
  }

  .logout {
    @include fontMontserrat(12px, 500, 15px);
    margin-top: 20px;
    float: right;
    background: $color-light-red;
    color: white;
    width: calc(100% - 16px);
    height: 35px;
    border-radius: 5px;
  }

  ion-item {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    min-height: 50px;

    .dateInput {
      max-width: 150px;
      background: white;
      width: 100%;
      padding: 0;
      margin: 0;
      text-align: right !important;
    }

    .height {
      position: relative;

      &:after {
        content: 'cm';
        position: absolute;
        left: 0;
        display: block;
        height: 20px;
        width: 20px;
      }
    }

    .level-activity {
      max-width: 200px;
    }
  }

  .inCorrectAge {
    color: $color-light-red
  }
}

.fadeInAndSlide-enter-active {
  animation: fadeOutAndSlideUp .2s both reverse ease-in-out;
}

.fadeInAndSlide-leave-active {
  animation: fadeOutAndSlideUp .2s both ease-in-out;
}

.fadeIn-enter-active {
  animation: fadeIn .3s both reverse;
}
</style>
