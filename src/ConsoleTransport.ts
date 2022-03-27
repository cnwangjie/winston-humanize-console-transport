import Transport from 'winston-transport'
import chalk from 'chalk'
import { inspect } from 'util'
import { Writable } from 'stream'

const colors: any = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
}

export interface ConsoleTransportOption
  extends Transport.TransportStreamOptions {
  stdout?: Writable
  stderr?: Writable
}

export default class ConsoleTransport extends Transport {
  name = 'console'

  constructor(private options: ConsoleTransportOption = {}) {
    super(options)
    options.stdout = options.stdout || process.stdout
    options.stderr = options.stderr || process.stderr
    this.setMaxListeners(30)
  }

  private _writeOut(data: string) {
    this.options.stdout?.write(data + '\n')
  }

  private _writeErr(data: string) {
    this.options.stderr?.write(data + '\n')
  }

  log(info: any, cb: any) {
    setImmediate(() => this.emit('logged', info))

    const {
      level,
      timestamp,
      message,
      module,
      pid,
      traceId,
      host,
      stack,
      ...meta
    } = info

    const lv = chalk
      .keyword(colors[level] || 'gray')(level.toUpperCase())
      .padEnd(6, ' ')

    const ts = chalk.gray(timestamp)
    const mod = chalk.yellow(module || '')
    const tid = chalk.gray(traceId || '')
    const rest = Object.entries(meta)
      .map(([k, v]) => {
        return k + chalk.gray('=') + inspect(v, { colors: true })
      })
      .join(' ')

    const p = pid.toString().padEnd(5)
    const msg = [ts, p, tid, lv, mod, message, rest].filter(i => i).join(' ')

    this._writeOut(msg)
    if (stack) this._writeErr(stack)

    cb?.()
  }
}
