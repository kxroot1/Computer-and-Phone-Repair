import { Wrench } from 'lucide-react'
import { business } from '../config/business'

export function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand${light ? ' brand-light' : ''}`} href="#home" aria-label={`${business.name}، الرئيسية`} dir="ltr">
    <span className="brand-mark" aria-hidden="true"><Wrench size={23} strokeWidth={2.3} /></span>
    <span>{business.name}<span className="brand-dot">.</span></span>
  </a>
}
