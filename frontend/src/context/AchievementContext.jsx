import React, { createContext, useState, useContext } from 'react';
import AchievementModal from '../admin/components/achievements/AchievementModal.jsx';
const AchievementContext = createContext(null);

export function useAchievements() {
    return useContext(AchievementContext);
}

export function AchievementProvider({ children }) {
    const [achievementQueue, setAchievementQueue] = useState([]);

    const showAchievement = (newAchievements) => {
        if (newAchievements && newAchievements.length > 0) {
            setAchievementQueue(prevQueue => [...prevQueue, ...newAchievements]);
        }
    };

    const handleClose = () => {
        setAchievementQueue(prevQueue => prevQueue.slice(1));
    };

    return (
        <AchievementContext.Provider value={{ showAchievement }}>
            {children}
            {achievementQueue.length > 0 && (
                <AchievementModal 
                    achievement={achievementQueue[0]} 
                    onClose={handleClose} 
                />
            )}
        </AchievementContext.Provider>
    );
}
