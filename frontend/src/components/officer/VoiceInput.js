import React, { useState, useRef } from "react";

const VoiceInput = ({ value, onResult, placeholder }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (typeof onResult === 'function') {
        onResult(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onResult?.(e.target.value)}
        placeholder={placeholder}
        className="form-control"
      />
      <button type="button" onClick={startListening} style={{ marginLeft: 8 }}>
        🎤
      </button>
    </div>
  );
};

export default VoiceInput;
