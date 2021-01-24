// var { translate } = require("../../dist/index");

import readline from 'readline'
import axios from 'axios'
import { Translator } from 'google-translate-api-browser'

const translator = new Translator(async (url) => {
  return axios.get(url)
})
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
