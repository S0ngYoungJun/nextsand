import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const SandCanvas3 = () => {
  const sceneRef = useRef(null);
  const [currentColor, setCurrentColor] = useState('#F4D03F');
  const engine = useRef(Matter.Engine.create());

  useEffect(() => {
    const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

    const canvas = sceneRef.current;
    const render = Render.create({
      canvas: canvas,
      engine: engine.current,
      options: {
        width: 800,
        height: 600,
        wireframes: false
      }
    });

    // Create ground and walls
    const ground = Bodies.rectangle(400, 600, 810, 60, { isStatic: true });
    const leftWall = Bodies.rectangle(0, 300, 60, 600, { isStatic: true });
    const rightWall = Bodies.rectangle(800, 300, 60, 600, { isStatic: true });
    World.add(engine.current.world, [ground, leftWall, rightWall]);

    // Add mouse control
    const mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    World.add(engine.current.world, mouseConstraint);

    // Keep track of mouse state
    render.canvas.addEventListener('mousedown', () => {
      setInterval(() => {
        const particle = Bodies.circle(mouse.position.x, mouse.position.y, 10, {
          density: 0.0005,
          frictionAir: 0.06,
          restitution: 0.3,
          friction: 0.01,
          render: {
            fillStyle: currentColor
          }
        });
        World.add(engine.current.world, particle);
      }, 100);
    });

    Engine.run(engine.current);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.current.world);
      Engine.clear(engine.current);
      render.canvas.remove();
    };
  }, [currentColor]);

  return (
    <div>
      <canvas ref={sceneRef}></canvas>
      <input type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} />
    </div>
  );
};

export default SandCanvas3;