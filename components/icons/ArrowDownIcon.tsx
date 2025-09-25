
import React from 'react';
const ArrowDownIcon: React.FC<{stopColor?: string}> = ({stopColor}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {stopColor && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9h14" stroke={stopColor}/>}
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m0 0l-4-4m4 4l4-4" />
    </svg>
);

export default ArrowDownIcon;
