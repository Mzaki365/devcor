import React, { useEffect, useState } from 'react';

export default function CustomCursor({ themeColor = '#e2c992' }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e) => {
      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, textarea, .cursor-pointer, [role="button"]');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleElementHover);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Follower Ring */}
      <div
        className="fixed rounded-full transition-all duration-200 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: isHovered ? '44px' : '26px',
          height: isHovered ? '44px' : '26px',
          border: `1px solid ${themeColor}`,
          backgroundColor: isHovered ? `${themeColor}15` : 'transparent',
          boxShadow: `0 0 ${isHovered ? '16px' : '8px'} ${themeColor}40`,
        }}
      />
      {/* Inner Pinpoint Starlight Dot */}
      <div
        className="fixed w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_0_6px_#ffffff]"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
    </div>
  );
}
