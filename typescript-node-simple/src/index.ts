import { config } from '@/config/'
import type { AppConfig } from '@/types'
import { logger } from '@/utils/logger'

/** Main entry */

const appConfig: AppConfig = config

logger.info('Application starting...')
logger.info(`Config loaded: ${appConfig.appName}`)