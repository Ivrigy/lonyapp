import React from "react";
import styles from "../styles/Avatar.module.css";

const defaultAvatar = "https://res.cloudinary.com/da5x8a1jh/image/upload/v1753130079/default_profile_bbo1dj.jpg";

const Avatar = ({ src, height = 45, text }) => {
  return (
    <span>
      <img
        className={styles.Avatar}
        src={src || defaultAvatar}
        height={height}
        width={height}
        alt={text || "avatar"}
        onError={e => {
          e.target.onerror = null;
          e.target.src = defaultAvatar;
        }}
      />
      {text}
    </span>
  );
};

export default Avatar;