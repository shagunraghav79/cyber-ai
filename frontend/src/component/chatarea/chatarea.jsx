import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import mermaid from "mermaid";
import "./chatarea.css";
import Search from "./search";

const MermaidDiagram = ({ code }) => {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Date.now()}`;

        const { svg } = await mermaid.render(id, code);

        setSvg(svg);
      } catch (error) {
        console.error("Mermaid error:", error);
      }
    };

    renderDiagram();
  }, [code]);

  return (
    <div
      className="mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

const Chatarea = () => {
  const { currentChat, activeChat, setChats } = useOutletContext();

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  // =========================
  // MERMAID
  // =========================

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
    });
  }, []);

  // =========================
  // LOAD CURRENT CHAT
  // =========================

  useEffect(() => {
    if (currentChat) {
      setMessages(currentChat.messages || []);
    } else {
      setMessages([]);
    }
  }, [currentChat]);

  // =========================
  // FILE URL
  // =========================

  const getFileUrl = (file) => {
    return URL.createObjectURL(file);
  };

  // =========================
  // UPDATE CHAT
  // =========================

  const updateCurrentChat = (updatedMessages) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id !== activeChat) {
          return chat;
        }

        // First text message becomes chat title

        const firstMessage = updatedMessages.find(
          (msg) => msg.message && msg.message.trim() !== "",
        );

        let newTitle = chat.title;

        if (chat.title === "New Chat" && firstMessage) {
          newTitle = firstMessage.message.trim().slice(0, 30);
        }

        return {
          ...chat,
          title: newTitle,
          messages: updatedMessages,
        };
      }),
    );
  };

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSend = async (message, file) => {
    if (message.trim() === "" && !file) {
      return;
    }

    const newMessage = {
      id: Date.now(),

      message: message,

      file: file,

      sender: "user",
    };

    const updatedMessages = [...messages, newMessage];

    // Update UI immediately

    setMessages(updatedMessages);

    // Save to selected chat

    updateCurrentChat(updatedMessages);

    // Don't call Gemini if only file

    if (message.trim() === "") {
      return;
    }

    // =========================
    // GEMINI / BACKEND
    // =========================

    // =========================

    setLoading(true);

    try {
      const response = await fetch("https://cyber-ai-8pf5.vercel.app/api/ask", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          question: message,
        }),
      });

      // Backend returned an HTTP error
      if (!response.ok) {
        throw new Error(`SERVER_ERROR:${response.status}`);
      }

      const data = await response.json();

      // Backend responded but didn't provide an answer
      if (!data.answer) {
        throw new Error("EMPTY_RESPONSE");
      }

      const aiMessage = {
        id: Date.now() + 1,
        message: data.answer,
        sender: "ai",
      };

      const finalMessages = [...updatedMessages, aiMessage];

      setMessages(finalMessages);

      updateCurrentChat(finalMessages);
    } catch (error) {
      console.error("AI Error:", error);

      let errorMessage = "Something went wrong. Please try again.";

      // Network / backend unreachable
      if (error instanceof TypeError) {
        errorMessage = "🌐 Network error. Unable to connect to the server.";
      }

      // Backend returned an error
      else if (error.message.startsWith("SERVER_ERROR")) {
        errorMessage = "⚠️ Server error. Please try again later.";
      }

      // Backend returned no answer
      else if (error.message === "EMPTY_RESPONSE") {
        errorMessage = "⚠️ Server error. No response was received from the AI.";
      }

      const errorMsg = {
        id: Date.now() + 1,
        message: errorMessage,
        sender: "ai",
      };

      const errorMessages = [...updatedMessages, errorMsg];

      setMessages(errorMessages);

      updateCurrentChat(errorMessages);
    } finally {
      // Always stop loading animation
      setLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="chatarea">
      {/* HEADER */}

      <div className="chatarea-header">
        <p>Upgrade</p>
      </div>

      {/* CHAT */}

      <div className="chatarea-response">
        <div className="chat-container">
          <div className="messages">
            {messages.map((message) => (
              <div className={`message ${message.sender}`} key={message.id}>
                {/* AI MESSAGE */}

                {message.sender === "ai" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");

                        if (!inline && match && match[1] === "mermaid") {
                          return (
                            <MermaidDiagram
                              code={String(children).replace(/\n$/, "")}
                            />
                          );
                        }

                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.message}
                  </ReactMarkdown>
                ) : (
                  message.message
                )}

                {/* IMAGE */}

                {message.file && message.file.type.startsWith("image/") && (
                  <img
                    src={getFileUrl(message.file)}
                    alt="attachment"
                    className="message-image"
                  />
                )}

                {/* OTHER FILE */}

                {message.file && !message.file.type.startsWith("image/") && (
                  <div className="file-attachment">📎 {message.file.name}</div>
                )}
              </div>
            ))}
            {/* AI LOADING ANIMATION */}
            {loading && (
              <div className="message ai loading-message">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* INPUT */}

        <div className="chatarea-typearea">
          <Search onSend={handleSend} />
        </div>
      </div>

      {/* FOOTER */}

      <div className="chatarea-footer">
        <p>@shagunRaghav</p>
      </div>
    </div>
  );
};

export default Chatarea;
