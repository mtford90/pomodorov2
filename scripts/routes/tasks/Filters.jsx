var React = require('react');

var Filters = React.createClass({
    render: function () {
        return (
            <div id="filters">
                <div className="filter">
                    <i className="fa fa-filter"></i>
                </div>
                <div className="filter">
                    <i className="fa fa-tags"></i>
                </div>
            </div>
        );
    }
});

module.exports = Filters;