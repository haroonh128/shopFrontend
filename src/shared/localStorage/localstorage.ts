export const setItem = (key: string, value: string) => {    
    localStorage.setItem(key, value);
}

export const getItem = (key: string) => {
    return localStorage.getItem(key);
}

export const removeItem = (key: string) => {
    localStorage.removeItem(key);
}

export const clear = () => {
    localStorage.clear();
}

export const getItemAsObject = (key: string) => {
    return JSON.parse(localStorage.getItem(key) || '{}');
}

export const setItemAsObject = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
}

export const removeItemAsObject = (key: string) => {
    localStorage.removeItem(key);
}

export const clearAsObject = () => {
    localStorage.clear();
}