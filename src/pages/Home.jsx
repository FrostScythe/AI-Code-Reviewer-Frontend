import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import FileDrop from '../components/FileDrop';
import api from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    const text = await file.text();
    setCode(text);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please enter code or upload a file');
      return;
    }

    setIsUploading(true);

    try {
      const filename = selectedFile ? selectedFile.name : 'pasted_code.txt';
      const submission = await api.uploadCode(code, filename);
      await api.analyzeSubmission(submission.id);
      navigate(`/review?id=${submission.id}`);
    } catch (error) {
      console.error(error);
      alert('Error connecting to server');
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
            Instant, AI-powered code analysis and optimization. <br />
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
            onChange={(e) => setCode(e.target.value)}
          />

          <div className="text-right">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Analyze Code'}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;