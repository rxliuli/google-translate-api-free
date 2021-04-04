import {
  ITranslatorHandler,
  Translator,
} from '@liuli-util/google-translate-api-free'
import axios from 'axios'
import { ActionType } from './model/ActionType'

class TranslatorHandler implements ITranslatorHandler {
  async handle<T>(url: string): Promise<T> {
    return (await axios.get<T>(url)).data
  }
}

const translator = new Translator(new TranslatorHandler())

browser.runtime.onMessage.addListener(
  async <K extends keyof ActionType>(message: {
    action: K
    data: ActionType[K]
  }): Promise<any> => {
    console.log('onMessage: ', message)
    switch (message.action) {
      case 'translate':
        const resp = await translator.translate(
          message.data[0],
          message.data[1],
        )
        await browser.notifications.create({
          type: 'basic',
          iconUrl:
            'https://raw.githubusercontent.com/rxliuli/google-translate-api-browser/1acd03721eaea0e59b7289cd7fd5b8b463c0014a/examples/chrome-plugin-example/src/public/icon-48.png',
          title: 'translate-chrome-plugin',
          message: '翻译完成: ' + resp.text,
        })
        return resp
      default:
        break
    }
  },
)
