import React from "react";

const App: React.FC = () => {
  return (
    <div style={{ textAlign: "center" }} className="App">
      <div style={{ margin: "20px" }} id="status">
        PENDING
      </div>
      <img id="qr" alt="QR Code" src="/resources/qr.png" />
    </div>
  );
};

export default App;
