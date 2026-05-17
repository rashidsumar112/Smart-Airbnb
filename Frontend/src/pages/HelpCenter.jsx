import React from 'react'
import StaticPage from './StaticPage'

function HelpCenter() {
    return (
        <StaticPage
            title='Help Center'
            subtitle='Answers for bookings, listings, chat support, and account usage.'
            sections={[
                {
                    title: 'Account help',
                    items: [
                        'Create an account, log in, and update your profile.',
                        'Recover access if you cannot sign in.',
                        'Keep your contact details up to date.'
                    ]
                },
                {
                    title: 'Booking help',
                    items: [
                        'Search listings by city, landmark, or “near me”.',
                        'Review your booking history in My Bookings.',
                        'Contact the host if you need more details before booking.'
                    ]
                }
            ]}
            footerNote='If you still need help, use the chat assistant from the floating button in the footer.'
        />
    )
}

export default HelpCenter