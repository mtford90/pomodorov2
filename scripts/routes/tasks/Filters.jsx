var React = require('react'),
    _ = require('underscore'),
    FilterConfig = require('./FilterConfig'),
    Task = require('../../data').Task,
    TagsFilter = require('./TagsFilter');

var Filters = React.createClass({
    render: function () {
        var filterConfig = this.state ? this.state.filterConfig : '';
        return (
            <div>
                {filterConfig}
                <div id="filters">
                    <div id="inner-filters">
                        <div className="logo">
                            <i className="fa fa-filter"></i>
                        </div>
                        <div className="filter" onClick={this.onNewPressed}>
                            <i className="fa fa-plus"></i>
                        </div>
                        <div className="filter tags-filter" onClick={this.onTagsPressed}>
                            <i className="fa fa-tags"></i>
                        </div>
                        <div className="filter tags-filter">
                            <i className="fa fa-refresh"></i>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    getInitialState: function () {
        return {
            filterConfig: ''
        }
    },
    onNewPressed: function () {
        Task.map({title: 'A new task!', completed: false})
            .then(function () {
                siesta.save().
                    then(function () {
                        console.log('Save success');
                    })
                    .catch(function (err) {
                        console.error('Error saving');
                    })
            })
            .catch(function (err) {
                console.error('error creating new task:', err);
            }).done();
    },
    onTagsPressed: function (e) {
        this.cancelFilterConfig();
        var target = e.target;
        var targetRect = target.getBoundingClientRect();
        var DOMNode = this.getDOMNode();
        var rect = DOMNode.getBoundingClientRect();
        // TODO: If adjust font-size of icons within _tasks.scss have to change it here too... kinda sucks.
        var fontSize = 18;
        var adj = 3;
        var marginTop = targetRect.bottom - rect.bottom - fontSize - adj;

        var filterConfig = (
            <TagsFilter
                onCancel={this.cancelFilterConfig}
                yPos={marginTop}/>
        );


        this.setState({
            filterConfig: filterConfig
        })
    },
    cancelFilterConfig: function () {
        this.setState({
            filterConfig: ''
        })
    }
});

module.exports = Filters;