var React = require('react'),
    _ = require('underscore');

var Task = React.createClass({
    render: function () {
        var onCancel = this.props.onCancel ? _.partial(this.props.onCancel, this) : undefined;
        return (
            <div className="task">
                <span className="title">
                    {this.props.title}
                </span>
                {this.props.asana ? <img className="tag-asana tag" src="img/asana-minimal.png"/> : ''}
                <div className="buttons">
                    <i className="fa fa-check-circle-o done" title="Complete"></i>
                    <i className="fa fa-times-circle-o cancel" onClick={onCancel} title="Hide"></i>
                </div>
            </div>
        )
    }
});

module.exports = Task;