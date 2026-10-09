import type { Service } from '../data/services'
import { formatPrice } from '../data/services'

export const deviceOptions = [
  { value: 'laptop', label: 'حاسوب محمول' },
  { value: 'desktop', label: 'حاسوب مكتبي' },
  { value: 'smartphone', label: 'هاتف' },
  { value: 'tablet', label: 'جهاز لوحي' },
  { value: 'other', label: 'جهاز آخر' },
]
export const contactOptions = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'مكالمة هاتفية' },
]
export type Inquiry = {
  name: string
  device: string
  model: string
  serviceId: string
  details: string
  contactMethod: string
  contactNumber: string
}
export type InquiryErrors = Partial<Record<keyof Inquiry, string>>

export function validateInquiry(inquiry: Inquiry, services: Service[]): InquiryErrors {
  const errors: InquiryErrors = {}
  if (inquiry.name.trim().length < 2 || inquiry.name.trim().length > 80)
    errors.name = 'دخل الاسم ديالك، بين حرفين و80 حرف.'
  if (!deviceOptions.some(item => item.value === inquiry.device))
    errors.device = 'اختار نوع الجهاز.'
  if (inquiry.model.trim().length < 2 || inquiry.model.trim().length > 100)
    errors.model = 'دخل الماركة والموديل، بين حرفين و100 حرف.'
  if (!services.some(service => service.id === inquiry.serviceId) && inquiry.serviceId !== 'diagnostic')
    errors.serviceId = 'اختار خدمة أو تشخيص عام.'
  if (inquiry.details.trim().length < 10 || inquiry.details.trim().length > 1000)
    errors.details = 'وصف المشكل خاصّو يكون بين 10 و1000 حرف.'
  if (!contactOptions.some(item => item.value === inquiry.contactMethod))
    errors.contactMethod = 'اختار كيفاش بغيتي نتواصلو معاك.'
  if (inquiry.contactMethod === 'phone' && !normalizeWhatsAppNumber(inquiry.contactNumber))
    errors.contactNumber = 'دخل رقم هاتف بصيغة دولية، مع رمز البلد.'
  return errors
}

export function normalizeWhatsAppNumber(value: string): string | null {
  if (!/^[+\d\s().-]+$/.test(value)) return null
  const digits = value.replace(/\D/g, '')
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null
}

export function buildInquiryMessage(inquiry: Inquiry, businessName: string, services: Service[]): string {
  const service = services.find(item => item.id === inquiry.serviceId)
  return [
    `السلام عليكم ${businessName}، بغيت نطلب تشخيص لجهازي.`,
    '',
    `الاسم: ${inquiry.name.trim()}`,
    `نوع الجهاز: ${deviceOptions.find(item => item.value === inquiry.device)?.label ?? inquiry.device}`,
    `الماركة والموديل: ${inquiry.model.trim()}`,
    `الخدمة: ${service?.title ?? 'تشخيص عام'}`,
    ...(service?.price !== undefined ? [`ثمن إرشادي: ابتداءً من ${formatPrice(service.price)} (يتأكد بعد التشخيص)`] : []),
    `المشكل: ${inquiry.details.trim()}`,
    `طريقة التواصل المفضلة: ${contactOptions.find(item => item.value === inquiry.contactMethod)?.label ?? inquiry.contactMethod}`,
    ...(inquiry.contactMethod === 'phone' ? [`رقم التواصل: ${inquiry.contactNumber.trim()}`] : []),
    '',
    'عافاكم وضّحو لي الخطوة الجاية والتقدير ديال الثمن قبل أي إصلاح. شكراً.',
  ].join('\n')
}

export function buildWhatsAppUrl(number: string, message: string): string | null {
  const normalized = normalizeWhatsAppNumber(number)
  return normalized ? `https://wa.me/${normalized}?text=${encodeURIComponent(message)}` : null
}

export function isConfiguredUrl(value: string) {
  try { return new URL(value).protocol === 'https:' } catch { return false }
}
