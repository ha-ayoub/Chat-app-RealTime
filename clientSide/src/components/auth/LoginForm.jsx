import { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import '../../styles/LoginForm.css'
import logo from '../../assets/meeting.png'

export default function LoginForm({ onJoin, isJoining, error, rooms }) {
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const validateUsername = (value) => {
    if (value.length < 3) {
      setUsernameError('The username must contain at least 3 characters');
      return false;
    }
    if (value.length > 20) {
      setUsernameError('The username cannot exceed 20 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      setUsernameError('The username can only contain letters, numbers, underscores, and hyphens.');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateUsername(username) && roomName.trim()) {
      onJoin(username.trim(), roomName.trim());
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (value) validateUsername(value);
  };

  const isValid = username.trim().length >= 3 && roomName.trim() && !usernameError;

  return (
    <div className='login-container'>
      <Card className='login-card'>
        <Card.Body className="p-4">

          <div className="login-header text-center mb-4">
            <div >
              <img src={logo} className='login-header-icon'/>
            </div>
            <h2>Welcome to ChatApp</h2>
            <p>Join or create a chat room</p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Pseudo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={handleUsernameChange}
                disabled={isJoining}
                isInvalid={!!usernameError}
                style={{
                  padding: '0.75rem',
                  border: usernameError ? '1px solid #ef4444' : '1px solid #e2e8f0'
                }}
              />
              {usernameError && (
                <Form.Text className="text-danger">{usernameError}</Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Room name
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the name of the room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                disabled={isJoining}
              />
              <Form.Text style={{ color: '#64748b' }}>
                If the room does not exist, it will be created automatically.
              </Form.Text>
            </Form.Group>

            {rooms.length > 0 && (
              <div className="available-room mb-3">
                <p> Available rooms: </p>

                <div className='available-room-content'>
                  {rooms.map((room) => (
                    <button
                      key={room.name}
                      type="button"
                      onClick={() => setRoomName(room.name)}
                      className='available-room'
                      style={{
                        backgroundColor: roomName === room.name ? '#2563eb' : '#f1f5f9',
                        color: roomName === room.name ? 'white' : '#64748b'
                      }}
                    >
                  {room.name} ({room.userCount})
                </button>
                  ))}
              </div>
              </div>
            )}

          <Button
            type="submit"
            disabled={!isValid || isJoining}
            className='button-join'
            style={{

            }}
          >
            {isJoining ? 'Login...' : 'Join the room'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
    </div >
  );
}