<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="系统用户" name="first"></el-tab-pane>
      <el-tab-pane label="角色" name="second"></el-tab-pane>
      <!-- <el-tab-pane label="权限" name="third"></el-tab-pane>
      <el-tab-pane label="参数" name="fourth"></el-tab-pane>
      <el-tab-pane label="字典" name="fifth"></el-tab-pane> -->
    </el-tabs>

    <UserList v-if="activeName === 'first'" />
    <RoleList v-if="activeName === 'second'" />
    <PerList v-if="activeName === 'third'" />
    <ParamsList v-if="activeName === 'fourth'" />
    <DictionaryList v-if="activeName === 'fifth'" />
  </div>
</template>
<script>
import PerList from '../system/permission/permissionList'
import UserList from '../system/user/UserList'
import RoleList from '../system/role/RoleList'
import ParamsList from '../system/params/ParamsList'
import DictionaryList from '../system/dictionary/DictionaryList'
export default {
  name: "SystemList",
  components: {
    PerList,
    UserList,
    RoleList,
    ParamsList,
    DictionaryList,
  },
  data() {
    return {
      radio4: '',
      activeName: 'first'
    };
  },
};
</script>
