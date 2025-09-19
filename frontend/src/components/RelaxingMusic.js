import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const RelaxingMusic = () => {
  const navigate = useNavigate();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const progressInterval = useRef(null);

  // Curated soundscapes - using royalty-free web audio URLs
  const soundscapes = [
    {
      id: 'rain',
      title: 'Gentle Rain',
      description: 'Soft rainfall sounds',
      icon: '🌧️',
      duration: '30:00',
      // Using a royalty-free rain sound - in production, you'd host these files
      url: 'https://www.soundjay.com/misc/sounds-641.wav',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'forest',
      title: 'Forest Ambience',
      description: 'Birds and nature sounds',
      icon: '🌲',
      duration: '45:00',
      url: 'https://www.soundjay.com/nature/sounds-of-nature-1.wav',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'ocean',
      title: 'Ocean Waves',
      description: 'Calming wave sounds',
      icon: '🌊',
      duration: '40:00',
      url: 'https://www.soundjay.com/misc/sounds-651.wav',
      color: 'from-cyan-500 to-teal-600'
    },
    {
      id: 'meditation',
      title: 'Meditation Bells',
      description: 'Tibetan singing bowls',
      icon: '🔔',
      duration: '20:00',
      url: 'https://www.soundjay.com/misc/sounds-661.wav',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'white-noise',
      title: 'White Noise',
      description: 'Pure focus sound',
      icon: '🌪️',
      duration: '60:00',
      url: 'https://www.soundjay.com/misc/sounds-671.wav',
      color: 'from-gray-500 to-slate-600'
    },
    {
      id: 'crackling-fire',
      title: 'Crackling Fire',
      description: 'Warm fireplace sounds',
      icon: '🔥',
      duration: '35:00',
      url: 'https://www.soundjay.com/misc/sounds-681.wav',
      color: 'from-orange-500 to-red-600'
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });
    }
  }, [currentTrack, volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }

    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const playTrack = (track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
      return;
    }

    setCurrentTrack(track);
    setProgress(0);
    
    // For demo purposes, we'll create a simple audio oscillator
    // In production, you'd load actual audio files
    createAudioContext(track);
  };

  const createAudioContext = (track) => {
    // Demo audio generation - replace with actual audio files in production
    const context = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create different sounds based on track type
    let frequency = 200;
    let type = 'sine';
    
    switch (track.id) {
      case 'rain':
        // Create rain-like noise
        createRainSound(context);
        break;
      case 'ocean':
        frequency = 100;
        type = 'sine';
        createWaveSound(context, frequency);
        break;
      case 'forest':
        createForestSound(context);
        break;
      default:
        createSimpleSound(context, frequency, type);
    }
    
    setIsPlaying(true);
  };

  const createRainSound = (context) => {
    const bufferSize = context.sampleRate * 2;
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const output = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.1;
    }
    
    const source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    const gainNode = context.createGain();
    gainNode.gain.value = volume * 0.3;
    
    source.connect(gainNode);
    gainNode.connect(context.destination);
    source.start();
  };

  const createWaveSound = (context, frequency) => {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.2, context.currentTime + 2);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
  };

  const createForestSound = (context) => {
    // Create multiple oscillators for forest ambience
    const frequencies = [300, 500, 800, 1200];
    
    frequencies.forEach((freq, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, context.currentTime);
      
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.05, context.currentTime + index + 1);
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start();
    });
  };

  const createSimpleSound = (context, frequency, type) => {
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, context.currentTime + 1);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    oscillator.start();
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    // In a real implementation, you'd pause the actual audio
  };

  const stopTrack = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    setProgress(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      style={{
        padding: '3rem',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.div
          style={{ textAlign: 'center', marginBottom: '3rem' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#E2E8F0', 
            marginBottom: '1rem' 
          }}>
            🎵 Relaxing Music
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#A0AEC0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Immerse yourself in calming soundscapes designed to enhance focus and relaxation
          </p>
        </motion.div>

        {/* Current Player */}
        {currentTrack && (
          <motion.div
            style={{
              background: 'rgba(45, 55, 72, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2rem',
              marginBottom: '3rem'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                {currentTrack.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', color: '#E2E8F0', marginBottom: '0.5rem' }}>
                {currentTrack.title}
              </h3>
              <p style={{ color: '#A0AEC0' }}>
                {currentTrack.description}
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${duration > 0 ? (progress / duration) * 100 : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #667EEA, #764BA2)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '0.5rem',
                fontSize: '0.9rem',
                color: '#A0AEC0'
              }}>
                <span>{formatTime(progress)}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <button
                onClick={() => playTrack(currentTrack)}
                style={{
                  background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #667EEA, #764BA2)',
                  border: isPlaying ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                  borderRadius: '50px',
                  width: '60px',
                  height: '60px',
                  color: isPlaying ? '#F87171' : 'white',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={stopTrack}
                style={{
                  background: 'rgba(107, 114, 128, 0.2)',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  color: '#9CA3AF',
                  cursor: 'pointer'
                }}
              >
                ⏹️ Stop
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </motion.div>
        )}

        {/* Soundscape Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {soundscapes.map((track, index) => (
            <motion.div
              key={track.id}
              style={{
                background: currentTrack?.id === track.id 
                  ? 'rgba(102, 126, 234, 0.2)' 
                  : 'rgba(45, 55, 72, 0.6)',
                backdropFilter: 'blur(20px)',
                border: currentTrack?.id === track.id 
                  ? '1px solid rgba(102, 126, 234, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                borderColor: 'rgba(102, 126, 234, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => playTrack(track)}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {track.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600', 
                color: '#E2E8F0', 
                marginBottom: '0.5rem' 
              }}>
                {track.title}
              </h3>
              <p style={{ 
                color: '#A0AEC0', 
                marginBottom: '0.5rem' 
              }}>
                {track.description}
              </p>
              <p style={{ 
                color: '#6B7280', 
                fontSize: '0.9rem',
                marginBottom: '1.5rem'
              }}>
                {track.duration}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: currentTrack?.id === track.id && isPlaying ? '#10B981' : '#A0AEC0',
                fontSize: '0.9rem'
              }}>
                {currentTrack?.id === track.id && isPlaying ? (
                  <>🎵 Playing</>
                ) : (
                  <>▶️ Play</>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'rgba(45, 55, 72, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem 2rem',
              color: '#A0AEC0',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RelaxingMusic;