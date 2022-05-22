//potrebno napisati

const express = require('express');
const router = express.Router();
const db = require('../db');
const {
    body,
    validationResult
} = require('express-validator');



router.get('/', function (req, res) {
    res.render('admin', {
        title: 'Admin',
        linkActive: 'admin',
    });
});



//ADDITEM
router.get('/addItem', async function (req, res) {

    let categories = (await db.query('SELECT * FROM categories')).rows;

    let categorySelect = {
        name: 'categoryId',
        class: 'form-input',
        selected: '3',
        list: categories.map(category => ({
            name: category.name,
            value: category.id,
        }))
    }

    console.log(categorySelect);

    res.render('additem', {
        title: 'Add Item',
        linkActive: 'admin',
        categorySelect: categorySelect,
    });
});


router.post('/additem',
    [
        body('name').trim().isLength({
            min: 3,
            max: 20
        }),
        body('price').trim().isInt({
            min: 0,
            max: 99999
        }).toInt(),
        body('imageUrl').trim().isURL(),

        body("colors").trim().isLength({
            min: 3,
            max: 20
        })
    ],
    async function (req, res) {
        const errors = validationResult(req);
        console.log("Stringify object:")
        console.log(JSON.stringify(req.body));

        if (!errors.isEmpty()) { //To znaci otvori error view ako se to dogodi
            res.render('error', {
                title: 'INPUT ERROR',
                linkActive: 'admin',
                isError: 'true',
                errorsOUT: errors.array(),
            });
        } else {
            try {
                await db.query(
                    'INSERT INTO inventory (name, price, categoryid, imageurl, colors) VALUES ($1, $2, $3, $4, $5)',
                    [
                        req.body.name,
                        req.body.price,
                        req.body.categoryId,
                        req.body.imageUrl,
                        req.body.colors,
                    ],
                );
                res.redirect('/admin');
            } catch (err) {
                res.render('error', {
                    title: 'DATABASE ERROR',
                    linkActive: 'admin',
                    errorsOUT: 'none',
                    errDB: err.message,
                });
            }
        }
    });


//UPDATE ITEM
router.get('/updateitem', async function (req, res) {
    let items = (await db.query("SELECT * FROM INVENTORY")).rows;
    let categories = (await db.query('SELECT * FROM categories')).rows;


    let categorySELECT = {
        name: 'categoryId',
        class: 'form-input',
        id: "categoryId",
        selected: '3',
        list: categories.map(category => ({
            name: category.name,
            value: category.id,
        }))
    }

    let itemsSELECT = {
        name: 'itemId',
        class: 'form-input',
        id: "itemId",
        selected: '3',
        list: items.map(item => ({
            name: item.name,
            value: item.id,
        }))
    }

    res.render('updateitem', {
        title: 'Update item',
        linkActive: 'admin',
        itemsSELECT: itemsSELECT,
        categorySELECT: categorySELECT,
        items: items,
        categories: categories,
    });
});


router.post('/updateitem',
    [body('name').trim().isLength({
            min: 3,
            max: 20
        }),

        body('price').trim().isInt({
            min: 0,
            max: 99999
        }).toInt(),

        body('imageUrl').trim().isURL(),

        body("colors").trim().isLength({
            min: 3,
            max: 20
        })
    ],
    async function (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render('error', {
                title: 'UPDATE INPUT ERROR',
                linkActive: 'admin',
                errorsOUT: errors.array(),
            });
        } else {
            try {
                await db.query(
                    `UPDATE inventory 
                        SET name = $1, price = $2, categoryid = $3, imageurl = $4, Colors = $5
                     WHERE id = $6`,
                    [
                        req.body.name,
                        req.body.price,
                        req.body.categoryId,
                        req.body.imageUrl,
                        req.body.colors,
                        req.body.itemId,
                    ],
                );
                res.redirect('/admin');
            } catch (err) {
                res.render('error', {
                    title: 'UPDATE DATABASE ERROR',
                    linkActive: 'admin',
                    errorsOUT: 'none',
                    errDB: err.message,
                });
            }
        }
    }
);


//DELETE ITEM
router.get('/deleteitem', async function (req, res) {
    let items = (await db.query("SELECT * FROM INVENTORY")).rows;

    res.render('deleteitem', {
        title: 'Delete Item',
        linkActive: 'admin',
        items: items,
    });
});


router.post('/deleteitem',
    [
        body('itemId').toInt().custom(async (id) => {
            const items = (await db.query('SELECT * FROM inventory')).rows;
            const item = items.find(item => (item.id === id));

            if (item === undefined) {
                return Promise.reject();
            }
            return Promise.resolve();
        }),
    ],
    async function (req, res) {
        const errors = validationResult(req);

        console.log(errors);

        if (!errors.isEmpty()) {
            res.render('error', {
                title: 'Delete Item',
                linkActive: 'management',
                errorsOUT: errors.array(),
            });
        } else {
            try {
                await db.query('DELETE FROM inventory WHERE id = $1', [req.body.itemId]);
                res.redirect('/admin');
            } catch (err) {
                res.render('error', {
                    title: 'Delete Item',
                    linkActive: 'admin',
                    errorsOUT: 'none',
                    errDB: err.message,
                });
            }
        }
    }
);

















module.exports = router;