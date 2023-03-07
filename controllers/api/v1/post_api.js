const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
module.exports.index = async function(req, res){
    // populate the user of each post
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    });

    return res.json(200, {
        message : "List of posts",
        posts:posts
    })
}

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        // .id means converting the object into string

 //       if(post.user == req.user.id){
            post.remove();
            await Comment.deleteMany({post:req.params.id});


            // if(req.xhr){
            //     return res.status(200).json({
            //         data:{
            //             post_id:req.params.id
            //         },
            //         message: "Post Deleted!"
            //     });
            // }
//            req.flash('success','Post and associated comments Deleted!');
            return res.json(200, {
                message:"Post and associated comments deleted successfully"
            });
//        }else{
//           req.flash('error','you cannot delete this post');
//            return res.redirect('back');
//        }
    }catch(err){
        req.json(500, {
            message: "Internal server error"
        });
        
    }

}