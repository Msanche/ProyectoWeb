import { useNavigate } from 'react-router-dom'
import './App.css'
import Intro from './public/img/Evidencia1.png';

function App() {
  const navigate = useNavigate();

  return (
    <>
      <div>

       <h1>Selecciona el modo</h1>
       <nav>
        <ul>
          <li>
          <button id='ver' onClick={() => navigate('feed')} >Ver publicaciones</button>
          
          </li>
          <button id='crear' onClick={() => navigate('Publish')}>Crear Publicación  </button>
          
        </ul>
        Image at public/img/Evidencia1.png : <br />
            <img src={Intro} alt="GFG Logo" />
       </nav>
      </div>
     

    </>
  )
}

export default App
