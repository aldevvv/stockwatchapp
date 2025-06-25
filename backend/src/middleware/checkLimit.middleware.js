import db from '../config/firebase.js';
import { PLAN_LIMITS } from '../config/planLimits.js';

export const checkLimit = (dataType) => async (req, res, next) => {
  try {
    const userId = req.user.id;

    const profileRef = db.ref(`users/${userId}/profile`);
    const profileSnapshot = await profileRef.once('value');
    const userPlan = profileSnapshot.val()?.plan || 'Free';

    const limit = PLAN_LIMITS[userPlan]?.[dataType];
    if (limit === undefined || limit === Infinity) {
      return next();
    }

    let dataPath;
    switch (dataType) {
      case 'stok': dataPath = `stok/${userId}`; break;
      case 'supplier': dataPath = `suppliers/${userId}`; break;
      case 'produk': dataPath = `produkJadi/${userId}`; break;
      default: return next();
    }

    const dataRef = db.ref(dataPath);
    const dataSnapshot = await dataRef.once('value');
    const currentCount = dataSnapshot.numChildren();

    if (currentCount >= limit) {
      return res.status(403).json({ 
        message: `Batas tercapai! Paket ${userPlan} Anda hanya mengizinkan ${limit} ${dataType}. Silakan upgrade paket Anda.` 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Gagal memverifikasi batasan plan." });
  }
};
