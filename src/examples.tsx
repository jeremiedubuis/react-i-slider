import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { ReactISlider } from './ReactISlider';

const Slider = () => {
    const [overflow, setOverflow] = useState(false);
    const [maxSlides, setMaxSlides] = useState(4);
    const [moveSlides, setMoveSlides] = useState(4);

    return (
        <>
            <ReactISlider
                maxSlides={maxSlides}
                moveSlides={moveSlides}
                infinite={true}
                overflow={overflow}
            >
                <div className="test">
                    <img src="https://picsum.photos/id/1018/200/300" alt="" />
                </div>
                <div className="test">
                    <img src="https://picsum.photos/id/1021/200/300" alt="" />
                </div>
                <div className="test">
                    <img src="https://picsum.photos/id/1039/200/300" alt="" />
                </div>
                <div className="test">
                    <img src="https://picsum.photos/id/1043/200/300" alt="" />
                </div>
                <div className="test">
                    <img src="https://picsum.photos/id/1044/200/300" alt="" />
                </div>
                <div className="test">
                    <img src="https://picsum.photos/id/11/200/300" alt="" />
                </div>
            </ReactISlider>

            <fieldset>
                <legend>Slider options</legend>
                <div>
                    <label htmlFor="overflow">Overflow</label>
                    <input
                        type="checkbox"
                        id="overflow"
                        onChange={(e) => setOverflow(e.target.checked)}
                    />
                </div>
                <div>
                    <label htmlFor="maxSlides">Max Slides</label>
                    <input
                        type="number"
                        value={maxSlides}
                        id="maxSlides"
                        onChange={(e) =>
                            setMaxSlides(Math.max(0, Math.min(6, parseInt(e.target.value))))
                        }
                    />
                </div>
                <div>
                    <label htmlFor="moveSlides">Move Slides</label>
                    <input
                        type="number"
                        value={moveSlides}
                        id="moveSlides"
                        onChange={(e) =>
                            setMoveSlides(Math.max(0, Math.min(6, parseInt(e.target.value))))
                        }
                    />
                </div>
            </fieldset>

            <ReactISlider maxSlides={1} moveSlides={1} infinite={true} overflow={false} auto={true}>
                <div className="test">
                    <img src="https://picsum.photos/id/1018/200/300" alt="" />
                </div>
                <div className="test">
                    <img src="https://picsum.photos/id/1043/200/300" alt="" />
                </div>
            </ReactISlider>
        </>
    );
};

ReactDOM.render(<Slider />, document.getElementById('slider1'));
