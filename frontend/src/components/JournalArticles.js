import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const JournalArticles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, favorites
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
    loadFavorites();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${API}/articles`);
      const data = await response.json();
      setArticles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setLoading(false);
      // Fallback articles
      setArticles([
        {
          id: '1',
          title: 'Understanding Anxiety: A Gentle Guide',
          content: 'Anxiety is a natural response to stress, but when it becomes overwhelming, it can impact our daily lives. Learning to recognize the signs and developing healthy coping strategies can make a significant difference. Remember, seeking help is a sign of strength, not weakness.',
          category: 'Mental Health',
          author: 'Dr. Sarah Chen',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'The Power of Mindful Breathing',
          content: 'Breathing is something we do automatically, but when we bring conscious attention to our breath, it becomes a powerful tool for relaxation and stress relief. Try the 4-7-8 technique: inhale for 4 counts, hold for 7, exhale for 8. This simple practice can help calm your nervous system.',
          category: 'Mindfulness',
          author: 'Marcus Thompson',
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('serenity_favorite_articles');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const toggleFavorite = async (articleId) => {
    const isFavorited = favorites.includes(articleId);
    let updatedFavorites;

    if (isFavorited) {
      updatedFavorites = favorites.filter(id => id !== articleId);
    } else {
      updatedFavorites = [...favorites, articleId];
      // Try to save to backend
      try {
        await fetch(`${API}/favorites?article_id=${articleId}`, {
          method: 'POST'
        });
      } catch (error) {
        console.error('Error saving favorite:', error);
      }
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('serenity_favorite_articles', JSON.stringify(updatedFavorites));
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Mental Health': '🧠',
      'Mindfulness': '🧘',
      'Personal Growth': '🌱',
      'Wellness': '💚',
      'Therapy': '💭',
      'Self-Care': '🤗',
      'Stress Management': '😌',
      'Sleep': '😴'
    };
    return icons[category] || '📖';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Mental Health': 'from-blue-500 to-purple-600',
      'Mindfulness': 'from-green-500 to-teal-600',
      'Personal Growth': 'from-yellow-500 to-orange-600',
      'Wellness': 'from-emerald-500 to-green-600',
      'Therapy': 'from-purple-500 to-indigo-600',
      'Self-Care': 'from-pink-500 to-rose-600',
      'Stress Management': 'from-cyan-500 to-blue-600',
      'Sleep': 'from-indigo-500 to-purple-600'
    };
    return colors[category] || 'from-gray-500 to-slate-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredArticles = activeTab === 'favorites' 
    ? articles.filter(article => favorites.includes(article.id))
    : articles;

  if (selectedArticle) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(45, 55, 72, 0.8)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '3rem'
            }}
          >
            <div style={{ marginBottom: '2rem' }}>
              <button
                onClick={() => setSelectedArticle(null)}
                style={{
                  background: 'rgba(107, 114, 128, 0.2)',
                  border: '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  marginBottom: '2rem'
                }}
              >
                ← Back to Articles
              </button>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <span style={{ fontSize: '2rem' }}>
                  {getCategoryIcon(selectedArticle.category)}
                </span>
                <div>
                  <span style={{
                    background: `linear-gradient(135deg, ${getCategoryColor(selectedArticle.category).split(' ').slice(-2).join(' ')})`,
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    {selectedArticle.category}
                  </span>
                </div>
              </div>

              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                color: '#E2E8F0',
                marginBottom: '1rem',
                lineHeight: '1.2'
              }}>
                {selectedArticle.title}
              </h1>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                color: '#A0AEC0',
                marginBottom: '2rem',
                paddingBottom: '1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <span>By {selectedArticle.author}</span>
                <span>{formatDate(selectedArticle.created_at)}</span>
                <button
                  onClick={() => toggleFavorite(selectedArticle.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: favorites.includes(selectedArticle.id) ? '#F59E0B' : '#6B7280',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  {favorites.includes(selectedArticle.id) ? '⭐' : '☆'}
                </button>
              </div>
            </div>

            <div style={{
              color: '#E2E8F0',
              fontSize: '1.1rem',
              lineHeight: '1.8',
              whiteSpace: 'pre-line'
            }}>
              {selectedArticle.content}
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
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            📖 Wellness Articles
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#A0AEC0',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explore curated articles on mental health, mindfulness, and personal growth
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => setActiveTab('all')}
            style={{
              background: activeTab === 'all' 
                ? 'linear-gradient(135deg, #667EEA, #764BA2)' 
                : 'rgba(45, 55, 72, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem 2rem',
              color: activeTab === 'all' ? 'white' : '#A0AEC0',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            All Articles ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            style={{
              background: activeTab === 'favorites' 
                ? 'linear-gradient(135deg, #667EEA, #764BA2)' 
                : 'rgba(45, 55, 72, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '0.75rem 2rem',
              color: activeTab === 'favorites' ? 'white' : '#A0AEC0',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            ⭐ Favorites ({favorites.length})
          </button>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
            <p style={{ color: '#A0AEC0' }}>Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {activeTab === 'favorites' ? '⭐' : '📝'}
            </div>
            <p style={{ color: '#A0AEC0', fontSize: '1.1rem' }}>
              {activeTab === 'favorites' 
                ? 'No favorite articles yet. Star some articles to see them here!'
                : 'No articles available at the moment.'
              }
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                style={{
                  background: 'rgba(45, 55, 72, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  padding: '2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: 'rgba(102, 126, 234, 0.3)'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedArticle(article)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(article.id);
                  }}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: favorites.includes(article.id) ? '#F59E0B' : '#6B7280',
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {favorites.includes(article.id) ? '⭐' : '☆'}
                </button>

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{ fontSize: '2rem' }}>
                    {getCategoryIcon(article.category)}
                  </span>
                  <span style={{
                    background: `linear-gradient(135deg, ${getCategoryColor(article.category).split(' ').slice(-2).join(' ')})`,
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {article.category}
                  </span>
                </div>

                <h3 style={{
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  color: '#E2E8F0',
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  {article.title}
                </h3>

                <p style={{
                  color: '#A0AEC0',
                  marginBottom: '1.5rem',
                  lineHeight: '1.6',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {article.content}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#6B7280',
                  fontSize: '0.9rem'
                }}>
                  <span>{article.author}</span>
                  <span>{formatDate(article.created_at)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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

export default JournalArticles;