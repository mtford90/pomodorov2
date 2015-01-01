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
                    <div className="seeker">
                        <img draggable="true"
                            style={svgStyle}
                            onDragStart={this.onDragStart}
                            onDrag={this.onDrag}
                            className="svg"
                            src="img/timeline.svg">
                        </img>
                    </div>
                </div>
            </div>

        )
    },
    componentDidMount: function () {

    },
    onDragStart: function (e) {
        this.x = e.clientX;
    },
    onDrag: function (e) {
        console.log('onDrag', e);
        var X = e.clientX;
        console.log('X', X);
        if (X) {
            var svg = e.target,
                parentNode = svg.parentNode,
                parentRect = parentNode.getBoundingClientRect(),
                svgRect = svg.getBoundingClientRect(),
                parentLeft = parentRect.left,
                parentRight = parentRect.right,
                svgLeft = svgRect.left,
                svgRight = svgRect.right,
                deltaX = this.x - X,
                newSvgLeft = svgLeft - deltaX,
                newSvgRight = svgRight - deltaX;
            console.log('deltaX', deltaX);
            console.log('newSvgLeft', newSvgLeft);
            console.log('newSvgRight', newSvgRight);
            console.log('parentLeft', parentLeft);
            console.log('parentRight', parentRight);
            var withinBounds = newSvgLeft >= parentLeft && newSvgRight <= parentRight;
            if (withinBounds) {
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