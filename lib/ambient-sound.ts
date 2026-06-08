/**
 * Web Audio API ambient synthesizer — no files required.
 * Creates a layered drone: sub-bass sine + filtered noise + slow LFO.
 * Fades in/out smoothly. Call init() on first user interaction.
 */

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let running = false;
let nodes: AudioNode[] = [];

function buildGraph(audioCtx: AudioContext, gain: GainNode) {
  nodes = [];

  // ── Sub-bass sine tone ──────────────────────────────────────
  const subOsc = audioCtx.createOscillator();
  subOsc.type = "sine";
  subOsc.frequency.value = 42; // Hz — below audible fundamental, felt more than heard
  const subGain = audioCtx.createGain();
  subGain.gain.value = 0.22;
  subOsc.connect(subGain);
  subGain.connect(gain);
  subOsc.start();
  nodes.push(subOsc, subGain);

  // ── Second partial — creates mild harmonic depth ────────────
  const osc2 = audioCtx.createOscillator();
  osc2.type = "sine";
  osc2.frequency.value = 84; // octave up
  const g2 = audioCtx.createGain();
  g2.gain.value = 0.08;
  osc2.connect(g2);
  g2.connect(gain);
  osc2.start();
  nodes.push(osc2, g2);

  // ── Filtered white noise — subtle air texture ───────────────
  const bufSize = audioCtx.sampleRate * 2;
  const buffer = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  const bpf = audioCtx.createBiquadFilter();
  bpf.type = "bandpass";
  bpf.frequency.value = 300;
  bpf.Q.value = 0.4;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.value = 0.04;
  noiseSource.connect(bpf);
  bpf.connect(noiseGain);
  noiseGain.connect(gain);
  noiseSource.start();
  nodes.push(noiseSource, bpf, noiseGain);

  // ── Slow LFO tremolo on sub (0.05 Hz — 20 second cycle) ────
  const lfo = audioCtx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.05;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 0.06;
  lfo.connect(lfoGain);
  lfoGain.connect(subGain.gain);
  lfo.start();
  nodes.push(lfo, lfoGain);
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

  // Fade in over 2.5s
  masterGain!.gain.cancelScheduledValues(ctx.currentTime);
  masterGain!.gain.setValueAtTime(masterGain!.gain.value, ctx.currentTime);
  masterGain!.gain.linearRampToValueAtTime(1, ctx.currentTime + 2.5);
}

export function stopAmbient(): void {
  if (!running || !ctx || !masterGain) return;
  running = false;

  // Fade out over 1.5s then suspend
  masterGain.gain.cancelScheduledValues(ctx.currentTime);
  masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);

  setTimeout(() => {
    if (!running && ctx?.state === "running") ctx.suspend();
  }, 1600);
}

export function isAmbientRunning(): boolean {
  return running;
}
