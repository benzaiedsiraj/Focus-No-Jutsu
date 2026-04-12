const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  plantType: {
    type: String,
    default: 'Mangekyou Awakening',
  },
  missionName: {
    type: String,
    default: 'Uncategorized Training',
  },
  missionRank: {
    type: String,
    enum: ['D-Rank', 'C-Rank', 'B-Rank', 'A-Rank', 'S-Rank', 'Unranked'],
    default: 'Unranked',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Session', sessionSchema);
