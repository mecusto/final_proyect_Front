import { TAction } from "../types";

import produce from "immer";
import { IReports } from "../../interfaces/IReport";


const initialState: IReports = {
    byId: {},
    order: []
};


export default (state: IReports = initialState, action: TAction) =>
    produce (state, draftState => 
    {
        switch (action.type) {
            case 'SET_REPORTS':
                const reports = action.payload;
                draftState.byId = {}; 
                draftState.order = [];
                reports.forEach(report => {
                  draftState.byId[report.id_report] = report;
                  draftState.order.push(report.id_report);
                });
                break;
            case 'SET_PHOTO_REPORT': // todo 
                break; 
            case 'SET_NEW_REPORT':
                const report = action.payload;
                draftState.byId[report.id_report] = report;
                draftState.order.push(report.id_report);
                break;
            case "SET_RESET_REPORTS":
                return state = initialState
            case 'SET_LOGOUT':
                 return initialState; //this case is necessary in all the reducers so we restart all the states
            default:
                return state;
        }
    });


   
