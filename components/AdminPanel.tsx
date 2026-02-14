
import React, { useState } from 'react';
import { ADMIN_PASSWORD } from '../constants';
import { playButtonClick } from '../utils/audioEffects';

interface AdminPanelProps {
  topics: string[];
  setTopics: (topics: string[]) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ topics, setTopics, onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editList, setEditList] = useState(topics.join('\n'));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Verkeerd wachtwoord!');
    }
  };

  const handleSave = () => {
    const newTopics = editList
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (newTopics.length < 2) {
      setError('Voer minimaal 2 onderwerpen in.');
      return;
    }

    playButtonClick();
    setTopics(newTopics);
    localStorage.setItem('summa_topics', JSON.stringify(newTopics));
    onClose();
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-summaIndigo/10">
          <h2 className="text-2xl font-bold text-summaIndigo mb-4 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-summaIndigo mb-1">Wachtwoord</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-summaGray rounded-xl p-3 focus:border-summaAqua outline-none transition-all"
                placeholder="********"
                autoFocus
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  playButtonClick();
                  onClose();
                }}
                className="flex-1 bg-summaGray text-summaIndigo font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
              >
                Annuleren
              </button>
              <button
                type="submit"
                onClick={() => playButtonClick()}
                className="flex-1 bg-summaIndigo text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all"
              >
                Inloggen
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold text-summaIndigo mb-2">Beheer Onderwerpen</h2>
        <p className="text-sm text-gray-500 mb-6">Zet elk onderwerp op een nieuwe regel.</p>
        
        <textarea
          value={editList}
          onChange={(e) => setEditList(e.target.value)}
          className="flex-1 w-full border-2 border-summaGray rounded-xl p-4 focus:border-summaAqua outline-none font-mono text-sm resize-none mb-6"
          placeholder="Onderwerp 1\nOnderwerp 2..."
        />

        {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => {
              playButtonClick();
              onClose();
            }}
            className="px-6 py-3 bg-summaGray text-summaIndigo font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Sluiten
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-summaAqua text-summaIndigo font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
          >
            Opslaan & Toepassen
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
