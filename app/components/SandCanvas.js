import React, { useEffect, useRef, useState } from 'react';
const colors = ['#F4D03F', '#E74C3C', '#3498DB', '#2ECC71'];


const SandCanvas = () => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const [currentColor, setCurrentColor] = useState(colors[0]);

  const createParticle = (x, y) => {
    setParticles(currentParticles => [
      ...currentParticles,
      { x, y, radius: 2, speed: 4, stopped: false ,}
    ]);
  };

  const updateAndDrawParticles = (ctx, particles) => {
    // 모래알 간 충돌 검사를 위한 함수
    const checkCollisionWithOtherParticles = (particle, otherParticles) => {
      for (let other of otherParticles) {
        if (other !== particle && other.stopped) {
          const distance = Math.sqrt(Math.pow(other.x - particle.x, 2) + Math.pow(other.y - particle.y, 2));
          if (distance < particle.radius + other.radius) {
            return other.y - other.radius * 2; // 충돌 위치 반환
          }
        }
      }
      return null; // 충돌 없음
    };

    const updatedParticles = particles.map(particle => {
      if (!particle.stopped) {
        let newY = particle.y + particle.speed;
        let stopped = newY + particle.radius >= ctx.canvas.height; // 바닥 충돌 감지
        let collisionY = checkCollisionWithOtherParticles(particle, particles); // 다른 모래알과 충돌 감지
        
        if (collisionY !== null) {
          newY = collisionY; // 다른 모래알 위에 멈춤
          stopped = true;
        } else if (stopped) {
          newY = ctx.canvas.height - particle.radius; // 바닥에 멈춤
        }

        return { ...particle, y: newY, stopped };
      }
      return particle;
    });

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 화면 클리어
    updatedParticles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, 1 * Math.PI);
      ctx.fillStyle = '#F4D03F';
      ctx.fill();
    });

    return updatedParticles;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animate = () => {
      setParticles(particles => updateAndDrawParticles(ctx, particles));
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    function handleMouseMove(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      createParticle(x, y);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }}></canvas>;
};

export default SandCanvas;
