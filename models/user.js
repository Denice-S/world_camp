const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
//this adds onto the schema above a username and password, so we dont have to define it
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
