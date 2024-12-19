import { toast } from "react-toastify";
import { useChatStore } from "../../lib/chatStore"
import { auth, db } from "../../lib/firebase"
import { useUserStore } from "../../lib/userStore";
import "./detail.css"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {

  const {chatId,user,iscurrentUserBlocked,isRecieverBlocked,changeBlock}=useChatStore();
  const {currentUser}=useUserStore();

  const handleBlock= async()=>{
    if(!user) return;

    const userDocRef = doc(db,"users",currentUser.id);

    try{
      await updateDoc(userDocRef,{
        blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    }catch(err){
      console.log(err);
      toast.error(err.message);
    }
  }
  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png" alt="" />
                <span>photo_2024.png</span>
              </div>
                <img src="./download.png" alt="" className="icon"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png" alt="" />
                <span>photo_2024.png</span>
              </div>
            <img src="./download.png" alt="" className="icon"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png" alt="" />
                <span>phto_2024.png</span>
              </div>
            <img src="./download.png" alt="" className="icon"/>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092_1280.png" alt="" />
                <span>phto_2024.png</span>
              </div>
            <img src="./download.png" alt="" className="icon"/>
            </div>  
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>{
          iscurrentUserBlocked 
          ? "You are Blocked" 
          : isRecieverBlocked 
          ? "User Blocked" 
          : "Block User"}
        </button>
        <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail