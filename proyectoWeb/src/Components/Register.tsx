import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        const registerData = { nombre, fecha_nacimiento: fechaNacimiento, contrasena, correo };

        fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .then(() => {
            navigate('/');
        })
        .catch(error => {
            setError('Error al registrarse. Por favor, inténtelo de nuevo.');
            console.error('Error registering:', error);
        });
    };

    const handleBack = () => {
        navigate('/');
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Registrarse</h2>
            {error && <div style={styles.error}>{error}</div>}
            <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={styles.input}
            />
            <input
                type="date"
                placeholder="Fecha de Nacimiento"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                style={styles.input}
            />
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
            <button onClick={handleRegister} style={styles.button}>Registrarse</button>
            <button onClick={handleBack} style={styles.button}>Volver</button>

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
        marginBottom:20,
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
};

export default Register;
