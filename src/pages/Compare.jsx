import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import api from '../services/api';

const Compare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const submissionId = new URLSearchParams(location.search).get('id');

  const [versions, setVersions] = useState([]);
  const [versionA, setVersionA] = useState('');
  const [versionB, setVersionB] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loadingVersions, setLoadingVersions] = useState(true);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [error, setError] = useState('');

  // Load version list on mount
  useEffect(() => {
    if (!submissionId) {
      navigate('/history');
      return;
    }
    api.getVersions(submissionId)
      .then((data) => {
        setVersions(data);
        // Pre-select most recent two versions if available
        if (data.length >= 2) {
          setVersionA(data[1].id);   // second newest = "original"
          setVersionB(data[0].id);   // newest = "modified"
        } else if (data.length === 1) {
          setVersionA(data[0].id);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load versions.');
      })
      .finally(() => setLoadingVersions(false));
  }, [submissionId, navigate]);

  // Fetch comparison whenever both selectors have a valid UUID
  const fetchComparison = useCallback(async () => {
    // Basic UUID validation — just check they're non-empty and different
    if (!versionA || !versionB) return;
    if (versionA === versionB) {
      setError('Please select two different versions to compare.');
      return;
    }
    setError('');
    setLoadingComparison(true);
    try {
      const data = await api.compareVersions(versionA, versionB);
      setComparison(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load comparison. Please try again.');
    } finally {
      setLoadingComparison(false);
    }
  }, [versionA, versionB]);

  useEffect(() => {
    if (versionA && versionB) {
      fetchComparison();
    }
  }, [fetchComparison, versionA, versionB]);

  if (loadingVersions) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Loader text="Loading versions..." />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold">Version Comparison</h1>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Back
          </button>
        </div>

        <div className="card">
          {/* Version selectors */}
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <div>
              <label className="block text-muted text-sm mb-1">Original (A)</label>
              <select
                className="btn btn-secondary"
                value={versionA}
                onChange={(e) => setVersionA(e.target.value)}
              >
                <option value="">— select —</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    Version {v.versionNumber}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-muted text-xl mt-5">→</span>

            <div>
              <label className="block text-muted text-sm mb-1">Modified (B)</label>
              <select
                className="btn btn-secondary"
                value={versionB}
                onChange={(e) => setVersionB(e.target.value)}
              >
                <option value="">— select —</option>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    Version {v.versionNumber}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-primary mt-5"
              onClick={fetchComparison}
              disabled={!versionA || !versionB || loadingComparison}
            >
              {loadingComparison ? 'Loading…' : 'Compare'}
            </button>
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          {/* Side-by-side diff */}
          {comparison ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-danger mb-2 text-center font-semibold">
                  Version {comparison.versionA.versionNumber} (Original)
                </h4>
                <pre className="whitespace-pre-wrap text-xs bg-black/30 p-4 rounded-lg border border-border overflow-auto max-h-[60vh]">
                  {comparison.versionA.code}
                </pre>
              </div>
              <div>
                <h4 className="text-success mb-2 text-center font-semibold">
                  Version {comparison.versionB.versionNumber} (Modified)
                </h4>
                <pre className="whitespace-pre-wrap text-xs bg-black/30 p-4 rounded-lg border border-border overflow-auto max-h-[60vh]">
                  {comparison.versionB.code}
                </pre>
              </div>
            </div>
          ) : (
            !loadingComparison && (
              <p className="text-muted text-center py-8">
                Select two versions above to see a side-by-side comparison.
              </p>
            )
          )}

          {loadingComparison && (
            <div className="text-center py-8">
              <div className="loader mx-auto mb-4" />
              <p className="text-muted">Loading comparison…</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Compare;