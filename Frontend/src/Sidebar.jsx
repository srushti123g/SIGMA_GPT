import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from 'uuid';
function Sidebar() {
  const {allThreads,setAllThreads,currThreadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats}=useContext(MyContext);
  const getAllThreads= async()=>{
    try{
      const response=await fetch("https://sigma-gpt-grkq.onrender.com/api/thread");
      const res=await response.json();
      const filteredData=res.map(thread=>({
        threadId:thread.threadId,
        title:thread.title
      }))
      console.log(filteredData);
      setAllThreads(filteredData);
    }catch(err){
      console.log(err);
    }
    //fetch all threads from backend
  };
  useEffect(()=>{
    getAllThreads();
  },[currThreadId]);

  const createNewChat=()=>{
    //logic to create new chat
    setNewChat(true);
    setPrompt('');
    setReply(null);

    setCurrThreadId(uuidv1());
    setPrevChats([]);
    console.log("New Chat Created");
  }
  const changeThread=async(newThreadId)=>{
    setCurrThreadId(newThreadId);
   try{
    const response=await fetch(`http://localhost:3000/api/thread/${newThreadId}`);
    const res=await response.json();
    console.log(res);
    setPrevChats(res);
    setNewChat(false);
    setPrompt('');
    setReply(null);
    

   }catch(err){
    console.log(err);
   }
  }
   const deleteThread=async(threadId)=>{
    try{
     const response=await fetch(`http://localhost:3000/api/thread/${threadId}`,{method:"DELETE"});
     const res=await response.json();
     console.log(res);
     //updated thread rerendering
     setAllThreads(allThreads.filter(thread=>thread.threadId!==threadId));
     if(threadId===currThreadId){
      //if deleted thread is current thread
      createNewChat();
     }

    }catch(err){
      console.log(err);
    }
   }

    return (

        <>
        <section className="sidebar" >
           {/*New Chat Button*/}
           <button onClick={createNewChat}>
            <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo">
            </img>
           <span><i className="fa-solid fa-pen-to-square"></i></span>
           </button>

           {/*Thread*/}
           <ul className="history">
            {
              allThreads?.map((thread,idx)=>(
                <li key={idx}
                onClick={(e)=>changeThread(thread.threadId)}
                className={thread.threadId===currThreadId?"highlighted":""}
                >
                  {thread.title}
                  <i className="fa-solid fa-trash"
                    onClick={(e)=>{
                      e.stopPropagation();//stop event bubbling
                      deleteThread(thread.threadId);
                    }}>
                  </i>
                </li>
              ))
            }
            
            </ul>

              {/*Sign*/}
              <div className="sign">
                <p>By Srushti &hearts;</p>
              </div>
        </section>
        </>
    )}

    export default Sidebar;
