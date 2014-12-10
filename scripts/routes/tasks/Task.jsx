var React = require('react');

var Task = React.createClass({
    render: function () {
        return (
            <div className="task">
                <span className="title">
                    {this.props.title}
                </span>
                {this.props.asana ? <img className="tag-asana tag" src="img/asana-minimal.png"/> : ''}
                <div className="buttons">
                    <i className="fa fa-check-circle-o done" title="Complete"></i>
                    <i className="fa fa-clock-o cancel" title="Later"></i>
                </div>
            </div>
        )
    }
});

module.exports = Task;