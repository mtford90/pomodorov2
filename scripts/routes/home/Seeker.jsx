/**
 * An awesome clock interface for changing the time by dragging the mouse.
 * SVG based for colour change and responsiveness.
 * @module routes.home.Clock
 */

var React = require('React');

var Seeker = React.createClass({
    render: function () {
        console.log('render');
        var svgStyle = {right: this.state.deltaX};
        return (
            <div className="seeker-wrapper">
                <div className="seeker-overlay">
                    <img draggable="true"
                        style={svgStyle}
                        onDragStart={this.onDragStart}
                        onDrag={this.onDrag}
                        className="svg"
                        src="img/timeline.svg">
                    </img>
                </div>
            </div>

        )
    },
    componentDidMount: function () {

    },
    onDragStart: function (e) {
        this.x = e.pageX;
    },
    onDrag: function (e) {
        console.log('onDrag', e);
        var X = e.pageX;
        console.log('this.x', this.x);
        console.log('X', X);
        if (X) {
            var parentNode = e.target.parentNode,
                deltaX = this.x - X;
            console.log('deltaX', deltaX);

            var $parentNode = $(parentNode),
                parentWidth = $parentNode.width(),
                parentMiddle = parentWidth / 2;
            var rightBounded = (deltaX > 0 && (deltaX - parentWidth) < parentMiddle);
            var leftBounded = (deltaX < 0 && Math.abs(deltaX) <= parentMiddle);
            var bounded = leftBounded || rightBounded;
            if (bounded) {
                console.log('within bounds');
                this.setState({
                    deltaX: deltaX
                });
            }
            else {
                console.log('not within bounds');
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