import { Plot } from './models/Plot.js';
import { Deed } from './models/Deed.js';
import { Transfer } from './models/Transfer.js';
import { Mutation } from './models/Mutation.js';
import { Alert } from './models/Alert.js';
import { AuditLog } from './models/AuditLog.js';
import { isDbConnected } from './db.js';

// In-memory cache / fallback store
const inMemory = {
  plots: [],
  deeds: [],
  transfers: [],
  mutations: [],
  alerts: [],
  auditLogs: []
};

export const store = {
  // PLOTS
  async getPlots(query = {}) {
    if (isDbConnected()) {
      const filter = {};
      if (query.search) {
        filter.$or = [
          { plotId: { $regex: query.search, $options: 'i' } },
          { mouza: { $regex: query.search, $options: 'i' } },
          { 'currentRecordedOwner.name': { $regex: query.search, $options: 'i' } },
          { khatianNumber: { $regex: query.search, $options: 'i' } }
        ];
      }
      return await Plot.find(filter).lean();
    }
    let res = [...inMemory.plots];
    if (query.search) {
      const s = query.search.toLowerCase();
      res = res.filter(p => 
        p.plotId.toLowerCase().includes(s) || 
        p.mouza.toLowerCase().includes(s) || 
        p.currentRecordedOwner?.name?.toLowerCase().includes(s) ||
        p.khatianNumber?.toLowerCase().includes(s)
      );
    }
    return res;
  },

  async getPlotById(plotId) {
    if (isDbConnected()) {
      return await Plot.findOne({ plotId }).lean();
    }
    return inMemory.plots.find(p => p.plotId === plotId) || null;
  },

  // DEEDS
  async getDeeds(plotId = null) {
    if (isDbConnected()) {
      const filter = plotId ? { plotId } : {};
      return await Deed.find(filter).lean();
    }
    if (plotId) return inMemory.deeds.filter(d => d.plotId === plotId);
    return [...inMemory.deeds];
  },

  async getDeedByRef(deedRef) {
    if (isDbConnected()) {
      return await Deed.findOne({ deedRef }).lean();
    }
    return inMemory.deeds.find(d => d.deedRef === deedRef) || null;
  },

  // TRANSFERS
  async getTransfers(plotId = null) {
    if (isDbConnected()) {
      const filter = plotId ? { plotId } : {};
      return await Transfer.find(filter).sort({ transferDate: 1 }).lean();
    }
    let res = inMemory.transfers;
    if (plotId) res = res.filter(t => t.plotId === plotId);
    return [...res].sort((a, b) => new Date(a.transferDate) - new Date(b.transferDate));
  },

  // MUTATIONS
  async getMutations(plotId = null) {
    if (isDbConnected()) {
      const filter = plotId ? { plotId } : {};
      return await Mutation.find(filter).sort({ mutationDate: 1 }).lean();
    }
    let res = inMemory.mutations;
    if (plotId) res = res.filter(m => m.plotId === plotId);
    return [...res].sort((a, b) => new Date(a.mutationDate) - new Date(b.mutationDate));
  },

  // ALERTS
  async getAlerts(filters = {}) {
    if (isDbConnected()) {
      const query = {};
      if (filters.plotId) query.plotId = filters.plotId;
      if (filters.severity) query.severity = filters.severity;
      if (filters.reviewStatus) query.reviewStatus = filters.reviewStatus;
      if (filters.ruleId) query.ruleId = filters.ruleId;
      return await Alert.find(query).sort({ createdAt: -1 }).lean();
    }
    let res = [...inMemory.alerts];
    if (filters.plotId) res = res.filter(a => a.plotId === filters.plotId);
    if (filters.severity) res = res.filter(a => a.severity === filters.severity);
    if (filters.reviewStatus) res = res.filter(a => a.reviewStatus === filters.reviewStatus);
    if (filters.ruleId) res = res.filter(a => a.ruleId === filters.ruleId);
    return res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getAlertById(alertId) {
    if (isDbConnected()) {
      return await Alert.findOne({ alertId }).lean();
    }
    return inMemory.alerts.find(a => a.alertId === alertId) || null;
  },

  async saveAlert(alertData) {
    if (isDbConnected()) {
      return await Alert.findOneAndUpdate(
        { alertId: alertData.alertId },
        { ...alertData, updatedAt: new Date() },
        { upsert: true, new: true }
      ).lean();
    }
    const idx = inMemory.alerts.findIndex(a => a.alertId === alertData.alertId);
    if (idx >= 0) {
      inMemory.alerts[idx] = { ...inMemory.alerts[idx], ...alertData, updatedAt: new Date() };
      return inMemory.alerts[idx];
    }
    const newAlert = { ...alertData, createdAt: new Date(), updatedAt: new Date() };
    inMemory.alerts.push(newAlert);
    return newAlert;
  },

  async updateAlertStatus(alertId, newStatus, reviewerNotes, reviewerId = 'REV-OFFICER-01', reviewerName = 'Authorized Land Reviewer') {
    let alertDoc = null;
    let prevStatus = 'Open';

    if (isDbConnected()) {
      const existing = await Alert.findOne({ alertId });
      if (!existing) return null;
      prevStatus = existing.reviewStatus;
      existing.reviewStatus = newStatus;
      existing.resolutionNotes = reviewerNotes || existing.resolutionNotes;
      existing.reviewedBy = `${reviewerName} (${reviewerId})`;
      existing.reviewedAt = new Date();
      existing.updatedAt = new Date();
      await existing.save();
      alertDoc = existing.toObject();
    } else {
      const idx = inMemory.alerts.findIndex(a => a.alertId === alertId);
      if (idx === -1) return null;
      prevStatus = inMemory.alerts[idx].reviewStatus;
      inMemory.alerts[idx] = {
        ...inMemory.alerts[idx],
        reviewStatus: newStatus,
        resolutionNotes: reviewerNotes || inMemory.alerts[idx].resolutionNotes,
        reviewedBy: `${reviewerName} (${reviewerId})`,
        reviewedAt: new Date(),
        updatedAt: new Date()
      };
      alertDoc = inMemory.alerts[idx];
    }

    // Add Audit Log Entry
    const auditEntry = {
      logId: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action: 'ALERT_STATUS_UPDATED',
      reviewerId,
      reviewerName,
      timestamp: new Date(),
      affectedRecordRefs: [alertId, alertDoc.plotId],
      details: `Alert ${alertId} (${alertDoc.ruleId}) status updated from '${prevStatus}' to '${newStatus}'. Notes: "${reviewerNotes || 'None'}"`,
      previousState: { reviewStatus: prevStatus },
      newState: { reviewStatus: newStatus, resolutionNotes: reviewerNotes }
    };

    await this.addAuditLog(auditEntry);
    return alertDoc;
  },

  // AUDIT LOGS
  async getAuditLogs(limit = 100) {
    if (isDbConnected()) {
      return await AuditLog.find().sort({ timestamp: -1 }).limit(limit).lean();
    }
    return [...inMemory.auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, limit);
  },

  async addAuditLog(entry) {
    const record = {
      ...entry,
      logId: entry.logId || `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: entry.timestamp || new Date()
    };
    if (isDbConnected()) {
      return await AuditLog.create(record);
    }
    inMemory.auditLogs.unshift(record);
    return record;
  },

  // SEED / RESET
  async seedData(data) {
    inMemory.plots = JSON.parse(JSON.stringify(data.plots || []));
    inMemory.deeds = JSON.parse(JSON.stringify(data.deeds || []));
    inMemory.transfers = JSON.parse(JSON.stringify(data.transfers || []));
    inMemory.mutations = JSON.parse(JSON.stringify(data.mutations || []));
    inMemory.alerts = JSON.parse(JSON.stringify(data.alerts || []));
    inMemory.auditLogs = JSON.parse(JSON.stringify(data.auditLogs || []));

    if (isDbConnected()) {
      try {
        await Alert.collection.dropIndexes();
      } catch (e) {
        // Ignore if collection doesn't exist or no index
      }
      await Plot.deleteMany({});
      await Deed.deleteMany({});
      await Transfer.deleteMany({});
      await Mutation.deleteMany({});
      await Alert.deleteMany({});
      await AuditLog.deleteMany({});

      if (data.plots?.length) await Plot.insertMany(data.plots);
      if (data.deeds?.length) await Deed.insertMany(data.deeds);
      if (data.transfers?.length) await Transfer.insertMany(data.transfers);
      if (data.mutations?.length) await Mutation.insertMany(data.mutations);
      if (data.alerts?.length) await Alert.insertMany(data.alerts);
      if (data.auditLogs?.length) await AuditLog.insertMany(data.auditLogs);
    }
    return true;
  }
};
