import axios from 'axios';

const API_BASE = '/api';

export const api = {
  // Flashcards
  async getFlashcards(params = {}) {
    try {
      const res = await axios.get(`${API_BASE}/flashcards`, { params });
      return res.data;
    } catch (err) {
      console.warn('API getFlashcards error:', err);
      return { success: false, data: [] };
    }
  },

  async createFlashcard(data) {
    const res = await axios.post(`${API_BASE}/flashcards`, data);
    return res.data;
  },

  async updateFlashcard(id, data) {
    const res = await axios.put(`${API_BASE}/flashcards/${id}`, data);
    return res.data;
  },

  async deleteFlashcard(id) {
    const res = await axios.delete(`${API_BASE}/flashcards/${id}`);
    return res.data;
  },

  async reviseFlashcard(id, rating) {
    const res = await axios.patch(`${API_BASE}/flashcards/${id}/revise`, { rating });
    return res.data;
  },

  async getCategories() {
    try {
      const res = await axios.get(`${API_BASE}/flashcards/meta/categories`);
      return res.data;
    } catch (err) {
      return { success: false, data: { dsa: [], sql: [], tags: [] } };
    }
  },

  // Analytics & Heatmap
  async getHeatmapData() {
    try {
      const res = await axios.get(`${API_BASE}/analytics/heatmap`);
      return res.data;
    } catch (err) {
      console.warn('API getHeatmapData error:', err);
      return { success: false, data: [] };
    }
  },

  async getStats() {
    try {
      const res = await axios.get(`${API_BASE}/analytics/stats`);
      return res.data;
    } catch (err) {
      console.warn('API getStats error:', err);
      return {
        success: false,
        data: {
          totalCards: 0,
          dsaCardsCount: 0,
          sqlCardsCount: 0,
          currentStreak: 0,
          maxStreak: 0,
          todayProgress: { dsaCount: 0, dsaTarget: 15, dsaPercentage: 0, sqlCount: 0, sqlTarget: 1, sqlPercentage: 0 },
        },
      };
    }
  },
};
