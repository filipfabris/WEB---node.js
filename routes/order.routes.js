// potrebno napisati

const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', async function (req, res) {

    const categories = (await db.query('SELECT * FROM categories')).rows;
    const items = (await db.query('SELECT * FROM inventory')).rows;


    // Iteracija po kategorijama i njihovo dodavanje.
    for (const category of categories) {
        category.items = items.filter(item => (item.categoryid === category.id));
        // console.log("OVO JEasdddddd " + JSON.stringify(category.items));
    }
    // console.log(categories);
    // console.log(items);

    res.render('order', {
        title: 'Order',
        linkActive: 'order',
        categories: categories,
    });

});

module.exports = router;