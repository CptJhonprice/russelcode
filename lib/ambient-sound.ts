/**
 * Ocean wave ambient — pure Web Audio API, no files needed.
 * 4 layered noise sources: main wave swell, sub rumble, mid wash, high spray.
 * Slow amplitude LFOs (0.06-0.10 Hz) create realistic wave rhythm.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let running = false;
let nodes: AudioNode[] = [];

function makeNoiseBuf(audioCtx: AudioContext, seconds: number) {
  const size = audioCtx.sampleRate * seconds;
  const buf  = audioCtx.createBuffer(1, size, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < size; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function buildGraph(audioCtx: AudioContext, gain: GainNode) {
  nodes = [];

  // ── LAYER 1: Main ocean swell — bandpass + amplitude LFO ──────────
  const swell = audioCtx.createBufferSource();
  swell.buffer = makeNoiseBuf(audioCtx, 3);
  swell.loop = true;

  const bpf1 = audioCtx.createBiquadFilter();
  bpf1.type = "bandpass";
  bpf1.frequency.value = 280;
  bpf1.Q.value = 0.65;

  // Filter sweep LFO — wave building & crashing
  const filterLFO = audioCtx.createOscillator();
  filterLFO.type = "sine";
  filterLFO.frequency.value = 0.065; // ~15s wave cycle
  const filterLFOGain = audioCtx.createGain();
  filterLFOGain.gain.value = 130;
  filterLFO.connect(filterLFOGain);
  filterLFOGain.connect(bpf1.frequency);
  filterLFO.start();

  // Amplitude swell LFO
  const swellLFO = audioCtx.createOscillator();
  swellLFO.type = "sine";
  swellLFO.frequency.value = 0.075;
  const swellLFOGain = audioCtx.createGain();
  swellLFOGain.gain.value = 0.28;
  swellLFO.connect(swellLFOGain);
  swellLFO.start();

  const swellGain = audioCtx.createGain();
  swellGain.gain.value = 0.32;
  swellLFOGain.connect(swellGain.gain);

  swell.connect(bpf1);
  bpf1.connect(swellGain);
  swellGain.connect(gain);
  swell.start();

  // ── LAYER 2: Sub-ocean rumble — deep lowpass ───────────────────────
  const rumbleSrc = audioCtx.createBufferSource();
  rumbleSrc.buffer = makeNoiseBuf(audioCtx, 2);
  rumbleSrc.loop = true;

  const lpf2 = audioCtx.createBiquadFilter();
  lpf2.type = "lowpass";
  lpf2.frequency.value = 55;
  lpf2.Q.value = 0.4;

  const rumbleGain = audioCtx.createGain();
  rumbleGain.gain.value = 0.28;

  rumbleSrc.connect(lpf2);
  lpf2.connect(rumbleGain);
  rumbleGain.connect(gain);
  rumbleSrc.start();

  // ── LAYER 3: Mid-freq wave wash ────────────────────────────────────
  const washSrc = audioCtx.createBufferSource();
  washSrc.buffer = makeNoiseBuf(audioCtx, 5);
  washSrc.loop = true;

  const bpf3 = audioCtx.createBiquadFilter();
  bpf3.type = "bandpass";
  bpf3.frequency.value = 700;
  bpf3.Q.value = 0.45;

  const washLFO = audioCtx.createOscillator();
  washLFO.type = "sine";
  washLFO.frequency.value = 0.055;
  const washLFOGain = audioCtx.createGain();
  washLFOGain.gain.value = 0.1;
  washLFO.connect(washLFOGain);
  washLFO.start();

  const washGain = audioCtx.createGain();
  washGain.gain.value = 0.14;
  washLFOGain.connect(washGain.gain);

  washSrc.connect(bpf3);
  bpf3.connect(washGain);
  washGain.connect(gain);
  washSrc.start();

  // ── LAYER 4: High-freq sea spray / foam ───────────────────────────
  const spraySrc = audioCtx.createBufferSource();
  spraySrc.buffer = makeNoiseBuf(audioCtx, 4);
  spraySrc.loop = true;

  const hpf4 = audioCtx.createBiquadFilter();
  hpf4.type = "highpass";
  hpf4.frequency.value = 2800;
  hpf4.Q.value = 0.25;

  const sprayLFO = audioCtx.createOscillator();
  sprayLFO.type = "sine";
  sprayLFO.frequency.value = 0.095; // slightly out of phase with swell
  const sprayLFOGain = audioCtx.createGain();
  sprayLFOGain.gain.value = 0.032;
  sprayLFO.connect(sprayLFOGain);
  sprayLFO.start();

  const sprayGain = audioCtx.createGain();
  sprayGain.gain.value = 0.038;
  sprayLFOGain.connect(sprayGain.gain);

  spraySrc.connect(hpf4);
  hpf4.connect(sprayGain);
  sprayGain.connect(gain);
  spraySrc.start();

  nodes.push(
    swell, bpf1, filterLFO, filterLFOGain, swellLFO, swellLFOGain, swellGain,
    rumbleSrc, lpf2, rumbleGain,
    washSrc, bpf3, washLFO, washLFOGain, washGain,
    spraySrc, hpf4, sprayLFO, sprayLFOGain, sprayGain,
  );
}

export function startAmbient(): void {
  if (running) return;
  running = true;

  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    buildGraph(ctx, masterGain);
  }

  if (ctx.state === "suspended") ctx.resume();

  masterGain!.gain.cancelScheduledValues(ctx.currentTime);
  masterGain!.gain.setValueAtTime(masterGain!.gain.value, ctx.currentTime);
  masterGain!.gain.linearRampToValueAtTime(1, ctx.currentTime + 3);
}

export function stopAmbient(): void {
  if (!running || !ctx || !masterGain) return;
  running = false;

  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);

  setTimeout(() => {
    if (!running && ctx?.state === "running") ctx.suspend();
  }, 2100);
}

export function isAmbientRunning(): boolean {
  return running;
}
