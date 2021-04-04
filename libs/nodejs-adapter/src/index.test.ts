import { TranslatorHandlerWithNodejs } from './index'
import { Translator } from '@liuli-util/google-translate-api-free'

describe('测试 translate', () => {
  const translator = new Translator(new TranslatorHandlerWithNodejs())

  it('基本示例', async () => {
    const res = await translator.translate('hello world', {
      from: 'auto',
      to: 'zh-cn',
    })

    console.log('res.text: ', res.text)
  })
})
