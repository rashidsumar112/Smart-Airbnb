import React from 'react'
import StaticPage from './StaticPage'

function SafetyLiability() {
    return (
        <StaticPage
            title='Safety & Liability'
            subtitle='Important safety guidance for guests, hosts, and property owners.'
            sections={[
                {
                    title: 'Safety basics',
                    items: [
                        'Verify listing details and ask questions before booking.',
                        'Use official platform communication where possible.',
                        'Meet in safe, public places when needed.'
                    ]
                },
                {
                    title: 'Liability guidance',
                    content: 'Smart Airbnb helps connect users, but property conditions, local rules, and booking outcomes remain the responsibility of the relevant parties and applicable laws.'
                }
            ]}
            footerNote='Always review local regulations, house rules, and booking terms before confirming a stay.'
        />
    )
}

export default SafetyLiability