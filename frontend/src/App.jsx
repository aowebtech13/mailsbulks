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
  const [statusMessage, setStatusMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage(null)
    try {
      const response = await axios.post('/api/send-bulk', {
        ...formData,
        recipients: formData.recipients.split('\n').map(email => email.trim()).filter(email => email !== '')
      })
      setStatusMessage(response.data.message)
    } catch (error) {
      alert('Error sending emails: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout-wrapper">
      <div className="side-image">
        <img src="https://res.cloudinary.com/djme9spdc/image/upload/v1681139870/samples/ecommerce/leather-bag-gray.jpg" alt="Bulk Mail" />
      </div>
      <div className="container">
       

        {statusMessage && (
          <div className="section" style={{ backgroundColor: 'var(--light-green)', border: '1px solid var(--primary-green)' }}>
            <p style={{ color: 'var(--dark-green)', fontWeight: 'bold', margin: 0 }}>{statusMessage}</p>
          </div>
        )}

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
