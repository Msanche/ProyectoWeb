import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Comment {
    id: number;
    id_publicacion: number;
    id_usuario: number;
    comentario: string;
    username: string; // Añadido para mostrar el nombre de usuario
}

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
    comments: number; // Añadido para mantener la cantidad de comentarios
}

interface PostProps {
    username: string;
    imageSrc: string;
    title: string;
    description: string;
    likes: number;
    comments: number;
    id: number;
    onLike: (likeInfo: LikeInfo) => void;
    onUpdateComments: (id: number, commentsCount: number) => void;
}

const Post: React.FC<PostProps> = ({ username, imageSrc, title, description, likes, comments, id, onLike, onUpdateComments }) => {
    const [liked, setLiked] = useState<boolean>(false);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [newComment, setNewComment] = useState<string>('');
    const [commentsList, setCommentsList] = useState<Comment[]>([]);

    const handleLike = () => {
        onLike({ id: id, liked: !liked });
        setLiked(!liked);
    };

    const handleCommentButtonClick = () => {
        setShowComments(!showComments);
        if (!showComments) {
            fetchComments();
        }
    };

    const fetchComments = () => {
        fetch(`http://localhost:3001/comentarios/${id}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                setCommentsList(data);
                onUpdateComments(id, data.length); // Actualizar la cantidad de comentarios
            })
            .catch(error => console.error('Error fetching comments:', error.message));
    };

    const handleAddComment = () => {
        if (newComment.trim() === '') return;

        const commentData = {
            id_publicacion: id,
            id_usuario: 1, // Aquí puedes usar el ID del usuario autenticado
            comentario: newComment,
        };

        fetch('http://localhost:3001/comentario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json(); // Esperamos un JSON con el comentario añadido
        })
        .then((newComment) => {
            setNewComment('');
            setCommentsList([...commentsList, newComment]);
            onUpdateComments(id, commentsList.length + 1); // Actualizar la cantidad de comentarios
        })
        .catch(error => {
            console.error('Error adding comment:', error);
        });
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
                    <button style={styles.buton} role="img" aria-label="comments" onClick={handleCommentButtonClick}>💬 {comments} comments</button>
                </div>
            </div>
            {showComments && (
                <div style={styles.commentsSection}>
                    <div style={styles.addComment}>
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment"
                            style={styles.commentInput}
                        />
                        <button onClick={handleAddComment} style={styles.commentButton}>Comment</button>
                    </div>
                    <div style={styles.commentsList}>
                        {commentsList.map(comment => (
                            <div key={comment.id} style={styles.comment}>
                                <strong>{comment.username}</strong>: {comment.comentario}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Feed: React.FC = () => {
    const [publicaciones, setPublicaciones] = useState<Publicacion[]>([]);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect (() => {
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
        const idPublicacion = likeInfo.id;

        fetch('http://localhost:3001/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_publicacion: idPublicacion,
                id_usuario: 1,
                liked: likeInfo.liked,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al dar like/quitar like');
            }
            return response.text();
        })
        .then(() => {
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

    const handleUpdateComments = (id: number, commentsCount: number) => {
        setPublicaciones(prevPublicaciones =>
            prevPublicaciones.map(publi =>
                publi.id === id ? { ...publi, comments: commentsCount } : publi
            )
        );
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
                        </button>
                    </div>
                </div>
            </aside>
            {error && <div style={styles.error}>{error}</div>}
            <main style={styles.mainContent}>
                {publicaciones.map((publi) => (
                    <Post 
                        key={publi.id}
                        username={`Usuario ${publi.id_usuario}`} 
                        title={publi.titulo}
                        imageSrc={publi.imagen ? `http://localhost:3001/${publi.imagen}` : ''} // URL completa para las imágenes
                        description={publi.contenido} 
                        likes={publi.likes}
                        comments={publi.comments}  // Mostrar la cantidad de comentarios real
                        id={publi.id}
                        onLike={handleLike}
                        onUpdateComments={handleUpdateComments}
                    />
                ))}
            </main>
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
    postImage: {
        width: '100%',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    postTitle: {
        fontWeight: 'bold',
        color: 'black',
    },
    postDescription: {
        color: 'black',
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
    buton: {
        backgroundColor: '#ffffff',
        color: 'black',
        borderColor: '#ffffff',
        cursor: 'pointer',
    },
    commentsSection: {
        marginTop: '10px',
        backgroundColor: '#f5f5f5',
        padding: '10px',
        borderRadius: '8px',
        position: 'relative',
        zIndex: 1,
    },
    addComment: {
        display: 'flex',
        gap: '10px',
        marginBottom: '10px',
    },
    commentInput: {
        flex: 1,
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    commentButton: {
        padding: '8px 12px',
        borderRadius: '4px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
    },
    commentsList: {
        maxHeight: '200px',
        overflowY: 'auto',
    },
    comment: {
        padding: '8px 0',
        borderBottom: '1px solid #ccc',
    },
};

export default Feed;

