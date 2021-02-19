require('dotenv').config({});
// require => memerlukan
const express = require('express');
const app = express();
const mysql = require('mysql');

const hbs = require('hbs');
const path = require('path');

const bodyParser = require('body-parser');

const { DB_USERNAME, DB_PASSWORD, DB_HOST, DB_DATABASE, PORT } = process.env

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password : DB_PASSWORD,
    database : DB_DATABASE
});

connection.connect((err) => {
    if(err) throw err;
    console.log("Connection is successfully");
})


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }))

// Route Get Categories
app.get('/view/categories', (req, res) => {
    const sql = 'SELECT * FROM categories';

    connection.query(sql, (err, data) => {
        if(err){
            console.log(err)
        }else{
            console.log("Data sebenarnya " + JSON.stringify(data));
            res.render('categories/index', {
                title: 'Kategori',
                categories : data
            });
        }
    })
})

// Route Save Categories
app.post('/view/categories/save', (req, res) => {
    console.log(req);
    const { body } = req;
    // const body = req.body
    const sql = "INSERT INTO categories SET ?";
    connection.query(sql, body, (err, data) => {
        if(err){
            console.log(err)
        }else{
            res.redirect('/view/categories');
        }
    });
})

// Route Update Categories
app.post('/view/categories/update', (req, res) => {
    // const id = req.body.id
    const { id, category_name } = req.body;
    const sql = "UPDATE categories SET category_name=? WHERE id= ?";
    connection.query(sql, [category_name, id], (err, data) => {
        if(err){
            console.log(err)
        }else{
            res.redirect('/view/categories');
        }
    });
})

// Route Delete Categories
app.post('/view/categories/delete', (req, res) => {
    const { id } = req.body;
    const sql = "DELETE FROM categories WHERE id=?";
    connection.query(sql, id, (err, data) => {
        if(err){
            console.log(err)
        }else{
            res.redirect('/view/categories');
        }
    })
})


// Restful API
app.get('/api/categories' , (req, res) => {
    const sql = 'SELECT * FROM categories';
    connection.query(sql, (err, data) => {
        if(err) throw err;
        res.json({
            msg: 'Success',
            status: 200,
            data: data
        });
    });
});

app.post('/api/categories', (req, res) => {
    const { body } = req;

    const sql = "INSERT INTO categories SET ?";
    connection.query(sql, body, (err, data) => {
        if(err) throw err;
        res.json({
            msg : 'Create new data is successfully',
            status: 200
        });
    });
});

app.put('/api/categories/:id', (req, res) => {
    console.log(req);
    const { id } = req.params;
    const { body } = req;

    const sql = "UPDATE categories SET ? WHERE id = ?";
    connection.query(sql, [body ,id], (err, data) => {
        if(err) throw err;
        res.json({
            msg : "Update data is successfully",
            status: 200
        });
    });
});

app.delete('/api/categories/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM categories WHERE id = ?";
    connection.query(sql, id, (err, data) => {
        if(err) throw err;
        res.json({
            msg : 'Delete data is successfully',
            status: 200
        });
    });
});


app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});