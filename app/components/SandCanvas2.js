import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const SandCanvas = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [currentColor, setCurrentColor] = useState('#F4D03F'); 
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);


  const colors = ['#F4D03F', '#E74C3C', '#3498DB', '#2ECC71'];

  useEffect(() => {
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        wireframes: false,
        width: window.innerWidth,
        height: window.innerHeight,
      }
    });

    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 60, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });
    const rightWall = Matter.Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });

    Matter.World.add(engine.world, [ground, leftWall, rightWall]);

    Matter.Engine.run(engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (e) => {
      setIsMouseDown(true);
      updateMousePosition(e);
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    const handleMouseMove = (e) => {
      updateMousePosition(e);
    };

    const updateMousePosition = (e) => {
      const rect = sceneRef.current.getBoundingClientRect();
      setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    let creationInterval;
    if (isMouseDown) {
      creationInterval = setInterval(() => {
        const { x, y } = mousePosition;
        const particle = Matter.Bodies.circle(x, y, 7, { 
          density: 1000,  // 밀도를 조정하여 팅겨나가는 효과 조절
          friction: 1000, // 마찰력 조정
          frictionStatic: 0.9, // 공기 마찰력 조정
          restitution: 0.5, //탄성 조정, 값이 낮을수록 팅겨나가는 효과 감소
          render: { fillStyle: currentColor }
        });
        Matter.World.add(engineRef.current.world, particle);
      }, 5);
    }

    return () => {
      clearInterval(creationInterval);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMouseDown, mousePosition,currentColor]);

  return (
    <div>
      <div ref={sceneRef} />
      <div style={{ position: 'absolute', top: 0, zIndex: 100 }}>
        {colors.map(color => (
          <button
            key={color}
            style={{ backgroundColor: color, width: '20px', height: '20px', margin: '5px' }}
            onClick={() => setCurrentColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default SandCanvas;
