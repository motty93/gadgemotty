import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * テキストからURLに適したスラグを生成する
 * CSSセレクタとして有効なIDを生成する
 */
export function generateSlug(text: string): string {
  // 日本語を含むテキストからCSSセレクタとして有効なIDを生成
  // 日本語や特殊文字を含む場合は、接頭辞 'heading-' を付けて英数字のハッシュを生成
  const hasNonLatinChars = /[^\w-]/.test(text)

  if (hasNonLatinChars) {
    // 日本語や特殊文字を含む場合は、シンプルなハッシュを生成
    // 簡易的なハッシュ関数
    let hash = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // 32bit整数に変換
    }
    // 正の数に変換して文字列化
    const positiveHash = Math.abs(hash).toString(16)
    return `heading-${positiveHash}`
  }

  // 英数字のみの場合は、そのままスラグ化
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // 空白を-に置換
    .replace(/[^\w-]/g, '') // 英数字とハイフン以外を削除
    .replace(/-+/g, '-') // 連続するハイフンを単一のハイフンに置換
}

/**
 * URLのハッシュ用に、人間が読みやすいスラグを生成する
 * URLエンコードが必要な文字も含めることができる
 */
export function generateUrlSlug(text: string): string {
  // URLのハッシュ用のスラグ（日本語もOK）
  return encodeURIComponent(
    text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // 空白を-に置換
      .replace(/-+/g, '-'), // 連続するハイフンを単一のハイフンに置換
  )
}
