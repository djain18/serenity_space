import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CognitiveReframer = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('home'); // home, session, journal
  const [currentStep, setCurrentStep] = useState(0);
  const [negativeThought, setNegativeThought] = useState('');
  const [answers, setAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');

  useEffect(() => {
    // Load initial static questions
    fetchQuestions();
    loadSessions();
  }, []);

  const fetchQuestions = async (negativeThought = null) => {
    try {
      let response;
      if (negativeThought) {
        // Use AI-powered dynamic questions
        response = await fetch(`${API}/cbt-questions/dynamic`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            negative_thought: negativeThought,
            user_context: "User seeking help with cognitive reframing through CBT techniques"
          })
        });
      } else {
        // Use static fallback questions
        response = await fetch(`${API}/cbt-questions`);
      }
      
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Fallback questions
      setQuestions([
        {
          id: 1,
          question: "Is this thought based on facts or feelings?",
          type: "choice",
          options: ["Facts", "Feelings", "Both", "Not sure"]
        },
        {
          id: 2,
          question: "What evidence do I have that supports this thought?",
          type: "text"
        },
        {
          id: 3,
          question: "What evidence do I have against this thought?",
          type: "text"
        },
        {
          id: 4,
          question: "What would I tell a friend who had this thought?",
          type: "text"
        },
        {
          id: 5,
          question: "How likely is it that this worst-case scenario will actually happen? (0-100%)",
          type: "number",
          min: 0,
          max: 100
        },
        {
          id: 6,
          question: "What's a more balanced way to think about this situation?",
          type: "text"
        }
      ]);
    }
  };

  const loadSessions = () => {
    const savedSessions = localStorage.getItem('serenity_cbt_sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  };

  const saveSessions = (newSessions) => {
    localStorage.setItem('serenity_cbt_sessions', JSON.stringify(newSessions));
    setSessions(newSessions);
  };

  const startNewSession = async () => {
    if (!negativeThought.trim()) return;
    
    // Fetch AI-powered questions based on the negative thought
    await fetchQuestions(negativeThought);
    
    setMode('session');
    setCurrentStep(0);
    setAnswers([]);
    setCurrentAnswer('');
  };

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return;

    const newAnswer = {
      question: questions[currentStep].question,
      answer: currentAnswer
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSession(updatedAnswers);
    }
  };

  const completeSession = async (finalAnswers) => {
    const sessionData = {
      id: Date.now().toString(),
      negative_thought: negativeThought,
      questions_and_answers: finalAnswers,
      created_at: new Date().toISOString(),
      completed: true
    };

    // Save to backend
    try {
      await fetch(`${API}/cbt-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          negative_thought: negativeThought,
          questions_and_answers: finalAnswers
        })
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }

    // Save to localStorage for privacy
    const updatedSessions = [sessionData, ...sessions];
    saveSessions(updatedSessions);

    // Reset for new session
    setMode('completed');
    setTimeout(() => {
      setMode('home');
      setNegativeThought('');
      setCurrentStep(0);
      setAnswers([]);
    }, 3000);
  };

  const deleteSession = (sessionId) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    saveSessions(updatedSessions);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (mode === 'completed') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '2rem'
      }}>
        <motion.div
          className="glass-modal"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            maxWidth: '500px'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🌟</div>
          <h2 style={{ fontSize: '2rem', color: '#E2E8F0', marginBottom: '1rem' }}>
            Session Complete!
          </h2>
          <p style={{ color: '#A0AEC0', fontSize: '1.1rem' }}>
            Your thoughts have been processed and saved privately. 
            Take a moment to reflect on your insights.
          </p>
        </motion.div>
      </div>
    );
  }

  if (mode === 'session') {
    const currentQuestion = questions[currentStep];
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <motion.div
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              borderRadius: '20px',
              padding: '2.5rem',
              marginBottom: '2rem'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#E2E8F0', marginBottom: '1rem' }}>
                Cognitive Reframing Session
              </h2>
              <div style={{ 
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid rgba(102, 126, 234, 0.2)'
              }}>
                <p style={{ color: '#A0AEC0', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  Your thought:
                </p>
                <p style={{ color: '#E2E8F0', fontStyle: 'italic' }}>
                  "{negativeThought}"
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.3rem', color: '#E2E8F0' }}>
                  Step {currentStep + 1} of {questions.length}
                </h3>
                <div style={{ 
                  background: 'rgba(102, 126, 234, 0.2)',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.9rem',
                  color: '#667EEA'
                }}>
                  {Math.round(((currentStep + 1) / questions.length) * 100)}% complete
                </div>
              </div>

              <h4 style={{ 
                fontSize: '1.2rem', 
                color: '#E2E8F0', 
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                {currentQuestion?.question}
              </h4>

              {currentQuestion?.type === 'choice' ? (
                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setCurrentAnswer(option)}
                      style={{
                        background: currentAnswer === option 
                          ? 'rgba(102, 126, 234, 0.3)' 
                          : 'rgba(45, 55, 72, 0.6)',
                        border: currentAnswer === option 
                          ? '1px solid rgba(102, 126, 234, 0.5)' 
                          : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '1rem',
                        color: '#E2E8F0',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : currentQuestion?.type === 'number' ? (
                <div style={{ marginBottom: '2rem' }}>
                  <input
                    type="range"
                    min={currentQuestion.min || 0}
                    max={currentQuestion.max || 100}
                    value={currentAnswer || 50}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    style={{ width: '100%', marginBottom: '1rem' }}
                  />
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    color: '#A0AEC0',
                    fontSize: '0.9rem'
                  }}>
                    <span>{currentQuestion.min || 0}%</span>
                    <span style={{ color: '#E2E8F0', fontSize: '1.2rem' }}>
                      {currentAnswer || 50}%
                    </span>
                    <span>{currentQuestion.max || 100}%</span>
                  </div>
                </div>
              ) : (
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Take your time to reflect and write your thoughts..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    background: 'rgba(45, 55, 72, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    color: '#E2E8F0',
                    fontSize: '1rem',
                    resize: 'vertical',
                    marginBottom: '2rem'
                  }}
                />
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => {
                    setMode('home');
                    setCurrentStep(0);
                    setAnswers([]);
                    setCurrentAnswer('');
                  }}
                  style={{
                    background: 'rgba(107, 114, 128, 0.2)',
                    border: '1px solid rgba(107, 114, 128, 0.3)',
                    borderRadius: '12px',
                    padding: '0.75rem 1.5rem',
                    color: '#9CA3AF',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!currentAnswer.trim()}
                  style={{
                    background: currentAnswer.trim() 
                      ? 'linear-gradient(135deg, #667EEA, #764BA2)' 
                      : 'rgba(107, 114, 128, 0.2)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem 2rem',
                    color: currentAnswer.trim() ? 'white' : '#6B7280',
                    cursor: currentAnswer.trim() ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    flex: 1
                  }}
                >
                  {currentStep < questions.length - 1 ? 'Next Question' : 'Complete Session'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
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
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            💭 Cognitive Reframer
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#A0AEC0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Transform negative thoughts into balanced perspectives using proven CBT techniques
          </p>
        </motion.div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* New Session Card */}
          <motion.div
            style={{
              background: 'rgba(45, 55, 72, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 style={{ 
              fontSize: '1.8rem', 
              color: '#E2E8F0', 
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Start New Session
            </h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ 
                display: 'block', 
                color: '#A0AEC0', 
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                What negative thought would you like to work through?
              </label>
              <textarea
                value={negativeThought}
                onChange={(e) => setNegativeThought(e.target.value)}
                placeholder="Example: 'I'm never going to succeed at this...' or 'Everyone thinks I'm not good enough...'"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  background: 'rgba(45, 55, 72, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1rem',
                  color: '#E2E8F0',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              onClick={startNewSession}
              disabled={!negativeThought.trim()}
              style={{
                width: '100%',
                background: negativeThought.trim() 
                  ? 'linear-gradient(135deg, #667EEA, #764BA2)' 
                  : 'rgba(107, 114, 128, 0.2)',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                color: negativeThought.trim() ? 'white' : '#6B7280',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: negativeThought.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
            >
              Begin Reframing Session
            </button>
          </motion.div>

          {/* My Journal */}
          <motion.div
            style={{
              background: 'rgba(45, 55, 72, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 style={{ 
              fontSize: '1.8rem', 
              color: '#E2E8F0', 
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              📖 My Journal
            </h2>

            {sessions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <p style={{ color: '#A0AEC0', fontSize: '1.1rem' }}>
                  Your reframing sessions will appear here.<br />
                  Start your first session above to begin your journey.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {sessions.slice(0, 5).map((session) => (
                  <div
                    key={session.id}
                    style={{
                      background: 'rgba(26, 32, 44, 0.6)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ 
                          color: '#E2E8F0', 
                          fontStyle: 'italic',
                          marginBottom: '0.5rem',
                          fontSize: '1rem'
                        }}>
                          "{session.negative_thought}"
                        </p>
                        <p style={{ 
                          color: '#A0AEC0', 
                          fontSize: '0.9rem'
                        }}>
                          {formatDate(session.created_at)} • {session.questions_and_answers?.length || 0} reflections
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSession(session.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '4px'
                        }}
                        title="Delete session"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    {session.questions_and_answers?.length > 0 && (
                      <div style={{ 
                        background: 'rgba(102, 126, 234, 0.1)',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginTop: '1rem'
                      }}>
                        <p style={{ 
                          color: '#A0AEC0', 
                          fontSize: '0.9rem',
                          marginBottom: '0.5rem'
                        }}>
                          Last reflection:
                        </p>
                        <p style={{ 
                          color: '#E2E8F0', 
                          fontSize: '0.95rem'
                        }}>
                          {session.questions_and_answers[session.questions_and_answers.length - 1]?.answer || 'No reflection available'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
                {sessions.length > 5 && (
                  <p style={{ 
                    textAlign: 'center', 
                    color: '#A0AEC0', 
                    fontSize: '0.9rem',
                    marginTop: '1rem'
                  }}>
                    Showing 5 most recent sessions. Total: {sessions.length} sessions.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
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

export default CognitiveReframer;