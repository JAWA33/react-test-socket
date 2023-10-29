import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState([]);
  const [connectedRoom, setConnectedRoom] = useState("");

  const sendMessage = async () => {
    if (message !== "") {
      const messageData = {
        room: connectedRoom,
        author: socket.id,
        message: message,
        time:
          new Date(Date.now()).getHours() +
          " : " +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageReceived((list) => [...list, messageData]);
    }
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      setConnectedRoom(room);
      setMessageReceived([]);
    }
  };

  useEffect(() => {
    socket.on("received_message", (data) => {
      setMessageReceived((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="App">
      <div className="roomContainer">
        <p>Select your room</p>
        <input
          type="text"
          id="joinRoom"
          placeholder="Select a room"
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>Select this room</button>
      </div>

      <h2>Live Chat</h2>
      <div className="chatContainer">
        {messageReceived !== [] ? (
          messageReceived.map((messageContent, index) => {
            return messageContent.author === socket.id ? (
              <p className="myMessage" key={index}>
                {messageContent.message}
              </p>
            ) : (
              <p className="otherMessage" key={index}>
                {messageContent.message}
              </p>
            );
          })
        ) : (
          <p>Waiting message...</p>
        )}
      </div>
      <div className="sendContainer">
        {connectedRoom !== "" ? (
          <h1>You are connected to this room : {connectedRoom}</h1>
        ) : (
          <h1>Not connected</h1>
        )}

        <input
          id="message"
          type="text"
          placeholder="Your message ..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send my message</button>
      </div>
    </div>
  );
}

export default App;
