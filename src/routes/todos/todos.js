const con = require('../../configs/db');
const express = require('express'), router = express.Router();
const user = require('../../index');
const mw = require('../../middleware/auth');

router
    //view all todo
    .get('/', (req, res, next) => {
        con.query(`select * from todo;`, function (err, result, fields) {
            if (err) {
                next(err);
            }
            else {
                res.status(200).json(result);
            }
            res.end();
          });
    })
    //view the todo
    .get('/:id', mw.checkToken,(req, res, next) => {
        con.query(`select * from todo where id = ${req.params.id};`, function (err, result) {
            if (err) {
                next(err);
            }
            else {
                res.status(200).json(result[0]);
            }
            res.end();
          });
    })
    //create a todo
    .post('/', mw.checkToken,(req, res, next) => {
        con.query(`insert into todo (title, description, due_time, user_id) values ("${req.body.title}", "${req.body.description}", "${req.body.due_time}", ${req.body.user_id});`, function (err, result, fields) {
            if (err) {
                next(err);
            } else {
                con.query(`select * from todo where id = ${result.insertId}`, function (err2, result2, fields2) {
                    res.status(201).json(result2[0]);
                    res.end();
                });
            }
        });
    })
    //update a todo
    .put('/:id', mw.checkToken,(req, res, next) => {
        con.query(`UPDATE todo
            SET
                title="${req.body.title}",
                description="${req.body.description}",
                due_time="${req.body.due_time}",
                user_id="${req.body.user_id}",
                status="${req.body.status}"
            WHERE
                id=${req.params.id};`,
            function (err, result, fields) {
            if (err)
                next(err);
            else
                res.status(200).json(req.body);
            res.end();
          });
    })
    //delete a todo
    .delete('/:id', (req, res, next) => {
        con.query(`DELETE FROM todo WHERE id = ${req.params.id};`, function (err, result, fields) {
            if (err)
                next(err);
            else
                res.status(200).json({"msg" : `succesfully deleted record number: ${req.params.id}`});
            res.end();
        });
    })
module.exports = router;