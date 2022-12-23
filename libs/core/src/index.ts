import sM from './sM'
import { getCode, isSupported, Lang } from './languages'

interface Token {
  name: string
  value: string
}

function computeToken(text: string): Token {
  return { name: 'tk', value: sM(text) }
}

export interface TranslateOptions {
  from: Lang
  to: Exclude<Lang, 'auto'>
  hl: string
  raw: boolean
  tld: string
}

export interface TranslateResult {
  text: string
  from: {
    language: {
      didYouMean: boolean
      iso: string
    }
    text: {
      autoCorrected: boolean
      value: string
      didYouMean: boolean
    }
  }
  raw: string

  pronunciation?: string
}

export interface ITranslatorHandler {
  handle<T>(url: string): Promise<T>
}

export class Translator {
  constructor(private handler: ITranslatorHandler) {}

  // function translate(text: string, to: string, from: string, tld: string) {
  async translate(
    text: string,
    opts_: Partial<TranslateOptions> = {},
  ): Promise<TranslateResult> {
    const opts: TranslateOptions = {
      from: opts_.from || 'auto',
      to: opts_.to || 'en',
      hl: opts_.hl || 'en',
      raw: opts_.raw || false,
      tld: opts_.tld || 'com',
    }

    let e: Error | null = null
    ;[opts.from, opts.to].forEach((lang) => {
      if (lang && !isSupported(lang)) {
        e = new Error()
        e.message = "The language '" + lang + "' is not supported"
      }
    })

    if (e) {
      return new Promise((resolve, reject) => {
        reject(e)
      })
    }

    const token = computeToken(text)
    const url = 'https://translate.google.' + opts.tld + '/translate_a/single'
    const data = {
      client: 'gtx',
      sl: getCode(opts.from),
      tl: getCode(opts.to),
      hl: getCode(opts.hl),
      dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
      ie: 'UTF-8',
      oe: 'UTF-8',
      otf: 1,
      ssel: 0,
      tsel: 0,
      kc: 7,
      q: text,
      [token.name]: token.value,
    }

    try {
      const usp = new URLSearchParams()
      Object.entries(data).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach((item) => usp.append(k, item))
        } else {
          usp.set(k, String(v))
        }
      })
      const resp = await this.handler.handle(url + '?' + usp.toString())
      const res = {
        body: JSON.stringify(resp),
      }
      const result: TranslateResult = {
        text: '',
        pronunciation: '',
        from: {
          language: {
            didYouMean: false,
            iso: '',
          },
          text: {
            autoCorrected: false,
            value: '',
            didYouMean: false,
          },
        },
        raw: opts.raw ? res.body : '',
      }

      const body = JSON.parse(res.body)

      body[0].forEach((obj: any) => {
        if (obj[0]) {
          result.text += obj[0]
        } else if (obj[2]) {
          result.pronunciation += obj[2]
        }
      })

      if (body[2] === body[8][0][0]) {
        result.from.language.iso = body[2]
      } else {
        result.from.language.didYouMean = true
        result.from.language.iso = body[8][0][0]
      }

      if (body[7] && body[7][0]) {
        let str = body[7][0]

        str = str.replace(/<b><i>/g, '[')
        str = str.replace(/<\/i><\/b>/g, ']')

        result.from.text.value = str

        if (body[7][5] === true) {
          result.from.text.autoCorrected = true
        } else {
          result.from.text.didYouMean = true
        }
      }
      return result
    } catch (err) {
      const e: Error = new Error()
      if (
        (err as any).statusCode !== undefined &&
        (err as any).statusCode !== 200
      ) {
        e.message = 'BAD_REQUEST'
      } else {
        e.message = 'BAD_NETWORK'
      }
      throw e
    }
  }
}
