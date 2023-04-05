import { Route, Routes } from "react-router-dom"
import Main from "./components/Main"
import Apps from "./components/apps/Apps"
import SD from "./components/apps/SD/SD"
import NewIssue from "./components/apps/SD/NewIssue"

function App() {
    return (
        <div className="App" id='mainLayout'>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/apps" element={<Apps />} />
                <Route path="/apps/sd" element={<SD />} />
                <Route path="/apps/sd/new_issue" element={<NewIssue />} />
            </Routes>
        </div>
    )
}

export default App
