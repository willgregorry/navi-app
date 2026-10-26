/**
 * Web Audio API synthesizer for the anti-distraction siren alarm.
 * Runs completely locally without external audio files.
 */
class SirenSynthesizer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  private isRunning: boolean = false;

  public start(): void {
    if (this.isRunning) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Main tone oscillator (high pitch siren)
      this.osc = this.ctx.createOscillator();
      this.osc.type = 'sawtooth';
      this.osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5

      // LFO for pitch modulation (warbling effect)
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(3.5, this.ctx.currentTime); // 3.5 cycles per second

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(250, this.ctx.currentTime); // Modulation depth

      this.lfo.connect(lfoGain);
      lfoGain.connect(this.osc.frequency);

      // Volume control
      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

      this.osc.connect(this.gain);
      this.gain.connect(this.ctx.destination);

      this.lfo.start();
      this.osc.start();
      this.isRunning = true;
    } catch (e) {
      console.error('Failed to initialize Web Audio siren:', e);
    }
  }

  public stop(): void {
    if (!this.isRunning) return;

    try {
      if (this.osc) {
        this.osc.stop();
        this.osc.disconnect();
      }
      if (this.lfo) {
        this.lfo.stop();
        this.lfo.disconnect();
      }
      if (this.gain) {
        this.gain.disconnect();
      }
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close();
      }
    } catch (e) {
      console.error('Error stopping siren:', e);
    } finally {
      this.osc = null;
      this.lfo = null;
      this.gain = null;
      this.ctx = null;
      this.isRunning = false;
    }
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

export const sirenSynth = new SirenSynthesizer();
