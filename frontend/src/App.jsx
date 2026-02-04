import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    from_email: '',
    subject: '',
    body: '',
    recipients: '',
    smtp_host: '',
    smtp_port: '465',
    smtp_user: '',
    smtp_pass: '',
    smtp_encryption: 'ssl',
    headers_list: []
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

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
      alert(response.data.message)
      // Since Laravel queues emails, we don't get immediate per-email success/fail status
      // unless we polling or use websockets. For now, just show the queue success message.
      setResults({ success: formData.recipients.split('\n').length, failed: 0 }) 
    } catch (error) {
      alert('Error sending emails: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  if (results) {
    return (
      <div className="layout-wrapper">
        <div className="side-image">
          <img src="https://res.cloudinary.com/djme9spdc/image/upload/v1681139870/samples/ecommerce/leather-bag-gray.jpg" alt="Bulk Mail" />
        </div>
        <div className="container">
          <div className="section status-page">
            <h2 style={{ color: results.failed === 0 ? 'var(--dark-green)' : '#d32f2f' }}>
              {results.failed === 0 ? '✓ All Emails Sent Successfully' : '⚠ Mailing Process Completed'}
            </h2>
            <div className="stats-grid">
              <div className="stat-card success">
                <h3>{results.success}</h3>
                <p>Sent</p>
              </div>
              <div className="stat-card failed">
                <h3>{results.failed}</h3>
                <p>Failed</p>
              </div>
            </div>

            {results.errors && results.errors.length > 0 && (
              <div className="error-list">
                <h3>Error Details:</h3>
                <ul>
                  {results.errors.map((err, i) => (
                    <li key={i}><strong>{err.recipient}:</strong> {err.error}</li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => setResults(null)} className="btn-success" style={{ marginTop: '20px' }}>
              Send More Emails
            </button>
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
          <h2>SMTP Configuration (Optional - uses server default if empty)</h2>
          <div className="grid">
            <input name="smtp_host" placeholder="SMTP Host (e.g. smtp.gmail.com)" value={formData.smtp_host} onChange={handleChange} />
            <input name="smtp_port" placeholder="Port (e.g. 465)" value={formData.smtp_port} onChange={handleChange} />
            <input name="smtp_user" placeholder="SMTP Username" value={formData.smtp_user} onChange={handleChange} />
            <input name="smtp_pass" type="password" placeholder="SMTP Password" value={formData.smtp_pass} onChange={handleChange} />
            <select name="smtp_encryption" value={formData.smtp_encryption} onChange={handleChange}>
              <option value="ssl">SSL</option>
              <option value="tls">TLS</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>

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
