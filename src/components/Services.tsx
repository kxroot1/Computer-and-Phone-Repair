import { useState } from 'react'
import { BatteryCharging, Laptop, Monitor, Search, Smartphone, HardDrive, ScanLine, Settings2, MessageCircle } from 'lucide-react'
import { services, formatPrice } from '../data/services'
import type { Service } from '../data/services'

const icons = { screen: ScanLine, battery: BatteryCharging, phone: Smartphone, laptop: Laptop, desktop: Monitor, data: HardDrive, settings: Settings2 }
const filters = [{ id: 'all', label: 'كل الخدمات' }, { id: 'computer', label: 'الحواسيب' }, { id: 'smartphone', label: 'الهواتف' }]
function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f\u064B-\u065F]/g, '').replace(/[أإآ]/g, 'ا').toLowerCase().trim() }

export function Services({ onSelect }: { onSelect: (service: Service) => void }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const visibleServices = services.filter(service => (filter === 'all' || service.category === filter) && normalize(`${service.title} ${service.description} ${service.frenchTitle}`).includes(normalize(query)))
  return <section className="services-section section-space" id="services" aria-labelledby="services-title">
    <div className="container">
      <div className="section-heading"><div><p className="eyebrow"><span className="section-number" dir="ltr">01 /</span> الخدمات</p><h2 id="services-title">عطل صغير أو كبير،<br /><span>نلقاو له الحل المناسب.</span></h2></div><p>كل جهاز عندو قصة. نشخّصو المشكل ونقترحو<br className="desktop-break" /> التدخل اللي يحتاجه، بلا مصاريف مفاجئة.</p></div>
      <div className="services-toolbar"><div className="filter-group" role="group" aria-label="تصفية الخدمات">{filters.map(item => <button key={item.id} className={filter === item.id ? 'active' : ''} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div><div className="search-wrap"><Search size={19} aria-hidden="true" /><input aria-label="البحث عن خدمة" type="search" placeholder="قلب على خدمة…" value={query} onChange={event => setQuery(event.target.value)} /></div></div>
      <p className="sr-only" aria-live="polite">{visibleServices.length} خدمات معروضة.</p>
      {visibleServices.length ? <div className="service-grid">{visibleServices.map(service => {
        const Icon = icons[service.icon]
        return <article className="service-card" key={service.id}><div className="service-card-top"><span className="service-icon"><Icon size={28} strokeWidth={1.6} /></span><span className="service-index" dir="ltr">0{services.indexOf(service) + 1}</span></div><p className="category-label" lang="fr" dir="ltr">{service.frenchTitle}</p><h3>{service.title}</h3><p className="service-description">{service.description}</p><div className="service-card-bottom"><span className="service-price">{service.price !== undefined ? <><small>ابتداءً من</small><strong dir="ltr">{formatPrice(service.price)}</strong></> : <strong className="diagnosis-price">حسب التشخيص</strong>}</span><button className="service-select" aria-label={`طلب خدمة: ${service.title}`} onClick={() => onSelect(service)}><span>طلب الخدمة</span><MessageCircle size={17} /></button></div></article>
      })}{filter === 'all' && !query && <article className="service-card diagnosis-card"><span className="service-icon"><Search size={29} strokeWidth={1.6} /></span><h3>ما عرفتيش<br />فين المشكل؟</h3><p>وصف لينا شنو كيوقع،<br />ونوجّهوك للخطوة المناسبة.</p><a href="#request" className="button button-outline-light">طلب تشخيص</a></article>}</div> : <div className="empty-state"><Search size={36} /><h3>ما لقيناش خدمة بهاد الاسم.</h3><p>جرّب «شاشة» أو «بطارية»، أو وصف لينا المشكل في الطلب.</p><button className="button button-outline" onClick={() => { setFilter('all'); setQuery('') }}>عرض كل الخدمات</button></div>}
      <p className="price-note">الأثمنة إرشادية بالدرهم المغربي (MAD). الثمن النهائي كيتحدّد بعد التشخيص، حسب الموديل والقطع اللازمة.</p>
    </div>
  </section>
}
