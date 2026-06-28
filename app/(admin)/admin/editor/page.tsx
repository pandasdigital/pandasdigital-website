'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Settings = {
  heroTitle: string
  heroSubtitle: string
  aboutStory: string
  aboutMission: string
  aboutVision: string
  companyName: string
  tagline: string
  email: string
  phone: string
  whatsapp: string
  address: string
  contactHeading: string
  contactSubheading: string
  workHeading: string
  workSubheading: string
  servicesHeading: string
  servicesSubheading: string
  productsHeading: string
  productsSubheading: string
}

// ── Moved OUTSIDE the component ──
function Field({
  label, id, type = 'text', rows, hint, form, onChange,
}: {
  label: string
  id: keyof Settings
  type?: string
  rows?: number
  hint?: string
  form: Settings
  onChange: (id: keyof Settings, val: string) => void
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {rows ? (
        <textarea
          className="form-input"
          rows={rows}
          value={form[id]}
          onChange={e => onChange(id, e.target.value)}
        />
      ) : (
        <input
          className="form-input"
          type={type}
          value={form[id]}
          onChange={e => onChange(id, e.target.value)}
        />
      )}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )
}

function InfoBox({ icon, text, linkLabel, linkHref }: {
  icon: string
  text: string
  linkLabel?: string
  linkHref?: string
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
      <span>{icon}</span>
      <span>
        {text}
        {linkLabel && linkHref && (
          <a href={linkHref} className="font-semibold underline ml-1">{linkLabel}</a>
        )}
      </span>
    </div>
  )
}

const defaultSettings: Settings = {
  heroTitle: 'We Build Digital Products That Last',
  heroSubtitle: 'Websites · Mobile apps · Custom software · SaaS platforms · AI automation. Built in Sri Lanka, for the world.',
  aboutStory: 'Pandas Digital started with a simple belief: businesses in Sri Lanka deserve world-class digital products.',
  aboutMission: 'To help businesses grow through innovative technology, automation, and software development.',
  aboutVision: 'To become a leading technology company creating globally recognized digital products.',
  companyName: 'Pandas Digital',
  tagline: 'Build · Innovate · Grow',
  email: 'hello@pandasdigital.lk',
  phone: '+94 77 000 0000',
  whatsapp: '+94770000000',
  address: 'Kurunegala, Sri Lanka',
  contactHeading: "Let's Build Together",
  contactSubheading: 'Have a project in mind? We will get back to you within 24 hours.',
  workHeading: "Projects We've Shipped",
  workSubheading: 'Real products, real clients, real results.',
  servicesHeading: 'What We Build',
  servicesSubheading: 'Full-stack digital solutions from design to deployment.',
  productsHeading: 'Software We Build & Sell',
  productsSubheading: 'Ready-made digital products built by Pandas Digital.',
}

const pages = [
  { key: 'home', label: '🏠 Home' },
  { key: 'about', label: '📖 About' },
  { key: 'services', label: '⚙️ Services' },
  { key: 'products', label: '📦 Products' },
  { key: 'work', label: '💼 Our Work' },
  { key: 'contact', label: '📞 Contact' },
] as const

type PageKey = (typeof pages)[number]['key']

