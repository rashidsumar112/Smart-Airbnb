import React from 'react'
import StaticPage from './StaticPage'

function FAQ() {
    return (
        <StaticPage
            title='Frequently Asked Questions'
            subtitle='Quick answers to common questions from guests and hosts.'
            sections={[
                {
                    title: 'Common questions',
                    items: [
                        {
                            question: 'How do I find properties near me?',
                            answer:
                                'Open the Home page and use the search box to enter a city, address, or use the map to browse nearby listings. Apply filters (dates, guests, price) to refine results.'
                        },
                        {
                            question: 'How do I list my property?',
                            answer:
                                'Go to "List Your Property" (or My Listing) and follow the guided form to add photos, description, pricing, and availability. Submit to publish your listing.'
                        },
                        {
                            question: 'How do I check my bookings or listings?',
                            answer:
                                'Visit My Bookings to see upcoming and past reservations. For hosts, go to My Listing to manage each property, view bookings, and update availability.'
                        },
                        {
                            question: 'How do I contact support or the chatbot?',
                            answer:
                                'Use the floating chat button to open the chatbot for instant help, or visit the Help Center page for articles and contact options.'
                        }
                    ]
                },
                {
                    title: 'Answer summary',
                    content: 'Use Home to browse listings, List Your Property to post a new stay, My Bookings to track reservations, and the floating chat button for assistance.'
                }
            ]}
            footerNote='Still stuck? Open the chat assistant or visit the Help Center page for more guidance.'
        />
    )
}

export default FAQ