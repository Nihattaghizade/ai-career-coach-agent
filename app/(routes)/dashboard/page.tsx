import React from 'react'
import WelcomeBanner from './_comppnents/WelcomeBanner'
import AiTools from './_comppnents/AiTools'
import History from './_comppnents/History'

function Dashboard() {
    return (
        <div>
        <WelcomeBanner /> 
        <AiTools />
        <History />
        </div>
    )
}

export default Dashboard