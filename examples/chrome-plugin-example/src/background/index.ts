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
        return await translator.translate(message.data[0], message.data[1])
      default:
        break
    }
  },
)
