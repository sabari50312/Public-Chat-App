import React from "react";

export default function SignIn({ authenticate }) {
  return (
    <>
      <div className="sign-in">
        <button className="sign-in-button" onClick={authenticate}>
          Sign In
        </button>
      </div>
    </>
  );
}
