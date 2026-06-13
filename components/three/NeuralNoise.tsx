"use client";

import { useEffect, useRef } from "react";

interface NeuralNoiseProps {
  /** RGB line color, each channel 0..1 */
  color?: [number, number, number];
  opacity?: number;
  speed?: number;
}

/**
 * NeuralNoise — animated WebGL "neural link" field (from 21st.dev).
 * Adapted to TypeScript with proper RAF cleanup. Reacts to pointer position.
 */
export default function NeuralNoise({
  color = [0.29, 0.51, 0.66],
  opacity = 0.95,
  speed = 0.001,
}: NeuralNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const gl =
      (canvasEl.getContext("webgl") as WebGLRenderingContext | null) ||
      (canvasEl.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const pointer = { x: 0, y: 0, tX: 0, tY: 0 };
    let frameId = 0;

    const vsSource = `
      precision mediump float;
      varying vec2 vUv;
      attribute vec2 a_position;
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;
    const fsSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;
      uniform vec3 u_color;
      uniform float u_speed;
      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }
      float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = 8.0;
        for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.0);
          sine_acc = rotate(sine_acc, 1.0);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer) + 2.4 * p;
          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.2;
        }
        return res.x + res.y;
      }
      void main() {
        vec2 uv = 0.5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0.0, 1.0);
        p = 0.5 * pow(1.0 - p, 2.0);
        float t = u_speed * u_time;
        vec3 col = vec3(0.0);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.0);
        noise += pow(noise, 10.0);
        noise = max(0.0, noise - 0.5);
        noise *= (1.0 - length(vUv - 0.5));
        col = u_color * noise;
        gl_FragColor = vec4(col, noise);
      }
    `;

    const createShader = (src: string, type: number) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(vsSource, gl.VERTEX_SHADER);
    const fragmentShader = createShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    // Collect uniform locations
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < uniformCount; i++) {
      const name = gl.getActiveUniform(program, i)!.name;
      uniforms[name] = gl.getUniformLocation(program, name);
    }

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.useProgram(program);
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform3f(uniforms.u_color, color[0], color[1], color[2]);
    gl.uniform1f(uniforms.u_speed, speed);

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvasEl.width = window.innerWidth * dpr;
      canvasEl.height = window.innerHeight * dpr;
      if (uniforms.u_ratio) gl.uniform1f(uniforms.u_ratio, canvasEl.width / canvasEl.height);
      gl.viewport(0, 0, canvasEl.width, canvasEl.height);
    };

    const render = () => {
      const currentTime = performance.now();
      pointer.x += (pointer.tX - pointer.x) * 0.2;
      pointer.y += (pointer.tY - pointer.y) * 0.2;
      gl.uniform1f(uniforms.u_time, currentTime);
      gl.uniform2f(
        uniforms.u_pointer_position,
        pointer.x / window.innerWidth,
        1 - pointer.y / window.innerHeight
      );
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(render);
    };

    const updateMouse = (x: number, y: number) => {
      pointer.tX = x;
      pointer.tY = y;
    };
    const onPointerMove = (e: PointerEvent) => updateMouse(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.targetTouches[0]) updateMouse(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    };
    const onClick = (e: MouseEvent) => updateMouse(e.clientX, e.clientY);
    const onResize = () => resizeCanvas();

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    resizeCanvas();
    render();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      gl.deleteProgram(program);
      gl.deleteBuffer(vertexBuffer);
    };
  }, [color, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
      }}
    />
  );
}
