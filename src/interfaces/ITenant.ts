
export interface ITenants{
  byId: Record<number, ITenant>;
  order: number[];
}

export interface ITenant {
  id_user: number,
  id_property: number,
  name: string;
  lastname: string;
  email: string;
  phone_number: string;
  check_in: string;
  check_out: string;
}
