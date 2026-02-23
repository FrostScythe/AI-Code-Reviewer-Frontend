import axios from 'axios';

const API_BASE = 'http://localhost:9095/api/code';
const USER_ID_KEY = 'ai_codereviewer_user_id';

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
  async uploadCode(code, filename) {
    const response = await axios.post(`${API_BASE}/upload`, {
      userId: USER_ID,
      filename: filename,
      language: this.detectLanguage(filename),
      code: code
    });
    return response.data;
  },

  async analyzeSubmission(submissionId) {
    await axios.post(`${API_BASE}/analyze/${submissionId}`);
  },

  async getVersions(submissionId) {
    const response = await axios.get(`${API_BASE}/version/${submissionId}`);
    return response.data;
  },

  async createNewVersion(submissionId, code) {
    const response = await axios.post(`${API_BASE}/version/${submissionId}/new`, code);
    return response.data;
  },

  async getUserSubmissions() {
    const response = await axios.get(`${API_BASE}/submissions/${USER_ID}`);
    return response.data;
  },

  async compareVersions(versionAId, versionBId) {
    const response = await axios.post(`${API_BASE}/compare`, {
      versionA: versionAId,
      versionB: versionBId
    });
    return response.data;
  },

  detectLanguage(filename) {
    if (filename.endsWith('.js')) return 'javascript';
    if (filename.endsWith('.java')) return 'java';
    if (filename.endsWith('.py')) return 'python';
    if (filename.endsWith('.cpp')) return 'cpp';
    return 'text';
  }
};

export default api;