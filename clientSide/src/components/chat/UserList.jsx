import { Users } from 'lucide-react';
import Avatar from '../common/Avatar';
import "../../styles/ChatRoom.css";

export default function UserList({ users, currentUser }) {
  return (
    <div className="userlist-container">

      <div className="userlist-header">
        <Users size={20} color="#64748b" />
        <h6 className="userlist-header-title">
          Users ({users.length})
        </h6>
      </div>

      <div className="userlist-list">
        {users.map((user) => {
          const isCurrent = user === currentUser;

          return (
            <div
              key={user}
              className={`userlist-item ${isCurrent ? "current" : ""}`}
            >
              <Avatar username={user} size={32} />

              <span
                className={`userlist-name ${isCurrent ? "current" : ""}`}
              >
                {user} {isCurrent && "(Vous)"}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}