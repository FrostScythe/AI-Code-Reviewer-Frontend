import React, { useCallback } from 'react';

const FileDrop = ({ onFileSelect }) => {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      className="file-drop"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput').click()}
    >
      <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="text-primary mx-auto mb-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
      </svg>
      <h3 className="text-xl mb-2">Drop file here or click to upload</h3>
      <p className="text-muted">Supports .js, .java, .py, .cpp, .txt</p>
      <input 
        type="file" 
        id="fileInput" 
        className="hidden" 
        accept=".js,.java,.py,.cpp,.txt"
        onChange={handleFileInput}
      />
    </div>
  );
};

export default FileDrop;