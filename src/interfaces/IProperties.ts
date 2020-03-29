import { ITenant } from "./ITenant";

export interface IProperties {
  byId: Record<number, IProperty>; //object with a key(number) and a IProperty for each number so we can map it
  order: number[];
  tenants: ITenant[];
  selectedIdProperty: number;
  detailsVisible: boolean;
}
export interface IProperty {
  id_property: number | null;
  id_user: number | null; // owner
  address_line1: string;
  address_line2: string;
  locality: string;
  region: string;
  postcode: number;
  photo_property?: string;
  isDeleted?: boolean | number;
  numMessages?: number;
}

