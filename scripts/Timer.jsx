var React = require('react');

var Timer = React.createClass({
    render: function () {
        var comp = (
            <div>
                <span className="timer">
                    <span id="minute"
                        className="segment"
                        onDoubleClick={this.onDblClick}
                        onBlur={this.onBlur}>25</span>
                :
                    <span id="seconds"
                        className="segment"
                        onDoubleClick={this.onDblClick}
                        onBlur={this.onBlur}>00</span>
                </span>
            </div>
        );
        // TODO: JSX harmony apparently has a better way of passing on props.
        _.extend(comp.props, this.props);
        return comp;
    },
    onDblClick: function (e) {
        var $target = $(e.target);
        $target.attr('contentEditable', 'true');
        //$target.focus();
    },
    onBlur: function (e) {
        var $target = $(e.target);
        $target.attr('contentEditable', 'false')
    }
});

module.exports = Timer;