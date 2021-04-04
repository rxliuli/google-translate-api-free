export class DOMEditorUtil {
  static getSelect(): string | null {
    const selection = getSelection()
    if (!selection || selection.type === 'None') {
      return null
    }
    return selection.toString()
  }

  static replaceSelect(text: string): void {
    const selection = window.getSelection()
    if (!selection || selection.type === 'None') {
      return
    }
    const $input:
      | HTMLInputElement
      | HTMLTextAreaElement
      | null = ((selection as any).baseNode as HTMLElement).querySelector(
      'input,textarea',
    )
    if (!$input) {
      return
    }
    $input.setRangeText(text)

    // console.log('paste: ', document.execCommand('paste', false, text))
  }

  static async writeClipboard(text: string) {
    await navigator.clipboard.writeText(text)
  }
}
