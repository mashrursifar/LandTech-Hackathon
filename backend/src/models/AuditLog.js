import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true, index: true },
  action: { type: String, required: true }, // e.g., 'ALERT_STATUS_UPDATED', 'DETECTION_ENGINE_RUN', 'MANUAL_INSPECTION_STARTED'
  reviewerId: { type: String, default: 'REV-OFFICER-01' },
  reviewerName: { type: String, default: 'Authorized Land Verification Officer' },
  timestamp: { type: Date, default: Date.now, index: true },
  affectedRecordRefs: [{ type: String }],
  details: { type: String, required: true },
  previousState: { type: mongoose.Schema.Types.Mixed, default: null },
  newState: { type: mongoose.Schema.Types.Mixed, default: null }
});

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
