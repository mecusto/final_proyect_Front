import { IPhotoReport } from "./IPhotoReport";

export interface IReport {
    id_report: number;
    id_property: number;
    title: string;
    description: string;
    openDate: string;
    closeDate: string;
    id_report_state: number;
    id_priority: number;
    isDeleted: boolean;
    photos: IPhotoReport[];
}

// export interface IPropertyReport {
//     reports: Record<number, IReport>; // number: id_property
// }

export interface IReports {
    byId: Record<number, IReport>;
    order: number[];
}

export interface IReportDeleted {
    reportDeleted: boolean
}

// { 
//     byId: { id_property : { id_report: {report}}}, // reports.byId[id_property] => { id_report : report }
//     order: []
// }
