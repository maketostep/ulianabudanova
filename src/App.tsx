import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { categories, projectPhoto, projects, reviews, services, steps } from './data'
import type { Project, ProjectCategory } from './types'
import { useInView } from './hooks/useInView'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useGraphicsFallback } from './hooks/useGraphicsFallback'
import MagneticCursor from './components/MagneticCursor'
import TiltCard from './components/TiltCard'
import ProjectGallery from './components/ProjectGallery'

const HeroScene = lazy(() => import('./components/scenes/HeroScene'))
const MorphScene = lazy(() => import('./components/scenes/MorphScene'))
const PortfolioCarousel = lazy(() => import('./components/scenes/PortfolioCarousel'))
const SnowScene = lazy(() => import('./components/scenes/SnowScene'))

gsap.registerPlugin(ScrollTrigger)

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Пожалуйста, укажите имя.'),
  contact: z.string().trim().min(5, 'Оставьте телефон или Telegram для связи.'),
  project: z.string().trim().min(8, 'Расскажите о задаче хотя бы в двух словах.'),
  consent: z.boolean().refine((value) => value, { message: 'Нужно согласие на обработку данных.' }),
})
type ContactForm = z.infer<typeof contactSchema>

function ScrollFallback({ className = '' }: { className?: string }) {
  return <div className={`scene-fallback ${className}`} aria-hidden="true"><i /><b /><em /></div>
}

function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="brand" href="#top" aria-label="Ульяна Буданова — на главную" data-magnetic>
        <span>Ульяна</span><span>Буданова</span>
      </a>
      <nav className="desktop-nav" aria-label="Основная навигация">
        <a href="#about">Обо мне</a>
        <a href="#services">Услуги</a>
        <a href="#portfolio">Проекты</a>
        <a href="#contacts">Контакты</a>
      </nav>
      <a className="header-cta" href="#contacts" data-magnetic>Обсудить проект <span>↗</span></a>
      <details className="mobile-nav">
        <summary>Меню</summary>
        <nav aria-label="Мобильная навигация" onClick={(event) => event.currentTarget.parentElement?.removeAttribute('open')}>
          <a href="#about">Обо мне</a>
          <a href="#services">Услуги</a>
          <a href="#portfolio">Проекты</a>
          <a href="#contacts">Контакты</a>
        </nav>
      </details>
    </header>
  )
}

function SectionIntro({ eyebrow, title, copy, light = false }: { eyebrow: string; title: ReactNode; copy?: string; light?: boolean }) {
  return (
    <div className={`section-intro ${light ? 'is-light' : ''}`}>
      <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.7 }}>{eyebrow}</motion.p>
      <motion.h2 initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}>{title}</motion.h2>
      {copy && <motion.p className="intro-copy" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }}>{copy}</motion.p>}
    </div>
  )
}

function ProjectVisual({ project }: { project: Project }) {
  return (
    <div className="project-visual" style={{ backgroundColor: project.palette[0] }}>
      <img src={projectPhoto(project.id, project.cover)} alt={project.alt} loading="lazy" decoding="async" />
      <span className="visual-count">{project.photoCount} фото</span>
    </div>
  )
}

function ContactFormBlock() {
  const [isSent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', contact: '', project: '', consent: false },
  })
  const submit = async (_values: ContactForm) => {
    await new Promise((resolve) => window.setTimeout(resolve, 650))
    setSent(true)
    reset()
  }

  if (isSent) {
    return <div className="form-success" role="status"><span>✦</span><h3>Заявка уже у меня</h3><p>Спасибо. Свяжусь с вами, чтобы обсудить идею и сроки.</p><button type="button" className="text-button" onClick={() => setSent(false)}>Отправить ещё одну заявку</button></div>
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate>
      <label>Ваше имя<input {...register('name')} placeholder="Как к вам обращаться?" autoComplete="name" />{errors.name && <small role="alert">{errors.name.message}</small>}</label>
      <label>Телефон или Telegram<input {...register('contact')} placeholder="+7 999 000 00 00" autoComplete="tel" />{errors.contact && <small role="alert">{errors.contact.message}</small>}</label>
      <label>О проекте<textarea {...register('project')} placeholder="Дата, формат, пространство — всё, что уже известно" rows={4} />{errors.project && <small role="alert">{errors.project.message}</small>}</label>
      <label className="consent"><input type="checkbox" {...register('consent')} /><span>Согласен(на) на обработку персональных данных</span></label>
      {errors.consent && <small className="consent-error" role="alert">{errors.consent.message}</small>}
      <button className="button button-dark" type="submit" disabled={isSubmitting} data-magnetic>{isSubmitting ? 'Отправляем…' : 'Оставить заявку'} <span>↗</span></button>
    </form>
  )
}

