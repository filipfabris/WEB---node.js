//potrebno napisati

const express = require('express');
const router = express.Router();
const db = require('../db');



router.get('/:id', async function (req, res) {

    let id = parseInt(req.params.id);

    const items = (await db.query('SELECT * FROM inventory')).rows;
    let item = items.filter(tempItem => (tempItem.id === id));
    item = item[0];



    const categories = (await db.query('SELECT * FROM categories')).rows;
    let category;

    for (const tempCategory of categories) {
        if (tempCategory.id === item.categoryid) {
            // console.log("JSSSSSSSSSSSSSSSSSSSSSSSs")
            category = tempCategory;
            break;
        }
    }
    console.log(category);

    if (item) {
        res.render('item', {
            title: item.name,
            linkActive: 'item',
            item: item,
            category: category,
        });
    } else {
        res.status(404)
            .send("Could not find product");
    }
});

module.exports = router;