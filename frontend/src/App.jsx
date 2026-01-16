import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const examples = [
    'I loved this product, it exceeded my expectations!',
    'Terrible experience, would not recommend to anyone.',
    'Average item — does the job but nothing special.'
  ]

  async function analyze() {
    if (!text.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const url = (API_URL || '') + '/api/predict'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  function fillExample(example) {
    setText(example)
    setResult(null)
  }

  async function copyResult() {
    if (!result) return
    const textToCopy = result.prediction ? `${result.prediction} (${result.probability ?? ''})` : JSON.stringify(result)
    await navigator.clipboard.writeText(textToCopy)
  }

  return (
    <div className="app">
      <div className="card">
        <h1>Sentiment Analysis</h1>
        <p className="lead">Paste a review or sentence below and press <strong>Analyze</strong>.</p>

        <textarea
          placeholder="Type or paste a review..."
          value={text}
          onChange={e => setText(e.target.value)}
          rows={6}
        />

        <div className="row">
          <div className="examples">
            <span>Examples:</span>
            {examples.map((ex, i) => (
              <button key={i} className="example-btn" onClick={() => fillExample(ex)}>{ex}</button>
            ))}
          </div>

          <div className="actions">
            <button onClick={analyze} disabled={loading || !text.trim()} className="primary">{loading ? 'Analyzing…' : 'Analyze'}</button>
            <div className="meta">{text.length} chars</div>
          </div>
        </div>

        {result && (
          <div className="result">
            {result.error ? (
              <div className="error">Error: {result.error}</div>
            ) : (
              <>
                <div className={`badge ${result.label === 1 ? 'pos' : 'neg'}`}>
                  {result.label === 1 ? 'Positive' : 'Negative'}
                </div>
                <div className="prob">Confidence: {result.probability ? Math.round(result.probability * 100) + '%' : 'N/A'}</div>
                <button onClick={copyResult} className="copy">Copy result</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
