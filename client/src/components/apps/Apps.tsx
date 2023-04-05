import { Route, Routes } from 'react-router-dom'
import SD from './SD/SD'

function Apps() {
    return (
        <div className='appsWrapper'>
            <Routes>
                <Route path={"/sd/*"} element={<SD />} />
            </Routes>
        </div>
    )
}

export default Apps