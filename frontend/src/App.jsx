import React, { useState, useEffect } from 'react';
import Navbar from './components/Layout/Navbar';
import MetricsHeader from './components/Dashboard/MetricsHeader';
import ContributionHeatmap from './components/Heatmap/ContributionHeatmap';
import FlashcardCard from './components/Flashcards/FlashcardCard';
import FlashcardModal from './components/Flashcards/FlashcardModal';
import FilterBar from './components/Flashcards/FilterBar';
import RevisionViewer from './components/Revision/RevisionViewer';
import { api } from './services/api';
import { Plus, Layers, Sparkles, BookOpen, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'cards', 'revision'
  const [flashcards, setFlashcards] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState({ dsa: [], sql: [], tags: [] });
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Initial Data Fetching
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [cardsRes, heatmapRes, statsRes, catRes] = await Promise.all([
        api.getFlashcards({
          type: selectedType !== 'ALL' ? selectedType : undefined,
          category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
          difficulty: selectedDifficulty !== 'ALL' ? selectedDifficulty : undefined,
          search: searchTerm || undefined,
        }),
        api.getHeatmapData(),
        api.getStats(),
        api.getCategories(),
      ]);

      if (cardsRes?.data) setFlashcards(cardsRes.data);
      if (heatmapRes?.data) setHeatmapData(heatmapRes.data);
      if (statsRes?.data) setStats(statsRes.data);
      if (catRes?.data) setCategories(catRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [selectedType, selectedCategory, selectedDifficulty, searchTerm]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSaveCard = async (payload, cardId) => {
    try {
      if (cardId) {
        await api.updateFlashcard(cardId, payload);
        showToast('Flashcard updated successfully! ✨');
      } else {
        await api.createFlashcard(payload);
        showToast('New Flashcard created! 🚀');
      }
      fetchAllData();
    } catch (err) {
      showToast('Error saving flashcard. Please check backend.');
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm('Are you sure you want to delete this flashcard?')) return;
    try {
      await api.deleteFlashcard(id);
      showToast('Flashcard removed.');
      fetchAllData();
    } catch (err) {
      showToast('Failed to delete flashcard.');
    }
  };

  const handleReviseCard = async (id, rating) => {
    try {
      await api.reviseFlashcard(id, rating);
      showToast(`Revision logged (${rating})! Streak & Heatmap updated.`);
      // Refresh heatmap & stats without full loading screen
      const [heatmapRes, statsRes] = await Promise.all([api.getHeatmapData(), api.getStats()]);
      if (heatmapRes?.data) setHeatmapData(heatmapRes.data);
      if (statsRes?.data) setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('ALL');
    setSelectedCategory('ALL');
    setSelectedDifficulty('ALL');
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-[#EFF2F6] font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#282828] border border-[#39D353] text-[#39D353] px-4 py-3 rounded-xl shadow-2xl font-mono text-xs flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setCardToEdit(null);
          setIsModalOpen(true);
        }}
        stats={stats}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-8">
        {/* DASHBOARD TAB VIEW */}
        {activeTab === 'dashboard' && (
          <>
            {/* Top Metrics Cards Banner */}
            <MetricsHeader
              stats={stats}
              onOpenAddModal={() => {
                setCardToEdit(null);
                setIsModalOpen(true);
              }}
              setActiveTab={setActiveTab}
            />

            {/* Core Heatmap Dashboard Component */}
            <ContributionHeatmap heatmapData={heatmapData} />

            {/* Quick Decks Preview */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#FFA116]" />
                    Recent Flashcards Library
                  </h3>
                  <p className="text-xs text-gray-400">Quick view of your DSA problems & SQL queries</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveTab('revision')}
                    className="bg-[#282828] hover:bg-[#3E3E3E] text-[#39D353] border border-[#39D353]/30 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start Review Mode</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('cards')}
                    className="text-xs text-[#FFA116] hover:underline font-mono font-semibold"
                  >
                    View All ({flashcards.length}) →
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              {flashcards.length === 0 ? (
                <div className="bg-[#282828] border border-[#3E3E3E] rounded-xl p-8 text-center text-gray-400 font-mono text-xs">
                  No flashcards found. Click "Add Card" to create your first DSA problem or SQL topic!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {flashcards.slice(0, 6).map((card) => (
                    <FlashcardCard
                      key={card._id}
                      card={card}
                      onEdit={(c) => {
                        setCardToEdit(c);
                        setIsModalOpen(true);
                      }}
                      onDelete={handleDeleteCard}
                      onRevise={handleReviseCard}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* FLASHCARD DECKS TAB VIEW */}
        {activeTab === 'cards' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-2xl text-white font-sans tracking-tight">
                  Flashcard Decks ({flashcards.length})
                </h2>
                <p className="text-xs text-gray-400">Search and filter DSA patterns and SQL topics</p>
              </div>

              <button
                onClick={() => {
                  setCardToEdit(null);
                  setIsModalOpen(true);
                }}
                className="bg-gradient-to-r from-[#26A641] to-[#39D353] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-2 shadow-lg"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>New Flashcard</span>
              </button>
            </div>

            {/* Filter Bar */}
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              categories={categories}
              onReset={handleResetFilters}
            />

            {/* Grid List */}
            {flashcards.length === 0 ? (
              <div className="bg-[#282828] border border-[#3E3E3E] rounded-2xl p-12 text-center text-gray-400 font-mono text-sm max-w-lg mx-auto">
                <AlertCircle className="w-10 h-10 text-[#FFA116] mx-auto mb-2" />
                No matching cards found for the selected filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flashcards.map((card) => (
                  <FlashcardCard
                    key={card._id}
                    card={card}
                    onEdit={(c) => {
                      setCardToEdit(c);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDeleteCard}
                    onRevise={handleReviseCard}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SPACED REPETITION REVISION TAB VIEW */}
        {activeTab === 'revision' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h2 className="font-extrabold text-2xl text-white tracking-tight flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-[#39D353]" />
                Spaced Repetition Reviewer
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Flip through cards to test your recall. Rate each card to auto-update your streak and heatmap!
              </p>
            </div>

            <RevisionViewer flashcards={flashcards} onReviseCard={handleReviseCard} />
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      <FlashcardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCard}
        cardToEdit={cardToEdit}
      />
    </div>
  );
}
