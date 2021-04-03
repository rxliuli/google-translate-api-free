// setting up cors-anywhere server address
import { ITranslatorHandler, Translator } from 'google-translate-api-browser'
import axios from 'axios'

const rInp = document.getElementById('root__input') as HTMLInputElement
const rTra = document.getElementById('translated') as HTMLDivElement
const rBut = document.getElementById('root__button') as HTMLButtonElement

class TranslatorHandler implements ITranslatorHandler {
  async handle<T>(url: string): Promise<T> {
    return (await axios.get('http://cors-anywhere.herokuapp.com/' + url)).data
  }
}

const translator = new Translator(new TranslatorHandler())

rBut.addEventListener('click', () => {
  rTra.innerHTML = '...'
  translator
    .translate(rInp.value, { to: 'en' })
    .then((res) => {
      rTra.innerHTML = res.text
    })
    .catch((err) => {
      console.error(err)
    })
})
