import { Route, Routes } from 'react-router-dom'
import NewIssue from './NewIssue'

function SD() {
    return (
        <div className='SDWrapper'>
            <Routes>
                <Route path={"/new_issue"} element={<NewIssue />} />
            </Routes>
        </div>
    )
}

export default SD