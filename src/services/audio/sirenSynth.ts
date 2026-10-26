import fahAlarmUrl from '../../assets/sound/fah-perfect-sync.mp3';

/**
 * Audio player service for the anti-distraction alarm using the fah audio track.
 */
class FahAlarmService {
  private audio: HTMLAudioElement | null = null;
  private isRunning: boolean = false;

  private getAudio(): HTMLAudioElement {
    if (!this.audio) {
      this.audio = new Audio(fahAlarmUrl);
      this.audio.loop = true;
      this.audio.volume = 0.9;
    }
    return this.audio;
  }

  public start(): void {
    if (this.isRunning) return;

    try {
      const sound = this.getAudio();
      sound.currentTime = 0;
      sound.play().catch((err) => {
        console.warn('Audio play deferred or blocked by browser policy:', err);
      });
      this.isRunning = true;
    } catch (e) {
      console.error('Failed to play fah alarm sound:', e);
    }
  }

  public stop(): void {
    if (!this.isRunning && !this.audio) return;

    try {
      if (this.audio) {
        this.audio.pause();
        this.audio.currentTime = 0;
      }
    } catch (e) {
      console.error('Failed to stop fah alarm sound:', e);
    } finally {
      this.isRunning = false;
    }
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

export const sirenSynth = new FahAlarmService();
export const alarmPlayer = sirenSynth;
