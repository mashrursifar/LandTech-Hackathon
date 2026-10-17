import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true, index: true },
  plotId: { type: String, required: true, index: true },
  ruleId: { 
    type: String, 
    required: true, 
    enum: ['R1', 'R2', 'R3', 'R4', 'R5'] 
  },
  ruleTitle: { type: String, required: true },
  severity: { 
    type: String, 
    required: true, 
    enum: ['High', 'Review', 'Medium'] 
  },
  explanation: { type: String, required: true },
  recommendation: { 
    type: String, 
    default: 'Hold for human review and verify registration tokens with local Sub-Registry.' 
  },
  evidenceRefs: [
    {
      type: { type: String, required: true }, // 'deed', 'transfer', 'mutation', 'plot'
      refId: { type: String, required: true },
      label: { type: String, default: '' },
      summary: { type: String, default: '' }
    }
  ],
  reviewStatus: { 
    type: String, 
    enum: ['Open', 'Under Review', 'Resolved', 'Dismissed'],
    default: 'Open',
    index: true
  },
  resolutionNotes: { type: String, default: '' },
  reviewedBy: { type: String, default: null },
  reviewedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Alert = mongoose.models.Alert || mongoose.model('Alert', AlertSchema);
