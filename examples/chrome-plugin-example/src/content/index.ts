import { ActionType } from '../background/model/ActionType'
import { TranslateResult } from '@liuli-util/google-translate-api-free'
import { DOMEditorUtil } from './util/DOMEditorUtil'

console.log('content script')

Reflect.set(window, 'DOMEditorUtil', DOMEditorUtil)

document.addEventListener('keydown', async (e) => {
  if (e.altKey && e.key === 't') {
    const text = DOMEditorUtil.getSelect()
    const target = e.target
    console.log('keydown: ', text, target)
    if (
      (!(target instanceof HTMLInputElement) &&
        !(target instanceof HTMLTextAreaElement)) ||
      text === null
    ) {
      return
    }
    const resp: TranslateResult = await browser.runtime.sendMessage({
      action: 'translate' as keyof ActionType,
      data: [text, { from: 'auto', to: 'en' }] as ActionType['translate'],
    })
    console.log('translate resp: ', resp.text)
    DOMEditorUtil.replaceSelect(resp.text)
  }
})
