import { Pie, mixins } from 'vue-chartjs'
import chartjsPluginAnnotation from "chartjs-plugin-annotation";
const { reactiveProp } = mixins

export default {
  extends: Pie,
  mixins: [reactiveProp],
  props: ['options','chartData'],
  mounted () {
    this.renderChart(this.chartData, this.options)
    this.addPlugin(chartjsPluginAnnotation)
  }
}


