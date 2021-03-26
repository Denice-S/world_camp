const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("./auth/register")
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        //because we are using passport we dont need to user.save() we are using regsister instead which is part of passport
        const registeredUser = await User.register(user, password);
        //have to use passport .login() to straight away lof the user in after registering.
        req.login(registeredUser, err => {
            if (err) return next(err);
        })
        req.flash("success", "Welcome to World Camp");
        res.redirect("/campsites");

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("./auth/login");
}

module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome back");
    //return user to original page or campsites if there isent an return to
    const redirectUrl = req.session.returnTo || "/campsites";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash("success", "You are now Logged Out");
    res.redirect("/campsites");
}