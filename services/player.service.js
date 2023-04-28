import {client} from "../index.js"
import {ObjectId} from "mongodb";

export async function getPlayers(request) {
    return await client.db("markdown").collection("projects").find({email:request.params.id}).toArray();
}
export async function deletePlayer(id) {
    return await client.db("markdown").collection("projects").deleteOne({ _id: new ObjectId(id) });
}
export async function EditPlayer(id, request) {
    return await client.db("markdown").collection("projects").updateOne({ _id: new ObjectId(id) },{ $set: request.body });
}
export async function getPlayerById(id) {
    return await client.db("markdown").collection("projects").findOne({ _id: new ObjectId(id) });
}
export async function CreatePlayer(data) {
    console.log(data)
    return await client.db("markdown").collection("projects").insertOne(data);
    
}
