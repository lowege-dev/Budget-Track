import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotes, useAddNote, useDeleteNote, useEditNote } from '../hooks/useNotes';
import { BookOpen, PlusCircle, Trash2, Lock, Unlock, ChevronLeft, Edit2, Save } from 'lucide-react';
import { useToast } from '../hooks/useToast';

export const NotesTab = () => {
  const { data: notes, isLoading } = useNotes();
  const { mutate: addNote, isPending: isAdding } = useAddNote();
  const { mutate: deleteNote } = useDeleteNote();
  const { mutate: editNote, isPending: isEditing } = useEditNote();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeNote, setActiveNote] = useState(null);
  const [unlockedNotes, setUnlockedNotes] = useState({});
  const [unlockPromptNote, setUnlockPromptNote] = useState(null);
  const [guessPin, setGuessPin] = useState('');
  const [pinError, setPinError] = useState(false);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const { user } = useAuth();
  const userId = user ? (user.id || user._id) : 'guest';
  const appPin = localStorage.getItem(`budget_pin_${userId}`);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    addNote({ title, content, isLocked }, {
      onSuccess: () => {
        toast('Diary entry saved!', 'success');
        setTitle('');
        setContent('');
        setIsLocked(false);
        setIsFormOpen(false);
      },
      onError: () => toast('Failed to save entry', 'error'),
    });
  };

  React.useEffect(() => {
    if (guessPin.length === 4) {
      if (guessPin === appPin) {
        setUnlockedNotes(p => ({ ...p, [unlockPromptNote]: true }));
        setUnlockPromptNote(null);
        setGuessPin('');
      } else {
        setPinError(true);
        setTimeout(() => setGuessPin(''), 500);
      }
    }
  }, [guessPin, appPin, unlockPromptNote]);

  if (isLoading) return (
    <div className="tab-container" style={{ padding: '0 1.25rem' }}>
      {/* Section header skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="skeleton" style={{ width: 160, height: 22, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 90, height: 18, borderRadius: 8 }} />
      </div>
      {/* Note card skeletons */}
      {[1,2,3].map(i => (
        <div key={i} style={{ background: 'var(--surface)', borderRadius: 18, padding: '1.25rem', border: '1px solid var(--border)', marginBottom: 14 }}>
          <div className="skeleton" style={{ width: '55%', height: 18, borderRadius: 6, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: '40%', height: 12, borderRadius: 6, marginBottom: 14 }} />
          <div className="skeleton" style={{ width: '100%', height: 14, borderRadius: 6, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '85%', height: 14, borderRadius: 6, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );

  if (unlockPromptNote) {
    return (
      <div className="tab-container slide-up" style={{ padding: '0', minHeight: '100dvh', background: 'var(--bg)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={() => { setUnlockPromptNote(null); setGuessPin(''); }} style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
          <ChevronLeft size={28} />
        </button>
        <div style={{ maxWidth: 320, textAlign: 'center', padding: '2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(108,92,231,0.3)', marginBottom: '1.5rem' }}>
            <Lock size={28} color="white" />
          </div>
          <h2 style={{ marginBottom: '0.4rem', fontSize: '1.4rem', fontWeight: 700 }}>Unlock Entry</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Enter your App PIN to read this note.</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: '2rem' }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i < guessPin.length ? 'var(--primary)' : 'var(--border)', border: '2px solid var(--primary)', transition: 'all 0.2s', animation: pinError ? 'shake 0.4s' : 'none' }} />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, maxWidth: 240, margin: '0 auto' }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} onClick={() => { if(guessPin.length < 4) { setGuessPin(p => p + n); setPinError(false); } }} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: 14, fontSize: '1.15rem', fontWeight: 600, borderRadius: 12, cursor: 'pointer' }}>{n}</button>
            ))}
            <div />
            <button onClick={() => { if(guessPin.length < 4) { setGuessPin(p => p + '0'); setPinError(false); } }} style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', padding: 14, fontSize: '1.15rem', fontWeight: 600, borderRadius: 12, cursor: 'pointer' }}>0</button>
            <button onClick={() => { setGuessPin(p => p.slice(0, -1)); setPinError(false); }} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: 14, fontSize: '1.15rem', borderRadius: 12, cursor: 'pointer' }}>⌫</button>
          </div>
        </div>
      </div>
    );
  }

  if (activeNote) {
    return (
      <div className="tab-container slide-up" style={{ padding: '0', minHeight: '100dvh', background: 'var(--bg)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>
          <button 
            onClick={() => { 
              if (isEditMode) {
                setIsEditMode(false);
                return;
              }
              setActiveNote(null);
              // Auto-relock when closing
              setUnlockedNotes(p => { const next = {...p}; delete next[activeNote._id]; return next; });
            }} 
            style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
             <ChevronLeft size={24} />
          </button>
          
          <h2 style={{ fontSize: '1.1rem', margin: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isEditMode ? 'Edit Entry' : activeNote.title}
          </h2>

          {isEditMode ? (
            <button 
              onClick={() => {
                editNote({ id: activeNote._id, note: { title: editTitle, content: editContent } }, {
                  onSuccess: (updatedNote) => {
                    setActiveNote(updatedNote);
                    setIsEditMode(false);
                    toast('Entry updated!', 'success');
                  },
                  onError: () => toast('Failed to update entry', 'error'),
                });
              }}
              disabled={isEditing}
              style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
            >
               <Save size={20} /> Save
            </button>
          ) : (
            <>
              <button onClick={() => setIsEditMode(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                 <Edit2 size={20} />
              </button>
              <button onClick={() => { if(window.confirm('Delete entry?')) { deleteNote(activeNote._id, { onSuccess: () => toast('Entry deleted', 'info'), onError: () => toast('Failed to delete entry', 'error') }); setActiveNote(null); } }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                 <Trash2 size={20} />
              </button>
            </>
          )}
        </div>
        <div style={{ padding: '1.5rem 1.25rem' }}>
          {isEditMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                type="text" 
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className="form-input"
                style={{ fontWeight: 'bold', fontSize: '1.2rem', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid var(--border)', borderRadius: 0, background: 'transparent', outline: 'none', boxShadow: 'none' }}
              />
              <textarea 
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                className="form-input"
                rows="15"
                style={{ border: 'none', background: 'transparent', padding: '0', resize: 'vertical', fontSize: '1.05rem', lineHeight: '1.8', outline: 'none', boxShadow: 'none' }}
              />
            </div>
          ) : (
            <>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  {new Date(activeNote.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text)' }}>
                {activeNote.content}
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tab-container slide-up">
      <div className="section-header">
        <span className="section-title">My Financial Diary</span>
        <button className="section-link" onClick={() => setIsFormOpen(!isFormOpen)}>
          {isFormOpen ? 'Cancel' : '+ New Entry'}
        </button>
      </div>

      {isFormOpen && (
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              placeholder="Entry Title (e.g. June Reflections)" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="form-input"
              required
              style={{ fontWeight: 'bold', fontSize: '1.1rem', padding: '0.5rem 0', border: 'none', borderBottom: '1px solid var(--border)', borderRadius: 0, background: 'transparent' }}
            />
            <textarea 
              placeholder="Write your thoughts, financial goals, or reminders here..." 
              value={content}
              onChange={e => setContent(e.target.value)}
              className="form-input"
              rows="4"
              required
              style={{ border: 'none', background: 'transparent', padding: '0', resize: 'vertical' }}
            />
            {appPin ? (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', color: isLocked ? 'var(--primary)' : 'var(--text-secondary)' }}>
                <input type="checkbox" checked={isLocked} onChange={e => setIsLocked(e.target.checked)} style={{ display: 'none' }} />
                {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                {isLocked ? 'Entry will be Locked' : 'Leave Unlocked'}
              </label>
            ) : (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <Lock size={14} style={{display:'inline', marginBottom:'-2px'}}/> Set an App PIN in Settings to lock entries.
              </div>
            )}
            <button type="submit" className="submit-btn" disabled={isAdding}>
              <PlusCircle size={18} /> {isAdding ? 'Saving...' : 'Save Entry'}
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 1.25rem 2rem' }}>
        {notes?.length === 0 && !isFormOpen && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
            Your diary is empty. Tap "+ New Entry" to start writing!
          </p>
        )}
        
        {notes?.map(note => (
          <div 
            key={note._id} 
            className="card" 
            style={{ margin: 0, position: 'relative', cursor: note.isLocked && !unlockedNotes[note._id] ? 'default' : 'pointer' }}
            onClick={() => {
              if (note.isLocked && !unlockedNotes[note._id]) {
                if (!appPin) return alert("Set an App PIN in settings first!");
                setUnlockPromptNote(note._id);
                return;
              }
              setActiveNote(note);
              setEditTitle(note.title);
              setEditContent(note.content);
              setIsEditMode(false);
            }}
          >
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {note.isLocked && (
                <div 
                  onClick={(e) => {
                    if (unlockedNotes[note._id]) {
                      e.stopPropagation();
                      setUnlockedNotes(p => { const next = {...p}; delete next[note._id]; return next; });
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'center', cursor: unlockedNotes[note._id] ? 'pointer' : 'default' }}
                  title={unlockedNotes[note._id] ? "Click to re-lock" : ""}
                >
                  {unlockedNotes[note._id] ? <Unlock size={16} color="var(--success)" /> : <Lock size={16} color="var(--primary)" />}
                </div>
              )}
              {note.title}
            </h3>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              {new Date(note.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            
            {note.isLocked && !unlockedNotes[note._id] ? (
              <div 
                style={{ filter: 'blur(6px)', userSelect: 'none', opacity: 0.6, background: 'var(--text)', WebkitBackgroundClip: 'text', color: 'transparent' }}
                title="Click to unlock"
              >
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {note.content.replace(/./g, '█ ')}
                </p>
              </div>
            ) : (
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem', color: 'var(--text)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {note.content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
