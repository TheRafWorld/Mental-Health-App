import React from 'react'
import '../styles/crisis-banner.css'

const CrisisBanner = () => {
    return (
        <div className="help-banner">
            <strong>Need immediate help?</strong>
            <wbr />
            <span className="mx-2">
                Call or text <strong>988</strong> — Suicide & Crisis Lifeline (24/7)
            </span>
            <wbr />
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">
                Find help internationally
            </a>
        </div>
    )
}

export default CrisisBanner