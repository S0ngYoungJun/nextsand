import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const SandCanvas2 = () => {
  const sceneRef = useRef(null);

  
  useEffect(() => {
    // matter.js 모듈 추출
    const { Engine, Render, World, Bodies, Mouse, MouseConstraint } = Matter;

    // 엔진 및 렌더러 생성
    const engine = Engine.create();
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        wireframes: false, // 와이어프레임 모드 비활성화
        width: window.innerWidth,
        height: window.innerHeight,
      }
    });

    // 바닥 객체 생성
    const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 60, { isStatic: true });
    const leftWall = Bodies.rectangle(0, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });
    const rightWall = Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 60, window.innerHeight, { isStatic: true });
    // 모래알 생성 함수
    const createParticle = (x, y, color) => {
      return Bodies.circle(x, y, 3, {
        density: 0.0002,
        friction: 0.1,
        frictionStatic: 0.5,
        restitution: 0.2,
        render: {
          fillStyle: color,
        }
      });
    };

    // 마우스 컨트롤 추가
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        }
      }
    });

    World.add(engine.world, [ground, leftWall, rightWall]);

    // 마우스 클릭 이벤트 리스너
    render.canvas.addEventListener('mousedown', (event) => {
      const particle = createParticle(event.clientX, event.clientY, '#F4D03F');
      World.add(engine.world, particle);
    });

    // 엔진 및 렌더러 실행
    Engine.run(engine);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  return <div ref={sceneRef} />;
};

export default SandCanvas2;
