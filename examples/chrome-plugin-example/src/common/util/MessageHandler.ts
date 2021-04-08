import { Class } from 'type-fest'
import { ClassUtil } from '@liuli-util/object'

export class ControllerRegister {
  private registerMap = new Map<string, Function>()

  register(clazz: Class): this {
    const ins = new clazz() as object
    const methods = ClassUtil.scan(ins)
    ClassUtil.bindMethodThis(ins)
    methods.forEach((method: string) => {
      this.registerMap.set(
        clazz.name + '.' + method,
        ins[method as keyof Class] as Function,
      )
    })
    return this
  }

  getListener() {
    return ({ action, args }: { action: string; args: any[] }) => {
      const func = this.registerMap.get(action)
      if (!func) {
        throw new Error(`Action ${action} not register`)
      }
      return func(...args)
    }
  }
}

export class MessageClient {
  /**
   * 生成一个客户端实例
   * @param namespace
   */
  static gen<T>(namespace: string): T {
    return new Proxy(Object.create(null), {
      get(target: any, api: string): any {
        const action = namespace + '.' + api
        return async function (...args: any[]) {
          return browser.runtime.sendMessage({ action, args })
        }
      },
    })
  }
}
