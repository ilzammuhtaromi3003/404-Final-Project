import React, { useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const ToastMessage = ({ status, message, onClose }) => {
  const toast = useToast();

  useEffect(() => {
    toast({
      title: message,
      status: status,
      duration: 1000,
      isClosable: true,
      onCloseComplete: onClose,
    });
  }, [toast, status, message, onClose]);

  return null;
};

export default ToastMessage;
