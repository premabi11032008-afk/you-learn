
import React from 'react';

const LoadingSpinner: React.FC = () => {
    const messages = [
        "Crafting your personalized lesson...",
        "Consulting with digital scholars...",
        "Tailoring examples just for you...",
        "Building your interactive quiz...",
        "Almost there! Just polishing the details..."
    ];
    
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-sky-500"></div>
            <p className="mt-6 text-lg font-semibold text-slate-700 dark:text-slate-300 text-center transition-opacity duration-500">{message}</p>
        </div>
    );
};

export default LoadingSpinner;
