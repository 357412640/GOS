<template>
  <div class="user-operate">
    <Button class="button" type="text" @click="logout">
      <Icon type="ios-power" />
      <span class="title">{{ buttonName }}</span>
    </Button>
  </div>
</template>
<script>
import './user-operate.less'
import { mapActions } from 'vuex'
export default {
  name: 'UserOperate',
  props: {
    buttonName: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    }
  }
}
</script>
