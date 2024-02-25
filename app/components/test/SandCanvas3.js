import React, { useEffect, useRef, useState } from 'react';
import planck from 'planck-js';

const SandCanvas3 = () => {
  const sceneRef = useRef(null);
  const [currentColor, setCurrentColor] = useState('#F4D03F');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const particleTimer = useRef(null); // 파티클 생성을 위한 타이머 참조 추가

  useEffect(() => {
    const world = planck.World({
      gravity: planck.Vec2(0, -10)
    });

    const canvas = sceneRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    const addParticle = (x, y, color) => {
      const position = planck.Vec2(x, y);
      const particle = world.createDynamicBody(position);
      const circle = planck.Circle(0.5);
      particle.createFixture(circle, {
        density: 0.5,
        friction: 0.3,
        restitution: 0.5,
      });
    };

    const render = () => {
      world.step(1 / 60);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(render);
    };

    render();

    const updateMousePosition = (x, y) => {
      const bounds = canvas.getBoundingClientRect();
      mousePosition.current = {
        x: (x - bounds.left) / 20,
        y: (canvas.height - (y - bounds.top)) / 20,
      };
    };

    const handleMouseDown = (e) => {
      setIsMouseDown(true);
      updateMousePosition(e.clientX, e.clientY);
      addParticle(mousePosition.current.x, mousePosition.current.y, currentColor);

      // 마우스를 누르고 있을 때 파티클을 지속적으로 생성하기 위한 타이머 설정
      if (!particleTimer.current) {
        particleTimer.current = setInterval(() => {
          addParticle(mousePosition.current.x, mousePosition.current.y, currentColor);
        }, 100); // 여기서 100ms는 파티클 생성 간격을 조절할 수 있는 값입니다.
      }
    };

    const handleMouseMove = (e) => {
      updateMousePosition(e.clientX, e.clientY);
      if (isMouseDown) {
        addParticle(mousePosition.current.x, mousePosition.current.y, currentColor);
      }
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
      clearInterval(particleTimer.current);
      particleTimer.current = null;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [currentColor]);

  return (
    <div>
      <canvas ref={sceneRef}></canvas>
      <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} />
      <input
        type="range"
        min="10"
        max="1000"
        value={particleInterval}
        onChange={(e) => setParticleInterval(Number(e.target.value))}
      />
    </div>
  );
};

export default SandCanvas3;
