import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState, useContext, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
function ChatWindow() {
    const {prompt, setPrompt, reply, setReply, currThreadId,prevChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen,setIsOpen]=useState(false);    
    const getReply= async()=>{
        setLoading(true);
        setNewChat(false);
        console.log("message", prompt,"threadId", currThreadId);
        const options={
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body:JSON.stringify({
                message:prompt,
                threadId:currThreadId
            })
        };
        try{
            const response=await fetch("http://localhost:3000/api/chat",options);
            const res=await response.json();
            setReply(res.reply);
            console.log(res);

        }catch(err){
            console.log(err);
        }
        setLoading(false);
    }

    //Append new Chat to prevChats
    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats=>(
                [...prevChats,
                {role:"user", content:prompt},
            
                {role:"gpt", content:reply}]
            ));
        }

        setPrompt('');

    },[reply]);

    const handleProfileClick=()=>{
        setIsOpen(!isOpen);
    }


    return (



        <>
        <div className="chatWindow">
            <div className="navbar">
                <span>SigmaGPT<i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>

            </div>
            {

                isOpen &&
                <div className="dropDown">
                  
                    <div className="dropDownItem"><i className="fa-solid fa-gear"> </i>Settings</div>
                     <div className="dropDownItem"><i className="fa-solid fa-cloud-arrow-up"> </i>Upgrade Plan</div>
                    <div className="dropDownItem"><i className="fa-solid fa-arrow-right-from-bracket"> </i>Logout</div>
                </div>
            }
            <Chat>

            </Chat>
            <ScaleLoader color="#fff" loading={loading} size={150} aria-label="Loading Spinner" data-testid="loader">

            </ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything"
                     value={prompt} onChange={(e)=>setPrompt(e.target.value)}
                     onKeyDown={(e)=>e.key==='Enter'?getReply():null}
                     >
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info. See Cookie Preferences.
        

                </p>

            </div>
        </div>

        </>
    )
}

export default ChatWindow;