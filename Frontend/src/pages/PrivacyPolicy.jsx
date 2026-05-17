import React from 'react'
import StaticPage from './StaticPage'

function PrivacyPolicy() {
    return (
        <StaticPage
            title='Privacy Policy'
            subtitle='How we handle your data, location, and account information.'
            sections={[
                {
                    title: 'Information we use',
                    items: [
                        'Account details you provide when signing up.',
                        'Listing information such as city, landmark, and images.',
                        'Location data only when you choose to use nearby features.'
                    ]
                },
                {
                    title: 'How we use it',
                    content: 'Your information is used to provide search, booking, chatbot, and listing features, improve the experience, and support account functionality.'
                }
            ]}
            footerNote='We aim to keep your data secure and only use it for platform-related features and support.'
        />
    )
}

export default PrivacyPolicy