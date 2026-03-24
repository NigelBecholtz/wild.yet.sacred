import { useState, useEffect } from 'react'
import { getAdminContent, updateContent, uploadImage } from '../../lib/api'

interface ContentItem {
  id: number
  page: string
  key: string
  locale: string
  value: string
}

type GroupedKey = Record<string, ContentItem>

const PAGES = ['home', 'howItWorks', 'about', 'book', 'nav', 'footer']

const isImageKey = (key: string) =>
  key.includes('image') || key.includes('img') || key.includes('photo')

const isLongText = (key: string) =>
  key.includes('body') || key.includes('bio') || key.includes('quote') ||
  key.includes('subtitle') || key.includes('note')

export default function AdminContent() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [activePage, setActivePage] = useState('home')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => {
    getAdminContent()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false))
  }, [])

  const pageItems = items.filter((i) => i.page === activePage)

  // Group by key: { hero_title: { en: ContentItem, es: ContentItem } }
  const grouped = pageItems.reduce<Record<string, GroupedKey>>((acc, item) => {
    if (!acc[item.key]) acc[item.key] = {}
    acc[item.key][item.locale] = item
    return acc
  }, {})
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    // Images last
    if (isImageKey(a) && !isImageKey(b)) return 1
    if (!isImageKey(a) && isImageKey(b)) return -1
    return a.localeCompare(b)
  })

  const makeKey = (item: ContentItem) => `${item.page}__${item.key}__${item.locale}`

  const getValue = (item: ContentItem) => edits[makeKey(item)] ?? item.value

  const handleEdit = (item: ContentItem, value: string) => {
    setEdits((prev) => ({ ...prev, [makeKey(item)]: value }))
    setSaved(false)
  }

  // For image keys: save same URL to both EN and ES
  const handleImageEdit = (key: string, value: string) => {
    const group = grouped[key]
    if (group?.en) handleEdit(group.en, value)
    if (group?.es) handleEdit(group.es, value)
  }

  const getImageValue = (key: string) => {
    const group = grouped[key]
    const enItem = group?.en
    if (!enItem) return ''
    return edits[makeKey(enItem)] ?? enItem.value
  }

  const handleSave = async () => {
    setSaving(true)
    const updates = Object.entries(edits).map(([compKey, value]) => {
      const [page, key, locale] = compKey.split('__')
      return { page, key, locale, value }
    })
    try {
      await updateContent(updates)
      setItems((prev) =>
        prev.map((item) => {
          const k = makeKey(item)
          return edits[k] !== undefined ? { ...item, value: edits[k] } : item
        })
      )
      setEdits({})
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (key: string, file: File) => {
    setUploading(key)
    try {
      const { data } = await uploadImage(file)
      const url = `http://localhost:3001${data.url}`
      handleImageEdit(key, url)
    } finally {
      setUploading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <span className="text-on-surface font-headline italic text-4xl animate-pulse">✦</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-16">
      {/* Header */}
      <div className="mb-12 flex items-start justify-between gap-6">
        <div>
          <span className="font-label text-on-surface text-xs tracking-[0.3em] uppercase block mb-4">◆ Editorial Control</span>
          <h1 className="font-headline text-5xl text-on-surface font-light">Content</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || Object.keys(edits).length === 0}
          className={`px-8 py-3 rounded-sm font-label text-xs uppercase tracking-widest transition-all disabled:opacity-50 ${
            saved ? 'bg-primary/20 text-on-surface' : 'bg-secondary text-on-secondary hover:brightness-110'
          }`}
        >
          {saving ? '✦' : saved ? 'Saved ✓' : `Save Changes${Object.keys(edits).length > 0 ? ` (${Object.keys(edits).length})` : ''}`}
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0">
          <div className="space-y-1">
            {PAGES.map((page) => {
              const count = items.filter((i) => i.page === page && i.locale === 'en').length
              return (
                <button
                  key={page}
                  onClick={() => setActivePage(page)}
                  className={`w-full text-left px-4 py-3 rounded-sm font-label text-xs uppercase tracking-widest transition-all ${
                    activePage === page
                      ? 'bg-secondary text-on-secondary'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span>{page}</span>
                  <span className={`float-right opacity-60 ${activePage === page ? 'text-on-secondary' : 'text-on-surface'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 space-y-4">
          {sortedKeys.length === 0 && (
            <p className="text-on-surface-variant italic font-headline">No content for this page yet.</p>
          )}

          {sortedKeys.map((key) => {
            const group = grouped[key]
            const isImg = isImageKey(key)
            const isLong = isLongText(key)

            if (isImg) {
              const imgValue = getImageValue(key)
              return (
                <div key={key} className="bg-surface-container border border-outline-variant/10 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-label text-xs uppercase tracking-widest text-on-surface">{key}</span>
                    <span className="text-xs px-2 py-0.5 rounded-sm font-label uppercase tracking-widest bg-surface-container-high text-on-surface border border-outline-variant/30">
                      Image
                    </span>
                  </div>
                  <div className="flex items-start gap-6">
                    {imgValue ? (
                      <img
                        src={imgValue}
                        alt={key}
                        className="h-32 w-32 object-cover rounded border border-outline-variant/20 flex-shrink-0"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded border border-outline-variant/20 bg-surface-container-high flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-outline/40 text-3xl">image</span>
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={imgValue}
                        onChange={(e) => handleImageEdit(key, e.target.value)}
                        placeholder="Image URL or upload below"
                        className="w-full bg-transparent border-b border-outline-variant focus:border-secondary py-2 text-on-surface text-sm outline-none transition-colors"
                      />
                      <label className={`inline-flex items-center gap-2 cursor-pointer text-xs font-label uppercase tracking-widest border px-4 py-2 rounded-sm transition-colors ${
                        uploading === key
                          ? 'text-outline border-outline/30 opacity-50'
                          : 'text-on-surface border-secondary/30 hover:bg-secondary/10'
                      }`}>
                        <span className="material-symbols-outlined text-sm">upload</span>
                        {uploading === key ? 'Uploading...' : 'Upload Image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          disabled={uploading !== null}
                          onChange={(e) => e.target.files?.[0] && handleUpload(key, e.target.files[0])}
                        />
                      </label>
                      <p className="text-xs text-on-surface-variant/50 font-label">
                        Applied to both EN and ES locales
                      </p>
                    </div>
                  </div>
                </div>
              )
            }

            // Text key — EN/ES side by side
            const enItem = group.en
            const esItem = group.es

            return (
              <div key={key} className="bg-surface-container border border-outline-variant/10 rounded-lg overflow-hidden">
                {/* Key label */}
                <div className="px-6 pt-4 pb-2">
                  <span className="font-label text-xs uppercase tracking-widest text-on-surface">{key}</span>
                </div>

                {/* EN + ES columns */}
                <div className="grid grid-cols-2 divide-x divide-outline-variant/10">
                  {/* EN */}
                  <div className="px-6 pb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-label uppercase tracking-widest text-on-surface bg-primary/10 px-2 py-0.5 rounded-sm">EN</span>
                    </div>
                    {enItem ? (
                      isLong ? (
                        <textarea
                          value={getValue(enItem)}
                          onChange={(e) => handleEdit(enItem, e.target.value)}
                          rows={4}
                          className="w-full bg-transparent border-b border-outline-variant focus:border-primary py-2 text-on-surface text-sm outline-none transition-colors resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={getValue(enItem)}
                          onChange={(e) => handleEdit(enItem, e.target.value)}
                          className="w-full bg-transparent border-b border-outline-variant focus:border-primary py-2 text-on-surface text-sm outline-none transition-colors"
                        />
                      )
                    ) : (
                      <span className="text-xs text-on-surface-variant/40 italic font-label">No EN entry</span>
                    )}
                  </div>

                  {/* ES */}
                  <div className="px-6 pb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-label uppercase tracking-widest text-on-surface bg-secondary/10 px-2 py-0.5 rounded-sm">ES</span>
                    </div>
                    {esItem ? (
                      isLong ? (
                        <textarea
                          value={getValue(esItem)}
                          onChange={(e) => handleEdit(esItem, e.target.value)}
                          rows={4}
                          className="w-full bg-transparent border-b border-outline-variant focus:border-secondary py-2 text-on-surface text-sm outline-none transition-colors resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={getValue(esItem)}
                          onChange={(e) => handleEdit(esItem, e.target.value)}
                          className="w-full bg-transparent border-b border-outline-variant focus:border-secondary py-2 text-on-surface text-sm outline-none transition-colors"
                        />
                      )
                    ) : (
                      <span className="text-xs text-on-surface-variant/40 italic font-label">No ES entry</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
