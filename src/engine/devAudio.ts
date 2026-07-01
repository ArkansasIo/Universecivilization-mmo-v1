export type DevSoundName = 'uiPing' | 'select' | 'error';

const SAMPLE_RATE = 22050;

const DEV_SOUND_SETTINGS: Record<DevSoundName, { frequency: number; duration: number; gain: number }> = {
  uiPing: { frequency: 880, duration: 0.12, gain: 0.22 },
  select: { frequency: 660, duration: 0.16, gain: 0.2 },
  error: { frequency: 220, duration: 0.2, gain: 0.18 },
};

function writeString(view: DataView, offset: number, value: string) {
  for (let i = 0; i < value.length; i++) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}

function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function createDevSoundDataUri(name: DevSoundName): string {
  const settings = DEV_SOUND_SETTINGS[name];
  const sampleCount = Math.max(1, Math.floor(SAMPLE_RATE * settings.duration));
  const bytesPerSample = 2;
  const dataSize = sampleCount * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < sampleCount; i++) {
    const t = i / SAMPLE_RATE;
    const envelope = 1 - i / sampleCount;
    const sample = Math.sin(Math.PI * 2 * settings.frequency * t) * settings.gain * envelope;
    view.setInt16(44 + i * bytesPerSample, Math.max(-1, Math.min(1, sample)) * 0x7fff, true);
  }

  return `data:audio/wav;base64,${encodeBase64(new Uint8Array(buffer))}`;
}
