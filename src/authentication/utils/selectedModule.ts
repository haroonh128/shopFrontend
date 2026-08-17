import { getItem, removeItem, setItem } from "../../shared";

const SELECTED_MODULE_ID_KEY = "selectedModuleId";

export const getSelectedModuleId = () => getItem(SELECTED_MODULE_ID_KEY);

export const setSelectedModuleId = (moduleId: string) => {
  setItem(SELECTED_MODULE_ID_KEY, moduleId);
};

export const clearSelectedModuleId = () => {
  removeItem(SELECTED_MODULE_ID_KEY);
};
