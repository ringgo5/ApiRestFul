let express = require('express');
let mysql = require('mysql');

//creamos el objeto de express
let app = express();

//esto lo creo despues de el metodo de añadir articulo:
app.use(express.json());


//creamos la conexion con mysql y la añadimos a una variable:

let conexion = mysql.createConnection({      //aqui solo van los datos de la basde datos

    host: 'localhost',
    user: 'root',
    password: '',  //probamos la conexion con una contraseña y vemos el error, la quitamos probamos y aparece conexion existosa
    database: 'articuloscrudvanilla'

});

//empezamos con las rutas, la primera la de la raíz
app.get('/', function (req, res) {
    res.send('Ruta INICIO')
})

//creamos variable entorno puerto:

let puerto = process.env.PUERTO || 3000; // no me funciona cambiando el puerto por 3000 y configurandolo con set PUERTO=
//al ponerle || le digo que si el puerto que seteo no va , que lo tire por el 3000

app.listen(puerto, function () {

    console.log("servidor ok en puerto: " + puerto)

}); //normalmente se usa puerto 3000,pero el que queramos usando set y despues de crear la vriable de entorno


//probamos la conexion:
conexion.connect(function (error) {

    if (error) {
        throw error;
    } else {
        console.log("conexion exitosa");
    }

})

//Métodos:
//mostrar todos los artículos:


app.get('/api/articulos', (req, res) => {

    conexion.query('SELECT * FROM articulos', (error, filas) => {

        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    })
})

//mostrar sólo un artículo:

app.get('/api/articulos/:id', (req, res) => {   //añadimos el ID que usaremos para mostrar ese artículo

    conexion.query('SELECT * FROM articulos where id = ?', [req.params.id], (error, fila) => {
        //la dif con mostra todos : 
        //añadimos ID,
        //añadimos[req.params.id] con el id, en este caso, que es lo mismo que hayamos puesto arriba en el path
        //importante el req.params para unir los parametros al ?
        //fila en ves de filas--) para probar ponemos api/articulos/2
        if (error) {
            throw error;
        } else {
            //res.send(fila);
            //si quisieramos ver solo la descripcion:
            res.send(fila[0].descripcion); // fila 0 por que sólo es un dato. SOlo me funcion con fila [0].descripcion

            //res.send(fila[3].stock)
            //res.send(fila[0].precio)
        }
    })
})

//metodo para crear un artículo:

app.post('/api/articulos', (req, res) => { //ojo no pongamos /api/articulos/2 que nos dara un error
    //aqui le decimos solo /api/articulos

    let data = { descripcion: req.body.descripcion, precio: req.body.precio, stock: req.body.stock };
    let sql = 'INSERT INTO articulos SET ?';
    conexion.query(sql, data, function (error, results) {

        if (error) {
            throw error;
        } else {
            res.send(results);
        }


    }) // para probarlo, iremos al postman y seleccionaremos post., apretamos body, raw y seleccionamos json
    //escribimos el articulo entre { } y lo añadimos. Para comprobar que lo tenemos, volvemos a poner /api/articulos pero desde get
    //para que nos muestre todos los datos, y vemos como sí lo tenemos(había creado el chicle)
})

//método para editar un artículo:

app.put('/api/articulos/:id', (req, res) => { //como vamos a editar un articulo, necesitaremos seleccionarlo antes mediante id,por esp
    //pongo /:id, al igual que en mostrar un articulo
    let id = req.params.id; //capturamos los valores igual que lo hacíamos en el método de mostrar un artículo para el id
    let descripcion = req.body.descripcion; //capturamos los valores = que hacíamos para crear un artículo con descripcion,precio,stock
    let precio = req.body.precio;
    let stock = req.body.stock;    //OJO CON BODY Y PARAMS que si no, no funciona

    //sentencia de sql:
    let sql = 'UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?';
    conexion.query(sql, [descripcion, precio, stock, id], function (error, results) {

        if (error) {
            throw error;
        } else {
            res.send(results);   //vemos que cambia la consulta(logicamente) y luego metemos los datos a capturar en un array, pero siguiendo
            //la estructura de crear un articulo
        }


    });  //para usar put, ponemos /api/articulo/(id del articulo que queramos editar) y una vez abrimos el articulo lo guardamos 



})

//metodo para eliminar articulo:

app.delete('/api/articulos/:id', (req, res) => {
    conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id], function(error, results){ //ojo con paréntesis y {}
        if (error) {
            throw error;
        } else {
            res.send(results);
        }

    });                                                                      //como es una consulta simple, no creo la variable sql, e introduzco
    //directamente la consulta en query
})