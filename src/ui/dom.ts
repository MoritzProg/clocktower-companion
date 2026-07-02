/** Small DOM helpers shared by all views. */

export function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** Creates a single element from an HTML string. */
export function el<T extends HTMLElement = HTMLElement>(html: string): T {
  const template = document.createElement('template')
  template.innerHTML = html.trim()
  return template.content.firstElementChild as T
}

/**
 * Renders speech text as HTML: escaped, blank lines become paragraphs,
 * remaining unresolved $Name tokens are highlighted.
 */
export function speechToHtml(text: string): string {
  const paragraphs = escapeHtml(text.trim()).split(/\n\s*\n/)
  return paragraphs
    .map((p) => `<p>${p.replaceAll('\n', '<br>')}</p>`)
    .join('')
    .replace(/\$name/gi, (match) => `<mark>${match}</mark>`)
}

let toastTimer: number | undefined

export function toast(message: string): void {
  document.querySelector('.toast')?.remove()
  const node = el(`<div class="toast">${escapeHtml(message)}</div>`)
  document.body.append(node)
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => node.remove(), 2500)
}

export function downloadFile(filename: string, content: string, mime: string): void {
  const url = URL.createObjectURL(new Blob([content], { type: mime }))
  const link = el<HTMLAnchorElement>(`<a download="${filename}"></a>`)
  link.href = url
  link.click()
  URL.revokeObjectURL(url)
}

/** Opens a file picker and resolves with the chosen file's text (or null). */
export function pickTextFile(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = el<HTMLInputElement>('<input type="file" accept=".json,application/json">')
    input.addEventListener('change', async () => {
      const file = input.files?.[0]
      resolve(file ? await file.text() : null)
    })
    input.addEventListener('cancel', () => resolve(null))
    input.click()
  })
}
