Based on [google-translate-api](https://github.com/cjrsgu/google-translate-api-browser)
and [google-translate-token](https://github.com/matheuss/google-translate-token)

## Install

```sh
yarn add @liuli-util/google-translate-api-free
```

## Examples

### For node

> ref: [node-example](https://github.com/rxliuli/google-translate-api-free/tree/master/examples/node-example)

```sh
yarn add @liuli-util/google-translate-api-free-nodejs-adapter
```

```ts
import { Translator } from '@liuli-util/google-translate-api-free'
import { TranslatorHandlerWithNodejs } from '@liuli-util/google-translate-api-free-nodejs-adapter'

const translator = new Translator(new TranslatorHandlerWithNodejs())

it('基本示例', async () => {
  const res = await translator.translate('hello world', {
    from: 'auto',
    to: 'zh-cn',
  })

  console.log('res.text: ', res.text)
})
```

### For browser

> ref: [browser-example](https://github.com/rxliuli/google-translate-api-free/tree/master/examples/browser-example)

For cross origin requests it uses [cors-anywhere
](https://github.com/Rob--W/cors-anywhere). You can use public cors-anywhere
server `https://cors-anywhere.herokuapp.com/` or set up your own. By default it does not use proxying.

```ts
class TranslatorHandler implements ITranslatorHandler {
  async handle<T>(url: string): Promise<T> {
    return (await axios.get('http://cors-anywhere.herokuapp.com/' + url)).data
  }
}

const translator = new Translator(new TranslatorHandler())

it('基本示例', async () => {
  const res = await translator.translate('hello world', {
    from: 'auto',
    to: 'zh-cn',
  })

  console.log('res.text: ', res.text)
})
```

## API

### translate(text, options)

#### text

Type: `string`

The text to be translated

#### options

Type: `object`

##### from

Type: `string` Default: `auto`

The `text` language. Must be `auto` or one of the codes/names (not case sensitive) contained
in [languages.js](https://github.com/matheuss/google-translate-api/blob/master/languages.js)

##### to

Type: `string` Default: `en`

The language in which the text should be translated. Must be one of the codes/names (not case sensitive) contained
in [languages.js](https://github.com/matheuss/google-translate-api/blob/master/languages.js).

##### raw

Type: `boolean` Default: `false`

If `true`, the returned object will have a `raw` property with the raw response (`string`) from Google Translate.

### Returns an `object`:

- `text` _(string)_ – The translated text.
- `from` _(object)_
  - `language` _(object)_
    - `didYouMean` _(boolean)_ - `true` if the API suggest a correction in the source language
    - `iso` _(string)_ -
      The [code of the language](https://github.com/matheuss/google-translate-api/blob/master/languages.js) that the
      API has recognized in the `text`
  - `text` _(object)_
    - `autoCorrected` _(boolean)_ – `true` if the API has auto corrected the `text`
    - `value` _(string)_ – The auto corrected `text` or the `text` with suggested corrections
    - `didYouMean` _(boolean)_ – `true` if the API has suggested corrections to the `text`
- `raw` _(string)_ - If `options.raw` is true, the raw response from Google Translate servers. Otherwise, `''`.

Note that `res.from.text` will only be returned if `from.text.autoCorrected` or `from.text.didYouMean` equals to `true`.
In this case, it will have the corrections delimited with brackets (`[ ]`):

```js
translator
  .translate('I spea Dutch')
  .then((res) => {
    console.log(res.from.text.value)
    //=> I [speak] Dutch
  })
  .catch((err) => {
    console.error(err)
  })
```
