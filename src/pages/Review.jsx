import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import api from '../services/api';

const Review = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const submissionId = queryParams.get('id');

  const [loading, setLoading] = useState(true);
  const [latestVersion, setLatestVersion] = useState(null);
  const [newCode, setNewCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadVersions = useCallback(async () => {
    try {
      const data = await api.getVersions(submissionId);
      const latest = data.sort((a, b) => b.versionNumber - a.versionNumber)[0];
      setLatestVersion(latest);
      setNewCode(latest?.code || '');
      
      if (latest?.analysis === 'Pending analysis...' || !latest?.analysis) {
        setTimeout(loadVersions, 2000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    if (!submissionId) {
      navigate('/history');
      return;
    }
    loadVersions();
  }, [submissionId, navigate, loadVersions]);

  const handleSubmitNewVersion = async () => {
    if (!newCode.trim()) {
      alert('Please enter code');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.createNewVersion(submissionId, newCode);
      await api.analyzeSubmission(submissionId);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Error submitting version');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!latestVersion) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Loader />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold">Code Analysis</h1>
          <div>
            <span className="bg-dark-card border border-border px-4 py-2 rounded-full text-sm mr-4">
              Version {latestVersion.versionNumber}
            </span>
            <button
              onClick={() => navigate('/history')}
              className="btn btn-secondary"
            >
              Back to History
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-secondary mb-4">AI Feedback</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="loader mx-auto mb-4"></div>
              Analyzing code...
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-muted">
              {latestVersion.analysis}
            </pre>
          )}
        </div>

        <div className="card">
          <h3 className="mb-4">Source Code</h3>
          <textarea readOnly value={latestVersion.code} />
        </div>

        <div className="card">
          <h3 className="mb-4">Iterate & Improve</h3>
          <p className="text-muted mb-4">
            Edit the code below to submit a new version based on the feedback.
          </p>
          <textarea
            placeholder="// Apply fixes here..."
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={handleSubmitNewVersion}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Analyzing...' : 'Submit New Version'}
          </button>
        </div>
      </main>
    </>
  );
};

export default Review;