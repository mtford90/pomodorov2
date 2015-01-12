/**
 * An awesome clock interface for changing the time by dragging the mouse.
 * SVG based for colour change and responsiveness.
 * SVG is generated from timeline.ai, created using Adobe Illustrator 2014 CC
 * @module routes.home.Clock
 */

var React = require('React'),
    PomodoroTimer = require('../../pomodoroTimer').PomodoroTimer;

// See timeline.ai smart guides for the values.
var SVG_NATIVE_WIDTH = 1833,
    SIXTY_POS = 1820,
    ZERO_POS = 30,
    SIXTY_PERC = SIXTY_POS / SVG_NATIVE_WIDTH,
    ZERO_PERC = ZERO_POS / SVG_NATIVE_WIDTH,
    SIXTY_MODIFIER = SIXTY_PERC,
    ZERO_MODIFIER = (1 - ZERO_PERC);

var Seeker = React.createClass({
    render: function () {
        var svgStyle = {left: this.state.deltaX};
        return (
            <div className="seeker-wrapper">
                <div className="seeker-overlay">
                    <div className="left-blur"/>
                    <div className="right-blur"/>
                    <img draggable="true"
                        style={svgStyle}
                        onDragStart={this.onDragStart}
                        onDragEnd={this.onDragEnd}
                        onDrag={this.onDrag}
                        className="svg"
                        src="img/timeline.svg">
                    </img>
                </div>
            </div>
        )
    },
    moveSeekerToCorrectPosition: function () {
        /* TODO: Use refs instead.
         For some reason there is an error stating must have an owner to use refs which makes no sense as clearly has
         an owner.
         */
        PomodoroTimer.get()
            .then(function (timer) {
                var $overlay = $('.seeker-overlay'),
                    parentWidth = $overlay.width(),
                    parentMiddle = parentWidth / 2,
                    minDelta = SIXTY_MODIFIER * -(parentWidth + parentMiddle),
                    maxDelta = ZERO_MODIFIER * parentMiddle,
                    deltaRange = Math.abs(minDelta) + Math.abs(maxDelta),
                    normalisedDelta = (timer.seconds / (60 * 60)) * deltaRange,
                    denormalisedDelta = -(normalisedDelta - deltaRange) - parentMiddle - parentWidth;
                this.setState({
                    deltaX: denormalisedDelta
                });
            }.bind(this))
            .catch(function (err) {
                console.error('Error initialising seeker', err);
            });
    },
    componentDidMount: function () {
        this.moveSeekerToCorrectPosition();
        // TODO: Is there a more clever way to handle scaling of the seeker? i.e. incorporate into responsiveness?
        this.resizeHandler = this.moveSeekerToCorrectPosition.bind(this);
        $(window).resize(this.resizeHandler);
    },
    componentWillUnmount: function () {
        $(window).off('resize', this.resizeHandler);
    },
    onDragEnd: function () {
        document.body.removeChild(this.empty);
    },
    onDragStart: function (e) {
        this.x = e.pageX;
        this.empty = document.createElement('span');
        this.empty.setAttribute('style',
            'position: absolute; display: block; top: 0; left: 0; width: 0; height: 0;');
        document.body.appendChild(this.empty);
        e.dataTransfer.setDragImage(this.empty, 0, 0);
    },
    onDrag: function (e) {
        var X = e.pageX;
        if (X) {
            var $svg = $(e.target),
                delta = -(this.x - X),
                $overlay = $svg.parent(),
                parentWidth = $overlay.width(),
                parentMiddle = parentWidth / 2;

            var minDelta = SIXTY_MODIFIER * -(parentWidth + parentMiddle),
                maxDelta = ZERO_MODIFIER * parentMiddle,
                deltaRange = Math.abs(minDelta) + Math.abs(maxDelta),
                normalisedDelta = deltaRange - (delta + parentMiddle + parentWidth);


            if (delta > minDelta && delta < maxDelta) {
                var minutes = Math.round((normalisedDelta / deltaRange) * 60);
                if (minutes == 60) minutes--;
                var seconds = minutes * 60;

                console.log('value', Math.round(seconds));

                PomodoroTimer.get()
                    .then(function (timer) {
                        timer.seconds = seconds;
                    })
                    .catch(function (err) {
                        console.error('error changing seconds', err);
                    });

                console.log('deltaX', delta);
                console.log('normalisedDelta', normalisedDelta);
                this.setState({
                    deltaX: delta
                });
            }
        }
    },
    getInitialState: function () {
        return {
            deltaX: 0
        }
    }
});

module.exports = Seeker;