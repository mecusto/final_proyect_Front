import { TAction } from "../types";

import produce from "immer";
import { IProperties } from "../../interfaces/IProperties";

const initialState: IProperties = {
  byId: {},
  order: [],
  tenants: [],
  detailsVisible: false,
  selectedIdProperty: null
};

export default (state: IProperties = initialState, action: TAction) =>
  produce(state, draftState => {
    switch (action.type) {
      case "SET_PROPERTIES":
        const properties = action.payload;
        draftState.byId = {}; // inic para no duplicar, ojo si quieres mantener algún dato
        draftState.order = [];
        properties.forEach(property => {
          draftState.byId[property.id_property] = property;
          draftState.order.push(property.id_property);
        });
        break;
      case "UPDATE_PROPERTY":
        draftState.byId[action.payload.id_property] = action.payload;
        break;
      case "DELETE_PROPERTY":
        delete draftState.byId[action.payload];
        const pos = draftState.order.indexOf(action.payload);
        draftState.order.splice(pos, 1);
        draftState.selectedIdProperty = null;
        break;
      case "SET_PROPERTY":
        const property = action.payload;
        draftState.byId[property.id_property] = property;
        draftState.order.push(property.id_property);
        break;
      case "SET_TENANTS":
        const tenants = action.payload;
        tenants.forEach(tenant => {
          draftState.tenants.push(tenant);
        });
        break;
      case "SET_NEW_TENANT":
        const tenant = action.payload;
        draftState.tenants.push(tenant);
        break;
      case "SET_SELECTED_PROPERTY":
        draftState.selectedIdProperty = action.payload;
        break;
      case "SET_DETAIL_VISIBLE":
        draftState.detailsVisible = action.payload;
        break;

      case "SET_LOGOUT":
        return initialState; //this case is necessary in all the reducers so we restart all the states
      default:
        return state;
    }
  });
