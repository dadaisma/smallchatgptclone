import { useState, useEffect, useRef } from "react";

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChat, setPreviousChat] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const valueRef = useRef(""); // Create a ref to store the previous value

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null);
    setValue("");
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      //console.log(data)
      setMessage(data.choices[0].message);
         // Use the valueRef to store the previous value
         valueRef.current = value;
         setValue("");
    } catch (error) {
      console.log(error);
    }
    
  };
  useEffect(() => {
    console.log(currentTitle, valueRef.current, message); // Use valueRef.current
    if (!currentTitle && valueRef.current && message) {
      setCurrentTitle(valueRef.current); // Use valueRef.current
    }
    if (currentTitle && valueRef.current && message) {
      setPreviousChat((prevChats) => [
        ...prevChats,
        {
          title: currentTitle,
          role: "user",
          content: valueRef.current, // Use valueRef.current
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);


 // console.log(previousChat);
  const currentChat = previousChat.filter((previousC) => {
    return previousC.title === currentTitle;
    } );

  const uniqueTitles = Array.from(
    new Set(previousChat.map((previousC) => previousC.title))
     
  );
  //console.log(uniqueTitles);

  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>made by</p>
          <h1 className="web"><a href="https://Davide78.dev" target="_blank">Davide78.dev</a></h1>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>Welcome to 🧙‍♂️🦹‍♂️ Ask/Me/AnyThing! 🦹‍♀️🦄</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input
              type="text"
              placeholder="Type a message..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">
          Free Research Preview. ChatGPT: - it might just throw in some creative liberties about people, places, and facts.  Where accuracy meets its mischievous twin!
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
