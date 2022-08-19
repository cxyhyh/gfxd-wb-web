import devConfig from './config.dev'
import prodConfig from './config.online'

const config = process.env.NODE_ENV == 'dev' ? devConfig : prodConfig

export default config

