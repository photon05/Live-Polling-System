import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const TeacherPage = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ text: "", isCorrect: false }]);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [results, setResults] = useState(null);

  useEffect(() => {
    socket.on("poll:new", (poll) => setCurrentPoll(poll));
    socket.on("poll:update", (stats) => setResults(stats));

    return () => {
      socket.off("poll:new");
      socket.off("poll:update");
    };
  }, []);

  const handleOptionChange = (index, field, value) => {
    const updated = [...options];
    updated[index][field] = field === "isCorrect" ? value === "true" : value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleAskQuestion = () => {
    const poll = { question, options };
    socket.emit("teacher:createPoll", poll);
    setQuestion("");
    setOptions([{ text: "", isCorrect: false }]);
    setResults(null);
  };

  const getTotalVotes = () => {
    if (!results) return 0;
    return Object.values(results.count).reduce((a, b) => a + b, 0);
  };

  const totalVotes = getTotalVotes();

  return (
    <div className="bg-white min-h-screen p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-sm text-white px-6 py-3 rounded-4xl w-fit bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] shadow-md">
          Intervue Poll
        </h1>
      </header>

      {/* Form */}
      <section className="max-w-xl mb-10">
        <h2 className="text-2xl text-gray-800 font-semibold mb-1">
          Let's get started
        </h2>
        <p className="text-gray-500 mb-4">Create your poll below</p>

        <input
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-6"
        />

        {options.map((opt, index) => (
          <div key={index} className="flex items-center mb-4">
            <span className="mr-2">{index + 1}.</span>
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt.text}
              onChange={(e) =>
                handleOptionChange(index, "text", e.target.value)
              }
              className="flex-1 p-2 border border-gray-300 rounded-md"
            />
            <label className="ml-4 text-gray-600">
              <input
                type="radio"
                name="correct"
                value="true"
                checked={opt.isCorrect}
                onChange={() => {
                  const updated = options.map((o, i) => ({
                    ...o,
                    isCorrect: i === index,
                  }));
                  setOptions(updated);
                }}
              />{" "}
              Correct
            </label>
          </div>
        ))}

        <button
          onClick={addOption}
          className="bg-gray-200 text-black px-4 py-2 rounded-md mr-4"
        >
          + Add Option
        </button>

        <button
          onClick={handleAskQuestion}
          className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white px-6 py-2 rounded-md font-semibold shadow-md"
        >
          Ask Question
        </button>
      </section>

      {/* Live Results */}
      {currentPoll && results && (
        <section className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-[#4F0DCE] mb-4">
            {currentPoll.question}
          </h2>

          {currentPoll.options.map((opt, idx) => {
            const voteCount = results.count[opt.text] || 0;
            const percentage =
              totalVotes === 0
                ? 0
                : Math.round((voteCount / totalVotes) * 100);

            return (
              <div key={idx} className="mb-4">
                <div className="relative bg-gray-200 rounded-md overflow-hidden h-10">
                  <div
                    className="absolute h-full left-0 top-0 bg-gradient-to-r from-[#8F64E1] to-[#1D68BD]"
                    style={{ width: `${percentage}%` }}
                  ></div>
                  <div className="relative z-10 flex justify-between items-center h-full px-4 text-white font-semibold">
                    <span>{opt.text}</span>
                    <span>{percentage}%</span>
                  </div>
                </div>
              </div>
            );
          })}

          <p className="text-sm text-gray-500 mt-2">
            Total responses: {totalVotes}
          </p>
        </section>
      )}
    </div>
  );
};

export default TeacherPage;
