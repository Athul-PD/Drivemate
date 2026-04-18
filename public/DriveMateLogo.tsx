import React from "react";

type Props = {
  height?: string;
};

const DriveMateLogo: React.FC<Props> = () => {
  return (
    <svg width="300" height="70" viewBox="0 0 320 80" fill="none" xmlns="http://www.w3.org/2000/svg">

  {/* <!-- Steering wheel icon --> */}
  <g transform="translate(0,5)">
    <circle cx="35" cy="35" r="28" stroke="#5A6470" stroke-width="8" fill="none"/>
    
    {/* <!-- inner wheel --> */}
    <circle cx="35" cy="35" r="6" fill="#5A6470"/>
    
    {/* <!-- bottom curve --> */}
    <path d="M10 45 Q35 65 60 45" stroke="#5A6470" stroke-width="8" fill="none" stroke-linecap="round"/>
  </g>

  {/* <!-- Drive text --> */}
  <text x="80" y="50"
        font-family="'Roboto Mono', monospace"
        font-size="36"
        fill="#5A6470"
        font-weight="500">
    Drive
  </text>

  {/* <!-- mate text --> */}
  <text x="180" y="50"
        font-family="'Roboto Mono', monospace"
        font-size="36"
        fill="#F97316"
        font-weight="500">
    mate
  </text>

</svg>
  );
};

export default DriveMateLogo;