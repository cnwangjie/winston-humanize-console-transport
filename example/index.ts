import { createLogger, format, transports } from 'winston'
import os from 'os'

const { combine, timestamp, simple } = format

import ConsoleTransport from '../src'

const logger = createLogger({
  level: 'debug',
  defaultMeta: { pid: process.pid, host: os.hostname() },
  format: combine(timestamp(), simple()),
  transports: [new transports.Console()],
  // transports: [new ConsoleTransport()],
})

logger.debug('this is a debug message')
logger.info('this is an information', { a: 1, b: '2' })
logger.warn('this is a warning')
logger.error('this is an error', { stack: new Error('ttt') })
