import { createLogger, format } from 'winston'
import os from 'os'

const { combine, timestamp } = format

import ConsoleTransport from '../src'

const logger = createLogger({
  level: 'debug',
  defaultMeta: { pid: process.pid, host: os.hostname() },
  format: combine(timestamp()),
  transports: [new ConsoleTransport()],
})

logger.debug('this is a debug message')
logger.info('this is an information', { a: 1, b: '2' })
logger.warn('this is a warning')
logger.info(
  `
this is an multiline message
this is an multiline message
this is an multiline message
`,
  {
    largeMeta: `
  this is an multiline message
  this is an multiline message
  this is an multiline message
  `,
  },
)

const a = () => b()
const b = () => {
  throw new Error('ttt')
}

try {
  a()
} catch (err: any) {
  logger.error('this is an error', { stack: err.stack })
}
