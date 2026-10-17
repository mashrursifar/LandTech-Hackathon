import mongoose from 'mongoose';

const MutationSchema = new mongoose.Schema({
  mutationId: { type: String, required: true, unique: true, index: true },
  plotId: { type: String, required: true, index: true },
  caseNumber: { type: String, required: true },
  recordedOwnerId: { type: String, required: true },
  recordedOwnerName: { type: String, required: true },
  linkedDeedRef: { type: String, required: true },
  khatianNumber: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Approved', 'Pending', 'Rejected', 'Disputed', 'Mismatch'],
    default: 'Approved' 
  },
  mutationDate: { type: String, required: true },
  acLandOffice: { type: String, default: 'Assistant Commissioner (Land) Office' },
  dakhilaNumber: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Mutation = mongoose.models.Mutation || mongoose.model('Mutation', MutationSchema);
