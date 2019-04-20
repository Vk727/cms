const express = require('express');
const router = express.Router();
const Post = require('../../models/admin-model-posts');
const Comment = require('../../models/model-Comment');



router.all('/*',(req,res,next)=>{

    req.app.locals.layout = 'admin';
    next();

});



router.get('/',(req,res)=>{

    Comment.find({user: req.user.id}).populate('user')
        .then(comments=>{

        res.render('admin-content/admin-comments/index',{comments: comments});

    });
});



router.post('/',(req,res)=>{

    Post.findOne({_id: req.body.id}).then(post=>{

        const newComment = new Comment({

            user: req.user.id,    //user is coming from the session that is taken care by passport
            body: req.body.body

        });

        post.comments.push(newComment);

        post.save().then(savedPost=>{

            newComment.save().then(saveComment=>{

                req.flash('success_message','Your comment is submitted for review');

                res.redirect(`/post/${post.slug}`);

            });
        });
    });

});



router.delete('/:id',(req,res)=>{

    Comment.findByIdAndDelete(req.params.id).then(deleteItem=>{

        Post.findOneAndUpdate({comments: req.params.id},{$pull: {comments: req.params.id}},(err,data)=>{

            if(err) console.log(err);

            res.redirect('/route-comments');

        });        
    });
});




router.post('/approve-comment',(req,res)=>{ 

    Comment.findByIdAndUpdate(req.body.id,{$set: {approveComment: req.body.approveComment}},(err,result)=>{

        if(err) throw err;
        
        res.send(result);
    });

});



module.exports = router;