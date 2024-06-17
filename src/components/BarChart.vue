<script>
import { Bar, mixins } from 'vue-chartjs'
import chartjsPluginAnnotation from 'chartjs-plugin-annotation'

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: ['options', 'chartData'],
  mounted () {
    this.renderChart(this.chartData, this.options)
    this.addPlugin(chartjsPluginAnnotation)
  }
}
</script>

<style>
</style>
