import { createContext } from "react";

export const SecretaireContext = createContext();
const SecretaireContextProvider = (props) => {
  const value = {};
  return (
    <SecretaireContext.Provider value={value}>{props.children}</SecretaireContext.Provider>
  );
};
export default SecretaireContextProvider;
