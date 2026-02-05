import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    from_email: '',
    subject: '',
    body: '',
    recipients: '',
    headers_list: []
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [view, setView] = useState('form') // 'form', 'success', 'history'
  const [history, setHistory] = useState([])

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      const response = await axios.get(`${apiUrl}/history`)
      setHistory(response.data)
      setView('history')
    } catch (error) {
      alert('Error fetching history: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResults(null)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      const response = await axios.post(`${apiUrl}/send-bulk`, {
        ...formData,
        recipients: formData.recipients.split('\n').map(email => email.trim()).filter(email => email !== '')
      })
      setResults({ success: formData.recipients.split('\n').filter(e => e.trim()).length, failed: 0 }) 
      setView('success')
    } catch (error) {
      alert('Error sending emails: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  if (view === 'success') {
    return (
      <div className="layout-wrapper">
        <div className="side-image">
          <img src="https://res.cloudinary.com/djme9spdc/image/upload/v1681139870/samples/ecommerce/leather-bag-gray.jpg" alt="Bulk Mail" />
        </div>
        <div className="container">
          <div className="section status-page animate-in">
            <div className="success-icon-wrapper">
              <div className="success-icon">✓</div>
            </div>
            <h2 className="status-title">
              Campaign Processed Successfully!
            </h2>
            <p className="status-subtitle">Your emails have been added to the high-priority queue and are being dispatched.</p>
            
            <div className="stats-container">
              <div className="stat-box">
                <span className="stat-value">{results.success}</span>
                <span className="stat-value">{results.success}</span>
                <span className="stat-label">Total Recipients</span>
              </div>
              <div className="stat-box">
                <span className="stat-value">Active</span>
                <span className="stat-label">Queue Status</span>
              </div>
            </div>

            <div className="info-alert">
              <p><strong>Note:</strong> Since we use a background worker system, you can safely close this window or start a new campaign while the current one finishes in the background.</p>
            </div>

            <div className="action-buttons">
              <button onClick={() => setView('form')} className="btn-primary">
                Send Another Batch
              </button>
              <button onClick={fetchHistory} className="btn-secondary">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (view === 'history') {
    return (
      <div className="layout-wrapper">
        <div className="side-image">
          <img src="https://res.cloudinary.com/djme9spdc/image/upload/v1681139870/samples/ecommerce/leather-bag-gray.jpg" alt="Bulk Mail" />
        </div>
        <div className="container">
          <div className="section animate-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Mail History</h2>
              <button onClick={() => setView('form')} className="btn-secondary">Back to Send</button>
            </div>
            
            <div className="history-list">
              {history.length === 0 ? (
                <p>No emails sent yet.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Recipient</th>
                        <th style={{ padding: '12px' }}>Subject</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{item.recipient}</td>
                          <td style={{ padding: '12px' }}>{item.subject}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              fontSize: '0.8em',
                              backgroundColor: item.status === 'sent' ? '#d4edda' : (item.status === 'failed' ? '#f8d7da' : '#fff3cd'),
                              color: item.status === 'sent' ? '#155724' : (item.status === 'failed' ? '#721c24' : '#856404')
                            }}>
                              {item.status}
                            </span>
                            {item.error && <div style={{ fontSize: '0.7em', color: '#721c24', marginTop: '4px' }}>{item.error}</div>}
                          </td>
                          <td style={{ padding: '12px' }}>{new Date(item.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="layout-wrapper">
      <div className="side-image">
        <img src="https://res.cloudinary.com/djme9spdc/image/upload/v1681139870/samples/ecommerce/leather-bag-gray.jpg" alt="Bulk Mail" />
      </div>
      <div className="container">
       

      <form onSubmit={handleSubmit}>
        <div className="section">
          <h2>Email Content</h2>
          <div className="grid">
            <input name="from_email" placeholder="From Email (Spoofing)" value={formData.from_email} onChange={handleChange} />
            <input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
          </div>
          <textarea name="body" placeholder="Email Body (HTML supported)" value={formData.body} onChange={handleChange} required rows="5"></textarea>
        </div>

        <div className="section">
          <h2>Recipients</h2>
          <textarea name="recipients" placeholder="Enter emails (one per line)" value={formData.recipients} onChange={handleChange} required rows="5"></textarea>
        </div>

        <div className="section">
          <h2>Advanced / Security </h2>
          <p>Spoofing is demonstrated by the "From Email" field above. Below you can add custom headers.</p>
          {formData.headers_list.map((header, index) => (
            <div key={index} className="grid" style={{ marginBottom: '10px' }}>
              <input 
                placeholder="Header Name (e.g. X-Mailer)" 
                value={header.name} 
                onChange={(e) => {
                  const newHeaders = [...formData.headers_list]
                  newHeaders[index].name = e.target.value
                  setFormData({ ...formData, headers_list: newHeaders })
                }} 
              />
              <input 
                placeholder="Header Value" 
                value={header.value} 
                onChange={(e) => {
                  const newHeaders = [...formData.headers_list]
                  newHeaders[index].value = e.target.value
                  setFormData({ ...formData, headers_list: newHeaders })
                }} 
              />
              <button type="button" onClick={() => {
                const newHeaders = formData.headers_list.filter((_, i) => i !== index)
                setFormData({ ...formData, headers_list: newHeaders })
              }} className="btn-danger" style={{ gridColumn: 'span 2' }}>Remove Header</button>
            </div>
          ))}
          <button type="button" onClick={() => {
            setFormData({ ...formData, headers_list: [...formData.headers_list, { name: '', value: '' }] })
          }} className="btn-success">Add Custom Header</button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Bulk Emails'}
        </button>
      </form>
    </div>
    </div>
  )
}

export default App
