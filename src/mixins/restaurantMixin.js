import { callCordovaPlugin } from "@ionic-native/core/decorators/common";

export default {
  data() {
    return {
      distance: 0,
    }
  },
  methods: {
    getDistance(latRest, lonRest) {
      console.log("mmmmmmmmm")
      console.log(latRest)
      console.log(lonRest)
      let res = 0
      let earthRadiusKm = 6371;

      function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
      }
      console.log("bbbbbbbbb")
      if (this.getCurrentPositionComp.lat && this.getCurrentPositionComp.lng) {
        console.log("bbbbbbbbb")
        let lat1 = this.getCurrentPositionComp.lat
        let lon1 = this.getCurrentPositionComp.lng

        let dLat = degreesToRadians(latRest - lat1);
        let dLon = degreesToRadians(lonRest - lon1);
        console.log(dLat)
        console.log(dLon)
        lat1 = degreesToRadians(lat1);
        latRest = degreesToRadians(latRest);

        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(latRest);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        res = earthRadiusKm * c
      }
      console.log(res)
      this.distance = res.toFixed(2)
    },
    checkIsOpen(rest) {
      try {
        let day = (new Date().getDay() - 1)
        let hour = new Date().toLocaleTimeString('en-GB')
        for (let time of rest.times) {
          if ((day === time.day) || (day === -1 && time.day === 6)) {
            if (time?.pauses?.length) {
              for (let pause of time.pauses) {
                let start = pause.pauseStart.substring(11)
                let end = pause.pauseEnd.substring(11)
                if (hour > start && hour < end) {
                  return 'break'
                }
              }
            }
            let start = time.openingTime.substring(11)
            let end = time.closingTime.substring(11)
            if (hour > start && hour < end) {
              return 'open'
            }
          }
        }
        return 'close'
      }
      catch (e) {
        return 'close'
      }
    }
  }
}
