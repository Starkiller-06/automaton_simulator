import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.jsx';
import Simulations from './pages/Simulator.jsx';

export default function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/Simulator" element={<Simulations />} />
            </Routes>
        </Router>
    )
}