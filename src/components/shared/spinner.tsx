import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div
      className="absolute right-3 top-1/2 -translate-y-1/2 w-[24px] h-[24px] flex items-center justify-center"
      aria-label="Ładowanie"
    >
      <span className="block w-[18px] h-[18px] border-2 border-primary-blue border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Spinner;
