import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        const loginParams = `?correo=${correo}&contrasena=${contrasena}`;
    
        fetch(`http://localhost:3001/login${loginParams}`, {
            method: 'GET', // Cambia a GET si tu servidor espera solicitudes GET
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            navigate('/feed');
        })
        .catch(error => {
            setError('Correo o contraseña incorrectos');
            console.error('Error logging in:', error);
        });
    };
    

    const handleRegister = () => {
        
            navigate('/Register');
       
        
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Iniciar Sesión</h2>
            {error && <div style={styles.error}>{error}</div>}
            <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                style={styles.input}
            />
            <button onClick={handleLogin} style={styles.button}>Iniciar Sesión</button>
            <button onClick={handleRegister} style={styles.button}>Registrar</button>

        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width:1700,
        backgroundColor: '#fdece8',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '24px',
        marginBottom: '20px',
        color: 'black',
    },
    input: {
        width: '300px',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
        marginBottom:15,
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
};

export default Login;
