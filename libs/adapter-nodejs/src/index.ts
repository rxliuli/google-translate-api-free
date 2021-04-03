import axios from 'axios'
import { ITranslatorHandler } from '@liuli-util/google-translate-api-free'

export class TranslatorHandlerWithNodejs implements ITranslatorHandler {
  constructor() {
    axios.defaults.adapter = require('axios/lib/adapters/http')
  }

  async handle<T>(url: string): Promise<T> {
    return (await axios.get<T>(url)).data
  }
}
