import React from 'react'
import { Link } from 'react-router-dom'
import StaticPage from './StaticPage'

function Support() {
    return (
        <StaticPage
            title='Support Center'
            subtitle='Find help quickly, learn how the platform works, and jump to the policy or FAQ page you need.'
            sections={[
                {
                    title: 'Popular help topics',
                    items: [
                        'How to list a property and manage your listing.',
                        'How bookings, cancellations, and payments work.',
                        'How to contact a host or guest safely.',
                        'How to use the chatbot and browse nearby stays.'
                    ]
                },
                {
                    title: 'Need a quick start?',
                    content: 'Use the following pages to find the exact information you need.'
                }
            ]}
            footerNote={
                <div className='flex flex-wrap gap-[12px]'>
                    <Link to='/help-center' className='text-[#3498db] font-medium hover:underline'>Help Center</Link>
                    <Link to='/safety-liability' className='text-[#3498db] font-medium hover:underline'>Safety & Liability</Link>
                    <Link to='/terms-conditions' className='text-[#3498db] font-medium hover:underline'>Terms & Conditions</Link>
                    <Link to='/privacy-policy' className='text-[#3498db] font-medium hover:underline'>Privacy Policy</Link>
                    <Link to='/faq' className='text-[#3498db] font-medium hover:underline'>FAQ</Link>
                </div>
            }
        />
    )
}

export default Support