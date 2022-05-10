<script>
export default {
  name: 'liveLayout',
  data () {
    return {

    }
  },
  created () {
    setTimeout(() => {
      window.L2Dwidget.init({
        pluginRootPath: 'live2dw/',
        pluginJsPath: 'lib/',
        pluginModelPath: 'live2d-widget-model-hijiki/assets/',
        tagMode: false,
        debug: false,
        model: { jsonPath: '/live2dw/live2d-widget-model-hijiki/assets/hijiki.model.json' },
        display: { position: 'right', width: 150, height: 300 },
        mobile: { show: true },
        log: false
      })
    }, 3000)
  }
}
</script>
