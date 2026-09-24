import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import "../sidebar/sidebar.css";

import { VscDeveloperTools } from "react-icons/vsc";
import { IoMdAdd } from "react-icons/io";
import { FaRegNewspaper } from "react-icons/fa6";
import { FaHistory } from "react-icons/fa";
import { VscAccount } from "react-icons/vsc";
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { FaPencil } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";

function MainLayout() {

  const navigate = useNavigate();

  // =========================
  // CHAT STATE
  // =========================

  const [chats, setChats] = useState(() => {
    const savedChats = localStorage.getItem("cyberai-chats");

    return savedChats
      ? JSON.parse(savedChats)
      : [];
  });

  const [activeChat, setActiveChat] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [editingChat, setEditingChat] = useState(null);

  const [editTitle, setEditTitle] = useState("");


  // =========================
  // SAVE CHATS
  // =========================

  useEffect(() => {
    localStorage.setItem(
      "cyberai-chats",
      JSON.stringify(chats)
    );
  }, [chats]);


  // =========================
  // NEW CHAT
  // =========================

  const handleNewChat = () => {

    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [
      newChat,
      ...prev
    ]);

    setActiveChat(newChat.id);

    navigate("/");
  };


  // =========================
  // SELECT CHAT
  // =========================

  const handleChatClick = (id) => {

    setActiveChat(id);

    navigate("/");
  };


  // =========================
  // DELETE CHAT
  // =========================

  const handleDeleteChat = (id) => {

    setChats((prevChats) =>
      prevChats.filter(
        (chat) => chat.id !== id
      )
    );

    if (activeChat === id) {
      setActiveChat(null);
    }
  };


  // =========================
  // RENAME CHAT
  // =========================

  const handleRenameChat = (id) => {

    if (editTitle.trim() === "") {
      return;
    }

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              title: editTitle.trim(),
            }
          : chat
      )
    );

    setEditingChat(null);

    setEditTitle("");
  };


  // =========================
  // CURRENT CHAT
  // =========================

  const currentChat = chats.find(
    (chat) => chat.id === activeChat
  );


  return (
    <div className="full">

      {/* =========================
          MOBILE SIDEBAR BUTTON
      ========================= */}

      <button
        className="mobile-sidebar-btn"
        onClick={() =>
          setSidebarOpen(!sidebarOpen)
        }
      >
        <BsLayoutTextSidebarReverse />
      </button>


      {/* =========================
          SIDEBAR
      ========================= */}

      <div
        className={`sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        {/* HEADER */}

        <div className="sidebar-header">

          <div className="logo">
            <p>CyberAi⚡</p>
          </div>

          <div
            className="slidebar"
            onClick={() =>
              setSidebarOpen(!sidebarOpen)
            }
          >
            <p>
              <BsLayoutTextSidebarReverse />
            </p>
          </div>

        </div>


        {/* SIDEBAR OPTIONS */}

        <div className="sidebar-options">

          {/* NEW CHAT */}

          <div
            className="newchat"
            onClick={handleNewChat}
          >
            <p>
              <IoMdAdd />
              New Chat
            </p>
          </div>


          {/* TOOLS */}

          <div
            className="tool"
            onClick={() =>
              navigate("/tools")
            }
          >
            <p>
              <VscDeveloperTools />
              Tools
            </p>
          </div>


          {/* NEWS */}

          <div
            className="news"
            onClick={() =>
              navigate("/news")
            }
          >
            <p>
              <FaRegNewspaper />
              News
            </p>
          </div>


          {/* =========================
              HISTORY
          ========================= */}

          <div className="history">

            <p className="history-heading">
              <FaHistory />
              History
            </p>


            <div className="history-list">

              {chats.map((chat) => (

                <div
                  key={chat.id}
                  className={`history-chat ${
                    activeChat === chat.id
                      ? "active-chat"
                      : ""
                  }`}
                  onClick={() =>
                    handleChatClick(chat.id)
                  }
                >

                  {/* CHAT TITLE */}

                  {editingChat === chat.id ? (

                    <input
                      className="chat-rename-input"
                      value={editTitle}
                      autoFocus

                      onChange={(e) =>
                        setEditTitle(
                          e.target.value
                        )
                      }

                      onKeyDown={(e) => {

                        if (
                          e.key === "Enter"
                        ) {
                          handleRenameChat(
                            chat.id
                          );
                        }

                        if (
                          e.key === "Escape"
                        ) {
                          setEditingChat(null);
                          setEditTitle("");
                        }

                      }}

                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    />

                  ) : (

                    <p>{chat.title}</p>

                  )}


                  {/* CHAT ACTIONS */}

                  <div className="chat-actions">

                    {/* RENAME */}

                    <button
                      className="chat-rename"

                      onClick={(e) => {

                        e.stopPropagation();

                        setEditingChat(
                          chat.id
                        );

                        setEditTitle(
                          chat.title
                        );

                      }}
                    >
                      <FaPencil />
                    </button>


                    {/* DELETE */}

                    <button
                      className="chathistory-delete"

                      onClick={(e) => {

                        e.stopPropagation();

                        handleDeleteChat(
                          chat.id
                        );

                      }}
                    >
                      <RiDeleteBin6Line />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* =========================
            FOOTER
        ========================= */}

        <div className="sidebar-footer">

          <div
            className="profile"
            onClick={() =>
              navigate("/profile")
            }
          >
            <p>
              <VscAccount />
              Profile
            </p>
          </div>

        </div>

      </div>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="main-content">

        <Outlet
          context={{
            chats,
            activeChat,
            currentChat,
            setActiveChat,
            setChats,
          }}
        />

      </main>

    </div>
  );
}

export default MainLayout;