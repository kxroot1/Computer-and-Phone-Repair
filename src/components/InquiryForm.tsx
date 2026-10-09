import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Check, CheckCircle2, Copy, LoaderCircle, MessageCircle, LockKeyhole, ClipboardCheck } from 'lucide-react'
import { business } from '../config/business'
import { services, formatPrice } from '../data/services'
import { buildInquiryMessage, buildWhatsAppUrl, contactOptions, deviceOptions, normalizeWhatsAppNumber, validateInquiry } from '../lib/whatsapp'
import type { Inquiry, InquiryErrors } from '../lib/whatsapp'

type Props = { selectedServiceId: string; selectionVersion: number }
const initialInquiry: Inquiry = { name: '', device: '', model: '', serviceId: 'diagnostic', details: '', contactMethod: 'whatsapp', contactNumber: '' }
export function InquiryForm({ selectedServiceId, selectionVersion }: Props) {
  const [inquiry, setInquiry] = useState<Inquiry>(initialInquiry)
  const [errors, setErrors] = useState<InquiryErrors>({})
  const [preparedMessage, setPreparedMessage] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const resultRef = useRef<HTMLDivElement>(null)
  const selectedService = services.find(service => service.id === inquiry.serviceId)
  const configured = normalizeWhatsAppNumber(business.whatsappNumber) !== null
  useEffect(() => {
    const service = services.find(item => item.id === selectedServiceId)
    if (!service) return
    setInquiry(current => ({ ...current, serviceId: service.id, device: service.device ?? current.device }))
    setPreparedMessage(''); setErrors({}); setCopyState('idle')
    document.getElementById('inquiry-name')?.focus({ preventScroll: true })
  }, [selectedServiceId, selectionVersion])
  useEffect(() => { if (preparedMessage) resultRef.current?.focus({ preventScroll: true }) }, [preparedMessage])
  function update(field: keyof Inquiry, value: string) {
    setInquiry(current => ({ ...current, [field]: value }))
    setErrors(current => ({ ...current, [field]: undefined, ...(field === 'contactMethod' ? { contactNumber: undefined } : {}) }))
    setPreparedMessage(''); setCopyState('idle')
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateInquiry(inquiry, services)
    setErrors(nextErrors)
    const firstError = (Object.keys(nextErrors) as (keyof Inquiry)[])[0]
    if (firstError) { document.getElementById(`inquiry-${firstError}`)?.focus(); return }
    const message = buildInquiryMessage(inquiry, business.name, services)
    const url = buildWhatsAppUrl(business.whatsappNumber, message)
    setPreparedMessage(message); setWhatsappUrl(url); setCopyState('idle')
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }
  async function copyMessage() {
    setCopyState('loading')
    try { await navigator.clipboard.writeText(preparedMessage); setCopyState('success') }
    catch { setCopyState('error') }
  }
  function fieldProps(field: keyof Inquiry) {
    return { id: `inquiry-${field}`, name: field, value: inquiry[field], 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `error-${field}` : undefined }
  }
  const fieldError = (field: keyof Inquiry) => errors[field] ? <span className="field-error" id={`error-${field}`}>{errors[field]}</span> : null
  return <section className="request-section section-space" id="request" aria-labelledby="request-title"><div className="container contact-layout">
    <div className="contact-copy"><p className="eyebrow"><span className="section-number" dir="ltr">03 /</span> طلب إصلاح</p><h2 id="request-title">خلّي الخطوة الأولى<br /><span>علينا.</span></h2><p>عطينا شوية تفاصيل على جهازك والمشكل.<br className="desktop-break" /> نكمّلو الحديث على WhatsApp ونحدّدو<br className="desktop-break" /> كيفاش نقدرو نعاونوك.</p><div className="contact-points"><div><ClipboardCheck size={22} /><span>تقدير واضح قبل أي تدخل</span></div><div><MessageCircle size={22} /><span>تواصل مباشر، بلا تعقيد</span></div></div><div className="request-footnote"><LockKeyhole size={19} /><p>ما تحتاجش تشارك كلمات السر أو ملفاتك هنا.<br />غير المعلومات اللي تساعدنا نفهمو العطل.</p></div><span className="request-wordmark" dir="ltr" aria-hidden="true">{business.name}<span> /</span></span></div>
    <div className="form-card"><div className="form-heading"><div><MessageCircle size={21} /><h3>طلب تشخيص لجهازك</h3></div><span>دقيقة للبداية</span></div><p className="form-intro">الحقول بعلامة * ضرورية.</p><form noValidate onSubmit={submit}>
      <div className="form-grid"><div className="form-field"><label htmlFor="inquiry-name">الاسم ديالك <span aria-hidden="true">*</span></label><input {...fieldProps('name')} dir="auto" placeholder="الاسم الكامل" autoComplete="name" required maxLength={80} onChange={event => update('name', event.target.value)} />{fieldError('name')}</div><div className="form-field"><label htmlFor="inquiry-device">نوع الجهاز <span aria-hidden="true">*</span></label><select {...fieldProps('device')} required onChange={event => update('device', event.target.value)}><option value="">اختار الجهاز</option>{deviceOptions.map(device => <option key={device.value} value={device.value}>{device.label}</option>)}</select>{fieldError('device')}</div></div>
      <div className="form-field"><label htmlFor="inquiry-model">الماركة والموديل <span aria-hidden="true">*</span></label><input {...fieldProps('model')} dir="auto" placeholder="مثلاً: Lenovo ThinkPad T14، Samsung A54" required maxLength={100} onChange={event => update('model', event.target.value)} />{fieldError('model')}</div>
      <div className="form-field"><label htmlFor="inquiry-serviceId">الخدمة اللي تحتاج</label><select {...fieldProps('serviceId')} onChange={event => update('serviceId', event.target.value)}><option value="diagnostic">ما متأكدش — تشخيص عام</option>{services.map(service => <option key={service.id} value={service.id}>{service.title}</option>)}</select>{fieldError('serviceId')}</div>
      <div className="form-field"><div className="label-row"><label htmlFor="inquiry-details">شنو المشكل؟ <span aria-hidden="true">*</span></label><span dir="ltr">{inquiry.details.length} / 1000</span></div><textarea {...fieldProps('details')} dir="auto" rows={3} required minLength={10} maxLength={1000} placeholder="وصف لينا شنو كيوقع، ومن إمتى بدا المشكل…" onChange={event => update('details', event.target.value)} />{fieldError('details')}</div>
      <fieldset className="contact-method"><legend>كيفاش تفضّل نتواصلو معاك؟ <span aria-hidden="true">*</span></legend><div className="contact-options">{contactOptions.map((option, index) => <label key={option.value} className={inquiry.contactMethod === option.value ? 'selected' : ''}><input id={index === 0 ? 'inquiry-contactMethod' : 'inquiry-contactMethod-phone'} type="radio" name="contactMethod" value={option.value} checked={inquiry.contactMethod === option.value} aria-describedby={errors.contactMethod ? 'error-contactMethod' : undefined} onChange={event => update('contactMethod', event.target.value)} /><span>{option.label}</span></label>)}</div>{fieldError('contactMethod')}</fieldset>
      {inquiry.contactMethod === 'phone' && <div className="form-field"><label htmlFor="inquiry-contactNumber">رقم التواصل بصيغة دولية <span aria-hidden="true">*</span></label><input {...fieldProps('contactNumber')} type="tel" dir="ltr" autoComplete="tel" placeholder="رقمك مع رمز البلد" required maxLength={30} onChange={event => update('contactNumber', event.target.value)} />{fieldError('contactNumber')}</div>}
      {selectedService && <div className="estimate-note"><span>{selectedService.price !== undefined ? 'ثمن إرشادي، ابتداءً من' : 'ثمن الخدمة'}</span><strong dir={selectedService.price !== undefined ? 'ltr' : undefined}>{selectedService.price !== undefined ? formatPrice(selectedService.price) : 'حسب التشخيص'}</strong><small>التقدير النهائي بموافقتك بعد الفحص.</small></div>}
      {Object.values(errors).some(Boolean) && <p className="error-summary" role="alert">راجع الحقول المشار ليها قبل ما تكمل.</p>}
      <button className="button button-blue form-submit" type="submit"><MessageCircle size={21} />{configured ? 'نكمل على WhatsApp' : 'جهّز طلب الإصلاح'}</button><p className="form-privacy">الطلب كيتجهّز كرسالة WhatsApp. كتأكد الإرسال بنفسك.<br />المعلومات ما كتتخزّنش في هاد الموقع.</p>
    </form>
    {preparedMessage && <div className="inquiry-result" ref={resultRef} tabIndex={-1} aria-labelledby="result-title"><div className="result-heading"><CheckCircle2 size={23} /><h3 id="result-title">الرسالة ديالك واجدة.</h3></div><p>{whatsappUrl ? 'كمّل الإرسال في WhatsApp. إذا ما تفتحاتش النافذة، استعمل الرابط لتحت. الطلب ما كيأكدش موعد.' : 'رقم WhatsApp غير مفعّل حالياً. تقدر تنسخ الرسالة؛ ما ترسل حتى طلب.'}</p><pre tabIndex={0} aria-label="الرسالة المحضّرة" dir="auto">{preparedMessage}</pre><div className="result-actions"><button className="button button-outline" type="button" onClick={copyMessage} disabled={copyState === 'loading'}>{copyState === 'loading' ? <LoaderCircle className="spin" size={17} /> : copyState === 'success' ? <Check size={17} /> : <Copy size={17} />}{copyState === 'success' ? 'تم نسخ الرسالة' : copyState === 'loading' ? 'جاري النسخ…' : 'نسخ الرسالة'}</button>{whatsappUrl && <a className="text-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer">فتح WhatsApp</a>}</div><p className="copy-feedback" role="status">{copyState === 'success' ? 'تقدر دابا تلصق الرسالة في المحادثة.' : copyState === 'error' ? 'النسخ التلقائي ما خدمش. اختار النص لفوق وانسخو يدوياً.' : ''}</p></div>}
    </div>
  </div></section>
}
