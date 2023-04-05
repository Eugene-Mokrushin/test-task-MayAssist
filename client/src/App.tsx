import { Route, Routes } from "react-router-dom"
import Main from "./components/Main"
import Apps from "./components/apps/Apps"

function App() {
    return (
        <div className="App" id='mainLayout'>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/apps" element={<Apps />} />
            </Routes>
        </div>
    )
}

export default App
