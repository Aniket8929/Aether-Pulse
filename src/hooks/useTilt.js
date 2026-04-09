// Tilt hook for 3D card hover effects
import { useState, useRef } from 'react';

export function useTilt() {
  const [transform, setTransform] = useState('');
  const elementRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)');
  };

  return {
    ref: elementRef,
    style: { transform },
    eventHandlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave
    }
  };
}

// Simple parallax scroll hook
export function useScrollParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setOffset(window.scrollY * speed);
    }, { passive: true });
  }

  return offset;
}