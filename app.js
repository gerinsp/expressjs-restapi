const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const {
    users
} = require('./models');


const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/users', (req, res) => {
    // Logic untuk mendapatkan semua data user dari database
    users.findAll().then(users => {
        res.json({
            data: users
        });
    });
});

// Get single user by ID
app.get('/users/:id', (req, res) => {
    // Logic untuk mendapatkan data user berdasarkan ID
    users.findAll({
        where: {
            id: req.params.id
        }
    }).then(user => {
        if (!user) {
            res.json({
                message: 'Data user tidak ditemukan.'
            })
        }
        res.json({
            user: user
        });
    })
});

// Create new user
app.post('/users', (req, res) => {
    // Logic untuk menambah data user baru ke database
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;
    const role = req.body.role;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(pass, salt, (err, hash) => {
            users.create({
                name: name,
                email: email,
                password: hash,
                role: role
            }, {
                timestamps: true
            }).then(user => {
                res.json({
                    message: 'Data user berhasil ditambahkan.',
                    data: user
                });
            });
        });
    });
});

// Update existing user
app.put('/users/:id', (req, res) => {
    // Logic untuk mengupdate data user berdasarkan ID
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;
    const role = req.body.role;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(pass, salt, (err, hash) => {
            users.update({
                name: name,
                email: email,
                password: hash,
                role: role
            }, {
                where: {
                    id: req.params.id
                }
            }).then(() => {
                res.json({
                    message: 'Data user berhasil di update.'
                })
            })
        })
    })
});

// Delete user
app.delete('/users/:id', (req, res) => {
    // Logic untuk menghapus data user berdasarkan ID
    users.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => {
        res.json({
            message: 'Data user berhasil dihapus.'
        })
    })
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});