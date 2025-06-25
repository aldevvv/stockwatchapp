import db from '../config/firebase.js';

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, startDate, endDate, limit } = req.query;

    const allHistoryRef = db.ref(`riwayatStok/${userId}`);
    const snapshot = await allHistoryRef.once('value');

    if (!snapshot.exists()) {
      return res.status(200).json({ message: 'Belum ada data riwayat.', data: [] });
    }

    const allHistoryData = snapshot.val();
    let flattenedHistory = [];

    for (const anItemId in allHistoryData) {
      const itemHistory = allHistoryData[anItemId];
      Object.values(itemHistory).forEach(entry => {
        flattenedHistory.push({ ...entry, itemId: anItemId });
      });
    }
    
    flattenedHistory.sort((a, b) => b.timestamp - a.timestamp);
    
    let filteredHistory = flattenedHistory;
    if (itemId) {
      filteredHistory = filteredHistory.filter(item => item.itemId === itemId);
    }
    if (startDate) {
      const startTimestamp = new Date(startDate).getTime();
      filteredHistory = filteredHistory.filter(item => item.timestamp >= startTimestamp);
    }
    if (endDate) {
      const endTimestamp = new Date(endDate).setHours(23, 59, 59, 999);
      filteredHistory = filteredHistory.filter(item => item.timestamp <= endTimestamp);
    }

    if (limit) {
        filteredHistory = filteredHistory.slice(0, parseInt(limit, 10));
    }

    res.status(200).json({ message: 'Data riwayat berhasil diambil', data: filteredHistory });
  } catch (error) {
    console.error("Error di getHistory:", error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: error.message });
  }
};
