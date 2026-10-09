import { useState } from 'react'
import { Camera, Clock3, Globe, MapPin, MessageCircle, Phone } from 'lucide-react'
import { business } from '../config/business'
import { buildWhatsAppUrl, isConfiguredUrl, normalizeWhatsAppNumber } from '../lib/whatsapp'
import { Brand } from './Brand'

export function Footer() {
  const [contactNotice, setContactNotice] = useState(false)
  const whatsappUrl = buildWhatsAppUrl(business.whatsappNumber, `السلام عليكم ${business.name}، بغيت نسول على تشخيص جهازي.`)
  const phone = normalizeWhatsAppNumber(business.phoneNumber)
  return <footer className="site-footer" id="contact"><div className="container"><div className="footer-heading"><div><p className="eyebrow"><span className="section-number" dir="ltr">05 /</span> تواصل معنا</p><h2>حنا هنا باش نعاونوك.</h2></div>{whatsappUrl ? <a className="button button-blue" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle size={21} /> تواصل عبر WhatsApp</a> : <button className="button button-blue" onClick={() => setContactNotice(true)}><MessageCircle size={21} /> تواصل عبر WhatsApp</button>}</div>{contactNotice && <p className="contact-notice" role="status">رقم WhatsApp غير مفعّل حالياً. <a href="#request">جهّز طلبك وانسخ الرسالة.</a></p>}
    <div className="footer-top"><div className="footer-brand"><Brand light /><p>صيانة واضحة.<br />جهاز يرجع يخدم.</p><div className="footer-social">{Object.entries(business.socialLinks).map(([network, url]) => { const label = network === 'instagram' ? 'Instagram' : 'Facebook'; const Icon = network === 'instagram' ? Camera : Globe; return isConfiguredUrl(url) ? <a key={network} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={20} /></a> : <span key={network} className="social-placeholder" role="img" aria-label={`${label}، الرابط غير مفعّل`}><Icon size={20} /></span> })}</div></div><div className="footer-contact"><h3><MapPin size={19} /> عنوان الورشة</h3><address dir="auto">{business.address}</address><p>{business.country}</p></div><div className="footer-hours"><h3><Clock3 size={19} /> أوقات العمل</h3>{business.openingHours.map(item => <p key={item.days}><span>{item.days}</span><span dir="auto">{item.hours}</span></p>)}</div><div className="footer-phone"><h3><Phone size={19} /> الهاتف وWhatsApp</h3>{phone ? <a className="phone-link" href={`tel:+${phone}`} dir="ltr">{business.phoneNumber}</a> : <p className="placeholder-number" dir="ltr">{business.phoneNumber}</p>}<p className="placeholder-number" dir="ltr">{business.whatsappNumber}</p><a className="text-link" href="#request">طلب تشخيص لجهازك</a></div></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} {business.name}. جميع الحقوق محفوظة.</p><span lang="fr" dir="ltr">Réparer. Comprendre. Reconnecter.</span><a href="#home">الرجوع للفوق</a></div>
  </div></footer>
}
