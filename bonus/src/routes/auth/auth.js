const con = require('../../configs/db');
const express = require('express'), router = express.Router();
const user = require('../../index');
const bcrypt = require('bcryptjs');
const saltRound = 10;
const jwt = require('jsonwebtoken');

router
    //view all todo
    .post('/register', (req, res) => {
        const {email, password, name, firstname} = req.body;
        const hashpass = bcrypt.hashSync(password, saltRound);
        con.query(`INSERT INTO user (email, password, name, firstname) VALUES ("${email}", "${hashpass}", "${name}", "${firstname}")`, function (err) {
          if (err) {
            res.status(400).json({"msg": "account already exists"});
          } else {
            let payload = {
              id : req.body.id,
              email : req.body.email,
              password : hashpass,
              name : req.body.name,
              firstname : req.body.firstname
            }
            const token = jwt.sign(payload, process.env.SECRET);
            res.status(200).json({"token": token});
          }
          res.end();
        })
    })
    .post('/login', (req, res) => {
        let mail = req.body.email;
        let password = req.body.password;

        if (mail && password) {
          con.query('SELECT * FROM user WHERE email = ?', [mail], function(error, results, fields) {
                if (results.length > 0) {
                  if (!bcrypt.compareSync(password, results[0].password)) {
                    res.status(400).json({"msg": "Invalid Credentials"});
                  } else {
                    user.id = results[0].id;
                    user.email = results[0].email;
                    user.password = results[0].password;
                    user.created_at = results[0].created_at;
                    user.firstname = results[0].firstname;
                    user.name = results[0].name;
                    let payload = {
                      email : results[0].email,
                      id : results[0].id,
                      password : results[0].password,
                      name : results[0].name,
                      firstname : results[0].firstname
                    }
                    const token = jwt.sign(payload, process.env.SECRET);
                    res.status(200).json({"token": token});
                    res.end();
                  }
                } else {
                  res.status(400).json({"msg": "Invalid Credentials"});
                }
              })
          }
      });
module.exports = router;