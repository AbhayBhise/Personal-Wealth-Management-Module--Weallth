import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const AIChatWidget: React.FC = () => {
  const { isChatOpen, toggleChat, chatHistory, sendChatMessage, isChatLoading } = useAppStore();
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  return (
    <>
      <button 
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '30px',
          background: 'var(--accent-primary, #007bff)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          zIndex: 1000
        }}
      >
        {isChatOpen ? '✕' : '💬'}
      </button>

      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '350px',
          height: '500px',
          background: 'var(--bg-card, #fff)',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid var(--border-color, #eee)'
        }}>
          <div style={{
            background: 'var(--accent-primary, #007bff)',
            color: '#fff',
            padding: '16px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>AI Wealth Coach</span>
            <button onClick={toggleChat} style={{ background:'transparent', border:'none', color:'#fff', cursor:'pointer' }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-default, #fafafa)' }}>
            {chatHistory.length === 0 && (
              <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
                Ask me about your financial plan, retirement, or asset allocation.
              </div>
            )}
            {chatHistory.map((msg, idx) => (
              <div key={idx} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                background: msg.sender === 'user' ? 'var(--accent-primary, #007bff)' : '#f1f5f9',
                color: msg.sender === 'user' ? '#fff' : '#0f172a',
                padding: '10px 14px',
                borderRadius: '16px',
                maxWidth: '88%',
                lineHeight: '1.45',
                wordBreak: 'break-word',
                borderBottomRightRadius: msg.sender === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: msg.sender === 'ai' ? '4px' : '16px'
              }}>
                {msg.sender === 'user' ? msg.text : msg.text.split('\n').map((line, lIdx) => {
                  if (line.startsWith('## ')) {
                    return (
                      <div key={lIdx} style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b', marginTop: lIdx > 0 ? '12px' : '0', marginBottom: '4px', borderBottom: '1px solid #cbd5e1', paddingBottom: '2px' }}>
                        {line.replace('## ', '')}
                      </div>
                    );
                  }
                  if (line.startsWith('### ')) {
                    return (
                      <div key={lIdx} style={{ fontWeight: '600', fontSize: '0.9rem', color: '#334155', marginTop: lIdx > 0 ? '8px' : '0', marginBottom: '4px' }}>
                        {line.replace('### ', '')}
                      </div>
                    );
                  }
                  if (!line.trim()) return <div key={lIdx} style={{ height: '4px' }} />;
                  return <div key={lIdx} style={{ marginBottom: '3px' }}>{line}</div>;
                })}
              </div>
            ))}
            {isChatLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#888', fontSize: '0.9rem', fontStyle: 'italic' }}>
                Coach is thinking...
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid var(--border-color, #eee)', padding: '12px', background: 'var(--bg-card, #fff)' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                border: '1px solid #ccc',
                borderRadius: '20px',
                padding: '8px 16px',
                outline: 'none',
                background: '#ffffff',
                color: '#000000',
                WebkitTextFillColor: '#000000',
                fontSize: '14px',
                fontWeight: '500'
              }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isChatLoading}
              style={{
                marginLeft: '8px',
                background: 'var(--accent-primary, #007bff)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: input.trim() && !isChatLoading ? 'pointer' : 'not-allowed',
                opacity: input.trim() && !isChatLoading ? 1 : 0.5
              }}
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
};
