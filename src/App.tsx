import { useEffect, useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Services } from './components/Services'
import { Approach } from './components/Approach'
import { InquiryForm } from './components/InquiryForm'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'
import { business } from './config/business'
import type { Service } from './data/services'

export default function App() {
  const [selectedServiceId, setSelectedServiceId] = useState('')
  const [selectionVersion, setSelectionVersion] = useState(0)
  useEffect(() => {
    document.title = `${business.name} — ${business.tagline}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', `${business.name}، ورشة صيانة الحواسيب والهواتف في ${business.country}. اكتشف الخدمات واطلب تشخيص جهازك عبر WhatsApp، مع تقدير واضح قبل الإصلاح.`)
  }, [])
  function selectService(service: Service) {
    setSelectedServiceId(service.id)
    setSelectionVersion(current => current + 1)
    document.getElementById('request')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  return <>
    <a className="skip-link" href="#main">انتقل إلى المحتوى</a>
    <Header />
    <main id="main"><Hero /><Services onSelect={selectService} /><Approach /><InquiryForm selectedServiceId={selectedServiceId} selectionVersion={selectionVersion} /><FAQ /></main>
    <Footer />
  </>
}
