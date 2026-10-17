import mongoose from 'mongoose';

const PlotSchema = new mongoose.Schema({
  plotId: { type: String, required: true, unique: true, index: true },
  mouza: { type: String, required: true },
  khatianNumber: { type: String, required: true },
  dagNumber: { type: String, required: true },
  sampleArea: { type: String, required: true },
  district: { type: String, default: 'Dhaka' },
  subDistrict: { type: String, default: 'Dhanmondi' },
  landCategory: { type: String, default: 'Residential' },
  currentRecordedOwner: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    nid: { type: String, default: 'NID-****-****' }
  },
  status: { type: String, default: 'Active' },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Plot = mongoose.models.Plot || mongoose.model('Plot', PlotSchema);
