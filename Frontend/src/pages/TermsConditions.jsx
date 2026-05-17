import React from 'react'
import StaticPage from './StaticPage'

function TermsConditions() {
    return (
        <StaticPage
            title='Terms & Conditions'
            subtitle='Rules for using Smart Airbnb, including account use, listings, and bookings.'
            sections={[
                {
                    title: 'Using the platform',
                    items: [
                        'You must provide accurate information when creating listings or bookings.',
                        'Do not misuse the platform or attempt unauthorized access.',
                        'Respect other users and communicate professionally.'
                    ]
                },
                {
                    title: 'Bookings and content',
                    content: 'Listings, images, and user content may be reviewed or removed if they violate platform policies or create risk for other users.'
                }
            ]}
            footerNote='By using the platform, you agree to follow these terms and any updates posted here.'
        />
    )
}

export default TermsConditions