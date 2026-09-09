"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Full-bleed hero atmosphere: CSS vertical gradient + WebGL film-grain overlay.
 * Layout technique mirrors the mosaic/noise panel reference; colors stay on
 * Monochromia ink/paper tokens (see .hero-mosaic-bg in globals.css).
 */

const VERT = `#version 300 es
in vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision mediump float;
out vec4 outColor;
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
  float n = rand(gl_FragCoord.xy);
  outColor = vec4(vec3(n), 0.38);
}`;

const VERT_LEGACY = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG_LEGACY = `
precision mediump float;
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
  float n = rand(gl_FragCoord.xy);
  gl_FragColor = vec4(vec3(n), 0.38);
}`;

type GlCtx = WebGLRenderingContext | WebGL2RenderingContext;

function compile(gl: GlCtx, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function linkProgram(gl: GlCtx, vertSrc: string, fragSrc: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return null;
  }
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function initNoise(canvas: HTMLCanvasElement) {
  const attrs: WebGLContextAttributes = {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  };

  const gl2 = canvas.getContext("webgl2", attrs);
  const gl: GlCtx | null = gl2 ?? canvas.getContext("webgl", attrs);
  if (!gl) return null;

  const program = gl2
    ? linkProgram(gl2, VERT, FRAG)
    : linkProgram(gl, VERT_LEGACY, FRAG_LEGACY);
  if (!program) return null;

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const loc = gl.getAttribLocation(program, "a_pos");
  gl.useProgram(program);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const draw = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const dispose = () => {
    gl.deleteProgram(program);
    gl.deleteBuffer(buf);
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  return { draw, dispose };
}

export function HeroMosaicBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    // Static CSS grain only — skip WebGL for reduced motion / battery.
    if (reduceMotion) {
      canvas.dataset.webgl = "skipped";
      return;
    }

    const api = initNoise(canvas);
    if (!api) {
      canvas.dataset.webgl = "failed";
      return;
    }
    canvas.dataset.webgl = "ready";

    let cancelled = false;
    let visible = true;

    const draw = () => {
      if (cancelled || !visible) return;
      api.draw();
    };

    const ro = new ResizeObserver(() => draw());
    ro.observe(host);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              visible = Boolean(entry?.isIntersecting);
              if (visible) draw();
            },
            { rootMargin: "80px", threshold: 0 },
          )
        : null;
    io?.observe(host);

    draw();

    return () => {
      cancelled = true;
      ro.disconnect();
      io?.disconnect();
      api.dispose();
    };
  }, [reduceMotion]);

  return (
    <div
      ref={hostRef}
      className="hero-mosaic-bg"
      aria-hidden="true"
      data-reduced-motion={reduceMotion ? "true" : "false"}
    >
      <div className="hero-mosaic-bg__gradient" />
      <canvas ref={canvasRef} className="hero-mosaic-bg__noise" />
      <div className="hero-mosaic-bg__fallback-noise" />
      <div className="hero-mosaic-bg__veil" />
    </div>
  );
}
