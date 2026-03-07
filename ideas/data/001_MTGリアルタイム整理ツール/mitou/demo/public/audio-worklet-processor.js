/**
 * AudioWorklet Processor for streaming PCM audio to WebSocket.
 *
 * Captures mic audio, downsamples to 16kHz mono,
 * converts Float32 to Int16LE, and posts to main thread
 * in frames of FRAME_SIZE samples.
 */
class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(0);
    // Output frame size: 4096 samples @ 16kHz = 256ms
    this.FRAME_SIZE = 4096;
    // Will be set based on actual AudioContext sampleRate
    this.inputSampleRate = sampleRate; // global in AudioWorklet scope
    this.downsampleRatio = this.inputSampleRate / 16000;
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    if (!input || !input[0] || input[0].length === 0) return true;

    // Take first channel (mono)
    const channelData = input[0];

    // Downsample to 16kHz
    const downsampled = this.downsample(channelData);

    // Append to buffer
    const newBuffer = new Float32Array(this.buffer.length + downsampled.length);
    newBuffer.set(this.buffer);
    newBuffer.set(downsampled, this.buffer.length);
    this.buffer = newBuffer;

    // Emit frames of FRAME_SIZE
    while (this.buffer.length >= this.FRAME_SIZE) {
      const frame = this.buffer.slice(0, this.FRAME_SIZE);
      this.buffer = this.buffer.slice(this.FRAME_SIZE);

      // Convert Float32 [-1.0, 1.0] to Int16LE
      const int16 = new Int16Array(frame.length);
      for (let i = 0; i < frame.length; i++) {
        const s = Math.max(-1, Math.min(1, frame[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      this.port.postMessage(int16.buffer, [int16.buffer]);
    }

    return true;
  }

  downsample(input) {
    if (this.downsampleRatio === 1) return input;

    const outputLength = Math.floor(input.length / this.downsampleRatio);
    const output = new Float32Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      // Simple linear interpolation downsampling
      const srcIndex = i * this.downsampleRatio;
      const srcIndexFloor = Math.floor(srcIndex);
      const srcIndexCeil = Math.min(srcIndexFloor + 1, input.length - 1);
      const frac = srcIndex - srcIndexFloor;
      output[i] = input[srcIndexFloor] * (1 - frac) + input[srcIndexCeil] * frac;
    }

    return output;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
