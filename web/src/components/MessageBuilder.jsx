import { useState } from 'react';
import './MessageBuilder.css';

function MessageBuilder({ apiUrl }) {
  const [message, setMessage] = useState('');
  const [botIndex, setBotIndex] = useState(1);
  const [sending, setSending] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const handleSend = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setSending(true);
    setLastResult(null);

    try {
      const response = await fetch(`${apiUrl}/api/telegram/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          botIndex
        })
      });

      const data = await response.json();

      if (data.success) {
        setLastResult({ success: true, message: data.output });
        setMessage(''); // Clear message on success
      } else {
        setLastResult({ success: false, message: data.error });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setLastResult({ success: false, message: error.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="message-builder">
      <div className="section-header">
        <h2>✉️ Telegram Message Builder</h2>
        <p>Send messages to Telegram via Wolf Daemon</p>
      </div>

      <div className="builder-container">
        <div className="builder-controls">
          <div className="control-group">
            <label>Select Bot:</label>
            <select
              className="bot-selector"
              value={botIndex}
              onChange={(e) => setBotIndex(parseInt(e.target.value))}
            >
              <option value={1}>🜂 Aetheron Sentinel (Bot 1)</option>
              <option value={2}>🌊 TriadGate (Bot 2)</option>
              <option value={3}>💚 Laira Mirror (Bot 3)</option>
            </select>
          </div>

          <div className="control-group">
            <label>Message:</label>
            <textarea
              className="message-input"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
            />
            <div className="character-count">
              {message.length} characters
            </div>
          </div>

          <div className="control-actions">
            <button
              className="btn btn-primary btn-large"
              onClick={handleSend}
              disabled={sending || !message.trim()}
            >
              {sending ? 'Sending...' : '📤 Send Message'}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setMessage('')}
              disabled={sending}
            >
              Clear
            </button>
          </div>
        </div>

        {lastResult && (
          <div className={`result-message ${lastResult.success ? 'success' : 'error'}`}>
            <div className="result-header">
              {lastResult.success ? '✅ Success' : '❌ Error'}
            </div>
            <div className="result-content">
              {lastResult.message}
            </div>
          </div>
        )}

        <div className="builder-info">
          <h4>ℹ️ How it works</h4>
          <ol>
            <li>Select which bot you want to use (default: Bot 1)</li>
            <li>Type your message in the text area</li>
            <li>Click "Send Message" to queue it for transmission</li>
            <li>Wolf Daemon will process and send it to Telegram</li>
          </ol>

          <h4>💡 Tips</h4>
          <ul>
            <li>Messages are processed asynchronously by Wolf Daemon</li>
            <li>You can use markdown formatting in your messages</li>
            <li>Each bot sends to its configured Telegram chat</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MessageBuilder;
