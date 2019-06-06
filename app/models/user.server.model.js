var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        match: /.+\@.+\..+/,
        index: true
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        validate: [function(password)
        {
            return password.length >= 6;
        },
            'Password should be longer'
        ]
    },
    role: {
        type: String,
        enum:['Admin','Owner','User']
    },
    website: {
        type: String,
        set: function (url) {
            if (!url) {
                return url;
            } else {
                if (url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
                    url = 'http://' + url;
                }
                return url;
            }
        }
    },
    created: {
        type: Date,
        default: Date.now
    }
});
//自定义静态方法
UserSchema.statics.findOneByUsername = function (username,callback) {
    this.findOne({
        username: new RegExp(username, 'i')} , callback) ;
};
//自定义实例方法
UserSchema.methods.authenticate = function (password) {
    return this.password === password;
};

UserSchema.set('toJSON', { getters: true });
mongoose.model('User', UserSchema);