const con = require('../../configs/db');
const express = require('express'), router = express.Router();
const user = require('../../index');
const mw = require('../../middleware/auth');

function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }

router
    // view all user informations
    .get('/',mw.checkToken, (req, res) => {
      res.status(200).json(user);
    })

    //view all user tasks
    .get('/todos', mw.checkToken, (req, res) => {
        con.query(`SELECT * FROM todo WHERE user_id=${user.id};`, function(error, results, fields) {
          res.status(200).json(results);
        })
    })

    //view user information
    .get('/:id', mw.checkToken, (req, res, next) => {
        if (isNumber(req.params.id)) {
          con.query(`SELECT * from user WHERE (id = ${req.params.id});`, function (err, result) {
            if (err) {
              next(err);
            }
            else {
              res.status(200).json(result[0]);
            }
            res.end();
          });
        } else {
          con.query(`SELECT * from user WHERE (email='${req.params.id}');`, function (err, result) {
            if (err)
              next(err);
            else
            res.status(200).json(result[0]);
            res.end();
          });
        }
    })

    //update user information
    .put('/:id', mw.checkToken, (req, res, next) => {
        con.query(`UPDATE user SET
            email="${req.body.email}",
            password="${req.body.password}",
            firstname="${req.body.firstname}",
            name="${req.body.name}"
          WHERE
            id=${req.params.id};`,
        function (err, results, fields) {
          if (err)
            next(err);
          else
            con.query(`select * from user where id=${req.params.id}`, function (err2, results2, fields2) {
              if (err)
                next(err);
              else {
                res.status(200).json(results2[0]);
              }
              res.end();
            });
      });
    })

    //delete user
    .delete('/:id', mw.checkToken, (req, res, next) => {
        con.query(`DELETE FROM user WHERE id=${req.params.id};`, function (err, result, fields) {
          if (err)
            next(err);
          else
            res.status(200).json({"msg" : `succesfully deleted record number: ${req.params.id}`});
          res.end();
        });
    })
module.exports = router;