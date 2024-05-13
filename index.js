const express = require('express');
const bodyparser = require('body-parser');
const koneksi = require('./config/database');
const multer = requier('multer');
const path = require('path');
const app = express();
const port = 3000;

//set bodyparser
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

app.use(express.static('./public'))

// Use of multer
var storage = multer.diskstorage({
    destination: (req, file, callback) => {
        callback(null, './public/images')
    },
    filename: (req, file, callback)=>{
        callback(null, file.fieldname +'-'+
         date.no() + path.extname(file.originalname)) 
    }
})

var upload = multer({
    storage: storage
});

// read data / get data
app.get('/api/movie', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM movies';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});



// read data / get data by id
app.get('/api/movie-specific/:id', (req, res) => {
    // buat query sql
    const querySql = 'SELECT judul,rating,deskripsi FROM movies where id=?';

    // jalankan query
    koneksi.query(querySql,req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});



app.post('/api/movies',upload.single('image'),(req,res)=> {
    if (!req.file) {
        console.log("No file upload");
    const data = { ...req.body};
    const querySql = 'INSERT INTO movies (judul, rating, deskripsi, sutradara) VALUES (?,?,?,?);';
    const judul = req.body.judul;
    const rating = req.body.rating;
    const deskripsi = req.body.deskripsi;
    const sutradara = req.body.sutradara;

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(201).json({ success: true, data: rows });
    })
    }else{
        console.log(req.file.filename)
        var imgsrc = 'http://localhost:3000/image' + req.file.filename
        // buat variable penampung data query sql
        const data = { ...req.body};
        const querySql = 'INSERT INTO movies (judul, rating, deskripsi, sutradara) VALUES (?,?,?,?,?);';
        const judul = req.body.judul;
        const rating = req.body.rating;
        const deskripsi = req.body.deskripsi;
        const sutradara = req.body.sutradara;
        const foto = imgsrc;
        
        
    // jalankan query
    koneksi.query(querySql, [judul, rating, deskripsi, sutradara, foto],(err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(201).json({ success: true, data: rows });
    })
       
    };
})

//delete data
app.delete('/api/movies/:id', (req, res) => {
    const querySql = 'DELETE FROM movies WHERE id = ?'
    koneksi.query(querySql, [req.params.id], (err, rows, field) => {
      if (err) {
        return res.status(500).json({ message: 'Ada kesalahan', error: err })
      }
      res.status(200).json({ success: true, message: 'Data berhasil di hapus', data: rows })
    })
  })


  // read data / get data
app.get('/api/movies/:judul', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM movies where judul Like \'%' + req.params.judul + '%\';';
    console.log(querySql);
    // jalankan query
    koneksi.query(querySql,req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
        // res.status(200).array({ rows });
    });
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});