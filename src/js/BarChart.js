import { Bar, mixins } from 'vue-chartjs'
import chartjsPluginAnnotation from "chartjs-plugin-annotation";
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options','chartData'],
  mounted () {
    this.renderChart(this.chartData, this.options)
    this.addPlugin(chartjsPluginAnnotation)
  }
}
