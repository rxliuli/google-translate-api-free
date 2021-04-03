import axios from 'axios'
import * as console from 'console'
import { ITranslatorHandler, Translator } from './index'

describe('测试 translate', () => {
  it('基本示例', async () => {
    class TranslatorHandler implements ITranslatorHandler {
      constructor() {
        axios.defaults.adapter = require('axios/lib/adapters/http')
      }

      async handle<T>(url: string): Promise<T> {
        return (await axios.get<T>(url)).data
      }
    }

    const translator = new Translator(new TranslatorHandler())
    const res = await translator.translate('hello world', {
      from: 'auto',
      to: 'zh-cn',
    })

    console.log('res.text: ', res.text)
  })
})
