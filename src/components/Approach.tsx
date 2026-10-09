import { ClipboardCheck, MessageCircle, ScanLine, Wrench, BadgeCheck } from 'lucide-react'
const steps = [
  { icon: MessageCircle, title: 'تواصل معنا', description: 'وصف لينا جهازك والمشكل عبر WhatsApp.' },
  { icon: ScanLine, title: 'نشخّصو العطل', description: 'نفحصو الجهاز ونحدّدو شنو يحتاج.' },
  { icon: ClipboardCheck, title: 'نعطيوك تقدير', description: 'الثمن، القطع والمدة المتوقعة بكل وضوح.' },
  { icon: BadgeCheck, title: 'ناخدو موافقتك', description: 'أنت اللي كتقرر قبل ما نبداو أي إصلاح.' },
  { icon: Wrench, title: 'نصلحو ونجرّبو', description: 'نكملو الإصلاح ونتحققو من الجهاز معاك.' },
]
export function Approach() {
  return <section className="approach-section section-space" id="atelier" aria-labelledby="approach-title"><div className="container">
    <div className="section-heading"><div><p className="eyebrow"><span className="section-number" dir="ltr">02 /</span> كيفاش كنخدمو</p><h2 id="approach-title">من أول رسالة،<br /><span>كل خطوة واضحة.</span></h2></div><p>بلا تعقيد، وبلا إصلاح بلا موافقتك.<br />ها كيفاش كندوزو من المشكل للحل.</p></div>
    <ol className="steps-list">{steps.map((step, index) => <li className="step" key={step.title}><div className="step-top"><span className="step-icon"><step.icon size={25} strokeWidth={1.6} /></span><span className="step-number" dir="ltr">0{index + 1}</span></div><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
  </div></section>
}
