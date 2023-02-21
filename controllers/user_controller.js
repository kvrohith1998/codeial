const User = require('../models/user');
const fs = require('fs');
const path = require('path');

module.exports.profile = function(req,res){
    User.findById(req.params.id, function(err,user){
        return res.render('user_profile',{
            title : "Profiles",
            profile_user: user
        });
    });
};

module.exports.update = async function(req, res){
    // if(req.user.id == req.params.id){
    //     User.findByIdAndUpdate(req.params.id, req.body, function(err,user){
    //         return res.redirect('back');
    //     });
    // }else{
    //     return res.status(401).send('Unauthorized');
    // }
    if(req.user.id == req.params.id){
        try{
            let user = await User.findById(req.params.id);
            User.uploadAvatar(req,res,function(err){
                if(err) {console.log('****** Multer Error : ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname,'..', user.avatar));
                    }
                    // this is saving thr path of the uploaded file into the avatar field in the usr
                    user.avatar = User.avatarPath + '/' + req.file.filename
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err){
            req.flash('error',err);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized');
        return res.status(401).send('Unauthorized');
    }
}

//render the sign up page
module.exports.signUp = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    })
};

//render the sign in page
module.exports.signIn = function(req,res){

    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    })
};

//get the signup data
module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('error in finding the user in signing up');
            return;
        }
        if(!user){
            User.create(req.body, function(err, user){
                if(err){
                    console.log('error in creating the user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }
    });
}

//sign in and create session
module.exports.createSession = function(req,res){
    //TODO
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

//sign out
module.exports.destroySession = function(req, res){
    req.logout(function(err){
        if(err){
            return next(err);
        }
        req.flash('success','You have logged out');
        return res.redirect('/');
    });
}