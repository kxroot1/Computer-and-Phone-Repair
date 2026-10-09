export type ServiceCategory = 'smartphone' | 'computer'
export type Service = {
  id: string
  category: ServiceCategory
  title: string
  frenchTitle: string
  description: string
  price?: number
  icon: 'screen' | 'battery' | 'phone' | 'laptop' | 'desktop' | 'data' | 'settings'
  device?: string
}

/** Fictional starting prices in MAD. Omit price to show diagnosis-based pricing. */
export const services: Service[] = [
  { id: 'laptop', category: 'computer', title: 'إصلاح الحاسوب المحمول', frenchTitle: 'PC PORTABLE', description: 'سخونية، بطء أو مشكل في التشغيل؟ نشخّص السبب ونقترح الإصلاح المناسب.', price: 150, icon: 'laptop', device: 'laptop' },
  { id: 'desktop', category: 'computer', title: 'إصلاح الحاسوب المكتبي', frenchTitle: 'PC DE BUREAU', description: 'من الأعطال الداخلية حتى مشاكل الأداء، نراجع المكوّنات خطوة بخطوة.', price: 120, icon: 'desktop', device: 'desktop' },
  { id: 'phone', category: 'smartphone', title: 'إصلاح الهواتف', frenchTitle: 'SMARTPHONE', description: 'مشاكل الشحن، الصوت أو الكاميرا. كل عطل كيبدأ بتشخيص دقيق.', price: 100, icon: 'phone', device: 'smartphone' },
  { id: 'screen', category: 'smartphone', title: 'تبديل الشاشة', frenchTitle: 'REMPLACEMENT ÉCRAN', description: 'شاشة مكسورة أو لمس ما كيستجبش؟ نوضّح لك خيارات الشاشة المتوافقة.', price: 250, icon: 'screen', device: 'smartphone' },
  { id: 'battery', category: 'smartphone', title: 'تبديل البطارية', frenchTitle: 'BATTERIE', description: 'البطارية كتسالي بسرعة؟ نفحص حالتها ونقترح بديلاً مناسباً لجهازك.', price: 180, icon: 'battery', device: 'smartphone' },
  { id: 'system', category: 'computer', title: 'حل مشاكل البرامج', frenchTitle: 'LOGICIEL & SYSTÈME', description: 'أخطاء النظام، بطء البرامج أو مشاكل التحديث، مع توضيح أثر التدخل على ملفاتك.', price: 100, icon: 'settings' },
  { id: 'data', category: 'computer', title: 'استرجاع البيانات', frenchTitle: 'RÉCUPÉRATION DE DONNÉES', description: 'نقيّم إمكانية استرجاع الملفات حسب حالة وحدة التخزين. النتيجة غير مضمونة.', icon: 'data' },
]

export function formatPrice(price: number) {
  return `${new Intl.NumberFormat('fr-MA').format(price)} MAD`
}
