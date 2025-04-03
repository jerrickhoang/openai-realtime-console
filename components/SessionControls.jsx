import React, { useState } from "react";
import { Mic, X } from "react-feather";
import Button from "./Button";

export default function SessionControls({
  startSession,
  stopSession,
  sendTextMessage,
  isSessionActive,
}) {
  const [message, setMessage] = useState("");

  function handleSendMessage(e) {
    e.preventDefault();
    if (message.trim() && isSessionActive) {
      sendTextMessage(message);
      setMessage("");
    }
  }

  const startSessionButton = (
    <Button primary onClick={startSession} disabled={isSessionActive}>
      <div className="flex items-center gap-2">
        <Mic size={16} /> Start Session
      </div>
    </Button>
  );

  const stopSessionButton = (
    <Button onClick={stopSession} disabled={!isSessionActive}>
      <div className="flex items-center gap-2">
        <X size={16} /> End Session
      </div>
    </Button>
  );

  const hintText = isSessionActive
    ? "Type a message or speak to interact with the model..."
    : "Start a session to interact with the model";

  const textInputForm = (
    <form onSubmit={handleSendMessage} className="mt-2 w-full flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 bg-white border border-gray-300 rounded px-3 py-2"
        placeholder={hintText}
        disabled={!isSessionActive}
      />
      <Button
        primary
        disabled={!message.trim() || !isSessionActive}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </form>
  );

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="flex gap-2 items-center">
        {isSessionActive ? stopSessionButton : startSessionButton}
        <div className="text-sm ml-2">
          {isSessionActive ? (
            <span className="text-green-600 flex items-center gap-1">
              <span className="block w-2 h-2 rounded-full bg-green-500"></span>
              Session Active
            </span>
          ) : (
            <span className="text-gray-500">Session not started</span>
          )}
        </div>
      </div>
      {textInputForm}
    </div>
  );
} 