<template>
    <div class = "headerCart">
        <a href="javascript:;" @click.prevent="handleCart">
            <span>购物车{{ cartItemsCount}}</span>
        </a>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HeaderCart',
  components: {},
  computed: {
    ...mapGetters('cart', {
      cartItemsCount: 'itemsCount'
    })
  },
  methods: {
    handleCart () {
      this.$router.push('/cart')
    }
  }
}
</script>
