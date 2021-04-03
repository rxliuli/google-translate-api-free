// var { translate } = require("../../dist/index");

import readline from 'readline'
import axios from 'axios'
import {
  ITranslatorHandler,
  Translator,
} from '@liuli-util/google-translate-api-free'

class TranslatorHandler implements ITranslatorHandler {
  constructor() {
    axios.defaults.adapter = require('axios/lib/adapters/http')
  }

  async handle<T>(url: string): Promise<T> {
    return (await axios.get<T>(url)).data
  }
}

const translator = new Translator(new TranslatorHandler())
const rl = readline.createInterface(process.stdin, process.stdout)
rl.setPrompt('translate > ')
rl.prompt()

rl.on('line', function (line) {
  translator
    .translate(line, { to: 'en' })
    .then((res) => {
      rl.setPrompt(line + ' > ' + res.text + '\ntranslate > ')
      rl.prompt()
    })
    .catch((err) => {
      console.error(err)
    })
}).on('close', function () {
  process.exit(0)
})
