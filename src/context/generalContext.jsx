import { createContext, useState, useEffect } from "react";
import useDataFetcher from "../api/useDataFetcher ";
import Cookies from "js-cookie";

const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const { data, isLoading, error, get, post } = useDataFetcher();
  const [generalData, setGeneralData] = useState([]);
  const [website_status, set_website_status] = useState(null);
  // console.log(generalData);
  const isGeneralInLocal = localStorage.getItem("generalData") ? true : false;
  useEffect(() => {
    // if (generalData) return null;
    if (isGeneralInLocal) {
      setGeneralData(JSON.parse(localStorage.getItem("generalData")));
      return;
    } else {
      get("/api/settings/genral");
    }
  }, [isGeneralInLocal]);

  useEffect(() => {
    if (data) {
      setGeneralData(data?.settings);
      localStorage.setItem("generalData", JSON.stringify(data.settings));
      set_website_status(data?.settings?.site_status);
    }
  }, [data]);

  return (
    <GeneralContext.Provider
      value={{
        generalData,
        website_status,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
