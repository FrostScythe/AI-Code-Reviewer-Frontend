import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Loader from '../components/Loader';
import api from '../services/api';

const History = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await api.getUserSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-4xl font-extrabold mb-8">Your Submissions</h1>

        <div id="submissionList">
          {submissions.length === 0 ? (
            <div className="card text-center">No submissions yet.</div>
          ) : (
            submissions.map((sub) => (
              <div key={sub.id} className="card">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{sub.filename}</h3>
                    <p className="text-muted text-sm mt-1">
                      {new Date(sub.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-x-4">
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
            ))
          )}
        </div>
      </main>
    </>
  );
};

export default History;