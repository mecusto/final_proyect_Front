// import { IPropertyForm } from './IPropertyForm';

import { IProfile } from "./IProfile";
import { IProperties } from "./IProperties";
import { IReports } from "./IReport";
import { ITenantInfo } from './ITenantInfo';

export interface IStore {
  userProfile: IProfile;
  properties: IProperties;
  reports: IReports;
  tenantInfo: ITenantInfo;
}
