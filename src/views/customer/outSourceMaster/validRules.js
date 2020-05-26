let rules = {
  rules: {
    taskName: [{
      required: true,
      message: "任务名称不能为空",
      trigger: "blur",
    }, ],
    taskType:[{
        required: true,
        message: "任务指派不能为空",
        trigger: "change",
    }],  
    manager: [{
      required: true,
      message: "项目经理不能为空",
      trigger: "change"
    }],
    startTime0: [{
      required: true,
      message: "开始时间不能为空",
      trigger: "change"
    }],
    startTime1: [{
      required: true,
      message: "开始时间不能为空",
      trigger: "change"
    }],
    authorizedNumber: [{
        required: true,
        message: "核定人数不能为空",
        trigger: "blur",
      },
      {
        required: true,
        message: "核定人数不能为空",
        trigger: "change",
      },
      {
        pattern: /^[1-9][0-9]*$/,
        message: "请填写正确的生产核定人数",
        trigger: "blur",
      }
    ],
    workStartTime: [{
        required: true,
        message: "上班时间不能为空",
        trigger: "change"
      },
      {
        required: true,
        message: "上班时间不能为空",
        trigger: "blur"
      }
    ],
    countLimitPrice: [{
        required: true,
        message: "上限不能为空",
        trigger: "change"
      },
      {
        required: true,
        message: "上限不能为空",
        trigger: "blur"
      }
    ],
    nameIdcard: [
        {
          required: true,
          message: "客户工作量确认人员姓名或身份证号不能为空",
          trigger: "blur"
        }
    ],
    ageLowerLimit: [{
        required: true,
        message: "年龄要求不能为空",
        trigger: "blur",
      },
      {
        pattern: /^[1-9][0-9]*$/,
        message: "请填写正确的年龄下限"
      }
    ],
    quilty: [{
        required: false,
        trigger: "blur"
      },
      {
        pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[1-9]{1,2})$/,
        message: "请填写正确的预计工作量"
      }
    ],
  },
}

export default rules