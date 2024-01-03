import { createContext, useContext, useState } from 'react';

const UploadContext = createContext();

export const UploadProvider = ({ children }) => {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const setSuccess = () => setUploadSuccess(true);
  const resetSuccess = () => setUploadSuccess(false);

  return (
    <UploadContext.Provider value={{ uploadSuccess, setSuccess, resetSuccess }}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUploadContext = () => {
  return useContext(UploadContext);
};
