"use client"
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import styles from "@/app/styles/SandCanvas.module.scss"

const SandCanvas = () => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const [currentColor, setCurrentColor] = useState('#F4D03F'); 
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [currentShape, setCurrentShape] = useState('circle');
  const shapes = ['circle', 'rectangle', 'triangle', 'octagon'];
  const [scale, setScale] = useState(3);
  const [backgroundColor, setBackgroundColor] = useState('#f3f3df'); 

  useEffect(() => {
    // 엔진 및 세계를 조절
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        wireframes: false,
        width: window.innerWidth /1.3,
        height: window.innerHeight,
        background: backgroundColor,
      }
    });

    //벽 조절하는 애들
    const wallOptions = {
      isStatic: true,
      render: {
        fillStyle: backgroundColor 
      }
    };
    
    const ground = Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-15, window.innerHeight / 2, 30, window.innerHeight, wallOptions);
    const rightWall = Matter.Bodies.rectangle(window.innerWidth / 1.28 , window.innerHeight / 2, 30, window.innerHeight, wallOptions);
    const ceiling = Matter.Bodies.rectangle(window.innerWidth / 2, -30, window.innerWidth, 50, wallOptions);
    Matter.World.add(engine.world, [ground, leftWall, rightWall, ceiling]);


    Matter.Engine.run(engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [backgroundColor]);

  // 마우스 이벤트 조절
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

    // 객체 조절
    let creationInterval;
    if (isMouseDown) {
      creationInterval = setInterval(() => {
        const { x, y } = mousePosition;
        let options = {
          density: 0.001,  // 밀도
          friction: 0.1,   // 마찰력
          restitution: 0.1, // 탄성
          render: { fillStyle: currentColor }
        };
    
        let body;
        switch (currentShape) {
          case 'circle':
            body = Matter.Bodies.circle(x, y, 11.5 * scale, options); // 원의 반지름을 scale에 따라 조절
            break;
          case 'rectangle':
            body = Matter.Bodies.rectangle(x, y, 20 * scale, 20 * scale, options); // 사각형의 크기를 scale에 따라 조절
            break;
          case 'triangle':
            body = Matter.Bodies.polygon(x, y, 3, 20 * scale, options); // 삼각형(다각형)의 크기를 scale에 따라 조절
            break;
          case 'octagon':
            body = Matter.Bodies.polygon(x, y, 8, 12 * scale, options); // 팔각형(다각형)의 크기를 scale에 따라 조절
            break; 
          default:
            body = Matter.Bodies.circle(x, y, 10 * scale, options);
        }
  
        // 입자에 무작위 초기 속도 부여
        const angle = Math.random() * 2 * Math.PI; // 0에서 2π 사이의 각도
        const speed = Math.random() * 5 + 2; // 최소 속도를 2로 설정하고, 최대 5까지 무작위로 추가
        Matter.Body.setVelocity(body, { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed });
  
        // 입자에 무작위 각속도 부여 (선택적)
        const angularSpeed = Math.random() * 0.2 - 0.1; // -0.1에서 0.1 사이의 각속도
        Matter.Body.setAngularVelocity(body, angularSpeed);
  
        Matter.World.add(engineRef.current.world, body);
      }, 50);
    }
  

    return () => {
      clearInterval(creationInterval);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMouseDown, mousePosition,currentColor]);

  // 스크린샷 및 저장
  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas'); // Matter.js가 렌더링하는 canvas 선택
    if (canvas) {
      const imageUrl = canvas.toDataURL('image/png'); // Canvas 내용을 이미지 URL로 변환
      const link = document.createElement('a'); // 다운로드 링크 생성
      link.href = imageUrl;
      link.download = 'world-screenshot.jpg'; // 다운로드될 파일명 지정
      document.body.appendChild(link);
      link.click(); // 링크 클릭 이벤트를 프로그래매틱하게 실행하여 파일 다운로드
      document.body.removeChild(link); // 사용 후 링크 요소 제거
    }
  };

  return (
    <div className={styles.container}>
      <div className="world" ref={sceneRef} />
      <div className={styles.controls}>
        <div className={styles.color}>
          <div className={styles.text}>도형색상</div>
          <input className={styles.input} type="color" value={currentColor} onChange={(e) => setCurrentColor(e.target.value)}/>
        </div>
        <div className={styles.color}>
          <div className={styles.text}>배경색상</div>
          <input className={styles.input} type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} /></div>
        <div className={styles.color2}>
          <div className={styles.input2}>{shapes.map(shape => (
            <button
            key={shape}
            className={`${styles.button} ${currentShape === shape ? styles.activeButton : ''}`}
            onClick={() => setCurrentShape(shape)}
          >
              {shape}
            </button>
          ))}</div>
        </div>

        <div className={styles.color}> 
          <div className={styles.text}>도형 크기</div>
          <input type="range" min="1" max="4" value={scale} onChange={(e) => setScale(e.target.value)}/>
        </div>
        <div className={styles.color}> 
         <button className={styles.scshot} onClick={takeScreenshot}>Save Screenshot</button>
        </div>
      </div>
    </div>
  );
};
export default SandCanvas;
