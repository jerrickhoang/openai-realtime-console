import React, { useState } from "react";

export default function ToolPanel({ sendClientEvent, isSessionActive }) {
  // List of example events to display
  const examples = [
    {
      name: "Set Rich Presence Mode",
      description: "Switch between different model personalities",
      template: {
        type: "rich_presence.mode.set",
        mode: "interview",
      },
      options: ["interview", "casual", "storytelling"],
      option_field: "mode",
    },
    {
      name: "Generate an Image",
      description: "Have the model generate an image",
      template: {
        type: "tool.use",
        id: crypto.randomUUID(),
        tool: {
          type: "image_gen",
          prompt: "",
        },
      },
      text_field: "tool.prompt",
      placeholder: "Enter an image prompt...",
    },
    {
      name: "Weather Tool",
      description: "Provide weather information for a location",
      template: {
        type: "tool.use",
        id: crypto.randomUUID(),
        tool: {
          type: "weather",
          location: "",
        },
      },
      text_field: "tool.location",
      placeholder: "Enter a location...",
    },
    {
      name: "Start Assistant Reply",
      description: "Manually trigger assistant to respond",
      template: {
        type: "response.create",
      },
    },
  ];

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-4">Tool Panel</h2>
      <div className="space-y-4">
        {examples.map((example, index) => (
          <ExampleCard
            key={index}
            example={example}
            sendClientEvent={sendClientEvent}
            isActive={isSessionActive}
          />
        ))}
      </div>
    </div>
  );
}

function ExampleCard({ example, sendClientEvent, isActive }) {
  const [value, setValue] = useState("");
  const [optionValue, setOptionValue] = useState(
    example.options ? example.options[0] : null,
  );

  // Helper to get nested object property
  function setNestedValue(obj, path, value) {
    const copy = JSON.parse(JSON.stringify(obj));
    const parts = path.split(".");
    let current = copy;

    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }

    current[parts[parts.length - 1]] = value;
    return copy;
  }

  function handleSend() {
    const eventToSend = { ...example.template };

    // Set text field value if applicable
    if (example.text_field && value) {
      setNestedValue(eventToSend, example.text_field, value);
    }

    // Set option field value if applicable
    if (example.option_field && optionValue) {
      setNestedValue(eventToSend, example.option_field, optionValue);
    }

    // Generate a new UUID for this event if needed
    if (eventToSend.id) {
      eventToSend.id = crypto.randomUUID();
    }

    sendClientEvent(eventToSend);
    setValue("");
  }

  // Render appropriate input field based on example type
  const inputField = example.text_field ? (
    <input
      type="text"
      className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={example.placeholder || "Enter value..."}
      disabled={!isActive}
    />
  ) : example.options ? (
    <select
      className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
      value={optionValue}
      onChange={(e) => setOptionValue(e.target.value)}
      disabled={!isActive}
    >
      {example.options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  ) : null;

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <div className="font-medium">{example.name}</div>
      <div className="text-sm text-gray-500 mb-2">{example.description}</div>

      {inputField && <div className="mb-2">{inputField}</div>}

      <button
        className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
        onClick={handleSend}
        disabled={!isActive}
      >
        Send Event
      </button>
    </div>
  );
} 