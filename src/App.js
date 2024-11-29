import React from 'react';
import TimeManagement from './component/TimeManagement';
import Cursor from './component/Cursor';
// import './style/timeManagement.css';

function App() {
  return (
    <div className="app-container">
      <Cursor/>
      <TimeManagement /> 
    </div>
  );
}

export default App;
