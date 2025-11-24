import './App.css'
import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Automaton Simulator</h1>
      <button type="button" onClick={() => navigate('/simulator')}>Simulator</button>
    </div>
  )
}
