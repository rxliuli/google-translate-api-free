import * as console from 'console'
import { ITranslatorHandler, Translator } from './index'

class TranslatorHandler implements ITranslatorHandler {
  async handle<T>(url: string): Promise<T> {
    const resp = await fetch(url, {
      method: 'get',
    })
    const r = await resp.json()
    return r as T
  }
}

describe('测试 translate', () => {
  const translator = new Translator(new TranslatorHandler())

  it('基本示例', async () => {
    const res = await translator.translate('hello world', {
      from: 'auto',
      to: 'zh-cn',
    })

    console.log('res.text: ', res.text)
  })
  it('测试单词', async () => {
    console.log(
      'res: ',
      await translator.translate('world', {
        from: 'en',
        to: 'zh-cn',
      }),
    )
    console.log(
      'res: ',
      await translator.translate('世界', {
        from: 'auto',
        to: 'en',
      }),
    )
  })
  it('翻译大段文本', async () => {
    const res = await translator.translate(
      `在 VSCode 中集成 joplin，目前允许直接对目录、笔记进行操作，同时支持搜索功能。

VSCode 的专业编辑功能及其生态
Joplin 强大的搜索和同步功能
开源 + 免费`,
      {
        from: 'auto',
        to: 'en',
      },
    )
    console.log('res: ', res)
  })
})
