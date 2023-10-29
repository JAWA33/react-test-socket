import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");

  const sendMessage = () => {
    if (message !== "") {
      socket.emit("send_message", { message, room });
    }
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  useEffect(() => {
    socket.on("received_message", (data) => {
      setMessageReceived(data.message);
    });
  }, [socket]);

  return (
    <div className="App">
      <div>
        <p>Select your room</p>
        <input
          type="text"
          id="joinRoom"
          placeholder="Select a room"
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Select this room</button>
      </div>
      <div>
        <h1>Mini Chat using Socket.io</h1>
        <p>Please write your message here</p>
      </div>
      <div>
        <input
          id="message"
          type="text"
          placeholder="Your message ..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send my message</button>
      </div>
      <div>
        <h2>Message from other user</h2>
        {messageReceived ? <p>{messageReceived}</p> : <p>Waiting message...</p>}
      </div>
    </div>
  );
}

export default App;
