import { Check, MessageCircle, ScanLine, Wrench } from 'lucide-react'
import { business } from '../config/business'

export function Hero() {
  return <section className="hero-section" id="home" aria-labelledby="hero-title">
    <div className="container hero">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> ورشة صيانة الحواسيب والهواتف</p>
        <h1 id="hero-title">جهازك تعطّل؟<br /><span>نرجّعوه يخدم.</span></h1>
        <p className="hero-description">من الشاشة المكسورة للحاسوب اللي ما كيشعلش.<br className="desktop-break" /> نشرحو لك المشكل، نعطيوك تقدير واضح،<br className="desktop-break" /> ونصلحو غير من بعد موافقتك.</p>
        <div className="hero-actions">
          <a href="#request" className="button button-blue"><MessageCircle size={21} /> طلب إصلاح</a>
          <a href="#services" className="button button-outline-light">شوف الخدمات</a>
        </div>
        <div className="hero-assurances"><span><Check size={17} /> تشخيص قبل الإصلاح</span><span><Check size={17} /> الثمن بموافقتك</span></div>
      </div>
      <div className="hero-visual">
        <div className="workshop-label"><span className="workshop-label-line" /><span dir="ltr">{business.name.toUpperCase()} / SUR L’ÉTABLI</span></div>
        <img className="repair-art" src="/images/workshop.webp" alt="يدان تعملان على إصلاح حاسوب محمول مفتوح فوق طاولة صيانة مرتبة" width="1536" height="1024" fetchPriority="high" />
        <span className="image-index" dir="ltr">01 — L’ATELIER</span>
        <div className="device-note"><span className="device-note-icon"><ScanLine size={27} /></span><div><strong>كل إصلاح كيبدأ بفهم المشكل.</strong><span>تشخيص · تقدير · إصلاح</span></div><Wrench className="device-note-detail" size={20} /></div>
      </div>
    </div>
    <div className="specialties-bar"><div className="container"><span>هواتف <small lang="fr">Smartphones</small></span><span>حواسيب محمولة <small lang="fr">PC portables</small></span><span>حواسيب مكتبية <small lang="fr">PC de bureau</small></span><span>صيانة وبرامج <small lang="fr">Maintenance & logiciels</small></span></div></div>
  </section>
}
