// var { translate } = require("../../dist/index");

import readline from 'readline'
import { Translator } from '@liuli-util/google-translate-api-free'
import { TranslatorHandlerWithNodejs } from '@liuli-util/google-translate-api-free-nodejs-adapter'

const translator = new Translator(new TranslatorHandlerWithNodejs())
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
