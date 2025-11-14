import { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Send } from 'lucide-react';
import "../../styles/ChatRoom.css";

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="message-input-field"
          maxLength={500}
        />
        <Button
          type="submit"
          disabled={!message.trim()}
          className="message-send-btn"
        >
          <Send size={20} />
        </Button>
      </InputGroup>
      <Form.Text className="message-counter">
        {message.length}/500 characters
      </Form.Text>
    </Form>
  );
}
