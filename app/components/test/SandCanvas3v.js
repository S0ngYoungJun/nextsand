import React, { useEffect, useRef, useState } from 'react';
import planck from 'planck-js';

const SandCanvas3 = () => {
  const sceneRef = useRef(null);
  const [currentColor, setCurrentColor] = useState('#F4D03F');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const particles = useRef([]); // particles를 useRef로 변경하여 상태 관리

  useEffect(() => {
    const world = new planck.World({
      gravity: planck.Vec2(0, 10)
    });

    const canvas = sceneRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');

    // 바닥, 좌우 벽 생성
    // 생략

    document.addEventListener('mousedown', (e) => {
      setIsMouseDown(true);
      addParticle(e.offsetX, e.offsetY, currentColor);
    });

    document.addEventListener('mousemove', (e) => {
      if (isMouseDown) {
        addParticle(e.offsetX, e.offsetY, currentColor);
      }
    });

    document.addEventListener('mouseup', () => {
      setIsMouseDown(false);
    });

    const addParticle = (x, y, color) => {
      const px = x / 30; // planck.js의 스케일에 맞추어 조정
      const py = y / 30;
      const particle = world.createDynamicBody(planck.Vec2(px, py));
      particle.createFixture(planck.Circle(0.1), {
        density: 1.0,
        friction: 0.5,
        restitution: 0.7,
      });
      particles.current.push({ particle, color }); // particles 배열에 추가
    };

    const update = () => {
      world.step(1 / 60);
      context.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach(({ particle, color }) => {
        const position = particle.getPosition();
        const shape = particle.getFixtureList().getShape();
        context.beginPath();
        context.arc(position.x * 30, position.y * 30, shape.m_radius * 30, 0, Math.PI * 2);
        context.fillStyle = color; // 각 particle의 색상을 사용
        context.fill();
      });

      requestAnimationFrame(update);
    };

    update();

    return () => {
      document.removeEventListener('mousedown', () => {});
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mouseup', () => {});
    };
  }, [currentColor]); // currentColor만 의존성 배열에 포함

  return (
    <div>
      <canvas ref={sceneRef} />
      <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} />
    </div>
  );
};

export default SandCanvas3;
