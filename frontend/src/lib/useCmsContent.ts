import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getContent } from './api'

type CmsMap = Record<string, string>

export function useCmsContent(page: string): CmsMap {
  const { i18n } = useTranslation()
  const [content, setContent] = useState<CmsMap>({})

  useEffect(() => {
    getContent(i18n.language)
      .then(r => setContent((r.data as Record<string, CmsMap>)[page] || {}))
      .catch(() => {})
  }, [page, i18n.language])

  return content
}
