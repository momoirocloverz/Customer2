<template>
  <div class="nav-aside">
    <div class="nav-item icon-total" @click="routeToHome">
      <span class="nav-icon icon-menu"></span>总览
    </div>
    <template v-for="(item, index) in $router.options.routes">
      <router-link v-if="!item.hidden" :to="item.path">
        <div class="nav-item" :key="index" @click="handleAuth(item)">
          {{ item.hidden }}
          <span class="nav-icon" :class="item.iconCls"></span>{{item.alias}}
        </div>
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: 'NavAside',
  mounted() {
//    console.log(this.$router)
  },
  methods: {
    handleAuth(param) {
      /*let menu = ""
      let noaccessName = "noaccess"+param.name
      param.children.forEach(item => {
        if (item.path == "") {
          menu = item.redirect
        }
      })
      this.$api.menuAuth(menu.replace(/\//, ''))
        .then(res => {
          if (res.respCode == 0) {

          } else {
            this.$router.push({ name: noaccessName })
          }
        })
        .catch(err => {
          alert(err)
        })*/
    },
    routeToHome() {
      this.$router.push({ name: 'welcome' })
    }
  }
}
</script>

<style lang="scss" scoped>
$theme-bg-color: #27292e;
.nav-aside {
  position: relative;
  box-sizing: border-box;
  width: 50px;
  height: 100%;
  overflow: hidden;
  background-color: $theme-bg-color;
  transition: all 0.2s linear;
  cursor: pointer;
  &:hover {
    width: 226px;
    .menu-icon-panel {
      .menu-icon {
        display: block;
      }
    }
  }
  &::before {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 1px;
    left: 0;
    top: 0;
    background-image: linear-gradient(
      transparent 0%,
      transparent 50%,
      #27292e 50%,
      #27292e 100%
    );
  }
  .nav-item {
    position: relative;
    height: 46px;
    padding-left: 60px;
    font-size: 12px;
    line-height: 46px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    .nav-icon {
      position: absolute;
      display: inline-block;
      width: 48px;
      height: 48px;
      left: 1px;
      top: -1px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center center;
    }
    &.icon-total {
      height: 50px;
      line-height: 50px;
      border-top: 1px solid #3b4044;
      border-bottom: 1px solid #3b4044;
    }
    .icon-menu {
      box-sizing: border-box;
      background-size: 22px 22px;
      top: 1px;
      background-image: url(../assets/icons/menu.png);
    }
    .icon-projectmanager {
      background-image: url(../assets/icons/icon_1.png);
    }
    .icon-task {
      background-image: url(../assets/icons/icon_2.png);
    }
    .icon-schedule {
      background-image: url(../assets/icons/icon_3.png);
    }
    .icon-attendence {
      background-image: url(../assets/icons/icon_4.png);
    }
    .icon-customer {
      background-image: url(../assets/icons/icon_5.png);
    }
    .icon-worker {
      background-image: url(../assets/icons/icon_6.png);
    }
    .icon-payable {
      background-image: url(../assets/icons/icon_7.png);
    }
    .icon-private {
      background-image: url(../assets/icons/icon_8.png);
    }
    .icon-account {
      background-image: url(../assets/icons/icon_9.png);
    }
    .icon-system {
      background-image: url(../assets/icons/icon_10.png);
    }
    .icon-invoice {
      background-image: url(../assets/icons/icon_11.png);
    }
    .icon-recruitment {
      background-image: url(../assets/icons/icon_12.png);
    }
    .icon-receive {
      background-image: url(../assets/icons/icon_13.png);
    }
    .icon-classManager {
      background-image: url(../assets/icons/classManager.png);
    }
    .icon-ANP {
      background-image: url(../assets/icons/ANP.png);
    }
    .icon-data {
      background-image: url(../assets/icons/data.png);
    }
  }
}
</style>

<style lang="scss">
.nav-aside {
  a {
    text-decoration: none;
    color: #fff;
  }
}
</style>