export default function App() {
  const reducedMotion = useReducedMotion()
  const graphicsFallback = useGraphicsFallback()
  const morphProgress = useRef(0)
  const morphSection = useRef<HTMLElement>(null)
  const stepsSection = useRef<HTMLElement>(null)
  const progressLine = useRef<HTMLSpanElement>(null)
  const christmas = useInView<HTMLElement>('-15% 0px')
  const [activeFilter, setActiveFilter] = useState<'Все' | ProjectCategory>('Все')
  const [openProject, setOpenProject] = useState<Project | null>(null)
  const visibleProjects = activeFilter === 'Все' ? projects : projects.filter((project) => project.category === activeFilter)

  useEffect(() => {
    if (reducedMotion) return
    const lenis = new Lenis({ duration: 1.08, smoothWheel: true, touchMultiplier: 1.1, anchors: { offset: -64 } })
    const tick = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (reducedMotion || !morphSection.current) return
    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: morphSection.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => { morphProgress.current = self.progress },
      })
    })
    return () => context.revert()
  }, [reducedMotion])

  useLayoutEffect(() => {
    if (reducedMotion || !stepsSection.current || !progressLine.current) return
    const context = gsap.context(() => {
      gsap.fromTo(progressLine.current, { scaleX: 0 }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: stepsSection.current, start: 'top 70%', end: 'bottom 58%', scrub: true },
      })
    })
    return () => context.revert()
  }, [reducedMotion])

  return (
    <>
      <MagneticCursor />
      <Header />
      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-noise" />
          <div className="hero-scene" aria-hidden="true">
            {reducedMotion || graphicsFallback ? <ScrollFallback /> : <Suspense fallback={<ScrollFallback />}><HeroScene /></Suspense>}
          </div>
          <div className="hero-content container">
            <motion.p className="hero-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.8 }}>декоратор · художник-оформитель · продюсер</motion.p>
            <h1 id="hero-title"><motion.span initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.2, 0.65, 0.2, 1] }}>Ульяна</motion.span><motion.span initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 1, ease: [0.2, 0.65, 0.2, 1] }}>Буданова</motion.span></h1>
            <motion.p className="hero-lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.58, duration: 1 }}>Декор, который превращает пространство<br className="desktop-only" /> во впечатление</motion.p>
            <motion.a className="button button-gold" href="#contacts" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72 }} data-magnetic>Обсудить проект <span>↗</span></motion.a>
          </div>
          <a className="scroll-cue" href="#about" aria-label="Перейти к разделу Обо мне"><span />Листайте, чтобы почувствовать</a>
          <p className="hero-side-note">Москва · проекты по России</p>
        </section>

        <section id="about" className="about section container" aria-labelledby="about-title">
          <div className="about-portrait-wrap reveal">
            <div className="about-portrait"><img src="/images/portrait.jpg" alt="Ульяна Буданова расставляет лилии на праздничном столе" loading="lazy" decoding="async" /><i /></div>
          </div>
          <div className="about-copy">
            <p className="eyebrow">обо мне</p>
            <h2 id="about-title">Собираю пространства, <em>которые остаются</em> в памяти.</h2>
            <p className="large-copy">Декор, арт-объекты и события для людей, брендов и мест. Веду проект целиком: от первой идеи до демонтажа.</p>
            <p>Слежу за логикой пространства, сценарием гостя, сроками и бюджетом, чтобы вам было спокойно.</p>
            <div className="signature"><span>У</span><p>Ульяна Буданова<br /><small>основательница и автор проектов</small></p></div>
          </div>
        </section>

        <section ref={morphSection} id="services" className="services section" aria-labelledby="services-title">
          <div className="morph-scene" aria-hidden="true">{reducedMotion || graphicsFallback ? <ScrollFallback /> : <Suspense fallback={<ScrollFallback />}><MorphScene progress={morphProgress} /></Suspense>}</div>
          <div className="container services-content">
            <SectionIntro eyebrow="возможности" title={<>От первого штриха <em>до финального света</em></>} copy="Идея, производство и монтаж в одних руках." />
            <div className="services-grid">
              {services.map((service, index) => (
                <motion.div key={service.number} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ delay: (index % 3) * 0.055 }}>
                  <TiltCard className={`service-card ${service.accent ? 'is-accent' : ''}`}>
                    <span className="service-number">{service.number}</span>
                    <span className="service-arrow">↗</span>
                    <h3>{service.title}</h3><p>{service.description}</p>
                    {service.accent && <span className="service-sparkle">✦</span>}
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="portfolio" className="portfolio section" aria-labelledby="portfolio-title">
          <div className="container">
            <SectionIntro eyebrow="избранные проекты" title={<>Не декор ради декора.<br /><em>А впечатление с характером.</em></>} copy="Нажмите на проект, чтобы открыть все фото." />
          </div>
          <div className="carousel-shell">{reducedMotion || graphicsFallback ? <ScrollFallback className="warm" /> : <Suspense fallback={<ScrollFallback className="warm" />}><PortfolioCarousel /></Suspense>}</div>
          <div className="container project-library">
            <div className="filters" role="tablist" aria-label="Фильтр проектов">
              {categories.map((category) => <button key={category} className={activeFilter === category ? 'active' : ''} type="button" role="tab" aria-selected={activeFilter === category} onClick={() => setActiveFilter(category)}>{category}</button>)}
            </div>
            <div className="portfolio-grid" aria-live="polite">
              {visibleProjects.map((project, index) => (
                <motion.article layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className={`project-card project-card-${index % 3}`} key={project.id}>
                  <button type="button" className="project-open" onClick={() => setOpenProject(project)} aria-label={`Открыть фотографии проекта «${project.title}»`}><ProjectVisual project={project} /></button>
                  <div className="project-card-bottom"><span>{project.category}</span>{project.metric && <b>{project.metric}</b>}</div>
                  <h3>{project.title}</h3><p>{project.label}</p>
                </motion.article>
              ))}
            </div>
                      </div>
          <ProjectGallery project={openProject} onClose={() => setOpenProject(null)} />
        </section>

        <section ref={stepsSection} className="process section container" aria-labelledby="process-title">
          <SectionIntro eyebrow="как я работаю" title={<>Чёткий процесс.<br /><em>Свободное творчество.</em></>} />
          <div className="steps-track" aria-hidden="true"><span ref={progressLine} /></div>
          <ol className="steps-list">
            {steps.map((step, index) => <motion.li key={step.number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: index * 0.08 }}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></motion.li>)}
          </ol>
        </section>

        <section className="advantages" aria-labelledby="advantages-title">
          <div className="container advantages-grid">
            <div><p className="eyebrow">почему со мной</p><h2 id="advantages-title">Смело в идеях.<br /><em>Точно в реализации.</em></h2></div>
            <div className="advantage-stat"><strong>4</strong><span>фотозоны за <b>10 дней</b><small>от обращения до монтажа</small></span></div>
            <div className="advantage-stat"><strong>8</strong><span>направлений декора<small>от фотозон до фасадов</small></span></div>
            <div className="advantage-quote">«Красота не должна быть сложной для клиента. Сложным может быть только путь, который я беру на себя.»</div>
            <div className="brands"><p>работала с</p><span>СБЕР</span><span>ЮГСТРОЙИНВЕСТ</span><span>ФОРУМ «ДВИЖЕНИЕ»</span></div>
          </div>
        </section>

        <section ref={christmas.ref} className="christmas section" aria-labelledby="christmas-title">
          <div className="christmas-scene" aria-hidden="true">{christmas.inView && !reducedMotion && !graphicsFallback ? <Suspense fallback={<ScrollFallback />}><SnowScene /></Suspense> : <ScrollFallback />}</div>
          <div className="container christmas-content">
            <motion.p className="eyebrow" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>сезон, который ждут</motion.p>
            <motion.h2 id="christmas-title" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Новогоднее<br /><em>оформление</em></motion.h2>
            <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>Витрины, фасады, ёлки и фотозоны для ресторанов, ТЦ и офисов.</motion.p>
            <a className="button button-ivory" href="#contacts" data-magnetic>Забронировать дату <span>↗</span></a>
          </div>
          <p className="christmas-date">сезон 2026/27</p>
        </section>

        <section className="reviews section container" aria-labelledby="reviews-title">
          <SectionIntro eyebrow="отклики" title={<>Красиво — это когда<br /><em>говорят без слов.</em></>} />
          <div className="reviews-grid">
            {reviews.map((review, index) => <motion.figure key={review.author} className={`review-card review-${index}`} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}><blockquote>{review.text}</blockquote><figcaption><span>{review.author}</span><small>{review.tag}</small></figcaption></motion.figure>)}
          </div>
        </section>

        <section id="contacts" className="contacts" aria-labelledby="contacts-title">
          <div className="container contact-layout">
            <div className="contact-copy"><p className="eyebrow">начать проект</p><h2 id="contacts-title">Расскажите,<br /><em>что хочется создать.</em></h2><p>Хватит даты и пары слов об идее.</p><div className="contact-links"><a href="tel:+79990000000" data-magnetic>+7 999 000-00-00 <span>↗</span></a><a href="https://t.me/" target="_blank" rel="noreferrer" data-magnetic>Telegram <span>↗</span></a><a href="https://wa.me/79990000000" target="_blank" rel="noreferrer" data-magnetic>WhatsApp <span>↗</span></a></div></div>
            <div className="form-card"><p className="form-eyebrow">Заполните форму — отвечу лично</p><ContactFormBlock /></div>
          </div>
        </section>
      </main>
      <footer className="footer"><div className="container"><a className="brand" href="#top"><span>Ульяна</span><span>Буданова</span></a><p>Декор и события, в которые хочется войти.</p><span>© {new Date().getFullYear()}</span></div></footer>
    </>
  )
}
