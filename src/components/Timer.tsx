import React from 'react';

const Timer = ({ timeLeft }) => {
  return (
    <div className="text-2xl font-bold mb-4">
      Time left: {timeLeft} seconds
    </div>
  );
};

export default Timer;