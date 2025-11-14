import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { LogOut, Hash } from 'lucide-react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import "../../styles/ChatRoom.css";
import logo from '../../assets/meeting.png'

export default function ChatRoom({
  currentRoom,
  currentUser,
  messages,
  users,
  messagesEndRef,
  onSendMessage,
  onLeaveRoom
}) {
  return (
    <div className="chatroom-wrapper">
      <Container fluid>
        <Row className="mb-3">
          <Col>
            <div className="chatroom-header">
              <div className="chatroom-header-left">
                <div className="chatroom-icon-box">
                  <img src={logo}/>
                </div>

                <div>
                  <h4 className="chatroom-title">{currentRoom}</h4>
                  <p className="chatroom-subtitle">
                    Connected as <strong>{currentUser}</strong>
                  </p>
                </div>
              </div>

              <Button
                variant="outline-danger"
                onClick={onLeaveRoom}
                className="leave-btn"
              >
                <LogOut size={18} />
                Exit
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={9} className="mb-3">
            <MessageList
              messages={messages}
              currentUser={currentUser}
              messagesEndRef={messagesEndRef}
            />

            <div className="chatroom-input-container mt-3">
              <MessageInput onSendMessage={onSendMessage} />
            </div>
          </Col>

          <Col lg={3}>
            <UserList users={users} currentUser={currentUser} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
