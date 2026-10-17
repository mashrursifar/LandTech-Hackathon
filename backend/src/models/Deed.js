import mongoose from 'mongoose';

const DeedSchema = new mongoose.Schema({
  deedRef: { type: String, required: true, index: true },
  plotId: { type: String, required: true, index: true },
  sellerId: { type: String, required: true },
  sellerName: { type: String, required: true },
  buyerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  deedDate: { type: String, required: true },
  registrationOffice: { type: String, default: 'District Sub-Registry Office' },
  deedValueBDT: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['Registered', 'Draft', 'Cancelled', 'Superseded', 'Pending', 'Disputed'],
    default: 'Registered' 
  },
  documentHash: { type: String, default: '' },
  sampleDocumentContent: { type: String, default: '' },
  remarks: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export const Deed = mongoose.models.Deed || mongoose.model('Deed', DeedSchema);
