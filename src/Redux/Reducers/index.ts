import { combineReducers } from "redux";

import userProfile from "./loginReducer";
import properties from "./propertiesReducer";
import reports from "./reportsReducer";
import tenantInfo from "./tenantReducer";

import { IStore } from "../../interfaces/IStore";

export default combineReducers<IStore>({
  userProfile,
  properties,
  reports,
  tenantInfo
});
