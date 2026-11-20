import { useState, useCallback, useRef, useEffect } from 'react';
import { transcribeAudio, fetchSpeechHealth } from '../lib/api';

export type SpeechState = 'idle' | 'recording' | 'transcribing';

export function useSpeech() {
  const [state, setState] = useState<SpeechState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [available, setAvailable] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>('');

  // Check if speech backend or browser Web Speech API is available
  useEffect(() => {
    const hasWebSpeech = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    fetchSpeechHealth()
      .then((health) => setAvailable(health.available || hasWebSpeech))
      .catch(() => setAvailable(hasWebSpeech));
  }, []);

  const startRecording = useCallback(async (): Promise<void> => {
    setError(null);
    transcriptRef.current = '';

    const SpeechRec = typeof window !== 'undefined' ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    if (SpeechRec) {
      try {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = true;
        // Support both Indonesian and English based on browser or general
        recognition.lang = navigator.language || 'id-ID';

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = 0; i < event.results.length; i++) {
            current += event.results[i][0].transcript;
          }
          transcriptRef.current = current;
        };

        recognition.onerror = (event: any) => {
          if (event.error !== 'no-speech') {
            setError(event.error === 'not-allowed' ? 'Microphone access denied' : `Speech error: ${event.error}`);
          }
        };

        recognition.onend = () => {
          // Keep active unless stopped by user
        };

        recognition.start();
        recognitionRef.current = recognition;
        setState('recording');
        return;
      } catch (err) {
        // Fallback to MediaRecorder below
      }
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Microphone not supported in this browser');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setState('recording');
    } catch (err) {
      setError('Microphone access denied');
      setState('idle');
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string> => {
    if (recognitionRef.current) {
      return new Promise((resolve) => {
        setState('transcribing');
        const rec = recognitionRef.current;
        recognitionRef.current = null;
        try {
          rec.stop();
        } catch {}
        setTimeout(() => {
          setState('idle');
          resolve(transcriptRef.current.trim());
        }, 300);
      });
    }

    return new Promise((resolve, reject) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state !== 'recording') {
        reject(new Error('Not recording'));
        return;
      }

      recorder.onstop = async () => {
        setState('transcribing');

        // Stop all audio tracks
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        chunksRef.current = [];

        try {
          const result = await transcribeAudio(blob);
          setState('idle');
          resolve(result.text);
        } catch (err) {
          setState('idle');
          const msg = err instanceof Error ? err.message : 'Transcription failed';
          setError(msg);
          reject(err);
        }
      };

      recorder.stop();
    });
  }, []);

  return {
    state,
    error,
    available,
    startRecording,
    stopRecording,
    isRecording: state === 'recording',
    isTranscribing: state === 'transcribing',
  };
}
