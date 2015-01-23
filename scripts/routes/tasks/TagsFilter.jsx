var React = require('react'),
    _ = require('underscore'),
    FilterConfig = require('./FilterConfig');

var TagsFilter = React.createClass({
    render: function () {
        var elem = (
            <FilterConfig
                icon={"fa fa-tags"}
                className="tags-filter">
            </FilterConfig>
        );
        _.extend(elem.props, this.props);
        return elem;
    }
});

module.exports = TagsFilter;