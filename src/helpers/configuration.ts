export type options = {
    libClassName?: string;
};

export let libClassName = 'react-i-slider';

export const setConfiguration = (o: options = {}) => {
    if (o.libClassName) libClassName = o.libClassName;
};