export default function EditorPage() {
  const [form, setForm] = useState<Settings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activePage, setActivePage] = useState<PageKey>('home')

  useEffect(() => {
    let mounted = true
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        if (mounted && data && !data.error) {
          setForm(f => ({ ...f, ...data }))
        }
        if (mounted) setLoading(false)
      })
      .catch(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  async function handleSave() {
    setSaving(true)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function update(id: keyof Settings, val: string) {
    setForm(f => ({ ...f, [id]: val }))
  }

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Website Editor</h1>
          <p className="text-gray-500 text-sm mt-1">Edit content for each page of your website</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" className="btn-outline text-sm py-1.5 px-4">Preview ↗</a>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saved ? '✅ Published!' : saving ? 'Saving...' : '💾 Save & Publish'}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Page nav */}
        <div className="w-44 flex-shrink-0">
          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            {pages.map(p => (
              <button
                key={p.key}
                onClick={() => setActivePage(p.key)}
                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 border-b border-gray-50 last:border-0 transition-colors ${
                  activePage === p.key
                    ? 'bg-blue-50 text-blue-700 font-medium border-l-2 border-l-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-gray-400 text-center leading-relaxed p-2">
            Changes update your live website
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-xl space-y-4">

          {activePage === 'home' && (
            <>
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">🏠 Hero Section</h2>
                <div className="space-y-3">
                  <Field label="Main Headline" id="heroTitle" hint="The big text. Keep it short and punchy." form={form} onChange={update} />
                  <Field label="Sub-headline" id="heroSubtitle" rows={3} hint="Supporting text below the headline." form={form} onChange={update} />
                  <Field label="Company Tagline" id="tagline" hint="Short tagline in nav and footer." form={form} onChange={update} />
                </div>
              </div>
              <InfoBox icon="💡" text="Services preview on Home pulls from" linkLabel="Our Services →" linkHref="/admin/services" />
              <InfoBox icon="⭐" text="Testimonials are currently hardcoded. Ask your developer to update them." />
            </>
          )}

          {activePage === 'about' && (
            <>
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">📖 About Page</h2>
                <div className="space-y-3">
                  <Field label="Our Story" id="aboutStory" rows={5} hint="Main story paragraph." form={form} onChange={update} />
                  <Field label="Our Mission" id="aboutMission" rows={2} form={form} onChange={update} />
                  <Field label="Our Vision" id="aboutVision" rows={2} form={form} onChange={update} />
                </div>
              </div>
              <InfoBox icon="👥" text="Team members are managed in the codebase. Ask your developer to update them." />
            </>
          )}

          {activePage === 'services' && (
            <>
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">⚙️ Services Page Header</h2>
                <div className="space-y-3">
                  <Field label="Page Heading" id="servicesHeading" form={form} onChange={update} />
                  <Field label="Page Sub-heading" id="servicesSubheading" rows={2} form={form} onChange={update} />
                </div>
              </div>
              <div className="bg-white border-2 border-blue-100 rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-2">⚙️ Manage Service Cards</div>
                <p className="text-sm text-gray-500 mb-3">Add, edit, reorder and toggle services shown on this page.</p>
                <a href="/admin/services" className="btn-primary text-sm py-2 px-4 inline-block">Go to Our Services →</a>
              </div>
            </>
          )}

          {activePage === 'products' && (
            <>
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">📦 Products Page Header</h2>
                <div className="space-y-3">
                  <Field label="Page Heading" id="productsHeading" form={form} onChange={update} />
                  <Field label="Page Sub-heading" id="productsSubheading" rows={2} form={form} onChange={update} />
                </div>
              </div>
              <div className="bg-white border-2 border-blue-100 rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-2">📦 Manage Products</div>
                <p className="text-sm text-gray-500 mb-3">Add, edit and manage products shown on this page.</p>
                <a href="/admin/products" className="btn-primary text-sm py-2 px-4 inline-block">Go to Our Products →</a>
              </div>
            </>
          )}

          {activePage === 'work' && (
            <>
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">💼 Our Work Page Header</h2>
                <div className="space-y-3">
                  <Field label="Page Heading" id="workHeading" form={form} onChange={update} />
                  <Field label="Page Sub-heading" id="workSubheading" rows={2} form={form} onChange={update} />
                </div>
              </div>
              <div className="bg-white border-2 border-blue-100 rounded-xl p-4">
                <div className="font-medium text-gray-900 mb-2">💼 Manage Visible Projects</div>
                <p className="text-sm text-gray-500 mb-3">Use the <strong>Show on Web</strong> toggle to control which projects appear here.</p>
                <a href="/admin/projects" className="btn-primary text-sm py-2 px-4 inline-block">Go to Projects →</a>
              </div>
            </>
          )}

          {activePage === 'contact' && (
            <>
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">📞 Contact Page Header</h2>
                <div className="space-y-3">
                  <Field label="Page Heading" id="contactHeading" form={form} onChange={update} />
                  <Field label="Page Sub-heading" id="contactSubheading" rows={2} form={form} onChange={update} />
                </div>
              </div>
              <div className="card">
                <h2 className="font-semibold text-gray-900 mb-4">📞 Contact Details</h2>
                <div className="space-y-3">
                  <Field label="Email" id="email" type="email" form={form} onChange={update} />
                  <Field label="Phone" id="phone" form={form} onChange={update} />
                  <Field label="WhatsApp Number" id="whatsapp" hint="Include country code e.g. 94770000000" form={form} onChange={update} />
                  <Field label="Address" id="address" form={form} onChange={update} />
                </div>
              </div>
              <InfoBox icon="📱" text="Social media links are managed in" linkLabel="Settings →" linkHref="/admin/settings" />
            </>
          )}

        </div>
      </div>
    </div>
  )
}