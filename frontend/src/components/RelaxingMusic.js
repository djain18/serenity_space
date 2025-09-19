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

  // Real audio files - using royalty-free audio URLs
  // In production, you would host these files locally or use CDN
  const soundscapes = [
    {
      id: 'rain',
      title: 'Gentle Rain',
      description: 'Soft rainfall sounds for deep relaxation',
      icon: '🌧️',
      duration: '30:00',
      // Using a publicly available rain sound
      url: 'https://www.soundjay.com/misc/sounds-641.mp3',
      color: 'from-blue-500 to-indigo-600',
      fallbackUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg'
    },
    {
      id: 'forest',
      title: 'Forest Ambience',
      description: 'Birds chirping and gentle forest sounds',
      icon: '🌲',
      duration: '45:00',
      url: 'https://www.soundjay.com/nature/nature-sounds-1.mp3',
      color: 'from-green-500 to-emerald-600',
      fallbackUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3'
    },
    {
      id: 'ocean',
      title: 'Ocean Waves',
      description: 'Peaceful ocean waves for meditation',
      icon: '🌊',
      duration: '40:00',
      url: 'https://www.soundjay.com/ocean/ocean-waves-1.mp3',
      color: 'from-cyan-500 to-teal-600',
      fallbackUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Erase_This-Musicalgenius.mp3'
    },
    {
      id: 'meditation',
      title: 'Meditation Bells',
      description: 'Tibetan singing bowls and gentle bells',
      icon: '🔔',
      duration: '20:00',
      url: 'https://www.soundjay.com/meditation/meditation-bells-1.mp3',
      color: 'from-purple-500 to-pink-600',
      fallbackUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/explosion.mp3'
    },
    {
      id: 'space',
      title: 'Space Ambience',
      description: 'Cosmic sounds for deep contemplation',
      icon: '🌌',
      duration: '60:00',
      url: 'https://www.soundjay.com/space/space-ambient-1.mp3',
      color: 'from-purple-600 to-indigo-700',
      fallbackUrl: 'https://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg'
    },
    {
      id: 'nature',
      title: 'Nature Sounds',
      description: 'Mixed natural sounds for tranquility',
      icon: '🍃',
      duration: '35:00',
      url: 'https://www.soundjay.com/nature/nature-mix-1.mp3',
      color: 'from-green-400 to-blue-500',
      fallbackUrl: 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp__CIRCULOS.mp3'
    }
  ];

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.volume = volume;
      
      const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      const handleError = () => {
        console.warn(`Failed to load primary audio, trying fallback for ${currentTrack.title}`);
        if (currentTrack.fallbackUrl && audioRef.current.src !== currentTrack.fallbackUrl) {
          audioRef.current.src = currentTrack.fallbackUrl;
          audioRef.current.load();
        }
      };
      
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audioRef.current.removeEventListener('ended', handleEnded);
          audioRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, [currentTrack, volume]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current && !audioRef.current.paused) {
          setProgress(audioRef.current.currentTime);
        }
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }

    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  const playTrack = async (track) => {
    if (currentTrack?.id === track.id && isPlaying) {
      pauseTrack();
      return;
    }

    try {
      if (currentTrack?.id !== track.id) {
        setCurrentTrack(track);
        setProgress(0);
        
        if (audioRef.current) {
          audioRef.current.src = track.url;
          audioRef.current.load();
        }
      }
      
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      // Try fallback URL
      if (track.fallbackUrl) {
        try {
          audioRef.current.src = track.fallbackUrl;
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (fallbackError) {
          console.error('Fallback audio also failed:', fallbackError);
          alert('Unable to play audio. Please check your internet connection.');
        }
      }
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickRatio = clickX / rect.width;
      const newTime = clickRatio * duration;
      
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
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

        {/* Hidden Audio Element */}
        <audio ref={audioRef} preload="metadata" />

        {/* Current Player */}
        {currentTrack && (
          <motion.div
            className="glass-modal"
            style={{
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
              <div 
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  cursor: 'pointer'
                }}
                onClick={handleProgressClick}
              >
                <div style={{
                  width: `${duration > 0 ? (progress / duration) * 100 : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #667EEA, #764BA2)',
                  transition: 'width 0.3s ease',
                  borderRadius: '3px'
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
                <span>{formatTime(duration)}</span>
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
                className="glass-button"
                style={{
                  borderRadius: '50px',
                  width: '60px',
                  height: '60px',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#E2E8F0'
                }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button
                onClick={stopTrack}
                className="glass-button"
                style={{
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  color: '#E2E8F0'
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
                onChange={handleVolumeChange}
                style={{ 
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px'
                }}
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
              className="glass-card"
              style={{
                background: currentTrack?.id === track.id 
                  ? 'rgba(102, 126, 234, 0.25)' 
                  : 'rgba(45, 55, 72, 0.4)',
                border: currentTrack?.id === track.id 
                  ? '1px solid rgba(102, 126, 234, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ 
                scale: 1.02,
                y: -4,
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
                marginBottom: '0.5rem',
                fontSize: '0.95rem'
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
                fontSize: '0.9rem',
                fontWeight: '500'
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
            className="glass-button"
            style={{
              borderRadius: '12px',
              padding: '0.75rem 2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: '#A0AEC0'
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