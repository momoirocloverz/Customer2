let config = null

// 开发环境，测试环境，预发环境，生产环境
if (process.env.NODE_ENV === 'development') {
  config = {
    api_base_url: 'dev'
  }
} else if (process.env.NODE_ENV === 'test') {
  config = {
    api_base_url: 'test'
  }
} else if (process.env.NODE_ENV === 'pre') {
  config = {
    api_base_url: 'pre'
  }
} else if (process.env.NODE_ENV === 'production') {
  config = {
    api_base_url: 'pro'
  }
}

export default config