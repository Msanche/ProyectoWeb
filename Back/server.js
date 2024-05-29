const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecoidentify'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
    console.log('Connected to database');
});

app.post('/addPubli', (req, res) => {
    const { titulo, contenido, id_usuario, id_imagen } = req.body;

    console.log('Request body:', req.body); // Log the request body to check if the data is being received

    // First, insert the image into the Fotos table
    const insertImageSQL = 'INSERT INTO Fotos (imagen) VALUES (?)';
    db.query(insertImageSQL, [id_imagen], (err, imageResult) => {
        if (err) {
            console.error('Error inserting image:', err);
            res.status(500).send('Error inserting image');
        } else {
            const imageId = imageResult.insertId;

            // Then, insert the publication into the publicaciones table using the image ID
            const insertPubliSQL = 'INSERT INTO publicaciones (titulo, contenido, id_usuario, id_imagen) VALUES (?, ?, ?, ?)';
            db.query(insertPubliSQL, [titulo, contenido, id_usuario, imageId], (err, result) => {
                if (err) {
                    console.error('Error inserting publication:', err);
                    res.status(500).send('Error inserting publication');
                } else {
                    console.log('Publication inserted successfully:', result);
                    res.send('Publicación agregada correctamente');
                }
            });
        }
    });
});


app.post('/like', (req, res) => {
    const { id_publicacion, id_usuario, liked } = req.body;

    if (liked) {
        // Eliminar el like si ya está presente
        const deleteLikeSQL = `
            DELETE FROM detalleme_gustapublicacion
            WHERE id_publicacion = ? AND id_usuario = ?
        `;
        db.query(deleteLikeSQL, [id_publicacion, id_usuario], (err, result) => {
            if (err) {
                console.error('Error deleting like:', err);
                res.status(500).send('Error deleting like');
            } else {
                res.send('Like eliminado exitosamente');
            }
        });
    } else {
        // Agregar el like si no está presente
        const insertLikeSQL = `
            INSERT INTO detalleme_gustapublicacion (id_publicacion, id_usuario, interaccion) 
            VALUES (?, ?, 1)
        `;
        db.query(insertLikeSQL, [id_publicacion, id_usuario], (err, result) => {
            if (err) {
                console.error('Error inserting like:', err);
                res.status(500).send('Error inserting like');
            } else {
                res.send('Like agregado exitosamente');
            }
        });
    }
});




// Actualizar el endpoint de obtención de publicaciones para incluir el recuento de likes
app.get('/publicaciones', (req, res) => {
    const getPubliSQL = `
        SELECT p.id, p.titulo, p.contenido, p.id_usuario, f.imagen, COUNT(dp.id) AS likes
        FROM Publicaciones p
        LEFT JOIN Fotos f ON p.id_imagen = f.id
        LEFT JOIN detalleme_gustapublicacion dp ON p.id = dp.id_publicacion
        AND dp.interaccion = 1
        GROUP BY p.id
        ORDER BY p.id DESC
    `;

    db.query(getPubliSQL, (err, results) => {
        if (err) {
            console.error('Error fetching publications:', err);
            res.status(500).send('Error fetching publications');
        } else {
            res.json(results.map(publi => ({
                id: publi.id,
                titulo: publi.titulo,
                contenido: publi.contenido,
                id_usuario: publi.id_usuario,
                imagen: publi.imagen ? Buffer.from(publi.imagen).toString('base64') : null,
                likes: publi.likes
            })));
        }
    });
});


// Endpoint para agregar un comentario
app.post('/comentario', (req, res) => {
    const { id_publicacion, id_usuario, comentario } = req.body;

    const insertCommentSQL = `
        INSERT INTO detallecomentariopublicacion (id_publicacion, id_usuario, comentario) 
        VALUES (?, ?, ?)
    `;
    
    db.query(insertCommentSQL, [id_publicacion, id_usuario, comentario], (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
            res.status(500).json({ error: 'Error adding comment' });
        } else {
            res.json({ message: 'Comment added successfully' });
        }
    });
});


// Endpoint para obtener los comentarios de una publicación
app.get('/comentarios/:idPublicacion', (req, res) => {
    const { idPublicacion } = req.params;
    const getCommentsSQL = `
        SELECT c.id, c.comentario, c.id_usuario, u.nombre 
        FROM detallecomentariopublicacion c
        JOIN usuario u ON c.id_usuario = u.id
        WHERE c.id_publicacion = ?
        ORDER BY c.id ASC
    `;
    db.query(getCommentsSQL, [idPublicacion], (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err);
            res.status(500).send('Error fetching comments');
        } else {
            res.json(results);
        }
    });
});


app.listen(3001, () => {
    console.log('Server running on port 3001');
});
