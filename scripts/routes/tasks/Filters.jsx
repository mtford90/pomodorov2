var React = require('react'),
    _ = require('underscore'),
    FilterConfig = require('./FilterConfig'),
    data = require('../../data'),
    Task = data.Task,
    incompleteTasks = data.incompleteTasks,
    TagsFilter = require('./TagsFilter');

var Filters = React.createClass({
    render: function () {
        var filterConfig = this.state ? this.state.filterConfig : '';
        return (
            <div>
                {filterConfig}
                <div id="filters">
                    <div id="inner-filters">
                        <div className="filter" onClick={this.onNewPressed}>
                            <i className="fa fa-plus"></i>
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
        Task.graph({title: 'A new task!', completed: false, editing: true})
            .then(function () {
                console.log('new task created');
            })
            .catch(function (err) {
                console.error('error creating new task:', err);
            }).done();
    }
});

module.exports = Filters;