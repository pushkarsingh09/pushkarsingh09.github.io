import { useEffect, useState } from "react";
import "./chatlist.css";
import Adduser from "./adduser/Adduser";
import {useUserStore} from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { toast } from "react-toastify";

const Chatlist = () => {
  const [addMode,setAddMode]=useState(false);
  const [chats,setChats]=useState([]);
  const [input,setInput]=useState("");  
  const {currentUser}=useUserStore();
  const { changeChat }=useChatStore();

  useEffect(()=>{
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const item= res.data().chats;

      const promises = item.map(async (item)=>{
        const userDocRef = doc(db, "users", item.recieverId);
        const userDocSnap = await getDoc(userDocRef);

        const user= userDocSnap.data();

        return{...item,user};
      })

      const chatData= await Promise.all(promises)

      setChats(chatData.sort((a,b)=>b.updatedAt - a.updatedAt))
    });

    return ()=>{
      unSub();
    }
  },[currentUser.id]);

  const handleSelect= async (chat)=>{
    
    const userChats= chats.map(item=>{
      const {user, ...rest} = item;
      return rest;
    });

    const chatIndex=userChats.findIndex(item=>item.chatId===chat.chatId);
    userChats[chatIndex].isSeen=true;
    const userChatRef = doc(db,"userchats",currentUser.id);

    try{
      await updateDoc(userChatRef,{
        chats:userChats,
      });
      changeChat(chat.chatId,chat.user)
    }catch(err){
      console.log(err);
      toast.error(err.message);
    }
  };

  const filteredChats= chats.filter(c=>c.user.username.toLowerCase().includes(input.toLowerCase()))
  
  return (
    <div className='chatlist'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" onChange={(e)=>setInput(e.target.value)}/>
        </div>
        <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className="add"
        onClick={()=>setAddMode((prev)=>!prev)}/>
      </div>
      
      {filteredChats.map((chat)=>(
        <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)} style={{
          backgroundColor: chat?.isSeen ? "transparent" : "aquamarine",
        }}>
        <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="" />
        <div className="texts">
          <span>{chat.user.blocked.includes(currentUser.id) ? "user" : chat.user.username}</span>
          <p>{chat.lastMessage}</p>
        </div>
      </div>
      ))}
      
      {addMode && <Adduser/>}
    </div>
  )
}

export default Chatlist