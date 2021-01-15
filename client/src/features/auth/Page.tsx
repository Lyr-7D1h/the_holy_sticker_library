import React from "react";

function AuthPage() {
  return (
    <div style={{ textAlign: "center" }} className="App">
      <div style={{ margin: "20px" }} id="status">
        PENDING
      </div>
      <img id="qr" alt="QR Code" src="/resources/qr.png" />
    </div>
  );
}

export default AuthPage;
