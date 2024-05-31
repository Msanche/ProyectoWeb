import { useNavigate } from 'react-router-dom'
import './App.css'

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

       </nav>
      </div>
     

    </>
  )
}

export default App
