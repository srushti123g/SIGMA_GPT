

import './App.css';
import Chat from './Chat.jsx';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';
import { MyContext } from './MyContext.jsx';
import { useState } from 'react';
import {v1 as uuidv1} from 'uuid';
function App() {
  const [prompt, setPrompt] = useState('');
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);//store previous chats
  const [newChat, setNewChat] = useState(true);//to indicate if a new chat is started  
  const [allThreads, setAllThreads]=useState([]);//to store all chat threads
  const providerValues={
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads
  };
 

  return (
    <>
      <div className="app">
        <MyContext.Provider value={providerValues}>
      
         <Sidebar> </Sidebar>
         <ChatWindow> </ChatWindow>
        </MyContext.Provider>
      </div>
    </>
  )
}

export default App
