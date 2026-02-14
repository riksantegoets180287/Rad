
import React, { useMemo } from 'react';

interface WheelProps {
  topics: string[];
  rotation: number;
  isSpinning: boolean;
}

const Wheel: React.FC<WheelProps> = ({ topics, rotation, isSpinning }) => {
  const segments = topics.length;
  const radius = 250;
  const center = 250;

  const getCoordinatesForAngle = (angle: number) => {
    const x = center + radius * Math.cos((Math.PI * angle) / 180);
    const y = center + radius * Math.sin((Math.PI * angle) / 180);
    return [x, y];
  };

  const wheelSegments = useMemo(() => {
    return topics.map((topic, i) => {
      const startAngle = (360 / segments) * i;
      const endAngle = (360 / segments) * (i + 1);
      const [startX, startY] = getCoordinatesForAngle(startAngle);
      const [endX, endY] = getCoordinatesForAngle(endAngle);
      const largeArcFlag = 360 / segments > 180 ? 1 : 0;

      const pathData = [
        `M ${center} ${center}`,
        `L ${startX} ${startY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        'Z',
      ].join(' ');

      const colors = ['#20126E', '#19E196', '#FFC800', '#F4F4F4'];
      const fill = colors[i % colors.length];
      const textColor = (fill === '#F4F4F4' || fill === '#FFC800') ? '#20126E' : '#FFFFFF';

      const textAngle = startAngle + (360 / segments) / 2;
      const textRadius = radius * 0.72;
      const textX = center + textRadius * Math.cos((Math.PI * textAngle) / 180);
      const textY = center + textRadius * Math.sin((Math.PI * textAngle) / 180);

      return (
        <g key={i}>
          <path d={pathData} fill={fill} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <g transform={`rotate(${textAngle}, ${textX}, ${textY})`}>
            <text
              x={textX}
              y={textY}
              fill={textColor}
              fontSize="8"
              fontWeight="900"
              textAnchor="middle"
              alignmentBaseline="middle"
              className="pointer-events-none"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            >
              {topic.length > 18 ? topic.substring(0, 15) + '...' : topic}
            </text>
          </g>
        </g>
      );
    });
  }, [topics, segments]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Indicator - Pointer stays on top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 z-[30]">
        <div className="relative">
          <div className="w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[50px] border-t-red-600 drop-shadow-2xl animate-pulse-subtle"></div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-800 rounded-full border-2 border-white shadow-lg"></div>
        </div>
      </div>

      {/* Wheel Background Shadow */}
      <div className="absolute inset-2 bg-summaIndigo/20 rounded-full blur-3xl transform translate-y-8 z-0"></div>

      {/* SVG Wheel */}
      <div className="w-full h-full relative z-[20]">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-visible"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 5s cubic-bezier(0.15, 0, 0.1, 1)' : 'none',
          }}
        >
          <circle cx="250" cy="250" r="250" fill="#FFFFFF" stroke="#20126E" strokeWidth="10" />
          {wheelSegments}
          {/* Decorative Hub */}
          <circle cx="250" cy="250" r="40" fill="#FFFFFF" stroke="#20126E" strokeWidth="8" shadow-xl />
          <circle cx="250" cy="250" r="18" fill="#19E196" />
          <circle cx="250" cy="250" r="8" fill="#FFFFFF" opacity="0.5" />
        </svg>
      </div>

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Wheel;
