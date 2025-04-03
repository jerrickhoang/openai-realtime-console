import React from 'react';

export default function EventLog({ events }) {
  function renderJSON(data) {
    const content = JSON.stringify(data, null, 2);
    return content.split("\n").map((line, i) => (
      <div key={i} className="whitespace-pre">{line}</div>
    ));
  }

  function truncate(text, length = 100) {
    return text.length > length ? `${text.substring(0, length)}...` : text;
  }

  function renderEvent(event) {
    // Common event header
    const header = (
      <div className="flex items-center text-xs text-gray-500 mt-2 mb-1">
        <span>{event.timestamp}</span>
        <span className="mx-1">•</span>
        <span className="font-bold">{event.type}</span>
        {event.event_id && (
          <>
            <span className="mx-1">•</span>
            <span className="text-gray-400 text-xs">
              {truncate(event.event_id, 8)}
            </span>
          </>
        )}
      </div>
    );

    let content;

    switch (event.type) {
      // Handle text output events
      case "response.content.part": {
        const textContent = event.content?.slice(0, -1).includes("\n") ? (
          <pre className="whitespace-pre-wrap">{event.content}</pre>
        ) : (
          <span>{event.content}</span>
        );

        content = <div className="p-2">{textContent}</div>;
        break;
      }

      // Handle complete messages
      case "conversation.item.complete": {
        const message = event?.item?.content[0]?.text;
        content = (
          <div className="p-2 bg-blue-50 rounded">
            <div className="whitespace-pre-wrap">{message}</div>
          </div>
        );
        break;
      }

      // For any other event types, just show the JSON
      default:
        const { timestamp, type, event_id, ...details } = event;
        content = <div className="text-xs bg-gray-100 p-2 rounded">{renderJSON(details)}</div>;
    }

    return (
      <div key={event.event_id || event.timestamp + Math.random()}>
        {header}
        {content}
      </div>
    );
  }

  return (
    <div className="pt-4">
      {events.length === 0 ? (
        <div className="text-gray-400 mt-8 text-center">
          No events yet. Start a session to see events here.
        </div>
      ) : (
        events.map(renderEvent)
      )}
    </div>
  );
} 