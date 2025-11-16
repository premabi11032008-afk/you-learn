import React, { useState, useEffect, useCallback } from 'react';

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h6v4H9z" />
  </svg>
);


interface SpeechControlsProps {
  textToRead: string;
}

const SpeechControls: React.FC<SpeechControlsProps> = ({ textToRead }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | undefined>(undefined);
  
  const populateVoices = useCallback(() => {
    if (!window.speechSynthesis) return;
    const commonLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'nl', 'ta', 'kn', 'te'];
    const availableVoices = window.speechSynthesis.getVoices();
    const filteredVoices = availableVoices.filter(voice => commonLanguages.some(langCode => voice.lang.startsWith(langCode)));

    if (filteredVoices.length > 0) {
      setVoices(filteredVoices);
      if (!selectedVoiceURI) {
          const defaultVoice = filteredVoices.find(v => v.lang.startsWith('en')) || filteredVoices[0];
          if (defaultVoice) {
            setSelectedVoiceURI(defaultVoice.voiceURI);
          }
      }
    }
  }, [selectedVoiceURI]);

  useEffect(() => {
    if (window.speechSynthesis) {
      // onvoiceschanged is the canonical way to ensure voices are loaded.
      window.speechSynthesis.onvoiceschanged = populateVoices;
      populateVoices(); // Call it once in case voices are already loaded.
    }

    // Cleanup function to stop speech when component unmounts
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [populateVoices]);
  
  const handlePlay = () => {
    if (!textToRead || !window.speechSynthesis) return;
    
    if (isPaused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(textToRead);
      const selectedVoice = voices.find(v => v.voiceURI === selectedVoiceURI);
      if (selectedVoice) {
          utterance.voice = selectedVoice;
      }
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      utterance.onpause = () => {
        setIsSpeaking(false);
        setIsPaused(true);
      };
      utterance.onresume = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      }
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePause = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.pause();
    }
  };
  
  const handleStop = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    }
  };

  const voicesByLang = voices.reduce((acc, voice) => {
    const lang = voice.lang.split('-')[0].toUpperCase();
    if (!acc[lang]) {
      acc[lang] = [];
    }
    acc[lang].push(voice);
    return acc;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  return (
    <div className="p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg flex flex-wrap items-center justify-center gap-4">
      <div className="flex-grow min-w-[200px]">
         <select
            id="voice-select"
            value={selectedVoiceURI}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            disabled={isSpeaking || voices.length === 0}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-sm"
            aria-label="Select a voice"
          >
            {voices.length === 0 && <option>Loading voices...</option>}
            {Object.keys(voicesByLang).sort().map(lang => (
              <optgroup label={lang} key={lang}>
                {voicesByLang[lang].map(voice => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </optgroup>
            ))}
         </select>
      </div>
      <div className="flex items-center space-x-2">
        <button 
          onClick={isSpeaking && !isPaused ? handlePause : handlePlay}
          className="p-2 rounded-full text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-sky-200 dark:hover:bg-sky-700 transition"
          aria-label={isSpeaking && !isPaused ? "Pause" : "Play"}
        >
          {isSpeaking && !isPaused ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button 
          onClick={handleStop}
          className="p-2 rounded-full text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-700 hover:bg-red-200 dark:hover:bg-red-700 transition"
          aria-label="Stop"
        >
          <StopIcon />
        </button>
      </div>
    </div>
  );
};

export default SpeechControls;