import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    location: { type: String, default: '' },
    status: { type: String, default: 'Enfocado en mis objetivos 🎯' },
    categoryActive: { type: String, default: '' },
    social: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        instagram: { type: String, default: '' },
        github: { type: String, default: '' },
        website: { type: String, default: '' }
    },
    view: { //Types of view: creationDate - dueDate - priority 
        type: Array, default: [{
            name: "creationDate",
            sort: 'desc'
        }]
    }
})

UserSchema.methods.encryptPassword = async function (password) {            //Define a encryptPassword method in the schema
    const salt = await bcrypt.genSalt(10);                                  //Generate a salt (is a string that is combined with the password). The number 10 indicates the number of times that the algorithm runs to generate a salt (Higher number => Better salt => Greater security (but takes longer to execute))
    const hash = await bcrypt.hash(password, salt);                         //With the salt and password, it encrypt the password
    this.password = hash;                                                   //To the UserSchema object in the password input assign the hash
}

UserSchema.methods.matchPassword = async function (password){               //Define a matchPassword method in the schema
    return await bcrypt.compare(password, this.password)                    //Use the 'compare' method of 'bcrypt' for compare the parameter password with it's storage in the DB
}

export default mongoose.model('User', UserSchema)