'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function NotesPage() {
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState('');
  const clientId = 'abc123'; // Replace with dynamic ID later

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from('client_notes')
        .select('*')
        .eq('client_id', clientId)
        .single();

      if (error) console.error(error);
      if (data) {
        setNotes(data.note || '');
        setTags(data.tags?.join(', ') || '');
      }
    };

    fetchNotes();
  }, []);

  const saveNote = async () => {
    const { error } = await supabase
      .from('client_notes')
      .upsert({
        client_id: clientId,
        note: notes,
        tags: tags.split(',').map(tag => tag.trim()),
      });

    if (error) console.error(error);
  };

  return (
    <div className="min-h-screen py-10 px-6 bg-gradient-to-tr from-[#0b0e17] to-[#141824] text-white">
      <div className="max-w-2xl mx-auto bg-[#11131b] p-8 rounded-2xl border border-white/10 shadow-glass space-y-6">
        <h1 className="text-3xl font-bold">📝 Agency Notes</h1>

        <div>
          <label className="text-sm text-gray-400">Notes</label>
          <textarea
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full mt-2 p-3 rounded bg-white/10 placeholder-gray-400"
            placeholder="Client insights, reminders..."
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full mt-2 p-3 rounded bg-white/10 placeholder-gray-400"
            placeholder="e.g. high LTV, testing creatives"
          />
        </div>

        <button
          onClick={saveNote}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded font-semibold hover:opacity-90"
        >
          💾 Save Note
        </button>
      </div>
    </div>
  );
}