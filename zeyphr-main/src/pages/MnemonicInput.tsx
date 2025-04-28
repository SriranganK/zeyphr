"use client";

import React, { useRef, useState } from "react";

interface MnemonicInputProps {
  onSubmit: (mnemonic: string) => void;
}

const MnemonicInput: React.FC<MnemonicInputProps> = ({ onSubmit }) => {
  const [words, setWords] = useState<string[]>(Array(12).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const updated = [...words];
    updated[index] = value.toLowerCase().replace(/[^a-z]/g, "");
    setWords(updated);

    // Auto move to next input
    if (value.length > 2 && index < 11) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").trim().split(/\s+/);
    if (pasteData.length === 12) {
      setWords(pasteData.map((w) => w.toLowerCase()));
    }
  };

  const handleSubmit = () => {
    if (words.every((word) => word.length > 0)) {
      onSubmit(words.join(" "));
    } else {
      alert("Please fill all 12 words.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>🔐 Enter Your 12-Word Recovery Phrase</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
        }}
      >
        {words.map((word, i) => (
          <input
            key={i}
            ref={(el:any) => (inputsRef.current[i] = el)}
            value={word}
            onChange={(e) => handleChange(i, e.target.value)}
            onPaste={i === 0 ? handlePaste : undefined}
            placeholder={`Word ${i + 1}`}
            style={{ padding: 8, fontSize: 16 }}
          />
        ))}
      </div>
      <button style={{ marginTop: 20 }} onClick={handleSubmit}>
        🚀 Login with Mnemonic
      </button>
    </div>
  );
};

export default MnemonicInput;
