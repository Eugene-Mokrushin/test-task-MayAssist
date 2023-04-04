import { Route, Routes } from 'react-router-dom'
import Apps from './apps/Apps'

function Main() {
    return (
        <div className='mainWrapper'>
            <Routes>
                <Route path="/apps/*" element={<Apps />} />
            </Routes>
        </div>
    )
}

export default Main