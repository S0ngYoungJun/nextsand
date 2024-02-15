import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const SandCanvas = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);

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
        const particle = Matter.Bodies.circle(x, y, 2, {
          density: 0.0005,
          friction: 0.1,
          restitution: 0.6,
          render: { fillStyle: '#F4D03F' }
        });
        Matter.World.add(engineRef.current.world, particle);
      }, 100);
    }

    return () => {
      clearInterval(creationInterval);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMouseDown, mousePosition]);

  return <div ref={sceneRef} />;
};

export default SandCanvas;
