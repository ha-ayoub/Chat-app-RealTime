import { getAvatarColor, getInitials } from '../../styles/theme';

export default function Avatar({ username, size = 40 }) {
  const color = getAvatarColor(username);
  const initials = getInitials(username);

  const style = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: `${size / 2.5}px`,
    flexShrink: 0
  };

  return <div style={style}>{initials}</div>;
}