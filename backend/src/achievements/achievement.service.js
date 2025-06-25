import db from '../config/firebase.js';
import { ACHIEVEMENTS } from '../config/achievements.config.js';

export const checkAndAwardAchievements = async (userId, eventType) => {
    const userStatsRef = db.ref(`userStats/${userId}`);
    const userAchievementsRef = db.ref(`userAchievements/${userId}`);

    const [statsSnapshot, achievementsSnapshot] = await Promise.all([
        userStatsRef.once('value'),
        userAchievementsRef.once('value')
    ]);

    const stats = statsSnapshot.val() || {};
    const earnedAchievements = achievementsSnapshot.val() || {};
    const newlyUnlocked = [];

    for (const achievementId in ACHIEVEMENTS) {
        const achievement = ACHIEVEMENTS[achievementId];
        
        if (achievement.type === eventType && !earnedAchievements[achievementId]) {
            let userStatValue = 0;
            switch(eventType) {
                case 'TRANSACTION_COUNT': userStatValue = stats.transactionCount || 0; break;
                case 'STOK_COUNT': userStatValue = stats.stokCount || 0; break;
                case 'LISTING_COUNT': userStatValue = stats.listingCount || 0; break;
                case 'PLAN_UPGRADE': userStatValue = 1; break; // Selalu ter-trigger jika event-nya terjadi
                case 'REDEEM_COUNT': userStatValue = 1; break; // Selalu ter-trigger jika event-nya terjadi
            }

            if (userStatValue >= achievement.threshold) {
                await userAchievementsRef.child(achievementId).set({
                    id: achievement.id,
                    name: achievement.name,
                    description: achievement.description,
                    unlockedAt: Date.now()
                });
                newlyUnlocked.push(achievement);
            }
        }
    }
    return newlyUnlocked;
};