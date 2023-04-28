import express from "express";
import { CreatePlayer,getPlayers,getPlayerById,EditPlayer,deletePlayer } from "../services/player.service.js";
import {auth} from "../middleware/auth.js";
const router = express.Router()

// router.get("/", function (request, response) {
//     response.send("🙋‍♂️, 🌏 🎊✨🤩Welcome");
//   });

  

router.post("/",auth,async function(request,response){
   try{
    const data =request.body;
    console.log(data);
    const result =await CreatePlayer(data)
    response.send(result)
   }catch(err){
    console.log(err);
   }

})

router.get("/markdown/:id",auth,async function(request,response){
   console.log("Hi")
    try{
        const result = await getPlayers(request);
        console.log(result);
        response.send(result)
    }catch(err){
        console.log(err);
    }
})

router.get("/:id",auth,async function(request,response){
    const {id} = request.params
    const result = await getPlayerById(id)
    result ? response.send(result): response.status(404).send({message:"player not found"})

})

router.put("/:id",auth,async function(request,response){
    const {id} = request.params

    const result=await EditPlayer(id, request)
    console.log(result)
    result ? response.send({message:"Player updated successfully"}): response.status(404).send({message:"player not found"})

})

router.delete("/:id",async function(request,response){
    const {id} = request.params

    const result = await deletePlayer(id)
    result.deletedCount > 0 ? response.send({message:"player deleted successfully"}): response.status(404).send({message:"Player not found"})
})

export default router;