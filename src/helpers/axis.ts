import { Axis } from '../types';

export const axisToSize = (el: HTMLElement, axis: Axis) =>
    axis === Axis.Horizontal ? el.offsetWidth : el.offsetHeight;

export const axisToSizeAttribute = (axis: Axis) => (axis === Axis.Horizontal ? 'width' : 'height');

export const axisToPositionAttribute = (axis: Axis) => (axis === Axis.Horizontal ? 'left' : 'top');

export const axisToEventPage = (axis: Axis) => (axis === Axis.Horizontal ? 'pageX' : 'pageY');
