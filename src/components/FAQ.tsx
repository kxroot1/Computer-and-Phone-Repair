import { Plus, MessageCircle } from 'lucide-react'
const questions = [
  { question: 'واش التشخيص ضروري؟ واش عندو ثمن؟', answer: 'التشخيص كيساعدنا نعرفو السبب الحقيقي قبل اقتراح الإصلاح. إذا كان التشخيص فيه تكلفة، نوضّحوها ليك وناخدو موافقتك قبل ما نبداو. وصف المشكل عبر WhatsApp ما كيعوّضش فحص الجهاز.' },
  { question: 'شحال كياخد الإصلاح من الوقت؟', answer: 'المدة كتختلف حسب العطل، الموديل وتوفّر قطع الغيار. من بعد التشخيص نعطيوك مدة تقديرية، ونخبروك إذا طرأ أي تغيير. ما نحدّدوش موعد تسليم قبل الفحص.' },
  { question: 'شنو نوع قطع الغيار اللي كتستعملو؟', answer: 'نشرح لك الخيارات المتوافقة والمتاحة لجهازك، وجودتها وثمنها قبل الإصلاح. ما كنقدّموش كل قطعة على أنها أصلية؛ مواصفات القطعة كتكون واضحة في التقدير.' },
  { question: 'واش خاصني نوافق على الثمن قبل الإصلاح؟', answer: 'نعم. نعطيوك تقدير بالدرهم المغربي، وننتظرو موافقتك قبل أي إصلاح. وإذا بان تدخل إضافي أو تغيير في الثمن، نتواصلو معاك من جديد قبل المتابعة.' },
  { question: 'واش تقدروا ترجعوا الملفات المحذوفة؟', answer: 'نقدروا نقيّمو إمكانية استرجاع البيانات حسب حالة وحدة التخزين ونوع العطل، لكن النتيجة غير مضمونة. الأفضل توقف استعمال وحدة التخزين وتحافظ على نسخة احتياطية متى أمكن.' },
]
export function FAQ() {
  return <section className="faq-section section-space" id="faq" aria-labelledby="faq-title"><div className="container faq-layout"><div className="faq-intro"><p className="eyebrow"><span className="section-number" dir="ltr">04 /</span> أسئلة شائعة</p><h2 id="faq-title">عندك سؤال؟<br /><span>نوضّحو لك.</span></h2><p>معلومات بسيطة باش تجي<br className="desktop-break" /> وأنت عارف شنو تتوقع.</p><a className="text-link" href="#request"><MessageCircle size={18} /> عندي سؤال آخر</a></div><div className="faq-list">{questions.map(item => <details key={item.question}><summary>{item.question}<Plus size={21} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></div></section>
}
