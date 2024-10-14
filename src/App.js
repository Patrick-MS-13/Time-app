import React from 'react';
import TimeManagement from './component/TimeManagement'; 
// import './style/timeManagement.css';
import TimeZonePicker from './component/TimeZonePicker';

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Time Management App</h1> 
      <TimeManagement /> 
      <TimeZonePicker/>
    </div>
  );
}

export default App;
