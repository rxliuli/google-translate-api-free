import { DOMEditorUtil } from './util/DOMEditorUtil'
import { IBasicProvider } from '../background'
import { MessageClient } from '../common/util/MessageHandler'

console.log('content script')

const client = MessageClient.gen<IBasicProvider>('BasicProvider')

document.addEventListener('keydown', async (e) => {
  if (e.altKey && e.key === 't') {
    const text = DOMEditorUtil.getSelect()
    // const target = e.target
    // console.log('keydown: ', text, target)
    if (
      // (!(target instanceof HTMLInputElement) &&
      //   !(target instanceof HTMLTextAreaElement)) ||
      text === null
    ) {
      return
    }
    const resp = await client.translate(text, { from: 'auto', to: 'en' })
    console.log('translate resp: ', resp.text)
    await Promise.all([
      DOMEditorUtil.writeClipboard(resp.text),
      client.notify({
        type: 'basic',
        iconUrl:
          'https://raw.githubusercontent.com/rxliuli/google-translate-api-browser/1acd03721eaea0e59b7289cd7fd5b8b463c0014a/examples/chrome-plugin-example/src/public/icon-48.png',
        title: 'translate-chrome-plugin',
        message: '翻译完成: ' + resp.text,
      }),
    ])
  }
})
