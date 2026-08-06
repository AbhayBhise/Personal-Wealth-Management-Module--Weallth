import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const AIChatWidget: React.FC = () => {
  const { isChatOpen, toggleChat, chatHistory, sendChatMessage, isChatLoading } = useAppStore();
  const [input, setInput] = useState('');
  const [showDebug, setShowDebug] = useState(false);
  const [feedbackState, setFeedbackState] = useState<Record<number, 'up' | 'down'>>({});
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

  const handleFollowUpClick = (prompt: string) => {
    if (isChatLoading) return;
    sendChatMessage(prompt);
  };

  const handleFeedback = (idx: number, type: 'up' | 'down') => {
    setFeedbackState(prev => ({ ...prev, [idx]: type }));
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
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          color: '#fff',
          border: 'none',
          boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          zIndex: 1000,
          transition: 'transform 0.2s ease',
        }}
      >
        {isChatOpen ? '✕' : '💬'}
      </button>

      {isChatOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '400px',
          height: '560px',
          background: '#0f172a',
          borderRadius: '16px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          overflow: 'hidden',
          border: '1px solid rgba(99,102,241,0.3)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
            color: '#fff',
            padding: '14px 16px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <div>
                <div style={{ fontSize: '14px', color: '#f8fafc', fontWeight: '600' }}>AI Wealth Advisor</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => setShowDebug(!showDebug)}
                title="Toggle Developer Diagnostics"
                style={{
                  background: showDebug ? 'rgba(99,102,241,0.3)' : 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#94a3b8', borderRadius: '6px', fontSize: '11px', padding: '2px 6px', cursor: 'pointer'
                }}
              >
                🐞 Debug
              </button>
              <button onClick={toggleChat} style={{ background:'transparent', border:'none', color:'#94a3b8', fontSize: '16px', cursor:'pointer' }}>✕</button>
            </div>
          </div>

          {/* Messages Container */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px', background: '#020617' }}>
            {chatHistory.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '24px', fontSize: '13px', lineHeight: '1.6' }}>
                👋 Hello! How can I assist you with your financial plan today?
              </div>
            )}
            
            {chatHistory.map((msg: any, idx: number) => {
              const isUser = msg.sender === 'user';

              return (
                <div key={idx} style={{
                  display: 'flex', flexDirection: 'column',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '90%', gap: '6px'
                }}>
                  {/* Chat Bubble */}
                  <div style={{
                    background: isUser ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(30, 41, 59, 0.85)',
                    color: isUser ? '#ffffff' : '#f1f5f9',
                    padding: '12px 15px',
                    borderRadius: '16px',
                    lineHeight: '1.55',
                    fontSize: '13.5px',
                    wordBreak: 'break-word',
                    borderBottomRightRadius: isUser ? '3px' : '16px',
                    borderBottomLeftRadius: !isUser ? '3px' : '16px',
                    border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    {isUser ? msg.text : (
                      <div>
                        {msg.text.split('\n').map((line: string, lIdx: number) => {
                          if (!line.trim()) return <div key={lIdx} style={{ height: '6px' }} />;
                          
                          // Format bold text **text**
                          const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

                          return (
                            <div 
                              key={lIdx} 
                              style={{ marginBottom: '4px' }}
                              dangerouslySetInnerHTML={{ __html: formattedLine }} 
                            />
                          );
                        })}

                        {/* Diagnostics Banner if debug is on */}
                        {showDebug && msg.diagnostics && (
                          <div style={{
                            marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.15)',
                            fontSize: '10.5px', color: '#38bdf8', display: 'flex', flexDirection: 'column', gap: '2px'
                          }}>
                            <div>⏱️ Latency: {msg.diagnostics.latencyMs ?? 0}ms</div>
                            <div>🎯 Intent: {msg.diagnostics.intent}</div>
                            <div>📊 Confidence: {msg.diagnostics.confidenceScore}</div>
                            <div>📚 Chunks: {(msg.diagnostics.retrievedChunkIds || []).join(', ')}</div>
                            {msg.diagnostics.sources && msg.diagnostics.sources.length > 0 && (
                              <div>📖 Sources: {msg.diagnostics.sources.join('; ')}</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Feedback 👍 / 👎 for AI messages */}
                  {!isUser && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '4px', fontSize: '11px', color: '#64748b' }}>
                      <span>Was this helpful?</span>
                      <button 
                        onClick={() => handleFeedback(idx, 'up')}
                        style={{
                          background: feedbackState[idx] === 'up' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                          border: 'none', color: feedbackState[idx] === 'up' ? '#34d399' : '#64748b', cursor: 'pointer'
                        }}
                      >
                        👍
                      </button>
                      <button 
                        onClick={() => handleFeedback(idx, 'down')}
                        style={{
                          background: feedbackState[idx] === 'down' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                          border: 'none', color: feedbackState[idx] === 'down' ? '#f87171' : '#64748b', cursor: 'pointer'
                        }}
                      >
                        👎
                      </button>
                    </div>
                  )}

                  {/* Suggested Follow-up Chips */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && idx === chatHistory.length - 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', marginLeft: '2px' }}>
                        💡 You may also ask:
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {msg.suggestedFollowUps.map((prompt: string, pIdx: number) => (
                          <button
                            key={pIdx}
                            onClick={() => handleFollowUpClick(prompt)}
                            disabled={isChatLoading}
                            style={{
                              textAlign: 'left',
                              background: 'rgba(99, 102, 241, 0.12)',
                              border: '1px solid rgba(99, 102, 241, 0.3)',
                              color: '#818cf8',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '11.5px',
                              cursor: isChatLoading ? 'not-allowed' : 'pointer',
                              transition: 'all 0.15s ease',
                              fontWeight: '500'
                            }}
                          >
                            • {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isChatLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#818cf8', fontSize: '12px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px', padding: '6px' }}>
                <span className="spinner" style={{ width: '12px', height: '12px' }} /> Advisor is synthesizing RAG advice...
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px', background: '#0f172a' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask a question..."
              style={{
                flex: 1,
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '20px',
                padding: '9px 16px',
                outline: 'none',
                background: '#1e293b',
                color: '#f8fafc',
                fontSize: '13.5px',
                fontWeight: '500'
              }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isChatLoading}
              style={{
                marginLeft: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                cursor: input.trim() && !isChatLoading ? 'pointer' : 'not-allowed',
                opacity: input.trim() && !isChatLoading ? 1 : 0.5,
                fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
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
