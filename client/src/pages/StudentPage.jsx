// client/src/pages/StudentPage.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update to your backend URL if hosted

const StudentPage = () => {
  const [name, setName] = useState('');
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(60);

  // Get name only once per tab using sessionStorage
  useEffect(() => {
    let storedName = sessionStorage.getItem('studentName');
    if (!storedName) {
      const inputName = prompt('Enter your name:');
      sessionStorage.setItem('studentName', inputName);
      storedName = inputName;
    }
    setName(storedName);
    socket.emit('student:join', { name: storedName });
  }, []);

  // Listen to events
  useEffect(() => {
    socket.on('poll:new', poll => {
      setQuestion(poll);
      setAnswer('');
      setSubmitted(false);
      setResults(null);
      setTimer(60);
    });

    socket.on('poll:update', stats => {
      setResults(stats);
    });

    socket.on('kicked', () => {
      alert('You were kicked by the teacher.');
      sessionStorage.removeItem('studentName');
      window.location.reload();
    });

    return () => {
      socket.off('poll:new');
      socket.off('poll:update');
      socket.off('kicked');
    };
  }, []);

  // Countdown Timer
  useEffect(() => {
    if (question && !submitted && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0 && !submitted) {
      setSubmitted(true);
    }
  }, [timer, submitted, question]);

  const handleSubmit = () => {
    if (answer && !submitted) {
      socket.emit('student:submitAnswer', { answer });
      setSubmitted(true);
    }
  };

  const getTotalVotes = () => {
    if (!results) return 0;
    return Object.values(results.count).reduce((a, b) => a + b, 0);
  };

  const totalVotes = getTotalVotes();

  return (
    <div style={{ padding: '2rem', backgroundColor: '#F2F2F2', minHeight: '100vh' }}>
      <h2 style={{ color: '#373737' }}>Welcome, {name}</h2>

      {!question ? (
        <p style={{ color: '#6E6E6E' }}>Waiting for the teacher to ask a question...</p>
      ) : submitted ? (
        <>
          <h3 style={{ color: '#4F0DCE' }}>{question.question}</h3>
          {results ? (
            <div style={{ marginTop: '1rem' }}>
              {question.options.map((opt, idx) => {
                const voteCount = results.count[opt.text] || 0;
                const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
                return (
                  <div key={idx} style={{ marginBottom: '1rem' }}>
                    <p style={{ marginBottom: '0.3rem', color: '#373737' }}>
                      {opt.text} — {percentage}%
                    </p>
                    <div style={{
                      backgroundColor: '#D3D9D4',
                      borderRadius: '8px',
                      height: '16px',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(to right, #8F64E1, #1D68BD)',
                        borderRadius: '8px',
                      }} />
                    </div>
                  </div>
                );
              })}
              <p style={{ marginTop: '1rem', color: '#6E6E6E' }}>
                Total responses: {totalVotes}
              </p>
            </div>
          ) : (
            <p>Waiting for results...</p>
          )}
        </>
      ) : (
        <>
          <h3 style={{ color: '#4F0DCE' }}>{question.question}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {question.options.map((opt, idx) => (
              <li key={idx} style={{ margin: '0.5rem 0' }}>
                <label style={{ color: '#373737' }}>
                  <input
                    type="radio"
                    name="answer"
                    value={opt.text}
                    onChange={e => setAnswer(e.target.value)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {opt.text}
                </label>
              </li>
            ))}
          </ul>
          <p>Time left: {timer} seconds</p>
          <button
            onClick={handleSubmit}
            disabled={!answer || submitted}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1.5rem',
              background: 'linear-gradient(to right, #8F64E1, #1D68BD)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
};

export default StudentPage;
