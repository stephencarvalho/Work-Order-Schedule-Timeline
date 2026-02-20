declare module 'canvas-confetti' {
  interface ConfettiOrigin {
    x?: number;
    y?: number;
  }

  interface ConfettiOptions {
    particleCount?: number;
    startVelocity?: number;
    spread?: number;
    ticks?: number;
    zIndex?: number;
    origin?: ConfettiOrigin;
  }

  type ConfettiFn = (options?: ConfettiOptions) => Promise<null>;

  const confetti: ConfettiFn;
  export default confetti;
}

