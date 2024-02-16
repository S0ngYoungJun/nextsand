import React, { useEffect, useRef, useState } from 'react';
import planck from 'planck-js';

const SandCanvas3 = () => {
  const sceneRef = useRef(null);
  const [currentColor, setCurrentColor] = useState('#F4D03F');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [particleInterval, setParticleInterval] = useState(100);
  const particles = useRef([]);

  useEffect(() => {
    const world = planck.World({
      gravity: planck.Vec2(0, -10)
    });

    const canvas = sceneRef.current;
    canvas.width = 800; // Canvas width in pixels
    canvas.height = 600; // Canvas height in pixels
    const ctx = canvas.getContext('2d');

    // Convert canvas dimensions to Planck scale (meters in the physics world)
    const canvasWidthInMeters = canvas.width / 20;
    const canvasHeightInMeters = canvas.height / 20;

    // Create ground and walls as static bodies
    world.createBody().createFixture(planck.Edge(planck.Vec2(0, 0), planck.Vec2(canvasWidthInMeters, 0)), { isStatic: true });
    world.createBody().createFixture(planck.Edge(planck.Vec2(0, 0), planck.Vec2(0, canvasHeightInMeters)), { isStatic: true });
    world.createBody().createFixture(planck.Edge(planck.Vec2(canvasWidthInMeters, 0), planck.Vec2(canvasWidthInMeters, canvasHeightInMeters)), { isStatic: true });
    
    const addParticle = (x, y, color) => {

      const position = planck.Vec2(x, y);
      const particle = world.createDynamicBody(position);
      const circle = planck.Circle(0.5);
      particle.createFixture(circle, {
        density: 0.5,
        friction: 0.3,
        restitution: 0.5,
      });

      // Store particle with its color for rendering
      particles.current.push({ particle, color });
    };

    const render = () => {
      world.step(1 / 60);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach(({ particle, color }) => {
        const position = particle.getPosition();
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(position.x * 20, canvas.height - position.y * 20, 10, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(render);
    };

    render();

    const handleMouseDown = (e) => {
      setIsMouseDown(true);
      // Convert mouse position to world coordinates
      const bounds = canvas.getBoundingClientRect();
      const x = (e.clientX - bounds.left) / 20;
      const y = (canvas.height - (e.clientY - bounds.top)) / 20;
      addParticle(x, y, currentColor);
    };

    const handleMouseMove = (e) => {
      if (isMouseDown) {
        const bounds = canvas.getBoundingClientRect();
        const x = (e.clientX - bounds.left) / 20;
        const y = (canvas.height - (e.clientY - bounds.top)) / 20;
        addParticle(x, y, currentColor);
      }
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
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
