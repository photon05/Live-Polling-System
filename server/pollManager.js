const Poll = require('./models/Poll');
const Student = require('./models/Student');

module.exports = {
  async addStudent(id, name) {
    await Student.create({ socketId: id, name });
  },

  async removeStudent(id) {
    await Student.deleteOne({ socketId: id });
  },

  async createPoll({ question, options }) {
    const newPoll = new Poll({ question, options, responses: {} });
    await newPoll.save();
    return newPoll;
  },

  async submitAnswer(socketId, answer) {
    const student = await Student.findOne({ socketId });
    const poll = await Poll.findOne().sort({ createdAt: -1 });

    if (student && poll) {
      poll.responses.set(socketId, answer);
      await poll.save();
    }
  },

  async getLatestPoll() {
    return await Poll.findOne().sort({ createdAt: -1 });
  },

  async getPollStats() {
    const poll = await Poll.findOne().sort({ createdAt: -1 });
    const count = {};

    if (poll) {
      for (let ans of poll.responses.values()) {
        count[ans] = (count[ans] || 0) + 1;
      }
    }

    return {
      question: poll?.question || '',
      count
    };
  }
};
