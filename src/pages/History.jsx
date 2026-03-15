import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import api from '../services/api';

const History = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getUserSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error(err);
      setError('Could not load submissions. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Loader text="Loading your submissions..." />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-4xl font-extrabold mb-8">Your Submissions</h1>

        {error && (
          <div className="card border-red-500 text-red-400 text-center">{error}</div>
        )}

        {!error && submissions.length === 0 && (
          <div className="card text-center text-muted">
            No submissions yet.{' '}
            <button className="btn btn-primary mt-4" onClick={() => navigate('/home')}>
              Analyse Your First File
            </button>
          </div>
        )}

        {submissions.map((sub) => (
          <div key={sub.id} className="card">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">
                  {sub.fileName || sub.fileName || 'Untitled'}
                </h3>
                <p className="text-muted text-sm mt-1">
                  {sub.language && (
                    <span className="bg-dark-card border border-border px-2 py-0.5 rounded-full text-xs mr-2">
                      {sub.language}
                    </span>
                  )}
                  {sub.createdAt
                    ? new Date(sub.createdAt).toLocaleString()
                    : 'Unknown date'}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/review?id=${sub.id}`)}
                  className="btn btn-primary"
                >
                  View
                </button>
                <button
                  onClick={() => navigate(`/compare?id=${sub.id}`)}
                  className="btn btn-secondary"
                >
                  Compare
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
};

export default History;