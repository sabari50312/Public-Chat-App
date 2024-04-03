import React from "react";

export default function SignOut({ logout }) {
  return (
    <>
      <button className="sign-button" onClick={logout}>
        Sign Out
      </button>
    </>
  );
}
