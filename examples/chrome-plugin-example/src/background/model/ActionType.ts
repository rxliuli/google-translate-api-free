import { Translator } from '@liuli-util/google-translate-api-free'

export interface ActionType {
  translate: Parameters<Translator['translate']>
}
