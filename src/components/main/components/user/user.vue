<template>
  <div class="user-avatar-dropdown">
    <div class="user-img-box">
      <Img :src="userImg" />
    </div>
    <span>{{ userName }}</span>
  </div>
</template>

<script>
import './user.less'
import userImgDefault from '@/assets/images/default_head.png'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userAvatar: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    },
    userImg: {
      type: String,
      default: userImgDefault
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
    },
    message () {
      this.$router.push({
        name: 'message_page'
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'message': this.message()
          break
      }
    }
  }
}
</script>
