import {
  ITranslatorHandler,
  TranslateResult,
  Translator,
} from '@liuli-util/google-translate-api-free'
import { ControllerRegister } from '../common/util/MessageHandler'

class TranslatorHandler implements ITranslatorHandler {
  async handle<T>(url: string): Promise<T> {
    return (await fetch(url)).json()
  }
}

export interface IBasicProvider {
  translate(
    ...args: Parameters<Translator['translate']>
  ): Promise<TranslateResult>

  notify(
    options: Parameters<typeof browser.notifications.create>[1],
  ): Promise<string>
}

class BasicProvider implements IBasicProvider {
  notify(
    options: Parameters<typeof browser.notifications.create>[1],
  ): Promise<string> {
    return browser.notifications.create(options)
  }

  private translator = new Translator(new TranslatorHandler())

  translate(
    ...[text, options]: Parameters<Translator['translate']>
  ): Promise<TranslateResult> {
    return this.translator.translate(text, options)
  }
}

browser.runtime.onMessage.addListener(
  new ControllerRegister().register(BasicProvider).getListener(),
)
