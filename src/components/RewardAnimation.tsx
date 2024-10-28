import React from 'react';

const RewardAnimation = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
        <p className="text-xl">You've cleared all pentominoes!</p>
      </div>
    </div>
  );
};

export default RewardAnimation;