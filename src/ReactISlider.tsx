import React, { ReactNode } from 'react';
import { libClassName } from './helpers/configuration';
import { ReactISliderList } from './ReactISliderList';
import { Axis } from './types';

type ReactISliderProps = {
    activeSlide?: number;
    ariaLabel?: string;
    arrows?: boolean;
    auto?: boolean | number;
    axis?: Axis;
    children: React.ReactNode | React.ReactNode[];
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
};

type ReactISliderState = {
    activeSlide: number;
    isRotatingAuto: boolean;
};

export class ReactISlider extends React.Component<ReactISliderProps, ReactISliderState> {
    static defaultProps = {
        arrows: true,
        auto: false,
        enableMouseSwipe: true,
        infinite: true,
        maxSlides: 1,
        moveSlides: 1,
        next: (
            <>
                &gt;<span className="visually-hidden">Next</span>
            </>
        ),
        overflow: false,
        pager: true,
        prev: (
            <>
                &lt;<span className="visually-hidden">Previous</span>
            </>
        ),
        renderPager: (page, active, pages) => (
            <>
                <span className="visually-hidden">
                    Page {page} / ${pages}
                </span>
            </>
        ),
        renderSlideAriaLabel: (label, children) => `${label} / ${children}`,
        swipeThreshold: 50,
        transitionDuration: 500
    };

    private sliderList: ReactISliderList;
    private autoTimeout: ReturnType<typeof setTimeout>;

    constructor(props) {
        super(props);
        this.state = {
            activeSlide: this.props.activeSlide || 0,
            isRotatingAuto: !!this.props.auto
        };
    }

    componentDidMount() {
        this.setAutoTimeout();
    }

    componentDidUpdate(prevProps) {
        if (this.props.auto && !prevProps.auto) this.setAutoTimeout();
    }

    componentWillUnmount() {
        clearTimeout(this.autoTimeout);
    }

    render() {
        const children = this.getChildrenNumber();
        const pages = Math.ceil(children / this.props.moveSlides);
        const classes = [libClassName];
        if (this.props.className) classes.push(this.props.className);
        return (
            <section
                id={this.props.id}
                className={classes.join(' ')}
                role="region"
                aria-label={this.props.ariaLabel}
                aria-roledescription="carousel"
                style={this.props.style}
            >
                {this.props.arrows && (
                    <button
                        aria-controls={this.props.id}
                        className={`${libClassName}-prev`}
                        disabled={!this.hasPrev(children)}
                        onClick={this.goToPrev}
                    >
                        {this.props.prev}
                    </button>
                )}

                <ReactISliderList
                    activeSlide={this.state.activeSlide}
                    auto={this.props.auto}
                    axis={this.props.axis || Axis.Horizontal}
                    children={this.props.children}
                    clearAutoTimeout={() => clearTimeout(this.autoTimeout)}
                    enableMouseSwipe={this.props.enableMouseSwipe}
                    getChildrenNumber={this.getChildrenNumber}
                    goToNext={this.goToNext}
                    goToPrev={this.goToPrev}
                    infinite={this.props.infinite}
                    maxSlides={this.props.maxSlides}
                    moveSlides={this.props.moveSlides}
                    overflow={this.props.overflow}
                    ref={(ref) => (this.sliderList = ref)}
                    renderSlideAriaLabel={this.props.renderSlideAriaLabel}
                    setAutoTimeout={this.setAutoTimeout}
                    setSlide={this.setSlide}
                    swipeThreshold={this.props.swipeThreshold}
                    transitionDuration={this.props.transitionDuration}
                />

                {this.props.arrows && (
                    <button
                        aria-controls={this.props.id}
                        className={`${libClassName}-next`}
                        disabled={!this.hasNext(children)}
                        onClick={this.goToNext}
                    >
                        {this.props.next}
                    </button>
                )}

                {this.props.pager && (
                    <ul className={`${libClassName}-pager`}>
                        {pages < 1 &&
                            [...Array(pages)].map((_, i) => (
                                <li key={i}>
                                    <button
                                        aria-controls={this.props.id}
                                        onClick={() => this.onClickPager(i)}
                                        className={
                                            this.state.activeSlide >= i * this.props.moveSlides &&
                                            this.state.activeSlide <
                                                i * this.props.moveSlides + this.props.moveSlides
                                                ? 'is-active'
                                                : null
                                        }
                                    >
                                        {this.props.renderPager(i, pages)}
                                    </button>
                                </li>
                            ))}
                    </ul>
                )}
            </section>
        );
    }

    setAutoTimeout = () => {
        if (!this.props.auto) return;

        clearTimeout(this.autoTimeout);
        this.autoTimeout = setTimeout(
            () => {
                this.goToNext();
                if (this.hasNext(this.getChildrenNumber())) this.setAutoTimeout();
            },
            typeof this.props.auto === 'boolean' ? 5000 : this.props.auto
        );
    };

    getChildrenNumber = (): number =>
        Array.isArray(this.props.children) ? this.props.children.length : 1;

    public goToPrev = () => {
        if (this.sliderList.animating) return;
        const target = this.state.activeSlide - this.props.moveSlides;
        this.setSlide(target);
    };

    public goToNext = () => {
        if (this.sliderList.animating) return;
        const target = this.state.activeSlide + this.props.moveSlides;
        this.setSlide(target);
    };

    onClickPager = (page) => {
        this.setSlide(page * this.props.moveSlides);
    };

    public setSlide = (activeSlide: number, cb?: Function) =>
        this.setState(
            {
                activeSlide: this.props.infinite
                    ? activeSlide
                    : Math.min(
                          Math.max(activeSlide, 0),
                          this.getChildrenNumber() - this.props.maxSlides
                      )

            },
            // @ts-ignore
            cb
        );

    public offsetSlide = (offset, cb?: Function) => this.setSlide(this.state.activeSlide + offset, cb);

    hasPrev = (children) =>
        children > this.props.maxSlides && (this.state.activeSlide > 0 || this.props.infinite);
    hasNext = (children) =>
        children > this.props.maxSlides &&
        (this.props.infinite || this.state.activeSlide < children - this.props.maxSlides);
}
