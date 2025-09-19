import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const VisualEffects = () => {
  const navigate = useNavigate();
  const [activeEffect, setActiveEffect] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [speed, setSpeed] = useState(3);

  const visualEffects = [
    {
      id: 'flowing-orbs',
      title: 'Floating Lotus',
      description: 'Gentle floating petals of tranquility',
      icon: '🪷',
      component: FlowingOrbs
    },
    {
      id: 'particle-rain', 
      title: 'Stardust Cascade',
      description: 'Peaceful falling stardust particles',
      icon: '✨',
      component: ParticleRain
    },
    {
      id: 'breathing-circle',
      title: 'Meditation Pulse',
      description: 'Synchronized breathing visualization',
      icon: '🔮',
      component: BreathingCircle
    },
    {
      id: 'wave-pattern',
      title: 'Zen Garden Waves',
      description: 'Flowing water ripples for peace',
      icon: '🌊',
      component: WavePattern
    },
    {
      id: 'aurora',
      title: 'Aurora Dreams',
      description: 'Soft northern lights display',
      icon: '🌌',
      component: AuroraEffect
    },
    {
      id: 'mandala',
      title: 'Sacred Mandala',
      description: 'Rotating spiritual geometry',
      icon: '🕸️',
      component: MandalaEffect
    }
  ];

  if (activeEffect) {
    const EffectComponent = activeEffect.component;
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        zIndex: 1000
      }}>
        <EffectComponent intensity={intensity} speed={speed} />
        
        {/* Controls overlay with glassmorphism */}
        <div className="glass-modal" style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          borderRadius: '16px',
          padding: '1.5rem',
          color: '#E2E8F0',
          minWidth: '220px'
        }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: '600' }}>
            {activeEffect.title}
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#A0AEC0' }}>
              Intensity: {intensity}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              style={{ 
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#A0AEC0' }}>
              Speed: {speed}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              style={{ 
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px'
              }}
            />
          </div>
          
          <button
            onClick={() => setActiveEffect(null)}
            className="glass-button"
            style={{
              width: '100%',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              color: '#F87171'
            }}
          >
            ✕ Exit Visual
          </button>
        </div>

        {/* Breathing instruction overlay for breathing circle */}
        {activeEffect.id === 'breathing-circle' && (
          <div style={{
            position: 'fixed',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#E2E8F0'
          }}>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 6 - speed * 0.4, repeat: Infinity }}
              style={{ fontSize: '1.2rem', fontWeight: '500' }}
            >
              Breathe with the circle
            </motion.div>
            <div style={{ fontSize: '0.9rem', color: '#A0AEC0', marginTop: '0.5rem' }}>
              Inhale as it grows • Exhale as it shrinks
            </div>
          </div>
        )}
      </div>
    );
  }

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
            🌸 Visual Meditation
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#A0AEC0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Immerse yourself in soothing visual experiences designed to calm your mind and enhance focus
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {visualEffects.map((effect, index) => (
            <motion.div
              key={effect.id}
              className="glass-card"
              style={{
                borderRadius: '20px',
                padding: '2.5rem',
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
              onClick={() => setActiveEffect(effect)}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
                {effect.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.4rem', 
                fontWeight: '600', 
                color: '#E2E8F0', 
                marginBottom: '0.5rem' 
              }}>
                {effect.title}
              </h3>
              <p style={{ 
                color: '#A0AEC0', 
                marginBottom: '1.5rem',
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                {effect.description}
              </p>
              <button 
                className="glass-button"
                style={{
                  borderRadius: '12px',
                  padding: '0.75rem 2rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Begin Experience
              </button>
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

// Enhanced Visual Effect Components with more calming animations
const FlowingOrbs = ({ intensity, speed }) => {
  const orbCount = Math.max(4, intensity);
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[...Array(orbCount)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${80 + intensity * 15}px`,
            height: `${80 + intensity * 15}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle, 
              rgba(255, 182, 193, 0.${Math.max(2, intensity - 2)}), 
              rgba(221, 160, 221, 0.${Math.max(1, intensity - 4)}),
              rgba(173, 216, 230, 0.${Math.max(1, intensity - 6)})
            )`,
            filter: 'blur(25px)',
            left: `${(i * 20) % 70 + 15}%`,
            top: `${(i * 25) % 50 + 25}%`
          }}
          animate={{
            x: [0, 150, -80, 0],
            y: [0, -120, 100, 0],
            scale: [1, 1.3, 0.9, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20 - speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3
          }}
        />
      ))}
      
      {/* Add floating petals */}
      {[...Array(Math.floor(intensity / 2))].map((_, i) => (
        <motion.div
          key={`petal-${i}`}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: `rgba(255, 192, 203, 0.${intensity})`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, -10, 0],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 8 - speed * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4
          }}
        />
      ))}
    </div>
  );
};

const ParticleRain = ({ intensity, speed }) => {
  const particleCount = intensity * 12;
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            borderRadius: '50%',
            background: `rgba(${200 + Math.random() * 55}, ${200 + Math.random() * 55}, 255, ${0.4 + (intensity / 25)})`,
            boxShadow: `0 0 ${4 + intensity}px rgba(255, 255, 255, 0.${intensity})`,
            left: `${Math.random() * 100}%`,
            top: '-10px'
          }}
          animate={{
            y: [0, window.innerHeight + 20],
            opacity: [0, 1, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 10 - speed * 0.8,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 6
          }}
        />
      ))}
    </div>
  );
};

const BreathingCircle = ({ intensity, speed }) => {
  const breathingDuration = 6 - speed * 0.4;
  
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      {/* Main breathing circle */}
      <motion.div
        style={{
          width: `${150 + intensity * 25}px`,
          height: `${150 + intensity * 25}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.7), rgba(118, 75, 162, 0.5), rgba(64, 224, 208, 0.3))',
          filter: 'blur(20px)',
          position: 'relative'
        }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.4, 0.9, 0.4]
        }}
        transition={{
          duration: breathingDuration,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Outer ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: `${200 + intensity * 30}px`,
          height: `${200 + intensity * 30}px`,
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          filter: 'blur(1px)'
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{
          duration: breathingDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.2
        }}
      />
      
      {/* Breathing particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.8)',
            left: '50%',
            top: '50%'
          }}
          animate={{
            x: [0, Math.cos((i * Math.PI * 2) / 8) * (100 + intensity * 10)],
            y: [0, Math.sin((i * Math.PI * 2) / 8) * (100 + intensity * 10)],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: breathingDuration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2
          }}
        />
      ))}
    </div>
  );
};

const WavePattern = ({ intensity, speed }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            bottom: `${i * 12}%`,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(64, 224, 208, ${0.2 + intensity * 0.06}), 
              rgba(102, 126, 234, ${0.3 + intensity * 0.06}),
              rgba(64, 224, 208, ${0.2 + intensity * 0.06}),
              transparent
            )`,
            borderRadius: '2px',
            transformOrigin: 'left center'
          }}
          animate={{
            scaleX: [0.5, 2.5, 0.5],
            x: [-300, 300, -300],
            opacity: [0.3, 1, 0.3]
          }}
          transition={{
            duration: 10 - speed * 0.6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8
          }}
        />
      ))}
      
      {/* Ripple effects */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ripple-${i}`}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            borderRadius: '50%',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [0, 2, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 6 - speed * 0.3,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 2
          }}
        />
      ))}
    </div>
  );
};

const AuroraEffect = ({ intensity, speed }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: `${i * 20}%`,
            left: 0,
            right: 0,
            height: `${60 + intensity * 10}px`,
            background: `linear-gradient(90deg, 
              transparent,
              rgba(${100 + i * 30}, 255, ${200 - i * 40}, 0.${intensity}),
              rgba(${200 - i * 30}, ${150 + i * 20}, 255, 0.${Math.max(2, intensity - 1)}),
              transparent
            )`,
            filter: 'blur(40px)',
            borderRadius: '50px'
          }}
          animate={{
            x: [-200, 200, -200],
            scaleY: [0.5, 1.5, 0.5],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 15 - speed * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
        />
      ))}
      
      {/* Twinkling stars */}
      {[...Array(intensity * 3)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            borderRadius: '50%',
            background: 'white',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 4
          }}
        />
      ))}
    </div>
  );
};

const MandalaEffect = ({ intensity, speed }) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Outer rotating ring */}
      <motion.div
        style={{
          position: 'absolute',
          width: `${200 + intensity * 20}px`,
          height: `${200 + intensity * 20}px`
        }}
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 30 - speed * 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '6px',  
              height: '6px',
              borderRadius: '50%',
              background: `rgba(${150 + i * 10}, ${200 - i * 5}, 255, 0.${intensity})`,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${100 + intensity * 10}px)`,
              boxShadow: `0 0 8px rgba(${150 + i * 10}, ${200 - i * 5}, 255, 0.5)`
            }}
          />
        ))}
      </motion.div>
      
      {/* Inner counter-rotating pattern */}
      <motion.div
        style={{
          position: 'absolute',
          width: `${120 + intensity * 15}px`,
          height: `${120 + intensity * 15}px`
        }}
        animate={{
          rotate: [0, -360]
        }}
        transition={{
          duration: 20 - speed * 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '20px',
              background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.${intensity}), transparent)`,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${60 + intensity * 8}px)`,
              borderRadius: '2px'
            }}
          />
        ))}
      </motion.div>
      
      {/* Central pulsing core */}
      <motion.div
        style={{
          width: `${40 + intensity * 5}px`,
          height: `${40 + intensity * 5}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8), rgba(102, 126, 234, 0.4))',
          filter: 'blur(8px)'
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 4 - speed * 0.2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default VisualEffects;