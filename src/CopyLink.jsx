import React, { useState } from "react";

function CopyLink() {
  const link = "https://chatapp-662fd.web.app/";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 5000); // Reset copied state after 2 seconds
  };

  return (
    <div>
      <button className="copy-link" onClick={copyToClipboard}>
        Copy Link
      </button>
      {copied && <span>Link copied!</span>}
    </div>
  );
}

export default CopyLink;
