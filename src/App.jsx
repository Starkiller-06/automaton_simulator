import './App.css'
import { useNavigate } from 'react-router-dom';
import PixelBlast from './components/PixelBlast';

export default function App() {
  const navigate = useNavigate();

  return (
    <div style={{ width:'100%', height: '100vh', position: 'fixed', inset: 0, overflow: 'hidden' }}>
      <PixelBlast
        variant="square"
        pixelSize={6}
        color="#B19EEF"
        patternScale={3}
        patternDensity={1.2}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.6}
        edgeFade={0.25}
        transparent
      />
           
      <div className='content-container'>
        <h1 className='app-header'>Automaton Simulator</h1>   
        <button className='simulator-btn' type="button" onClick={() => navigate('/simulator')}>Try it out!</button>
      </div>
      
    </div>
  )
}
