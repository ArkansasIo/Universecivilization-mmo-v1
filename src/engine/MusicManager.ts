import { type MusicTrack, type MusicPlaylist, type EngineEvent } from './types';

type EventCallback = (event: EngineEvent) => void;

interface MusicState {
  currentTrackId: string | null;
  playlistId: string | null;
  playing: boolean;
  volume: number;
  shuffle: boolean;
  loopPlaylist: boolean;
  crossfadeDuration: number;
}

export class MusicManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private activeSource: AudioBufferSourceNode | null = null;
  private activeGain: GainNode | null = null;
  private nextSource: AudioBufferSourceNode | null = null;
  private nextGain: GainNode | null = null;
  private loadedBuffers = new Map<string, AudioBuffer>();
  private tracks = new Map<string, MusicTrack>();
  private playlists = new Map<string, MusicPlaylist>();
  private state: MusicState = {
    currentTrackId: null, playlistId: null, playing: false,
    volume: 0.5, shuffle: false, loopPlaylist: true, crossfadeDuration: 2,
  };
  private playlistOrder: string[] = [];
  private playlistIndex = -1;
  private onEvent: EventCallback | null = null;

  setOnEvent(cb: EventCallback) { this.onEvent = cb; }

  private emit(type: EngineEvent['type'], payload?: unknown) {
    this.onEvent?.({ type, payload, timestamp: Date.now() });
  }

  init(audioContext: AudioContext) {
    this.ctx = audioContext;
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1;
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = this.state.volume;
    this.musicGain.connect(this.masterGain);
  }

  get playing() { return this.state.playing; }
  get currentTrackId() { return this.state.currentTrackId; }
  get volume() { return this.state.volume; }

  registerTrack(track: MusicTrack) {
    this.tracks.set(track.id, track);
  }

  registerPlaylist(playlist: MusicPlaylist) {
    this.playlists.set(playlist.id, playlist);
    this.state.shuffle = playlist.shuffle;
    this.state.loopPlaylist = playlist.loop;
    if (this.state.playlistId === playlist.id) {
      this.rebuildPlaylistOrder();
    }
  }

  async loadTrack(id: string): Promise<AudioBuffer> {
    if (this.loadedBuffers.has(id)) return this.loadedBuffers.get(id)!;
    const track = this.tracks.get(id);
    if (!track) throw new Error(`Track not registered: ${id}`);
    if (!this.ctx) throw new Error('MusicManager not initialized');

    const response = await fetch(track.url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    this.loadedBuffers.set(id, audioBuffer);
    return audioBuffer;
  }

  setVolume(vol: number) {
    this.state.volume = Math.max(0, Math.min(1, vol));
    if (this.musicGain) this.musicGain.gain.value = this.state.volume;
  }

  async playPlaylist(playlistId: string, startIndex = 0) {
    const playlist = this.playlists.get(playlistId);
    if (!playlist) throw new Error(`Playlist not found: ${playlistId}`);

    this.state.playlistId = playlistId;
    this.state.shuffle = playlist.shuffle;
    this.state.loopPlaylist = playlist.loop;
    this.rebuildPlaylistOrder();

    for (const track of playlist.tracks) {
      if (!this.tracks.has(track.id)) this.registerTrack(track);
    }

    this.playlistIndex = Math.max(0, Math.min(startIndex, this.playlistOrder.length - 1));
    await this.playTrackAtIndex();
    this.state.playing = true;
    this.emit('music:play', { playlistId });
  }

  async playTrack(trackId: string) {
    if (!this.tracks.has(trackId)) throw new Error(`Track not registered: ${trackId}`);
    this.state.currentTrackId = trackId;
    this.state.playlistId = null;
    this.playlistIndex = -1;
    await this.startTrack(trackId);
    this.state.playing = true;
  }

  stop() {
    this.fadeOutAndStop();
    this.state.playing = false;
    this.state.currentTrackId = null;
    this.emit('music:stop', {});
  }

  pause() {
    if (!this.ctx || !this.state.playing) return;
    if (this.ctx.state === 'running') {
      this.ctx.suspend();
      this.state.playing = false;
    }
  }

  resume() {
    if (!this.ctx || this.state.playing) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
      this.state.playing = true;
    }
  }

  next() {
    if (!this.state.playlistId || this.playlistOrder.length === 0) return;
    this.playlistIndex++;
    if (this.playlistIndex >= this.playlistOrder.length) {
      if (this.state.loopPlaylist) this.playlistIndex = 0;
      else { this.stop(); return; }
    }
    this.playTrackAtIndex();
  }

  previous() {
    if (!this.state.playlistId || this.playlistOrder.length === 0) return;
    this.playlistIndex--;
    if (this.playlistIndex < 0) {
      this.playlistIndex = this.playlistOrder.length - 1;
    }
    this.playTrackAtIndex();
  }

  seek(time: number) {
    if (!this.activeSource || !this.state.currentTrackId) return;
    const track = this.tracks.get(this.state.currentTrackId);
    if (!track) return;

    this.activeSource.stop();
    const buffer = this.loadedBuffers.get(this.state.currentTrackId);
    if (!buffer) return;

    const newSource = this.ctx!.createBufferSource();
    newSource.buffer = buffer;
    const newGain = this.ctx!.createGain();
    newGain.gain.value = this.state.volume;
    newSource.connect(newGain);
    newGain.connect(this.musicGain!);
    newSource.start(0, Math.max(0, Math.min(time, buffer.duration)));
    this.activeSource = newSource;
    this.activeGain = newGain;
  }

  private async playTrackAtIndex() {
    if (this.playlistIndex < 0 || this.playlistIndex >= this.playlistOrder.length) return;
    const trackId = this.playlistOrder[this.playlistIndex];
    const track = this.tracks.get(trackId);
    if (!track) return;

    await this.crossfadeTo(trackId);
    this.state.currentTrackId = trackId;
    this.emit('music:trackChange', { trackId, title: track.title });
  }

  private async startTrack(trackId: string) {
    const buffer = await this.loadTrack(trackId);
    if (!this.ctx || !this.musicGain) return;

    this.stopCurrent();

    this.activeGain = this.ctx.createGain();
    this.activeGain.gain.value = 0;
    this.activeGain.connect(this.musicGain);

    this.activeSource = this.ctx.createBufferSource();
    this.activeSource.buffer = buffer;
    this.activeSource.loop = false;
    this.activeSource.connect(this.activeGain);
    this.activeSource.start(0);

    this.activeGain.gain.linearRampToValueAtTime(this.state.volume, this.ctx.currentTime + 0.5);

    this.activeSource.onended = () => {
      if (this.state.playlistId) this.next();
    };

    this.state.currentTrackId = trackId;
  }

  private async crossfadeTo(trackId: string) {
    const buffer = await this.loadTrack(trackId);
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;
    const crossfade = this.state.crossfadeDuration;

    if (this.activeGain) {
      this.activeGain.gain.linearRampToValueAtTime(0, now + crossfade);
    }

    this.nextGain = this.ctx.createGain();
    this.nextGain.gain.value = 0;
    this.nextGain.connect(this.musicGain);

    this.nextSource = this.ctx.createBufferSource();
    this.nextSource.buffer = buffer;
    this.nextSource.loop = false;
    this.nextSource.connect(this.nextGain);
    this.nextSource.start(0);

    this.nextGain.gain.linearRampToValueAtTime(this.state.volume, now + crossfade);

    if (this.activeSource) {
      const activeSrc = this.activeSource;
      setTimeout(() => {
        try { activeSrc.stop(); } catch { /* already ended */ }
      }, crossfade * 1000 + 100);
    }

    this.nextSource.onended = () => {
      if (this.state.playlistId) setTimeout(() => this.next(), 1000);
    };

    this.activeSource = this.nextSource;
    this.activeGain = this.nextGain;
    this.nextSource = null;
    this.nextGain = null;
  }

  private stopCurrent() {
    if (this.activeSource) {
      try { this.activeSource.stop(); } catch { /* okay */ }
    }
    this.activeSource = null;
    this.activeGain = null;
  }

  private fadeOutAndStop() {
    if (!this.activeGain || !this.ctx) {
      this.stopCurrent();
      return;
    }
    const now = this.ctx.currentTime;
    this.activeGain.gain.linearRampToValueAtTime(0, now + 0.5);
    setTimeout(() => this.stopCurrent(), 600);
  }

  private rebuildPlaylistOrder() {
    const playlist = this.playlists.get(this.state.playlistId ?? '');
    if (!playlist) { this.playlistOrder = []; return; }

    this.playlistOrder = playlist.tracks.map(t => t.id);
    if (this.state.shuffle) {
      for (let i = this.playlistOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.playlistOrder[i], this.playlistOrder[j]] = [this.playlistOrder[j], this.playlistOrder[i]];
      }
    }
  }

  getCurrentPlaylistInfo(): { playlistId: string | null; position: number; total: number } {
    return {
      playlistId: this.state.playlistId,
      position: this.playlistIndex,
      total: this.playlistOrder.length,
    };
  }

  dispose() {
    this.stopCurrent();
    if (this.nextSource) { try { this.nextSource.stop(); } catch { /* okay */ } }
    this.nextSource = null;
    this.nextGain = null;
    this.loadedBuffers.clear();
    this.tracks.clear();
    this.playlists.clear();
    this.state.currentTrackId = null;
    this.state.playing = false;
  }
}
