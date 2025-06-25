import db from '../config/firebase.js';
import { ACHIEVEMENTS } from '../config/achievements.config.js';

export const getAchievementsStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const userAchievementsRef = db.ref(`userAchievements/${userId}`);
        const snapshot = await userAchievementsRef.once('value');
        const earnedAchievements = snapshot.val() || {};

        const allAchievementsWithStatus = Object.values(ACHIEVEMENTS).map(ach => {
            const earnedData = earnedAchievements[ach.id];
            return {
                ...ach,
                isUnlocked: !!earnedData,
                unlockedAt: earnedData ? earnedData.unlockedAt : null
            };
        });

        res.status(200).json({ data: allAchievementsWithStatus });
    } catch (error) {
        console.error("Error getting achievements status:", error);
        res.status(500).json({ message: "Gagal mengambil data pencapaian." });
    }
};