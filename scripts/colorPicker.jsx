var React = require('react');

// TODO: RGBA
var WHITE_CSS = ['white', 'rgb(255,255,255)', '#fff', '#ffffff'];

var ColorPicker = React.createClass({
    render: function () {
        var validColor = this.testColor(this.state.color);
        var style = {
            'background-color': validColor ? this.state.color : 'transparent'
        };
        return (
            <div className="color-picker">
                <div id="color" style={style}>
                </div>
                <input type="text"
                    id="code"
                    onChange={this.onChange}
                    value={this.state.color}></input>
                {validColor ? '' : <i className="fa fa-times-circle"></i>}
            </div>
        )
    },
    getInitialState: function () {
        return {
            color: '#c0ffee'
        }
    },
    onChange: function (e) {
        var color = e.target.value;
        this.setState({
            color: color
        })
    },
    testColor: function (color) {
        // e.g. rgb(0,   0, 0) === rgb(0,0,0)
        color = color.toLowerCase().trim().replace(/ /g, '');
        if (WHITE_CSS.indexOf(color) == -1) {
            var dummyElement = document.createElement('div');
            dummyElement.style.color = 'white';
            dummyElement.style.color = color;
            return dummyElement.style.color != 'white';
        }
        return true;
    }
});

module.exports = ColorPicker;