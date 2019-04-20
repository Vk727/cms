const express = require('express');
const router = express.Router();
const Post = require('../../models/admin-model-posts');
const Category = require('../../models/admin-model-Category');
const { isEmpty, uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const {userAuthenticated} = require('../../helpers/authentication');



router.all('/*',(req, res, next) => {   //userAuthenticated , add to parameter to protect routing

    req.app.locals.layout = 'admin';
    next();

    //here "posts" is the name of handlebar layout for admin
    //loads layout for /* in current  path from views/layouts/admin.handlebars

});



router.get('/', (req, res) => {


    Post.find()

        .populate('category')
        .then((posts) => {

        res.render('admin-content/admin-posts/index', { posts: posts });

        //here 'index' is optional as is searches it by default, therefore, will work well without it.

    });
});



router.get('/my-posts',(req,res)=>{

    Post.find({user: req.user.id})
        .populate('category')
        .then(posts=>{

            res.render('admin-content/admin-posts/my-posts',{posts: posts});

        });
        
});




router.get('/create', (req, res) => {

    Category.find().then(categories=>{

        res.render('admin-content/admin-posts/create',{categories: categories});

    });


    // res.render('admin-content/admin-posts/create');
    // i.e., views-> layouts-> admin.handlebars to load layout
    //then loads views->admin-content/admin-posts/create.handlebar
});




router.post('/create', (req, res) => {    //called when create-posts => "submit" button is hit

    let errors = [];

    if (!req.body.title) {

        errors.push({ message: 'Please add a Title' });

    }

    if (!req.body.body){

        errors.push({ message: 'Please add a Description' });

    }

    if (errors.length > 0){

        res.render('admin-content/admin-posts/create', { errors: errors });
    }

    else {

        let filename = '';

        if (!isEmpty(req.files)) {

            let file = req.files.file;
            filename = Date.now() + '-' + file.name;

            file.mv('./public/uploads/' + filename, (err) => {

                if (err) throw err;

            });

        }

        let comment = true;

        if (!req.body.allowComments) {

            comment = false;
        }

        const newPost = new Post({

            user: req.user.id,
            title: req.body.title,
            status: req.body.status,
            allowComments: comment,
            body: req.body.body,
            file: filename,
            category: req.body.category 
            
        });

        newPost.save().then((savedPost) => {

            //console.log(savedPost);
            
            req.flash('success_message',`Post "${savedPost.title}" was created successfully`); //1st arg is name, 2nd arg is actual message
            res.redirect('/admin-posts/my-posts');

            // redirect to all admin-posts/index.handlebars (index.handlebars is taken by default)

        }).catch(error => {

            console.log('Could not save the post');  //delete later, no need if working properly

            //Validation can be performed here too
            //res.render('admin-content/admin-posts/create',{errors : error.errors});

        });
    }

});




router.get('/edit/:id', (req, res) => {

    Post.findOne({ _id: req.params.id }).then(post => {

        Category.find().then(categories=>{

            res.render('admin-content/admin-posts/edit', { post: post, categories: categories });
        });
    });
});



router.put('/edit/:id', (req, res) => {

    Post.findOne({ _id: req.params.id }).then(post => {

        let comment = true;

        if (!req.body.allowComments) {

            comment = false;
        }

        post.user = req.user.id;
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = comment;
        post.body = req.body.body;
        post.category = req.body.category;

        if (!isEmpty(req.files)) {

            let file = req.files.file;
            filename = Date.now() + '-' + file.name;
            post.file = filename;

            file.mv('./public/uploads/' + filename, (err) => {

                if (err) throw err;

            });
        }

        post.save().then(updatedPost => {

            req.flash('success_message',`Post "${updatedPost.title}" was successfully updated`);

            res.redirect('/admin-posts/my-posts');

        });
    });

});



router.delete('/:id', (req, res) => {

    Post.findOne({ _id: req.params.id })
        .populate('comments')
        .then((post) => {

            fs.unlink(uploadDir + post.file, (err) => {

                if(!post.comments.length <1){

                    post.comments.forEach(comment=>{

                        comment.remove();

                    });
                }

                post.delete().then(postDeleted=>{

                    req.flash('success_message',`Post "${post.title}" was successfully deleted`);
                    res.redirect('/admin-posts/my-posts');

                });
            });
        });
});


module.exports = router;