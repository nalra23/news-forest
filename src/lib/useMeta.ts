import { useEffect } from 'react'

const SITE_NAME = 'News Forest'
const DEFAULT_TITLE = 'News Forest — 뉴스를 읽으면 나무가 자라요'
const DEFAULT_DESC =
  '기사 한 편 읽을 때마다 +10P. 씨앗이 자라 숲이 되는 게이미피케이션 뉴스 플랫폼.'

function setMeta(query: string, attrKey: string, attrVal: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(query)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrKey, attrVal)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useMeta({
  title,
  description,
  ogImage,
}: {
  title?: string
  description?: string
  ogImage?: string
} = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE
    const desc = description ?? DEFAULT_DESC

    document.title = fullTitle
    setMeta('meta[name="description"]', 'name', 'description', desc)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
    if (ogImage) {
      setMeta('meta[property="og:image"]', 'property', 'og:image', ogImage)
    }
    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href)

    return () => {
      document.title = DEFAULT_TITLE
      setMeta('meta[name="description"]', 'name', 'description', DEFAULT_DESC)
      setMeta('meta[property="og:title"]', 'property', 'og:title', DEFAULT_TITLE)
      setMeta('meta[property="og:description"]', 'property', 'og:description', DEFAULT_DESC)
      setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.origin)
    }
  }, [title, description, ogImage])
}
