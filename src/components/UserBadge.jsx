import { Link } from "react-router-dom";
import "../assets/styles/UserBadge.css";

const UserBadge = ({ user, size = "default" }) => {
  if (!user) {
    return null;
  }

  const sizeClasses = {
    small: "user-badge-small",
    default: "user-badge",
    large: "user-badge-large",
  };

  const avatarSizeClasses = {
    small: "user-avatar-small",
    default: "user-avatar",
    large: "user-avatar-large",
  };

  const placeholderSizeClasses = {
    small: "avatar-placeholder-small",
    default: "avatar-placeholder",
    large: "avatar-placeholder-large",
  };

  const usernameSizeClasses = {
    small: "username-small",
    default: "username",
    large: "username-large",
  };

  return (
    <Link to={`/user/${user._id}`} className={sizeClasses[size]}>
      <div className={avatarSizeClasses[size]}>
        {user.account?.avatar?.secure_url ? (
          <img
            src={user.account.avatar.secure_url}
            alt={user.account.username}
          />
        ) : (
          <div className={placeholderSizeClasses[size]}>
            {user.account?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>
      <span className={usernameSizeClasses[size]}>
        {user.account?.username || "Utilisateur"}
      </span>
    </Link>
  );
};

export default UserBadge;
