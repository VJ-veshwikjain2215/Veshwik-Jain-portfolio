// Canvas-native particle artwork and spring motion, implemented for this portfolio.
export const PARTICLE_SCENES = [
  "Veshwik",
  "Backend systems",
  "Web platforms",
  "Mobile apps",
  "Websites",
];
const PERIOD = 3000;
const TAU = Math.PI * 2;
const clamp = (n, low = 0, high = 1) => Math.max(low, Math.min(high, n));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);
const rgb = (c) =>
  `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
const palette = {
  ink: "#231f20",
  brown: "#b07040",
  peach: "#e5ba97",
  green: "#3db663",
  teal: "#0a282d",
  mint: "#9fd9b2",
};

function buildModels() {
  const mask = document.createElement("canvas");
  mask.width = mask.height = 320;
  const context = mask.getContext("2d", { willReadFrequently: true });
  const rounded = (x, y, w, h, r, color) => {
    context.fillStyle = color;
    context.beginPath();
    context.roundRect(x, y, w, h, r);
    context.fill();
  };
  const circle = (x, y, r, color) => {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, TAU);
    context.fill();
  };
  const gradient = context.createLinearGradient(0, 10, 0, 310);
  gradient.addColorStop(0, palette.teal);
  gradient.addColorStop(1, palette.green);
  const frame = (x, y, w, h, r, border) => {
    rounded(x, y, w, h, r, gradient);
    context.save();
    context.globalCompositeOperation = "destination-out";
    rounded(
      x + border,
      y + border,
      w - 2 * border,
      h - 2 * border,
      Math.max(2, r - border),
      "black",
    );
    context.restore();
  };
  const toolbar = (y) => {
    [palette.brown, palette.peach, palette.green].forEach((color, i) =>
      circle(49 + i * 20, y, 6, color),
    );
  };
  const drawers = [
    () => {
      circle(151, 195, 116, gradient);
      context.save();
      context.globalCompositeOperation = "destination-out";
      circle(151, 195, 50, "black");
      circle(216, 96, 45, "black");
      context.restore();
      circle(216, 96, 34, palette.ink);
      circle(195, 33, 20, palette.brown);
      circle(242, 43, 9, palette.peach);
    },
    () => {
      frame(29, 45, 262, 195, 17, 14);
      [
        [62, 155, 34, 56],
        [113, 106, 34, 105],
        [164, 131, 34, 80],
        [215, 80, 34, 131],
      ].forEach(([x, y, w, h], i) =>
        rounded(x, y, w, h, 4, i === 2 ? palette.peach : palette.green),
      );
      rounded(145, 239, 30, 36, 0, palette.teal);
      rounded(95, 272, 130, 16, 8, palette.teal);
    },
    () => {
      frame(27, 24, 266, 275, 20, 13);
      toolbar(49);
      rounded(112, 43, 151, 13, 6, palette.mint);
      rounded(53, 82, 214, 11, 4, palette.teal);
      for (let i = 0; i < 6; i++) {
        const x = 56 + i * 35;
        rounded(x, 95, 35, 27, 0, i % 2 ? palette.peach : palette.green);
        circle(x + 17.5, 122, 17.5, i % 2 ? palette.peach : palette.green);
      }
      context.strokeStyle = palette.ink;
      context.lineWidth = 9;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.beginPath();
      context.moveTo(68, 156);
      context.lineTo(88, 156);
      context.lineTo(111, 233);
      context.lineTo(226, 233);
      context.stroke();
      context.fillStyle = palette.teal;
      context.beginPath();
      context.moveTo(96, 171);
      context.lineTo(250, 171);
      context.lineTo(234, 218);
      context.lineTo(110, 218);
      context.closePath();
      context.fill();
      rounded(145, 172, 6, 44, 0, palette.mint);
      rounded(190, 172, 6, 44, 0, palette.mint);
      circle(127, 259, 12, palette.brown);
      circle(214, 259, 12, palette.brown);
    },
    () => {
      frame(89, 10, 142, 300, 29, 14);
      rounded(133, 26, 54, 11, 5, palette.ink);
      rounded(113, 62, 94, 65, 10, palette.green);
      rounded(113, 143, 94, 42, 9, palette.peach);
      rounded(113, 201, 94, 43, 9, palette.mint);
      circle(160, 278, 11, palette.brown);
    },
    () => {
      frame(25, 44, 270, 234, 18, 13);
      toolbar(66);
      rounded(53, 105, 118, 73, 10, palette.green);
      rounded(186, 105, 81, 73, 10, palette.peach);
      [
        [53, 196, 214],
        [53, 218, 175],
        [53, 240, 118],
      ].forEach(([x, y, w]) => rounded(x, y, w, 9, 4, palette.mint));
    },
  ];
  return drawers.map((draw) => {
    context.clearRect(0, 0, 320, 320);
    draw();
    const pixels = context.getImageData(0, 0, 320, 320).data,
      points = [];
    const spacing = 4.5;
    for (
      let row = 0, y = 6;
      y < 314;
      row++, y += (spacing * Math.sqrt(3)) / 2
    ) {
      for (let x = 8 + ((row % 2) * spacing) / 2; x < 312; x += spacing) {
        const offset = (Math.round(y) * 320 + Math.round(x)) * 4;
        if (pixels[offset + 3] > 170) {
          const color = [
            pixels[offset],
            pixels[offset + 1],
            pixels[offset + 2],
          ];
          points.push({ x: x - 160, y: y - 166, color, css: rgb(color) });
        }
      }
    }
    return points;
  });
}

export function createParticleStage(canvas, options) {
  const context = canvas.getContext("2d"),
    models = buildModels(),
    host = canvas.parentElement,
    hero = host.closest("section");
  let randomSeed = 4271;
  const random = () => {
    randomSeed = (Math.imul(randomSeed, 1664525) + 1013904223) >>> 0;
    return randomSeed / 4294967296;
  };
  const particles = Array.from(
    { length: Math.max(...models.map((model) => model.length)) },
    () => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      alpha: 0,
      modelX: 0,
      modelY: 0,
      modelZ: 0,
      color: [0, 0, 0],
      css: palette.green,
      seed: random() * TAU,
      size: 0.85 + random() * 0.3,
      depthJitter: random() - 0.5,
      spiral: 0.8 + random() * 0.4,
      expansion: 1.35 + random() * 0.55,
      jx: (random() - 0.5) * 48,
      jy: (random() - 0.5) * 48,
      scatterX: (random() - 0.5) * 900,
      scatterY: (random() - 0.5) * 850 - 100,
    }),
  );
  let width = 0,
    height = 0,
    scale = 1,
    cx = 0,
    cy = 0,
    shapeSize = 0,
    frame = 0,
    lastTime = 0,
    clock = 0,
    active = options.initialScene || 0,
    morph = null,
    nextChange = PERIOD,
    intro = true,
    introPulse = false,
    inView = true,
    destroyed = false,
    scroll = 0;
  let yaw = 0,
    pitch = 0,
    drag = 0,
    dragStart = null,
    dragReturn = null,
    moved = false,
    cursorX = 0,
    cursorY = 0;
  const pointer = { x: -10000, y: -10000, nx: 0, ny: 0, inside: false };
  const pulses = [];
  const target = (index, scene) => {
    const model = models[scene],
      point = model[index] || model[(index * 211) % model.length];
    const x = point.x * scale,
      y = point.y * scale,
      distance = Math.hypot(x, y) / (shapeSize * 0.6);
    return {
      x,
      y,
      z:
        Math.max(0, 1 - distance * distance) * shapeSize * 0.3 +
        particles[index].depthJitter * shapeSize * 0.05,
      color: point.color,
      css: point.css,
      alpha: index < model.length ? 1 : 0,
    };
  };
  function resetTargets(scene) {
    particles.forEach((p, i) => {
      const t = target(i, scene);
      p.modelX = t.x;
      p.modelY = t.y;
      p.modelZ = t.z;
      p.targetAlpha = t.alpha;
      p.color = t.color;
      p.css = t.css;
    });
  }
  function select(scene) {
    if (destroyed || morph || !width) return false;
    scene = (scene + models.length) % models.length;
    if (scene === active) {
      nextChange = clock + PERIOD;
      return false;
    }
    intro = false;
    if (options.reducedMotion) {
      active = scene;
      resetTargets(scene);
      options.onScene(scene);
      render(0);
      return true;
    }
    morph = { started: clock, scene };
    nextChange = clock + PERIOD;
    particles.forEach((p, i) => {
      const t = target(i, scene);
      p.fromX = p.modelX;
      p.fromY = p.modelY;
      p.fromZ = p.modelZ;
      p.fromColor = p.color;
      p.fromAlpha = p.targetAlpha;
      p.to = t;
      p.delay = clamp(p.fromX / shapeSize + 0.5) * 600 + random() * 80;
    });
    options.onMoving(true);
    options.onScene(scene);
    return true;
  }
  let cursorOriginX = 0,
    cursorOriginY = 0;
  function resize() {
    const heroBox = hero.getBoundingClientRect(),
      hostBox = host.getBoundingClientRect();
    width = heroBox.width;
    height = heroBox.height;
    if (!width || !height) return;
    // Use the full hero as the drawing surface so interaction trails and pulses aren't cropped.
    cursorOriginX = hostBox.left - heroBox.left;
    cursorOriginY = hostBox.top - heroBox.top;
    canvas.style.left = `${-cursorOriginX}px`;
    canvas.style.top = `${-cursorOriginY}px`;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const artSize =
      window.innerWidth > 760
        ? Math.min(height * 0.66, width * 0.38, 580)
        : Math.min(hostBox.width * 0.9, (hostBox.height - 32) * 0.95, 360);
    scale = artSize / 284;
    shapeSize = artSize;
    cx = cursorOriginX + hostBox.width * 0.5;
    cy = cursorOriginY + (hostBox.height - 47) * 0.5;
    if (morph) {
      active = morph.scene;
      morph = null;
      options.onMoving(false);
    }
    resetTargets(active);
    particles.forEach((p) => {
      p.x = cx + p.modelX;
      p.y = cy + p.modelY;
      p.vx = p.vy = 0;
      p.alpha = intro ? 0 : p.targetAlpha;
    });
    if (options.reducedMotion) render(0);
    schedule();
  }
  function updateScroll() {
    const hero = host.closest("section");
    if (!hero) return;
    const rect = hero.getBoundingClientRect(),
      progress = clamp(-rect.top / rect.height);
    scroll =
      window.innerWidth <= 760 ? clamp((progress - 0.45) / 0.55) : progress;
    options.controls.style.opacity = String(1 - clamp(scroll * 3));
  }
  function render(delta) {
    context.clearRect(0, 0, width, height);
    if (!width) return;
    const reduced = options.reducedMotion,
      step = clamp(delta / 16.667, 0.2, 1.8),
      seconds = clock / 1000;
    if (!reduced && dragReturn && clock > dragReturn.at && !dragStart) {
      const phase = clamp((clock - dragReturn.at) / 2400);
      drag = dragReturn.value * (1 - smooth(phase));
      if (phase === 1) dragReturn = null;
    }
    const desiredYaw = reduced
      ? 0
      : pointer.nx * 0.6 + drag + Math.sin(seconds * 0.5) * 0.22;
    const desiredPitch = reduced
      ? 0
      : -pointer.ny * 0.4 + Math.sin(seconds * 0.37) * 0.08;
    const response = 1 - Math.pow(0.93, step);
    yaw += (desiredYaw - yaw) * response;
    pitch += (desiredPitch - pitch) * response;
    const sy = Math.sin(yaw),
      cosY = Math.cos(yaw),
      sp = Math.sin(pitch),
      cosP = Math.cos(pitch),
      lens = shapeSize * 2.4;
    const morphAge = morph ? clock - morph.started : 0;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      let moving = false;
      if (morph) {
        const phase = clamp((morphAge - p.delay) / 580),
          blend = smooth(phase),
          arc = Math.sin(phase * Math.PI),
          dx = p.to.x - p.fromX,
          dy = p.to.y - p.fromY;
        p.modelX = lerp(p.fromX, p.to.x, blend) - dy * 0.3 * arc;
        p.modelY = lerp(p.fromY, p.to.y, blend) + dx * 0.3 * arc;
        p.modelZ = lerp(p.fromZ, p.to.z, blend) + shapeSize * 0.3 * arc;
        p.color = phase >= 1 ? p.to.color : p.fromColor;
        p.css =
          phase >= 1
            ? p.to.css
            : phase <= 0
              ? rgb(p.fromColor)
              : `rgb(${Math.round(lerp(p.fromColor[0], p.to.color[0], blend))},${Math.round(lerp(p.fromColor[1], p.to.color[1], blend))},${Math.round(lerp(p.fromColor[2], p.to.color[2], blend))})`;
        p.targetAlpha = lerp(p.fromAlpha, p.to.alpha, blend);
        moving = phase > 0 && phase < 1;
      }
      const rx = p.modelX * cosY + p.modelZ * sy,
        rz = -p.modelX * sy + p.modelZ * cosY,
        ry = p.modelY * cosP - rz * sp,
        depth = p.modelY * sp + rz * cosP,
        perspective = reduced ? 1 : lens / (lens - depth);
      let goalX = cx + rx * perspective + p.scatterX * scroll,
        goalY = cy + ry * perspective + p.scatterY * scroll,
        appearance = 1;
      if (reduced) {
        p.x = goalX;
        p.y = goalY;
        p.alpha = p.targetAlpha;
      } else if (intro) {
        const delay =
            clamp(Math.hypot(p.modelX, p.modelY) / (shapeSize * 0.62)) * 500 +
            (p.seed / TAU) * 100,
          progress = clamp((clock - delay) / 950),
          ease = 1 - Math.pow(1 - progress, 4),
          remain = 1 - ease,
          angle = p.spiral * remain,
          expansion = 1 + (p.expansion - 1) * remain,
          ax = goalX - cx,
          ay = goalY - cy;
        goalX =
          cx +
          (ax * Math.cos(angle) - ay * Math.sin(angle)) * expansion +
          p.jx * remain;
        goalY =
          cy +
          (ax * Math.sin(angle) + ay * Math.cos(angle)) * expansion +
          p.jy * remain;
        p.vx = goalX - p.x;
        p.vy = goalY - p.y;
        p.x = goalX;
        p.y = goalY;
        p.alpha = p.targetAlpha * (0.3 + 0.7 * ease);
        appearance = 0.6 + 0.4 * ease;
      } else if (moving) {
        p.vx = goalX - p.x;
        p.vy = goalY - p.y;
        p.x = goalX;
        p.y = goalY;
        p.alpha += (p.targetAlpha - p.alpha) * (1 - Math.pow(0.82, step));
      } else {
        p.vx += (goalX - p.x) * 0.045 * step;
        p.vy += (goalY - p.y) * 0.045 * step;
        const dx = p.x - pointer.x,
          dy = p.y - pointer.y,
          distance = Math.hypot(dx, dy),
          radius = Math.min(130, shapeSize * 0.32);
        if (pointer.inside && distance < radius && distance > 0.01) {
          const force = (1 - distance / radius) * 2.6 * step;
          p.vx += (dx / distance) * force;
          p.vy += (dy / distance) * force;
        }
        const friction = Math.pow(0.82, step);
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx * step;
        p.y += p.vy * step;
        p.alpha += (p.targetAlpha - p.alpha) * (1 - Math.pow(0.92, step));
      }
      if (p.alpha < 0.02) continue;
      const size = 4.5 * scale * 0.36 * p.size * perspective * appearance;
      context.globalAlpha =
        p.alpha *
        (1 - scroll * 0.85) *
        clamp(0.45 + (perspective - 0.85) * 2.2, 0.12, 1);
      context.fillStyle = context.strokeStyle = p.css;
      const speed = Math.hypot(p.vx, p.vy),
        trail = Math.min(55, speed * (moving ? 0.8 : intro ? 1.1 : 2.4));
      if (!reduced && speed > 3) {
        context.lineWidth = size * 2;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(
          p.x - (p.vx / speed) * trail,
          p.y - (p.vy / speed) * trail,
        );
        context.lineTo(p.x, p.y);
        context.stroke();
      } else {
        context.beginPath();
        context.arc(p.x, p.y, size, 0, TAU);
        context.fill();
      }
    }
    if (intro && clock > 1700 && !introPulse && !reduced) {
      pulses.push(clock);
      introPulse = true;
      intro = false;
    }
    if (morph && morphAge > 1300) {
      active = morph.scene;
      morph = null;
      resetTargets(active);
      pulses.push(clock);
      options.onMoving(false);
    }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const phase = (clock - pulses[i]) / 900;
      if (phase >= 1) {
        pulses.splice(i, 1);
        continue;
      }
      const eased = 1 - Math.pow(1 - phase, 3);
      context.globalAlpha = (1 - phase) * 0.48 * (1 - scroll);
      context.strokeStyle = i % 2 ? palette.peach : palette.green;
      context.lineWidth = 1 + (1 - phase) * 2;
      context.beginPath();
      context.arc(cx, cy, shapeSize * (0.12 + 0.7 * eased), 0, TAU);
      context.stroke();
    }
    context.globalAlpha = 1;
    options.controls.style.setProperty(
      "--scene-progress",
      String(
        reduced
          ? 1
          : morph
            ? 0
            : clamp(1 - (nextChange - clock) / (PERIOD - 1300)),
      ),
    );
    if (options.cursor) {
      cursorX += (pointer.x - cursorX) * 0.24;
      cursorY += (pointer.y - cursorY) * 0.24;
      options.cursor.style.transform = `translate(${cursorX - cursorOriginX}px,${cursorY - cursorOriginY}px) translate(-50%,-50%)`;
    }
    if (
      !reduced &&
      !intro &&
      !morph &&
      !dragStart &&
      scroll < 0.15 &&
      clock >= nextChange
    )
      select((active + 1) % models.length);
  }
  function tick(time) {
    frame = 0;
    if (destroyed || !inView || document.hidden) return;
    const delta = lastTime ? Math.min(80, time - lastTime) : 16.667;
    lastTime = time;
    clock += delta;
    render(delta);
    schedule();
  }
  function schedule() {
    if (
      !destroyed &&
      !options.reducedMotion &&
      inView &&
      !document.hidden &&
      !frame
    )
      frame = requestAnimationFrame(tick);
  }
  function visibility() {
    if (!inView || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    } else schedule();
  }
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    visibility();
  });
  observer.observe(canvas);
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(host);
  sizeObserver.observe(hero);
  function move(event) {
    const box = canvas.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
    pointer.nx = clamp((pointer.x - cx) / (width * 0.5), -1, 1);
    pointer.ny = clamp((pointer.y - cy) / (height * 0.5), -1, 1);
    pointer.inside = true;
    if (options.cursor)
      options.cursor.style.opacity = event.pointerType === "touch" ? "0" : "1";
    if (dragStart) {
      const dx = event.clientX - dragStart.x;
      if (Math.abs(dx) > 6) moved = true;
      drag = dragStart.value + dx * 0.012;
    }
  }
  function down(event) {
    if (options.reducedMotion || event.button > 0) return;
    move(event);
    dragStart = { x: event.clientX, value: drag };
    dragReturn = null;
    moved = false;
    canvas.setPointerCapture(event.pointerId);
  }
  function up(event) {
    if (!dragStart) return;
    dragReturn = { at: clock + 1200, value: drag };
    dragStart = null;
    if (canvas.hasPointerCapture(event.pointerId))
      canvas.releasePointerCapture(event.pointerId);
  }
  function leave() {
    pointer.inside = false;
    pointer.nx = pointer.ny = 0;
    pointer.x = pointer.y = -10000;
    if (options.cursor) options.cursor.style.opacity = "0";
  }
  function click() {
    if (options.reducedMotion) return;
    if (moved) {
      moved = false;
      return;
    }
    select(active + 1);
  }
  const listeners = [
    [canvas, "pointermove", move],
    [canvas, "pointerdown", down],
    [canvas, "pointerup", up],
    [canvas, "pointercancel", up],
    [canvas, "pointerleave", leave],
    [canvas, "click", click],
    [window, "scroll", updateScroll],
    [document, "visibilitychange", visibility],
  ];
  for (const [element, name, handler] of listeners)
    element.addEventListener(name, handler, { passive: true });
  resize();
  updateScroll();
  return {
    select,
    destroy() {
      destroyed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      for (const [element, name, handler] of listeners)
        element.removeEventListener(name, handler);
    },
  };
}
