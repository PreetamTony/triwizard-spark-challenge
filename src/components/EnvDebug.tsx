import React from 'react';

const EnvDebug = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Environment Variables:</h3>
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(
          {
            VITE_GENAI_API_KEY: import.meta.env.VITE_GENAI_API_KEY 
              ? '***' + import.meta.env.VITE_GENAI_API_KEY.slice(-4) 
              : 'Not loaded',
            NODE_ENV: import.meta.env.MODE,
            BASE_URL: import.meta.env.BASE_URL,
            DEV: import.meta.env.DEV,
            PROD: import.meta.env.PROD,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default EnvDebug;