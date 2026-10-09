import { useEffect, useState } from 'react'
import { Menu, MessageCircle, X } from 'lucide-react'
import { Brand } from './Brand'

const links = [
  { href: '#services', label: 'الخدمات' },
  { href: '#atelier', label: 'كيفاش كنخدمو' },
  { href: '#faq', label: 'أسئلة شائعة' },
  { href: '#contact', label: 'تواصل معنا' },
]
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMenuOpen(false); document.getElementById('menu-toggle')?.focus() }
    }
    if (menuOpen) window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menuOpen])
  return <header className="site-header">
    <div className="container header-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="القائمة الرئيسية">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}</nav>
      <a className="button button-blue header-cta" href="#request"><MessageCircle size={18} /> طلب إصلاح</a>
      <button id="menu-toggle" className="icon-button menu-toggle" aria-label={menuOpen ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </div>
    {menuOpen && <nav id="mobile-menu" className="container mobile-nav" aria-label="قائمة الهاتف">{links.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}</nav>}
  </header>
}
