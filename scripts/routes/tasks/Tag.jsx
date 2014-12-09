var React = require('react');

var Tag = React.createClass({
    render: function () {
        return (
            <div className="tag">
                <span className="title">
                    {this.props.title}
                </span>
                <i className="fa fa-close" onClick={this.onClick}></i>
            </div>
        )
    },
    // TODO: Is this neccessary? Can we access the react element from the event that is sent automatically?
    onClick: function (e) {
        console.log('onClick');
        var onDelete = this.props.onDelete;
        if (onDelete) {
            onDelete(e, this);
        }
    }
});

module.exports = Tag;