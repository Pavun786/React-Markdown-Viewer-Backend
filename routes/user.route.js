import express from "express";
import { generateHashedPassword,createUser,getUserByEmail,findUser,passwordReset} from "../services/user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { client } from "../index.js";
import {ObjectId} from "mongodb";

const router = express.Router();


router.post("/register",async function(request,response){
    const{username,password,email} = request.body;
    
    let user = await getUserByEmail(email)

    if(user){
        response.status(400).send({message:"This Email aleady exist"})
    }else

    {
   const hashPassword= await generateHashedPassword(password, request); 
    
     // const data = request.body;
    const result = await createUser(request)
    result ? response.send({message:"User registerded successfully"}) : response.send({message:"error"})   
    }
})

router.post("/login",async function(request,response){
    
        const{email,password} = request.body
        let user = await getUserByEmail(email)
        if(!user){
            response.status(401).send({ message : "Invalid Credentials"})
        } else {

            const storedDBPassword = user.password;
            const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);
            console.log(isPasswordCheck);
            
            if (isPasswordCheck) {
              const token = jwt.sign({ id : user._id }, process.env.SECRETKEY);
              response.send({ message : "Successful login", token : token, email : user.email });
            } else {
              response.status(401).send({ message: "Invalid Credentials"});
            }
      
          
          
        }
    } );
    
   
   router.post("/forgot",async function(request,response){
      const{email}=request.body;
      let check = await findUser(email);
      if(!check){
        response.status(401).send({ message : "This Email is Not Found"})
      }
      else{
        let token = jwt.sign({ id: check._id }, process.env.SECRETKEY, {
          expiresIn: "10m",
        });
        let url = `${process.env.BASE_URL}/forgot-password-page/${check._id}/${token}`;
  
        let transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 993,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.PASSWORD, // generated ethereal password
          },
        });
        let details = {
          from: process.env.EMAIL, // sender address
          to: check.email, // list of receivers
          subject: "Hii Hello 👋", // Subject line
          text: `Reset link`, // plain text body
          // html: "<b>Hello world?</b>", // html body
          html: `<div style=" border:3px solid blue; padding : 20px;"><span>Password Reset Link : - </span> <a href=${url}> Click
            here !!!</a>
        <div>
            <h4>
                Note :-
                <ul>
                    <li>This link only valid in 10 minitues</li>
                </ul>
            </h4>
        </div>
    </div>`,
        };
  
        await transporter.sendMail(details, (err) => {
          if (err) {
            res.json({
              statusCode: 200,
              message: "it has some error for send a mail",
            });
          } else {
            res.json({
              statusCode: 200,
              message: "Password Reset link send in your mail",
            });
          }
        });
      }
   }) 

   router.post("/passwordReset", async function (request,response){
    // const{id,password} = request.body;
    
    // const hashPassword= await passwordReset(password, request); 
    
    //  // const data = request.body;
    // const result = await passwordResetUpdate(hashPassword)
    // result ? response.send({message:"Password Reset successfully"}) : response.send({message:"error"})   
    
    try {
      let { id, password } = request.body;
      // hash the password
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(password, salt);
      request.body.password = hash;
      // update the password in database
      await client.db("markdown").collection("register").updateOne({ _id: new ObjectId(id) }, {  $set: { password: request.body.password } });
      response.json({
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
    }
   }) 

export default router;




