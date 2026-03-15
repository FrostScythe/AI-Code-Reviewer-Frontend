import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FileDrop from '../components/FileDrop';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setError('');
    try {
      const text = await file.text();
      setCode(text);
    } catch {
      setError('Failed to read file. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please enter code or upload a file.');
      return;
    }
    setError('');
    setIsUploading(true);

    try {
      // FIX: use selectedFile.name; fall back to a sensible default
      const filename = selectedFile ? selectedFile.name : 'pasted_code.txt';
      const submission = await api.uploadCode(code, filename);

      // Kick off analysis — don't await, Review page polls for result
      api.analyzeSubmission(submission.id).catch(console.error);

      navigate(`/review?id=${submission.id}`);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        'Could not connect to the server. Make sure the backend is running on port 9095.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <div className="card text-center py-16 px-8">
          <h1 className="text-4xl font-extrabold mb-4">Elevate Your Code Quality</h1>
          <p className="text-muted text-xl mb-8">
            Instant, AI-powered code analysis and optimisation.<br />
            Paste your code or drop a file to get started.
          </p>

          <FileDrop onFileSelect={handleFileSelect} />

          <div className="relative">
            <span className="hrsep">OR PASTE CODE</span>
            <hr className="border-border my-8" />
          </div>

          <textarea
            placeholder="// Paste your code here..."
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
          />

          {error && (
            <p className="text-red-400 text-sm mb-4 text-left">{error}</p>
          )}

          <div className="text-right">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? (
                <><span className="loader w-4 h-4 mr-2 inline-block" />Uploading...</>
              ) : (
                'Analyse Code'
              )}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;