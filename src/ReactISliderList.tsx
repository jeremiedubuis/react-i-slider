import React, { ReactNode } from 'react';
import { libClassName } from './helpers/configuration';
import { Axis } from './types';
import {
    axisToSizeAttribute,
    axisToSize,
    axisToPositionAttribute,
    axisToEventPage
} from './helpers/axis';

type ReactISliderListProps = {
    activeSlide: number;
    auto: boolean | number;
    axis: Axis;
    children: React.ReactNode | React.ReactNode[];
    clearAutoTimeout: Function;
    enableMouseSwipe: boolean;
    getChildrenNumber: Function;
    goToNext: Function;
    goToPrev: Function;
    infinite: boolean;
    maxSlides: number;
    moveSlides: number;
    overflow: boolean;
    renderSlideAriaLabel: Function;
    setAutoTimeout: Function;
    setSlide: Function;
    swipeThreshold: number;
    transitionDuration: number;
};

type ReactISliderListState = {
    slideSize: number;
    animate: boolean;
};

export class ReactISliderList extends React.Component<
    ReactISliderListProps,
    ReactISliderListState
> {

    public animating: boolean = false;

    private initialPointerCoords: number;
    private pointerCoords: number;
    private pointerDown: boolean = false;
    private ref = React.createRef<HTMLDivElement>();
    private resizeTimeout: ReturnType<typeof setTimeout>;
    private slides: HTMLLIElement[] = [];
    private ulRef = React.createRef<HTMLUListElement>();

    constructor(props) {
        super(props);
        this.state = {
            slideSize: 0,
            animate: true
        };
    }

    componentDidMount() {
        this.setStyle();
        window.addEventListener('resize', this.resize);
        this.ulRef.current.addEventListener('transitionend', this.onTransitionEnd);

        if (window.matchMedia('(any-pointer: coarse)').matches) {
            window.addEventListener('touchmove', this.onPointerMove);
            window.addEventListener('touchend', this.onPointerUp);
        } else if (this.props.enableMouseSwipe) {
            window.addEventListener('mousemove', this.onPointerMove);
            window.addEventListener('mouseup', this.onPointerUp);
        }
    }

    componentDidUpdate(
        prevProps: Readonly<ReactISliderListProps>,
        prevState: Readonly<{}>,
        snapshot?: any
    ) {
        if (this.props.maxSlides !== prevProps.maxSlides) {
            this.setStyleWithoutAnimating();
        }

        if (this.props.activeSlide !== prevProps.activeSlide) {
            this.animating = this.state.animate;
            this.setPosition();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
        this.ulRef.current.removeEventListener('animationend', this.onTransitionEnd);
    }

    render() {
        const children = React.Children.toArray(this.props.children);
        const iOffset = this.props.infinite ? this.props.maxSlides : 0;

        return (
            <div
                className={`${libClassName}-list`}
                aria-live={this.props.auto ? 'off' : 'polite'}
                ref={this.ref}
                onTouchStart={this.onPointerDown}
                onDragStart={this.preventDefault}
                onDrop={this.preventDefault}
                onMouseDown={this.props.enableMouseSwipe ? this.onPointerDown : null}
                style={{
                    overflow: this.props.overflow ? null : 'hidden'
                }}
            >
                <ul
                    ref={this.ulRef}
                    style={{
                        transitionDuration: `${
                            this.state.animate ? this.props.transitionDuration : 0
                        }ms`
                    }}
                >
                    {this.props.infinite
                        ? children.map((child, i) => this.renderLi(child, i, i, children))
                        : null}

                    {children.map((child, i) => this.renderLi(child, i + iOffset, i, children))}

                    {this.props.infinite
                        ? children.map((child, i) =>
                              this.renderLi(child, iOffset + children.length + i, i, children)
                          )
                        : null}
                </ul>
            </div>
        );
    }

    renderLi(child, i, label, children) {
        return (
            <li
                key={i}
                role="group"
                aria-roledescription="slide"
                aria-label={this.props.renderSlideAriaLabel(label, children)}
                style={{ width: this.state.slideSize }}
                ref={(ref) => (this.slides[i] = ref)}
            >
                {child}
            </li>
        );
    }

    resize = () => {
        this.resizeTimeout = setTimeout(this.setStyleWithoutAnimating, 200);
    };

    setStyle = (cb?: Function | Event) => {
        this.setSize(() => {
            this.setPosition();
            if (typeof cb === 'function') cb();
        });
    };

    setStyleWithoutAnimating = () => {
        this.setState({ animate: false }, () =>
            this.setStyle(() => setTimeout(() => this.setState({ animate: true }), 0))
        );
    };

    setSize(cb) {
        const size = axisToSize(this.ref.current, this.props.axis);
        const slideSize = size / this.props.maxSlides;
        const attribute = axisToSizeAttribute(this.props.axis);
        this.ulRef.current.style[attribute] = `${
            this.props.getChildrenNumber() * (this.props.infinite ? 3 : 1) * slideSize
        }px`;
        this.setState(
            {
                slideSize
            },
            cb
        );
    }

    setPosition() {
        const offset = this.props.infinite
            ? -this.props.getChildrenNumber() * this.state.slideSize
            : 0;
        this.ulRef.current.style[axisToPositionAttribute(this.props.axis)] = `${
            offset - this.props.activeSlide * this.state.slideSize
        }px`;
    }

    onTransitionEnd = () => {
        const children = this.props.getChildrenNumber();
        if (this.props.activeSlide >= children || this.props.activeSlide <= -this.props.maxSlides) {
            this.setState(
                {
                    animate: false
                },
                () => {
                    let delta =
                        this.props.activeSlide >= children
                            ? this.props.activeSlide - children
                            : children + this.props.activeSlide;
                    this.props.setSlide(delta, () =>
                        setTimeout(() => {
                            this.setState({ animate: true });
                            this.animating = false;
                        }, 0)
                    );
                }
            );
        } else {
            this.animating = false;
        }
    };

    onPointerDown = (e) => {
        if (this.animating) return;
        e.preventDefault();
        this.props.clearAutoTimeout();
        this.pointerDown = true;
        this.initialPointerCoords = this.pointerCoords = e.touches
            ? e.touches[0][axisToEventPage(this.props.axis)]
            : e[axisToEventPage(this.props.axis)];
        this.setState({ animate: false });
    };

    onPointerMove = (e) => {
        if (!this.pointerDown) return;
        const positionAttribute = axisToPositionAttribute(this.props.axis);
        const currentPosition = parseInt(this.ulRef.current.style[positionAttribute]);
        const pointerCoords = e.touches
            ? e.touches[0][axisToEventPage(this.props.axis)]
            : e[axisToEventPage(this.props.axis)];
        this.ulRef.current.style[positionAttribute] = `${
            currentPosition - (this.pointerCoords - pointerCoords)
        }px`;
        this.pointerCoords = pointerCoords;
    };

    onPointerUp = (e) => {
        if (!this.pointerDown) return;
        this.pointerDown = false;
        const delta = this.initialPointerCoords - this.pointerCoords;
        this.setState(
            {
                animate: true
            },
            () => {
                this.animating = false;
                this.props.setAutoTimeout();
                if (Math.abs(delta) > this.props.swipeThreshold)
                    return delta > 0 ? this.props.goToNext() : this.props.goToPrev();

                return this.setPosition();
            }
        );
    };

    preventDefault = (e) => e.preventDefault();
}
