import React, { useState } from "react";
import "./Style.css";

export default function Chat({ messages, sendMessage, getMessages, user }) {
  const [newMsg, setNewMsg] = useState("");

  function formSubmit(e) {
    e.preventDefault();
    sendMessage(newMsg).then((success) => {
      if (success) {
        setNewMsg("");
        getMessages();
      }
    });
  }
  return (
    <>
      <ul className="chat-box">
        {messages.map((d) => {
          return (
            <li className="message" key={crypto.randomUUID()}>
              <img className="profile-pic" src={d.photo}></img>
              <div className="message-container">
                {d.text}

                <p className="time-display">
                  {d.time.toDate().toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true, // Use 12-hour format
                  })}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <form onSubmit={formSubmit} className="form">
        <input
          value={newMsg}
          className="input-box"
          placeholder="Type Something Nice"
          onChange={(e) => {
            setNewMsg(e.target.value);
          }}
        ></input>
      </form>
    </>
  );
}
