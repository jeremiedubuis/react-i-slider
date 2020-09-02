# react-i-slider

## Installation
```
$ npm install react-i-slider --save
```

## Usage
```
<ReactISlider maxSlides={1} moveSlides={1} infinite={true} overflow={false} auto={true}>
    <img src="https://picsum.photos/id/1018/200/300" alt="" />
    <img src="https://picsum.photos/id/1043/200/300" alt="" />
</ReactISlider>
```

## Options

```
{
    activeSlide?: number;
    ariaLabel?: string;
    arrows?: boolean;
    auto?: boolean | number;
    axis?: 'horizontal' | 'vertical';
    className?: string;
    enableMouseSwipe?: boolean;
    id?: string;
    infinite?: boolean;
    maxSlides?: number;
    moveSlides?: number;
    next?: string | ReactNode;
    overflow?: boolean;
    pager?: boolean;
    prev?: string | ReactNode;
    renderPager?: Function;
    renderSlideAriaLabel?: () => string;
    style?: object;
    swipeThreshold?: number;
    transitionDuration?: number;
}
```

## Methods

```
{
    goToPrev: () => void;
    goToNext: () => void;
    setSlide: (activeSlide: number, cb?: Function) => void;
    offsetSlide: (offset: any, cb?: Function) => void;
}
```
