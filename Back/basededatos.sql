CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    contrasena TEXT NOT NULL,
    correo VARCHAR(255) NOT NULL
);

CREATE TABLE Fotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imagen MEDIUMBLOB
);

CREATE TABLE Publicaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    contenido VARCHAR(255) NOT NULL,
    id_usuario INT NOT NULL,
    id_imagen INT,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
    FOREIGN KEY (id_imagen) REFERENCES Fotos(id)
);

CREATE TABLE DetalleComentarioPublicacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comentario VARCHAR(90) NOT NULL,
    id_publicacion INT NOT NULL,
    id_usuario INT NOT NULL,

    FOREIGN KEY (id_comentario) REFERENCES Comentario(id),
    FOREIGN KEY (id_publicacion) REFERENCES Publicaciones(id)
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id)

);

CREATE TABLE DetalleMe_gustaPublicacion {
    id	INT AUTO_INCREMENT PRIMARY KEY,
    id_publicacion	INT NOT NULL,
    id_usuario	INT NOT NULL,
    interaccion	INT NOT NULL

}