import mongoose from 'mongoose';

const TransferSchema = new mongoose.Schema({
  transferId: { type: String, required: true, unique: true, index: true },
  plotId: { type: String, required: true, index: true },
  deedRef: { type: String, required: true, index: true },
  sellerId: { type: String, required: true },
  sellerName: { type: String, required: true },
  buyerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  transferStatus: { 
    type: String, 
    enum: ['Active', 'Pending', 'Superseded', 'Cancelled', 'Rejected', 'Under Review'],
    default: 'Active' 
  },
  dependsOnTransferId: { type: String, default: null },
  transferDate: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  notes: { type: String, default: '' }
});

export const Transfer = mongoose.models.Transfer || mongoose.model('Transfer', TransferSchema);
