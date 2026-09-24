// import React, { useState, useEffect } from "react";
// import "./sidebar.css";
// import Chatarea from "../chatarea/chatarea";
// import { VscDeveloperTools } from "react-icons/vsc";
// import { IoMdAdd } from "react-icons/io";
// import { FaRegNewspaper } from "react-icons/fa6";
// import { FaHistory } from "react-icons/fa";
// import { VscAccount } from "react-icons/vsc";
// import { BsLayoutTextSidebarReverse } from "react-icons/bs";
// import { FaPencil } from "react-icons/fa6";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import Tools from "../tools/tools";


// function Sidebar() {
//   const [chats, setChats] = useState(() => {
//     const savedChats = localStorage.getItem("cyberai-chats");

//     return savedChats ? JSON.parse(savedChats) : [];
//   });
//   const [activeChat, setActiveChat] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [showTools, setShowTools] = useState(false);

//   const [editingChat, setEditingChat] = useState(null);
//   const [editTitle, setEditTitle] = useState("");

//   useEffect(() => {
//     localStorage.setItem("cyberai-chats", JSON.stringify(chats));
//   }, [chats]);

//   // NEW CHAT
//   const handleNewChat = () => {
//     const newChat = {
//       id: Date.now(),
//       title: "New Chat",
//       messages: [],
//     };

//     setChats((prev) => [newChat, ...prev]);

//     setActiveChat(newChat.id);
//      setShowTools(false);
//   };

//   // CLICK HISTORY CHAT
//   const handleChatClick = (id) => {
//     setActiveChat(id);
//   };

//   // UPDATE CURRENT CHAT
//   const handleUpdateChat = (messages) => {
//     setChats((prevChats) => {
//       return prevChats.map((chat) => {
//         // Only update selected chat
//         if (chat.id !== activeChat) {
//           return chat;
//         }

//         // Get first message that has text
//         const firstMessage = messages.find(
//           (msg) => msg.message && msg.message.trim() !== "",
//         );

//         // Create title
//         let newTitle = chat.title;

//         if (chat.title === "New Chat" && firstMessage) {
//           newTitle = firstMessage.message.trim().slice(0, 30);
//         }

//         return {
//           ...chat,
//           title: newTitle,
//           messages: messages,
//         };
//       });
//     });
//   };

//   // CURRENT CHAT
//   const currentChat = chats.find((chat) => chat.id === activeChat);

//   const handleDeleteChat = (id) => {
//     setChats((prevChats) => prevChats.filter((chat) => chat.id !== id));

//     // If deleted chat was currently open
//     if (activeChat === id) {
//       setActiveChat(null);
//     }
//   };

//   const handleRenameChat = (id) => {
//     if (editTitle.trim() === "") {
//       return;
//     }

//     setChats((prevChats) =>
//       prevChats.map((chat) =>
//         chat.id === id
//           ? {
//               ...chat,
//               title: editTitle.trim(),
//             }
//           : chat,
//       ),
//     );

//     setEditingChat(null);
//     setEditTitle("");
//   };

//   return (
//     <div className="full">
//       {/* SIDEBAR */}
//            <button
//                  className="mobile-sidebar-btn"
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//            >
//              <BsLayoutTextSidebarReverse />
//            </button>    

//       <div className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
//         <div className="sidebar-header">
//           <div className="logo">
//             <p>CyberAi⚡</p>
//           </div>

//           <div className="slidebar"  onClick={() => setSidebarOpen(!sidebarOpen)}>
//             <p><BsLayoutTextSidebarReverse /></p>
//           </div>
//         </div>

//         <div className="sidebar-options">
//           {/* NEW CHAT */}

//           <div className="newchat" onClick={handleNewChat}>
//             <p><IoMdAdd /> New Chat</p>
//           </div>

//           {/* TOOLS */}

//           <div className="tool" onClick={() => setShowTools(true)}>
//             <p><VscDeveloperTools />Tools</p>
//           </div>

//           {/* NEWS */}

//           <div className="news">
//             <p> <FaRegNewspaper />News</p>
//           </div>

//           {/* HISTORY */}

//           <div className="history">
//             <p className="history-heading"> <FaHistory />History</p>

//             <div className="history-list">
//               {chats.map((chat) => (
//                 <div
//                   key={chat.id}
//                   className={`history-chat ${activeChat === chat.id ? "active-chat" : ""}`}
//                   onClick={() => handleChatClick(chat.id)}
//                 >
//                   {editingChat === chat.id ? (
//                     <input
//                       className="chat-rename-input"
//                       value={editTitle}
//                       autoFocus
//                       onChange={(e) => setEditTitle(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           handleRenameChat(chat.id);
//                         }

//                         if (e.key === "Escape") {
//                           setEditingChat(null);
//                           setEditTitle("");
//                         }
//                       }}
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                   ) : (
//                     <p>{chat.title}</p>
//                   )}

//                   <div className="chat-actions">
//                     {/* RENAME */}

//                     <button
//                       className="chat-rename"
//                       onClick={(e) => {
//                         e.stopPropagation();

//                         setEditingChat(chat.id);
//                         setEditTitle(chat.title);
//                       }}
//                     >
//                       <FaPencil />
//                     </button>

//                     {/* DELETE */}

//                     <button
//                       className="chathistory-delete"
//                       onClick={(e) => {
//                         e.stopPropagation();

//                         handleDeleteChat(chat.id);
//                       }}
//                     >
//                       <RiDeleteBin6Line />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* FOOTER */}

//         <div className="sidebar-footer">
//           <div className="profile">
//             <p><VscAccount /> Profile</p>
//           </div>
//         </div>
//       </div>

//       {/* CHAT AREA */}

//      {showTools ? (
//                 <Tools />
//               ) : (
//                    <Chatarea
//                     chat={currentChat}
//                     onUpdateChat={handleUpdateChat}
//                   />
//        )}
//     </div>
//   );
// }

// export default Sidebar;
