<template>
  <div class="login-user-info">
    <el-dropdown v-if="isLogin">
      <span class="el-dropdown-link">{{ shortName }}</span>
      <i class="el-icon-arrow-down el-icon--right" style="color:#fff;"></i>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <!--<el-dropdown-item>-->
          <!--<router-link to="/viewCompanyInfo">查看公司详情</router-link>-->
        <!--</el-dropdown-item>-->
        <el-dropdown-item>
          <router-link to="/editPsw">修改密码</router-link>
        </el-dropdown-item>
        <el-dropdown-item>
          <router-link to="/bindPhone">更改绑定手机号</router-link>
        </el-dropdown-item>
        <el-dropdown-item @click.native="handleLogOut">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      isLogin: false, // 是否已登录
      userName: '', // 用户名
      shortName: ''
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        this.isLogin = true
        this.userName = userInfo.username
        this.shortName = `${userInfo.customerShortName ? userInfo.customerShortName : ''} - ${userInfo.realName}`
      } else {
        this.isLogin = false
      }
    },
    handleLogOut() {
      sessionStorage.removeItem("token")
      localStorage.removeItem("token")
      sessionStorage.clear()
      localStorage.clear()
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="scss">
.login-user-info {
  position: absolute;
  width: 200px;
  right: 60px;
  text-align: right;
  top: 0;
  color: #fff;
  .el-dropdown-link {
    color: #fff;
  }
}
.user-dropdown {
  a {
    text-decoration: none;
    color: #606266;
  }
}
</style>
