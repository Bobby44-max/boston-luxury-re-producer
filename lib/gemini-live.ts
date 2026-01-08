/**
 * Gemini Live API Client for Browser
 * Handles WebSocket connection to Gemini 2.0 Flash Live API
 */

export interface GeminiLiveConfig {
  onOpen?: () => void;
  onClose?: (reason: string) => void;
  onError?: (error: string) => void;
  onAudioResponse?: (audioData: ArrayBuffer) => void;
  onTextResponse?: (text: string) => void;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
}

export class GeminiLiveClient {
  private ws: WebSocket | null = null;
  private config: GeminiLiveConfig;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private audioWorklet: AudioWorkletNode | null = null;
  private isConnected = false;

  constructor(config: GeminiLiveConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      // Get ephemeral token from our API
      const tokenResponse = await fetch("/api/live/token", { method: "POST" });
      const { token, model } = await tokenResponse.json();

      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      // Connect to Gemini Live API via WebSocket
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${token}`;

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;

        // Send initial setup message
        this.sendSetup(model);

        this.config.onOpen?.();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        this.config.onError?.("Connection error");
      };

      this.ws.onclose = (event) => {
        this.isConnected = false;
        this.config.onClose?.(event.reason || "Connection closed");
      };
    } catch (error) {
      console.error("Connect error:", error);
      this.config.onError?.(
        error instanceof Error ? error.message : "Failed to connect"
      );
      throw error;
    }
  }

  private sendSetup(model: string): void {
    const setupMessage = {
      setup: {
        model: `models/${model}`,
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: "Aoede",
              },
            },
          },
        },
        systemInstruction: {
          parts: [
            {
              text: `You are a luxury real estate consultant for the Boston market.
You have deep expertise in Back Bay, Beacon Hill, Seaport, South End, Cambridge, and Brookline.
You speak naturally and conversationally, providing insights on:
- Property valuations and market trends ($1,500+/sqft in core Boston)
- Neighborhood characteristics and lifestyle
- Investment opportunities and timing (22-32 days on market)
- Luxury amenities and architectural styles
Keep responses concise (under 30 seconds) and engaging. Use specific Boston neighborhood knowledge.`,
            },
          ],
        },
      },
    };

    this.ws?.send(JSON.stringify(setupMessage));
  }

  private handleMessage(data: string | Blob): void {
    if (data instanceof Blob) {
      // Binary audio data
      data.arrayBuffer().then((buffer) => {
        this.config.onAudioResponse?.(buffer);
      });
      return;
    }

    try {
      const message = JSON.parse(data);

      // Handle server content (audio response)
      if (message.serverContent) {
        const parts = message.serverContent.modelTurn?.parts || [];

        for (const part of parts) {
          if (part.inlineData?.mimeType?.startsWith("audio/")) {
            // Decode base64 audio
            const audioData = this.base64ToArrayBuffer(part.inlineData.data);
            this.config.onAudioResponse?.(audioData);
          }

          if (part.text) {
            this.config.onTextResponse?.(part.text);
          }
        }
      }

      // Handle input transcription
      if (message.serverContent?.inputTranscript) {
        this.config.onTranscript?.(
          message.serverContent.inputTranscript.text,
          message.serverContent.inputTranscript.isFinal
        );
      }

      // Handle output transcription
      if (message.serverContent?.outputTranscript) {
        this.config.onTranscript?.(
          message.serverContent.outputTranscript.text,
          true
        );
      }
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async startAudioCapture(): Promise<void> {
    try {
      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Create audio context
      this.audioContext = new AudioContext({ sampleRate: 16000 });

      // Create source from microphone
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Create script processor for capturing audio data
      const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (event) => {
        if (!this.isConnected || !this.ws) return;

        const inputData = event.inputBuffer.getChannelData(0);

        // Convert float32 to int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Convert to base64 and send
        const base64Audio = this.arrayBufferToBase64(pcmData.buffer);

        const audioMessage = {
          realtimeInput: {
            mediaChunks: [
              {
                mimeType: "audio/pcm;rate=16000",
                data: base64Audio,
              },
            ],
          },
        };

        this.ws.send(JSON.stringify(audioMessage));
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error("Audio capture error:", error);
      this.config.onError?.(
        error instanceof Error ? error.message : "Microphone access denied"
      );
      throw error;
    }
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  sendText(text: string): void {
    if (!this.isConnected || !this.ws) {
      console.error("Not connected");
      return;
    }

    const textMessage = {
      clientContent: {
        turns: [
          {
            role: "user",
            parts: [{ text }],
          },
        ],
        turnComplete: true,
      },
    };

    this.ws.send(JSON.stringify(textMessage));
  }

  disconnect(): void {
    // Stop audio capture
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Close WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.isConnected = false;
  }

  get connected(): boolean {
    return this.isConnected;
  }
}

/**
 * Audio playback utility for Gemini responses
 */
export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private audioQueue: AudioBuffer[] = [];
  private isPlaying = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new AudioContext({ sampleRate: 24000 });
    }
  }

  async playAudio(audioData: ArrayBuffer): Promise<void> {
    if (!this.audioContext) return;

    try {
      // Decode the audio data (24kHz PCM from Gemini)
      const audioBuffer = await this.decodeAudioData(audioData);

      this.audioQueue.push(audioBuffer);

      if (!this.isPlaying) {
        this.playNext();
      }
    } catch (error) {
      console.error("Audio playback error:", error);
    }
  }

  private async decodeAudioData(data: ArrayBuffer): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("No audio context");

    // Try to decode as-is first
    try {
      return await this.audioContext.decodeAudioData(data.slice(0));
    } catch {
      // If that fails, treat as raw PCM and create buffer manually
      const pcmData = new Int16Array(data);
      const floatData = new Float32Array(pcmData.length);

      for (let i = 0; i < pcmData.length; i++) {
        floatData[i] = pcmData[i] / 32768;
      }

      const audioBuffer = this.audioContext.createBuffer(
        1,
        floatData.length,
        24000
      );
      audioBuffer.getChannelData(0).set(floatData);

      return audioBuffer;
    }
  }

  private playNext(): void {
    if (!this.audioContext || this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const buffer = this.audioQueue.shift()!;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);

    source.onended = () => {
      this.playNext();
    };

    source.start();
  }

  stop(): void {
    this.audioQueue = [];
    this.isPlaying = false;
  }

  close(): void {
    this.stop();
    this.audioContext?.close();
    this.audioContext = null;
  }
}
