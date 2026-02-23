import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import api from '../services/api';

const Compare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const submissionId = queryParams.get('id');

  const [versions, setVersions] = useState([]);
  const [versionA, setVersionA] = useState('');
  const [versionB, setVersionB] = useState('');
  const [codeA, setCodeA] = useState('');
  const [codeB, setCodeB] = useState('');
  const [loading, setLoading] = useState(true);

  const loadVersions = useCallback(async () => {
    try {
      const data = await api.getVersions(submissionId);
      setVersions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  const updateComparison = useCallback(async () => {
    if (versionA && versionB && versionA !== 'Select version A' && versionB !== 'Select version B') {
      try {
        const data = await api.compareVersions(versionA, versionB);
        setCodeA(data.versionA.code);
        setCodeB(data.versionB.code);
      } catch (error) {
        console.error(error);
      }
    }
  }, [versionA, versionB]);

  useEffect(() => {
    if (!submissionId) {
      navigate('/history');
      return;
    }
    loadVersions();
  }, [submissionId, navigate, loadVersions]);

  useEffect(() => {
    updateComparison();
  }, [updateComparison]);

  if (loading) {
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
          <h1 className="text-4xl font-extrabold">Version Comparison</h1>
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Back
          </button>
        </div>

        <div className="card">
          <div className="flex gap-4 mb-4">
            <select
              className="btn btn-secondary w-48"
              value={versionA}
              onChange={(e) => setVersionA(e.target.value)}
            >
              <option value="">Select version A</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  Version {v.versionNumber}
                </option>
              ))}
            </select>
            <div className="flex items-center text-muted"></div>
            <select
              className="btn btn-secondary w-48"
              value={versionB}
              onChange={(e) => setVersionB(e.target.value)}
            >
              <option value="">Select version B</option>
              {versions.map((v) => (
                <option key={v.id} value={v.id}>
                  Version {v.versionNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="diff-view">
            <div>
              <h4 className="text-danger mb-2 text-center">Original</h4>
              <pre className="whitespace-pre-wrap text-xs bg-black/30 p-4 rounded-lg border border-border">
                {codeA}
              </pre>
            </div>
            <div>
              <h4 className="text-success mb-2 text-center">Modified</h4>
              <pre className="whitespace-pre-wrap text-xs bg-black/30 p-4 rounded-lg border border-border">
                {codeB}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Compare;