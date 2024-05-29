import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

// Definición de la interfaz para las publicaciones
interface LikeInfo {
    id: number;
    liked: boolean;
}

interface Publicacion {
    id: number;
    titulo: string;
    contenido: string;
    id_usuario: number;
    id_imagen: number | null;
    fecha: string;
    imagen: string | null;
    likes: number;
}

// Definición de la interfaz para las propiedades del componente Post
interface PostProps {
    username: string;
    imageSrc: string;
    title: string;
    description: string;
    likes: number;
    comments: number;
    id: number;
    onLike: (likeInfo: LikeInfo) => void;
}

const Feed: React.FC = () => {
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();


    useEffect(() => {
        fetch('http://localhost:3001/publicaciones')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener las publicaciones');
                }
                return response.json();
            })
            .then(data => {
                setPublicaciones(data);
                setError('');
            })
            .catch(error => {
                console.error('Error fetching publications:', error.message);
                setError('Error al obtener las publicaciones. Por favor, inténtalo de nuevo más tarde.');
            });
    }, []);

    const handleLike = (likeInfo: LikeInfo) => {
        // Enviar solicitud al backend para agregar un like
        const idPublicacion = likeInfo.id;

        fetch('http://localhost:3001/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_publicacion: idPublicacion,
                id_usuario: 1,
                liked: likeInfo.liked, // Enviar información sobre si se está dando/quintando like

            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al dar like/quitar like');
            }
            return response.text();
        })
        .then(() => {
            // Actualizar las publicaciones después de dar like
            fetch('http://localhost:3001/publicaciones')
                .then(response => response.json())
                .then(newPublicaciones => {
                    setPublicaciones(newPublicaciones);
                })
                .catch(error => {
                    console.error('Error fetching publications:', error.message);
                });
        })
        .catch(error => {
            console.error('Error liking publication:', error.message);
        });
        
    };




    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <h1 style={styles.title}>Ecodentify</h1>
                <div style={styles.menuItem}>
                    <div style={styles.icon}><span role="img" aria-label="home">🏠</span></div>
                    <div>
                    <button onClick={() => navigate('/')} style={styles.color}>
                    Home
                </button></div>
                </div>
            </aside>
            {error && <div style={styles.error}>{error}</div>}
            <main style={styles.mainContent}>
                {publicaciones.map((publi) => (
                    <Post 
                        key={publi.id}
                        username={`Usuario ${publi.id_usuario}`} 
                        title={publi.titulo}
                        imageSrc={publi.imagen ? `data:image/jpeg;base64,${publi.imagen}` : ''} 
                        description={publi.contenido} 
                        likes={publi.likes}
                        comments={Math.floor(Math.random() * 20)}  // Placeholder for comments
                        id={publi.id}
                        onLike={handleLike}
                    />
                ))}
            </main>
        </div>
    );
};

const Post: React.FC<PostProps> = ({ username, imageSrc, title, description, likes, comments, id, onLike }) => {
        // Dentro del componente Post
        const [liked, setLiked] = useState<boolean>(false);

        const handleLike = () => {
            onLike({ id: id, liked: !liked });
            setLiked(!liked); // Alternar el estado de liked
        };

    return (
        <div style={styles.post}>
            <div style={styles.postHeader}>
                <div style={styles.postUserInfo}>
                    <img
                        src="https://via.placeholder.com/40"
                        alt="User Avatar"
                        style={styles.userAvatar}
                    />
                    <div>
                        <div style={styles.username}>{username}</div>
                    </div>
                </div>
            </div>
            <div style={styles.postTitle}>{title}</div>
            <div style={styles.postDescription}>{description}</div>
            {imageSrc && <img src={imageSrc} alt="Post" style={styles.postImage} />}
            <div style={styles.postFooter}>
                <div style={styles.postActions}>
                    <button style={styles.buton} role="img" aria-label="likes" onClick={handleLike}>❤️ {likes} likes</button>
                    <span role="img" aria-label="comments">💬 {comments} comments</span>
                </div>
            </div>
        </div>
    );
};
const styles: { [key: string]: React.CSSProperties } = {
    color:{
        backgroundColor:'#fffae6',
        color:'black'
    },
    container: {
        display: 'flex',
        height: '100vh',
        backgroundColor: '#fdece8',
        fontFamily: 'Arial, sans-serif',
        width: 1500
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff6f1',
        padding: '20px',
        width: '250px',
        boxSizing: 'border-box',
        height: '100vh',
        borderRight: '1px solid #ccc'
    },
    title: {
        fontSize: '24px',
        margin: '0 0 20px 0',
        fontWeight: 'bold',
        color: 'black',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        fontSize: '18px',
        cursor: 'pointer',
        backgroundColor: '#fffae6',
        borderRadius: '8px',
        paddingLeft: '10px'
    },
    icon: {
        marginRight: '10px',
    },
    mainContent: {
        padding: '20px',
        overflowY: 'auto',
        flex: 1,
        backgroundColor: '#fdece8',
    },
    post: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        width: '50%',
        height: '20%',
        color: 'black',
    },
    postHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
    },
    postUserInfo: {
        display: 'flex',
        alignItems: 'center',
    },
    userAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        marginRight: '10px',
    },
    username: {
        fontWeight: 'bold',
        color: 'black'
    },
    timeAgo: {
        fontSize: '12px',
        color: 'gray',
    },
    postImage: {
        width: '100%',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    postTitle: {
        fontWeight: 'bold',
        
    },
    postFooter: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    postActions: {
        display: 'flex',
        gap: '10px',
        color: '#777',
        fontSize: '14px',   
        backgroundColor:'#ffffff'
    },
    buton:{
        backgroundColor:'#ffffff',
        color:'black',
        borderColor:'#ffffff'
    },
};

export default Feed;
