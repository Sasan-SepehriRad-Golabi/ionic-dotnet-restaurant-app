<template>
  <ion-grid>
    <ion-row class="take-photo-popup">
      <ion-col size="12"><h6>Upload new photo</h6></ion-col>
      <br>
      <br>
      <ion-col size="5">
        <img src="./../assets/whitePhoto.svg" class="take-new-photo-link "
             @click="takePicture('camera')">
        <br>
        <p class="title-take-photo">CAMERA</p>
      </ion-col>
      <ion-col size="2">

        <br>

        <h6>OR</h6>
      </ion-col>
      <ion-col size="5">
        <img src="./../assets/whiteGallery.svg" class="take-new-photo-link"
             @click="takePicture('gallery')">
        <br>
        <p class="title-take-photo">GALLERY</p>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import { CameraResultType, CameraSource, Plugins } from '@capacitor/core'
import { mapActions } from 'vuex'

const { Camera } = Plugins

export default {
  name: 'CameraComponent',
  methods: {
    ...mapActions('dataModule', ['setProfilePhoto']),
    async takePicture (type) {
      this.$emit('disable-show-notification')
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: type === 'gallery' ? CameraSource.Photos : CameraSource.Camera
      })
      this.setProfilePhoto(image.dataUrl)
    }
  }
}
</script>

<style>

</style>
