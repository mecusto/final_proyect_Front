export interface ITenantInfo{
    id_property: number,
    address_line1: string,
    address_line2?: string,
    locality?: string,
    postcode?: number,
    isDeleted?: boolean,
    id_user?:number;
    photo_property: string,
    check_in: string,
    check_out: string,
    newMessage?: number;

}