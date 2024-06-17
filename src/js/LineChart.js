import { Line, mixins } from 'vue-chartjs'
import chartjsPluginAnnotation from "chartjs-plugin-annotation";
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options','chartData'],
  mounted () {
    this.renderChart(this.chartData, this.options)
    this.addPlugin(chartjsPluginAnnotation)
  }
}


