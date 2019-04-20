const express = require('express');
const router = express.Router();
const faker = require('faker');
const Post = require('../../models/admin-model-posts');
const Category = require('../../models/admin-model-Category');
const Comment = require('../../models/model-Comment');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', (req,res,next)=>{    //userAuthenticated , add to parameter to protect routing

    req.app.locals.layout = 'admin'; 
    //here "admin" is the name of handlebar layout for admin
    //loads layout for /* in current path from views/layouts/handlebars/admin.handlebars
    next();

});



router.get('/',(req,res)=>{


    const promises = [

        Post.countDocuments().exec(),
        Category.countDocuments().exec(),
        Comment.countDocuments().exec()

    ];

    Promise.all(promises).then(([postCount, categoryCount, commentCount])=>{

        res.render('admin-content/index',{postCount: postCount, categoryCount: categoryCount, commentCount: commentCount}); 

    });

    // Post.countDocuments().then(postCount=>{

    //     res.render('admin-content/index',{postCount: postCount});   //content of admin's index
    // });

});



router.post('/generate-fake-posts', (req,res)=>{

    for(let i = 0; i < req.body.amount; i++){

        let post = new Post();

        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.random.boolean();
        post.slug = faker.name.title();
        post.body = faker.lorem.sentence();

        post.save((err) => {

            if(err) throw err;
            
            console.log('Random Data Created');

        });

        res.redirect('/admin-posts');
        // post.save().then(savePost=>{

        //     console.log('Random Data Created');
            
        // });

        

    }

});

module.exports = router;