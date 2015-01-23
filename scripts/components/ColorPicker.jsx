var React = require('react');

// TODO: RGBA
var WHITE_CSS = ['white', 'rgb(255,255,255)', '#fff', '#ffffff'];

var ColorPicker = React.createClass({
    render: function () {
        var validColor = this.testColor(this.state.color);
        var style = {
            'backgroundColor': validColor ? this.state.color : 'transparent'
        };
        var ComponentClass = this.props.componentClass || React.DOM.input;
        return (
            <div className="color-picker">
                <div id="color" style={style}>
                </div>
                <ComponentClass type="text"
                    id="code"
                    onChange={this.onChange}
                    value={this.state.color}></ComponentClass>
                {validColor ? '' : <i className="fa fa-exclamation-circle"></i>}
            </div>
        )
    },
    getInitialState: function () {
        return {
            color: this.props['color'] || '#c0ffee'
        }
    },
    onChange: function (e) {
        var color = e.target.value;
        var oldColor = this.state.color;
        //this.setState({
        //    color: color
        //});
        var onChange = this.props.onChange,
            onSuccessfulChange = this.props.onSuccessfulChange,
            onFailedChange = this.props.onFailedChange;
        var change = {
            oldColor: oldColor,
            color: color,
            picker: this
        };
        if (onChange) {
            onChange(change);
        }
        if (onSuccessfulChange || onFailedChange) {
            if (this.testColor(color)) {
                if (onSuccessfulChange) {
                    onSuccessfulChange(change);
                }
            }
            else {
                if (onFailedChange) {
                    onFailedChange(change);
                }
            }
        }
    },
    testColor: function (color) {
        // e.g. rgb(0,   0, 0) === rgb(0,0,0)
        if (color) {
            color = color.toLowerCase().trim().replace(/ /g, '');
            if (WHITE_CSS.indexOf(color) == -1) {
                var dummyElement = document.createElement('div');
                dummyElement.style.color = 'white';
                dummyElement.style.color = color;
                return dummyElement.style.color != 'white';
            }
            return true;
        }
        return false;
    },
    componentWillReceiveProps: function (nextProps) {
        var newState = {
            color: nextProps.color
        };
        console.log('componentWillReceiveProps', newState);
        this.setState(newState);
    }
});

module.exports = ColorPicker;