<template>
  <div class='candidate-list back-white'>
    <el-tabs v-model="activeName">
      <el-tab-pane label="统计" name="first"></el-tab-pane>
      <el-tab-pane label="明细" name="second"></el-tab-pane>
    </el-tabs>

    <expenses-total v-if="activeName === 'first'"></expenses-total>
    <expenses-detail v-if="activeName === 'second'"></expenses-detail>
  </div>
</template>

<script>
import ExpensesTotal from './components/expenses/ExpensesTotal'
import ExpensesDetail from './components/expenses/ExpensesDetail'

export default {
  name: 'ExpensesList',
  components: {
    ExpensesTotal, ExpensesDetail
  },
  data() {
    return {
      activeName: 'first'
    };
  },
}
</script>
