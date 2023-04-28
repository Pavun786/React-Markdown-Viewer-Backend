import { client } from "../index.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

 export async function generateHashedPassword(password, request) {
    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    return request.body.password = hashPassword;
}


export async function createUser(request) {
    return await client.db("markdown").collection("register").insertOne(request.body);
}

export async function getUserByEmail(email) {
    return await client.db("markdown").collection("register").findOne({ email: email });
}
 
export async function findUser(email) {
    return await client.db("markdown").collection("register").findOne({ email: email });
}

export async function passwordReset(password, request) {
    let salt = await bcrypt.genSalt(10);
    let hashPassword = await bcrypt.hash(password, salt);
    return request.body.password = hashPassword;
}
// export async function passwordResetUpdate(id,request) {
//    
//     return await client.db("markdown").collection("register").updateOne({_id:new ObjectId(id)},{$set:request.body});
// }
 
