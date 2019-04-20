const express = require('express');
const router = express.Router();
const Category = require('../../models/admin-model-Category');
const {userAuthenticated} = require('../../helpers/authentication');



router.all('/*', (req,res,next)=>{   //userAuthenticated , add to parameter to protect routing

    req.app.locals.layout = 'admin';
    next();

});

router.get('/',(req,res)=>{

    Category.find().then(categories=>{

        res.render('admin-content/admin-categories/index',{categories: categories});
    });
});
 
router.post('/create',(req,res)=>{

    const newCategory = Category({

        name: req.body.name
    });

    newCategory.save().then(savedCategory=>{

        res.redirect('/admin-categories');
    });

});

router.get('/edit/:id',(req,res)=>{

    Category.findOne({_id: req.params.id}).then(category=>{


        res.render('admin-content/admin-categories/edit',{category: category});
    });
});
 
router.put('/edit/:id',(req,res)=>{

    Category.findOne({_id: req.params.id}).then(category=>{

        category.name = req.body.name;
        
        category.save().then(updatedCategory =>{

            res.redirect('/admin-categories');

        });
    });
});
 

router.delete('/:id', (req,res)=>{

    Category.findByIdAndDelete({_id: req.params.id}).then(result=>{

        res.redirect('/admin-categories');
    });
});

module.exports = router;