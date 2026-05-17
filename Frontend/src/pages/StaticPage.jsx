import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import { Link } from 'react-router-dom'

function StaticPage({ title, subtitle, sections = [], footerNote }) {
    return (
        <div className='min-h-screen bg-[#f0f4f8]'>
            <Navbar />

            <main className='max-w-[1100px] mx-auto px-[20px] pt-[180px] pb-[80px]'>
                <div className='flex justify-start mb-[16px]'>
                    <Link
                        to='/'
                        onClick={() => window.scrollTo(0, 0)}
                        className='inline-flex items-center gap-[8px] rounded-full bg-gradient-to-r from-[#3498db] to-[#2ecc71] px-[18px] py-[10px] text-[14px] font-semibold text-white shadow-[0_12px_26px_rgba(52,152,219,0.24)] hover:brightness-105 transition-all duration-300'
                    >
                        <span className='text-[16px] leading-none'>←</span>
                        <span>Back to Home</span>
                    </Link>
                </div>

                <div className='bg-white rounded-[28px] shadow-[0_18px_50px_rgba(0,0,0,0.08)] overflow-hidden'>
                    <div className='bg-gradient-to-r from-[#3498db] to-[#2c3e50] px-[28px] py-[28px] text-white'>
                        <p className='text-[13px] uppercase tracking-[0.2em] opacity-80'>Smart Airbnb Support</p>
                        <h1 className='text-[34px] md:text-[44px] font-bold mt-[8px]'>{title}</h1>
                        {subtitle ? <p className='mt-[12px] text-[15px] md:text-[17px] text-white/90 max-w-[760px]'>{subtitle}</p> : null}
                    </div>

                    <div className='px-[22px] py-[26px] md:px-[28px] md:py-[32px] space-y-[22px]'>
                        {sections.map((section, sidx) => (
                            <section key={section.title} className='border border-[#e8eef4] rounded-[22px] p-[18px] md:p-[22px] bg-[#fbfdff]'>
                                <h2 className='text-[22px] font-semibold text-[#1f2d3a]'>{section.title}</h2>
                                {section.content ? <p className='mt-[10px] text-[#52606d] leading-relaxed'>{section.content}</p> : null}

                                {/* If items are provided they can be simple strings (legacy) or objects { question, answer } to render as an accordion */}
                                {section.items?.length ? (
                                    <div className='mt-[14px] grid gap-[10px] md:grid-cols-2'>
                                        {section.items.map((item, idx) => (
                                            <AccordionItem key={typeof item === 'string' ? item : item.question + idx} item={item} />
                                        ))}
                                    </div>
                                ) : null}
                            </section>
                        ))}

                        {footerNote ? (
                            <div className='rounded-[18px] bg-[#eef6fc] border border-[#d7e7f5] px-[18px] py-[16px] text-[#2c3e50]'>
                                {footerNote}
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    )
}

function AccordionItem({ item }) {
    const [open, setOpen] = useState(false)

    // legacy string item
    if (typeof item === 'string') {
        return (
            <div className='rounded-[16px] bg-white border border-[#e8eef4] px-[14px] py-[12px] text-[#34495e]'>
                {item}
            </div>
        )
    }

    const question = item.question || ''
    const answer = item.answer || ''

    return (
        <div className='rounded-[16px] bg-white border border-[#e8eef4] px-[14px] py-[6px] text-[#34495e]'>
            <button
                onClick={() => setOpen((v) => !v)}
                className='w-full flex items-center justify-between gap-4 text-left px-2 py-4'
                aria-expanded={open}
            >
                <span className='font-medium'>{question}</span>
                <span className='text-[20px] leading-none'>{open ? '−' : '+'}</span>
            </button>

            <div className={`mt-2 text-[#52606d] leading-relaxed px-2 pb-4 ${open ? 'block' : 'hidden'}`}>
                {answer}
            </div>
        </div>
    )
}

export default StaticPage