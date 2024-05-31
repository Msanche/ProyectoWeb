const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para evitar conflictos
    }
});

const upload = multer({ storage });

// Endpoint de login (GET)
app.get('/login', (req, res) => {
    const { correo, contrasena } = req.query;
    
    const getUserSQL = 'SELECT * FROM Usuario WHERE correo = ?';
    db.query(getUserSQL, [correo], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).send('Error fetching user');
        } else if (results.length === 0) {
            res.status(401).send('Correo o contraseña incorrectos');
        } else {
            const user = results[0];
            if (contrasena === user.contrasena) {
                res.json({ message: 'Inicio de sesión exitoso', user });
            } else {
                res.status(401).send('Correo o contraseña incorrectos');
            }
        }
    });
});

// Endpoint de registro (POST)
app.post('/register', (req, res) => {
    const { nombre, fecha_nacimiento, contrasena, correo } = req.body;


        
            const insertUserSQL = 'INSERT INTO Usuario (nombre, fecha_nacimiento, contrasena, correo) VALUES (?, ?, ?, ?)';
            db.query(insertUserSQL, [nombre, fecha_nacimiento,contrasena, correo], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    res.status(500).send('Error inserting user');
                } else {
                    res.json({ message: 'Registro exitoso' });
                }
            });
        
   
});

app.post('/addPubli', upload.single('imagen'), (req, res) => {
    const { titulo, contenido, id_usuario } = req.body;
    const name_imagen = req.file ? req.file.filename : null;

    const insertPubliSQL = 'INSERT INTO publicaciones (titulo, contenido, id_usuario, name_imagen) VALUES (?, ?, ?, ?)';
    db.query(insertPubliSQL, [titulo, contenido, id_usuario, name_imagen], (err, result) => {
        if (err) {
            console.error('Error inserting publication:', err);
            res.status(500).send('Error inserting publication');
        } else {
            console.log('Publication inserted successfully:', result);
            res.send('Publicación agregada correctamente');
        }
    });
});

app.post('/like', (req, res) => {
    const { id_publicacion, id_usuario, liked } = req.body;

    if (liked) {
        const deleteLikeSQL = 'DELETE FROM detalleme_gustapublicacion WHERE id_publicacion = ? AND id_usuario = ?';
        db.query(deleteLikeSQL, [id_publicacion, id_usuario], (err, result) => {
            if (err) {
                console.error('Error deleting like:', err);
                res.status(500).send('Error deleting like');
            } else {
                res.send('Like eliminado exitosamente');
            }
        });
    } else {
        const insertLikeSQL = 'INSERT INTO detalleme_gustapublicacion (id_publicacion, id_usuario, interaccion) VALUES (?, ?, 1)';
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

app.get('/publicaciones', (req, res) => {
    const getPubliSQL = `
    SELECT
    p.id,
    p.titulo,
    p.contenido,
    p.id_usuario,
    p.name_imagen,
    COUNT(dp.id) AS likes,
    u.nombre AS nombre_usuario
FROM
    Publicaciones p
LEFT JOIN DetalleMe_gustaPublicacion dp ON
    p.id = dp.id_publicacion AND dp.interaccion = 1
LEFT JOIN Usuario u ON
    p.id_usuario = u.id
GROUP BY
    p.id
ORDER BY
    p.id
DESC
    ;

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
                name_imagen: publi.name_imagen ? `http://localhost:3001/public/img/${publi.name_imagen}` : null,
                likes: publi.likes,
                name: publi.nombre_usuario,
            })));
        }
    });
});

app.post('/comentario', (req, res) => {
    const { id_publicacion, id_usuario, comentario } = req.body;

    const insertCommentSQL = 'INSERT INTO detallecomentariopublicacion (id_publicacion, id_usuario, comentario) VALUES (?, ?, ?)';
    db.query(insertCommentSQL, [id_publicacion, id_usuario, comentario], (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
            res.status(500).json({ error: 'Error adding comment' });
        } else {
            res.json({ message: 'Comment added successfully' });
        }
    });
});

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
            res.json(results.map(com => ({
                id: com.id,
                comentario: com.comentario,
                id_usuario: com.id_usuario,
                nombre: com.nombre,
                id_publicacion:com.id_publicacion,
            })));
        }
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
