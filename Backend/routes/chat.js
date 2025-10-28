import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";
const router = express.Router();

router.post("/test", async (req, res) => {
  // Your chat handling logic here
  try {
    
    const thread = new Thread({
      threadId: "test123",
      title: "Test Thread"
    });
    const response = await thread.save();
    res.send(response);
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});
 

//Get all threads
router.get("/thread", async (req, res) => {
    try{
        const threads=await Thread.find({}).sort({updatedAt:-1});
        //descending order of updatedAt
        res.json(threads);


    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch threads"});

    }
});

router.get("/thread/:threadId", async (req, res) => {
    const {threadId}=req.params;//destructuring to get threadId from req.params
    try{
        const thread=await Thread.findOne({threadId});
        if(!thread){
            return res.status(404).json({error:"Thread not found"});
        }
        res.json(thread.messages);
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch chat"});
    }
});
router.delete("/thread/:threadId", async (req, res) => {
    const {threadId}=req.params;    
    try{
        const deletedThread=await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            return res.status(404).json({error:"Thread not found"});
        }        
        res.status(200).json({message:"Thread deleted successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to delete thread"});    
    }
});

router.post("/chat", async (req, res) => {
    // Your chat handling logic here
    const { threadId, message } = req.body;
    if(!threadId || !message){
        return res.status(400).json({error:"Thread ID and message are required"});
    }
    try {
        let thread=await Thread.findOne({threadId});
        if(!thread){
            //create a new thread
            thread=new Thread({
                threadId,
                title:message,
                messages:[{role:"user",content:message}]

            });
        }else{
            thread.messages.push({role:"user",content:message});
        }
         const assistantReply=await getGeminiResponse(message);
        thread.messages.push({role:"assistant",content:assistantReply});
        thread.updatedAt=new Date();
        await thread.save();
        res.json({reply:assistantReply});



    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ error: "Failed to process chat" });
    }
    });
export default router;