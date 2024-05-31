import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
    user: User;
    id: number;
}

const PostForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = location.state as { user: User };

    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState<string>('');


    console.log(user);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('titulo', title);
        formData.append('contenido', content);
        formData.append('id_usuario', user.user.id.toString());
        if (image) {
            formData.append('imagen', image);
        }

        try {
            const response = await fetch('http://localhost:3001/addPubli', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                setConfirmationMessage('Publicación agregada correctamente');
                setTitle('');
                setContent('');
                setImage(null);
            } else {
                console.error('Error adding publication:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading data:', error);
        }
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>Ecodentify</h1>
                <hr style={styles.separator} />
            </header>
            <div style={styles.form}>
                <div style={styles.leftPanel}>
                    <div style={styles.formGroup}>
                        <label htmlFor="title" style={styles.label}>¿Sobre qué quieres hablar?</label>
                        <textarea
                            id="title"
                            placeholder="Título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={styles.textarea}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="content" style={styles.label}>¡Ilústranos!</label>
                        <textarea
                            id="content"
                            placeholder="Contenido"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={styles.textarea}
                        />
                    </div>
                </div>
                <div style={styles.rightPanel}>
                    <label htmlFor="image" style={styles.label}>Inserta una imagen</label>
                    <div style={styles.imageUpload}>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={styles.inputFile}
                        />
                        <label htmlFor="image">
                            <img
                                src={image ? URL.createObjectURL(image) : 'https://via.placeholder.com/150'}
                                alt="Upload Placeholder"
                                style={styles.placeholderImage}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <div style={styles.buttonGroup}>
                <button onClick={handleSubmit} style={styles.publishButton}>
                    Publicar
                </button>
                <button onClick={() => navigate('/feed', { state: { user } })} style={styles.exitButton}>
                    Salir
                </button>
            </div>
            {confirmationMessage && <p style={styles.confirmationMessage}>{confirmationMessage}</p>}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        backgroundColor: '#f7e7e1',
        width: 1700,
        height: 850,
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        width: '100%',
        marginBottom: '20px'
    },
    title: {
        margin: 0,
        fontSize: '24px',
        textAlign: 'left',
        color:'black',
    },
    separator: {
        marginTop: '10px',
        border: 'none',
        borderTop: '1px solid #ccc'
    },
    form: {
        display: 'flex',
        width: '100%',
        flex: 1,
        justifyContent: 'space-between',
    },
    leftPanel: {
        flex: 1,
        marginRight: '20px',
        display: 'flex',
        flexDirection: 'column'
    },
    rightPanel: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    formGroup: {
        marginBottom: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        display: 'block',
        marginBottom: '10px',
        fontWeight: 'bold',
        color:'black',

    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        flex: 1
    },
    textarea: {
        width: '100%',
        height: '40px',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
        flex: 1
    },
    imageUpload: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    inputFile: {
        display: 'none'
    },
    placeholderImage: {
        width: '150px',
        height: '150px',
        cursor: 'pointer'
    },
    buttonGroup: {
        bottom: '20px',
        left: '20px',
        display: 'flex'
    },
    publishButton: {
        padding: '10px 20px',
        backgroundColor: '#d4af37',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '10px'
    },
    exitButton: {
        padding: '10px 20px',
        backgroundColor: '#f8f8f8',
        color: 'black',
        border: '1px solid #ccc',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    confirmationMessage: {
        marginTop: '20px',
        color: 'green'
    }
};

export default PostForm;
