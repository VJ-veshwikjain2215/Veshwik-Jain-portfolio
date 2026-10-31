import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { createParticleStage, PARTICLE_SCENES } from "../lib/particleStage";

export default function HeroParticles() {
  const canvas = useRef(null),
    cursor = useRef(null),
    controls = useRef(null),
    engine = useRef(null),
    current = useRef(0);
  const [scene, setScene] = useState(0),
    [moving, setMoving] = useState(false);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const stage = createParticleStage(canvas.current, {
      reducedMotion: !!reducedMotion,
      initialScene: current.current,
      cursor: cursor.current,
      controls: controls.current,
      onScene: (index) => {
        current.current = index;
        setScene(index);
      },
      onMoving: setMoving,
    });
    engine.current = stage;
    return () => {
      stage.destroy();
      engine.current = null;
    };
  }, [reducedMotion]);
  return (
    <>
      <canvas
        ref={canvas}
        className="hero-canvas"
        id="heroDots"
        aria-hidden="true"
        data-cursor="Click"
      />
      <span className="particle-cursor" ref={cursor} aria-hidden="true">
        Click
      </span>
      <div
        ref={controls}
        className={`scene-selector particle-selector ${moving ? "is-morphing" : ""}`}
        role="group"
        aria-label="Hero animation"
        aria-describedby="particle-help"
      >
        <span
          className={`scene-brand-dot ${scene ? "scene-number" : ""}`}
          aria-hidden="true"
        >
          {scene ? String(scene).padStart(2, "0") : null}
        </span>
        <b key={scene}>{PARTICLE_SCENES[scene]}</b>
        <div>
          {PARTICLE_SCENES.map((name, index) => (
            <button
              key={name}
              type="button"
              aria-label={`Show ${name} graphic`}
              aria-pressed={scene === index}
              onClick={() => engine.current?.select(index)}
            />
          ))}
        </div>
      </div>
      <span id="particle-help" className="particle-help">
        Click to change · Drag to rotate
      </span>
    </>
  );
}
