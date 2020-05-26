let jobTypeFormatter = (row, column, cellValue, index) => {
  let result = ''
  switch (Number(cellValue)) {
    case 1:
      result = '日结'
      break;
    case 2:
      result = '月结'
      break;
    case 4:
      result = '周结'
      break;
  }

  return result
}

let jobLocationFormatter = (row, column, cellValue, index) => {
  let province = row.province || ''
  let city = row.city || ''
  let region = row.region || ''
  return `${province} ${city} ${region}`
}

// 推荐进度
let recommendProcessFormatter = (row, column, cellValue, index) => {
  let {
    recommendCount,
    maxRecommend
  } = row
  return `${recommendCount} / ${maxRecommend}`
}

// 已支付信息费
let expenseInfoFeeFormatter = (row, column, cellValue, index) => {
  let {
    recommendCount,
    jobInfoFee
  } = row
  return jobInfoFee * recommendCount
}

// 剩余冻结费用
let totalFeeFormatter = (row, column, cellValue, index) => {
  let {
    freezeInformationFee,
    freezeCommissionFee
  } = row
  return freezeInformationFee + freezeCommissionFee
}

// 支出类型
let expensesTypeFormatter = (row, column, cellValue, index) => {
  let result = ''
  switch (Number(cellValue)) {
    case 1:
      result = '信息费'
      break;
    case 2:
      result = '佣金'
      break;
  }

  return result
}
export {
  jobTypeFormatter,
  jobLocationFormatter,
  recommendProcessFormatter,
  expenseInfoFeeFormatter,
  totalFeeFormatter,
  expensesTypeFormatter
}