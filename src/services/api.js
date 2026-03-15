import axios from 'axios';

const API_BASE = 'http://localhost:9095/api/code';
const USER_ID_KEY = 'ai_codereviewer_user_id';

// Generate or reuse a stable UUID per browser session
const getUserId = () => {
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
};

const USER_ID = getUserId();

const api = {
  /**
   * Upload code and create a submission.
   * FIX: field name is 'fileName' (capital N) to match backend entity.
   */
  async uploadCode(code, fileName) {
    const response = await axios.post(`${API_BASE}/upload`, {
      userId: USER_ID,
      fileName: fileName,     
      language: detectLanguage(fileName),
      code: code,
    });
    return response.data;
  },

  /**
   * Trigger AI analysis on the latest version of a submission.
   */
  async analyzeSubmission(submissionId) {
    const response = await axios.post(`${API_BASE}/analyze/${submissionId}`);
    return response.data;
  },

  /**
   * Get all versions for a submission (newest first).
   * NEW endpoint — was missing before.
   */
  async getVersions(submissionId) {
    const response = await axios.get(`${API_BASE}/version/${submissionId}`);
    return response.data;
  },

  /**
   * Submit a new version of code for an existing submission.
   * NEW endpoint — was missing before.
   * Sends raw code as plain text.
   */
  async createNewVersion(submissionId, code) {
    const response = await axios.post(
      `${API_BASE}/version/${submissionId}/new`,
      code,
      { headers: { 'Content-Type': 'text/plain' } }
    );
    return response.data;
  },

  /**
   * Get all submissions for the current user (from History page).
   * NEW endpoint — was missing before.
   */
  async getUserSubmissions() {
    const response = await axios.get(`${API_BASE}/submissions/${USER_ID}`);
    return response.data;
  },

  /**
   * Compare two versions side by side.
   * NEW endpoint — was missing before.
   */
  async compareVersions(versionAId, versionBId) {
    const response = await axios.post(`${API_BASE}/compare`, {
      versionA: versionAId,
      versionB: versionBId,
    });
    return response.data;
  },
};

// Helper: detect language from file extension
function detectLanguage(filename) {
  if (!filename) return 'text';
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
  if (filename.endsWith('.java')) return 'java';
  if (filename.endsWith('.py')) return 'python';
  if (filename.endsWith('.cpp') || filename.endsWith('.cc')) return 'cpp';
  if (filename.endsWith('.c')) return 'c';
  if (filename.endsWith('.go')) return 'go';
  if (filename.endsWith('.rs')) return 'rust';
  return 'text';
}

export default api;