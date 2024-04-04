import React from "react";

export default function SignIn({ login }) {
  return (
    <>
      <div className="sign-in">
        <button className="sign-in-button" onClick={login}>
          Sign In
        </button>
      </div>
    </>
  );
}
