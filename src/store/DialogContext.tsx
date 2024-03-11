import React, { createContext, useState } from "react";

interface DialogContextProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const contextDefaultValues: DialogContextProps = {
  isOpen: false,
  setIsOpen: () => {},
};

const DialogContext = createContext(contextDefaultValues);

export const useDialog = () => React.useContext(DialogContext);

const DialogProvider = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(contextDefaultValues.isOpen);
  const contextValue: DialogContextProps = {
    isOpen,
    setIsOpen,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
