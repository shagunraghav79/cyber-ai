import { useRef, useState } from "react";
import "./search.css";

function Search({ onSend }) {
  const [text, setText] = useState("");
  const [selectedFile,setSelectedFile]=useState(null);

  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);

    const textarea = textareaRef.current;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      220
    )}px`;
  };

  // This handles both button click and Enter
  const handleSubmit = () => {
    if (text.trim() === "" && selectedFile==null) return;

    // Send text to Chatarea

    onSend(text ,selectedFile);

    // Clear input
    setText("");
    setSelectedFile(null);

    // Reset textarea height
    textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  return (
    <div className="search-box">
       
         {selectedFile && (
            <div className="selected-file">
          📎 {selectedFile.name}
          <button className="selsectedfile-cancel" onClick={()=>{setSelectedFile(null)}}>x</button>
          </div>
         
          )}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Start..."
        rows="1"
        className="search-input"
      />

      <div className="actions">
        <button type="button"  className="input-button" >
          +
          <input type="file" className="file-input"
           onChange={(e) => {const file = e.target.files[0];
           setSelectedFile(file);
           console.log(file);
           }}/>
        </button>

        <button type="button" onClick={handleSubmit}>
          ➤
        </button>
      </div>

    </div>
  );
}

export default Search;