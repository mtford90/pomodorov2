var React = require('react');

var TasksFooter = React.createClass({
    render: function () {
        return (
            <div id="tasks-footer" className="pull-right">
                <div className="asana filter">
                    <div className="asana-filter"/>
                </div>
                <div className="tags filter">
                    <i className="fa fa-tags tags"></i>
                    <span className="num-tags">3</span>
                </div>
            </div>
        )
    }
});

module.exports = TasksFooter;