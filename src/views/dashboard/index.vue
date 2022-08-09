<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <ImageUpload />
    <!-- <button @click="hello">点击</button> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { mixins } from '@/utils/mixins'
import ImageUpload from '@/components/ImageUpload'

export default {
  name: 'Dashboard',
  components: {
    ImageUpload
  },
  // mixins: [mixins],
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  created() {
    console.log('自己的')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
