/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var crypto = require('crypto');
module.exports = {
    connection: 'someMongodbServer',    
    attributes: {
        firstName: {
            type     : 'string',
            required : true
        },
        lastName: {
            type     : 'string',
            required : true
        },
        email: {
            type     : 'string',
            required : true,
            unique   : true
        },
        password: {
            type     : 'string',
            required : true
        },
        salt: {
            type: 'STRING',
        },
        profilePic: {
            type     : 'string',            
        },
        rol: {
            type     : 'string',
            required : true
        },
        projects: {
            collection: 'project',
            via: 'owner'
        },
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        },
        validPassword: function(password) {
            var obj = this.toObject();
            var stringPass = password + this.salt;
            var shasum = crypto.createHash("sha1");
            var cryptoPass = shasum.update(stringPass).digest('hex').toUpperCase();
            console.info(cryptoPass +" - "+this.password);
            return this.password == cryptoPass;

        }

    },
    beforeCreate: function(user, next){
        //salt generation
        var salt = Date.now().toString();
        var shasum = crypto.createHash("sha1");
        user.salt = shasum.update(salt).digest('hex').toUpperCase();
        //password generation
        var stringPass = user.password + user.salt;
        var shasum2 = crypto.createHash("sha1");
        user.password = shasum2.update(stringPass).digest('hex').toUpperCase();                        
        next();
    },
};

