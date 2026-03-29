import { createContext } from "react";

export const AvocatContext = createContext();
const AvocatContextProvider = (props) => {
  const value = {};
  return (
    <AvocatContext.Provider value={value}>{props.children}</AvocatContext.Provider>
  );
};
export default AvocatContextProvider;
