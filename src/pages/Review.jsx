import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import api from '../services/api';

const POLL_INTERVAL = 3000; // ms between analysis polls

const Review = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const submissionId = new URLSearchParams(location.search).get('id');

  const [loading, setLoading] = useState(true);
  const [latestVersion, setLatestVersion] = useState(null);
  const [newCode, setNewCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const pollRef = useRef(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearTimeout(pollRef.current);
      pollRef.current = null;
    }
  };

  const loadVersions = useCallback(async () => {
    try {
      const data = await api.getVersions(submissionId);
      if (!data || data.length === 0) {
        setLoading(false);
        return;
      }

      // Versions come back newest-first (sorted by backend)
      const latest = data[0];
      setLatestVersion(latest);
      setNewCode(latest.code || '');

      // Keep polling while analysis is still pending
      if (
        latest.analysis === 'Pending analysis...' ||
        !latest.analysis ||
        latest.analysis === ''
      ) {
        pollRef.current = setTimeout(loadVersions, POLL_INTERVAL);
      } else {
        setLoading(false);
        stopPolling();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('Failed to load version data.');
    }
  }, [submissionId]);

  useEffect(() => {
    if (!submissionId) {
      navigate('/history');
      return;
    }
    loadVersions();
    return stopPolling; // cleanup on unmount
  }, [submissionId, navigate, loadVersions]);

  const handleSubmitNewVersion = async () => {
    if (!newCode.trim()) {
      setError('Please enter code before submitting.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    try {
      await api.createNewVersion(submissionId, newCode);
      // Reload page so polling restarts for the new version
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        'Failed to submit new version. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!latestVersion && loading) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Loader text="Loading submission..." />
        </main>
      </>
    );
  }

  if (!latestVersion) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="card text-center">
            No version data found.{' '}
            <button className="btn btn-secondary mt-4" onClick={() => navigate('/history')}>
              Back to History
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        {/* Header row */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold">Code Analysis</h1>
          <div>
            <span className="bg-dark-card border border-border px-4 py-2 rounded-full text-sm mr-4">
              Version {latestVersion.versionNumber}
            </span>
            <button onClick={() => navigate('/history')} className="btn btn-secondary">
              Back to History
            </button>
          </div>
        </div>

        {/* AI Feedback */}
        <div className="card">
          <h3 className="text-secondary mb-4">AI Feedback</h3>
          {loading ? (
            <div className="text-center py-8">
              <div className="loader mx-auto mb-4" />
              <p className="text-muted">Analysing your code — this can take up to 30 seconds…</p>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-muted leading-relaxed">
              {latestVersion.analysis || 'No analysis available.'}
            </pre>
          )}
        </div>

        {/* Source code (read-only) */}
        <div className="card">
          <h3 className="mb-4">Source Code</h3>
          <textarea readOnly value={latestVersion.code} />
        </div>

        {/* Submit new version */}
        <div className="card">
          <h3 className="mb-4">Iterate &amp; Improve</h3>
          <p className="text-muted mb-4">
            Apply the suggestions above, then submit a new version to get fresh feedback.
          </p>
          <textarea
            placeholder="// Paste your improved code here…"
            value={newCode}
            onChange={(e) => { setNewCode(e.target.value); setError(''); }}
          />
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <button
            className="btn btn-primary"
            onClick={handleSubmitNewVersion}
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? (
              <><span className="loader w-4 h-4 mr-2 inline-block" />Analysing…</>
            ) : (
              'Submit New Version'
            )}
          </button>
        </div>
      </main>
    </>
  );
};

export default Review;