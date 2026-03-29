import { createContext } from "react";

export const JugeContext = createContext();
const JugeContextProvider = (props) => {
  const value = {};
  return (
    <JugeContext.Provider value={value}>{props.children}</JugeContext.Provider>
  );
};
export default JugeContextProvider;
