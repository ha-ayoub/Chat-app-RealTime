import { formatDistanceToNow } from 'date-fns';
import { fr, enUS, es, de, arSA, ja } from 'date-fns/locale';
import Avatar from '../common/Avatar';
import "../../styles/ChatRoom.css";

export default function MessageList({ messages, currentUser, messagesEndRef }) {
  const locales = {fr, en: enUS, es, de, ar: arSA, ja};

  const formatTime = (timestamp) => {
    try {
       const userLocale = navigator.language.split("-")[0];
       const locale = locales[userLocale] || enUS;

      return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale});
    } catch {
      return '';
    }
  };

  return (
     <div className="message-list-wrapper">
      {messages.length === 0 ? (
        <div className="message-empty">
          <p>No messages yet</p>
          <p>Be the first to send a message!</p>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => {
            const isSystem = msg.isSystemMessage;
            const isCurrentUser = msg.username === currentUser;

            if (isSystem) {
              return (
                <div key={index} className="message-system">
                  {msg.content}
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`message-item ${isCurrentUser ? "reverse" : ""}`}
              >
                <Avatar username={msg.username} size={36} />

                <div
                  className={`message-content-wrapper ${
                    isCurrentUser ? "right" : "left"
                  }`}
                >
                  <div
                    className={`message-header ${
                      isCurrentUser ? "right" : ""
                    }`}
                  >
                    <span className="message-username">{msg.username}</span>
                    <span className="message-time">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>

                  <div
                    className={`message-bubble ${
                      isCurrentUser ? "me" : "other"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}