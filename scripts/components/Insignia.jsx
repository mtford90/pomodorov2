var insignia = require('insignia'),
    PomodoroColourMixin = require('./pomodoro/PomodoroColourMixin'),
    React = require('react');

var Insignia = React.createClass({
    mixins: [PomodoroColourMixin],
    render: function () {
        return (
            <div className="insignia">
                <div className="filter">
                    <div className="inner-filter">
                        <i className="fa fa-filter"/>
                    </div>
                </div>
                <div className="insignia-wrapper">
                    <input ref="input"/>
                </div>
            </div>
        )
    },
    componentDidMount: function () {
        var input = this.refs.input.getDOMNode(),
            onNewTag = this.props['onNewTag'] || function () {
                };
        // Make available the insignia API on this instance.
        _.extend(this, insignia(input, _.extend({
            delimiter: ' ',
            deletion: true,
            parse: function (value) {
                var parsedTag = value.trim().toLowerCase();
                onNewTag(parsedTag);
                return parsedTag;
            }
        }, this.props.opts || {})));
        this.observeNewTags();
        if (this.state.color) this.configureAllExistingTags(this.state.color);
    },
    configureAllExistingTags: function (color) {
        console.log('configureAllExistingTags', color);
        $(this.refs.input).find('.nsg-tag').each(_.bind(this.configureTag, this, color));
    },
    configureTag: function (color, node) {
        var $node = $(node);
        if ($node.hasClass('nsg-tag')) {
            console.log('$node', $node, color);
            $node.css('background-color', color);
            $node.find('.nsg-tag-remove').addClass('fa fa-times');
        }
    },
    observeNewTags: function () {
        this.observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                // For some reason, .forEach is not available on addedNodes which is of type "NodeList"
                console.log('state', this.state);
                for (var i = 0; i < mutation.addedNodes.length; i++) this.configureTag(this.state.color, mutation.addedNodes[i])
            }.bind(this));
        }.bind(this));
        // Configuration of the observer:
        var config = {
            attributes: false,
            childList: true,
            characterData: false,
            subtree: true
        };
        var inputNode = $(this.refs.input.getDOMNode()).parent()[0];
        this.observer.observe(inputNode, config);
    },
    componentWillUnmount: function () {
        this.observer.disconnect();

    },
    componentWillUpdate: function (nextProps, nextState) {
        // React to colour config changes by updating the color of all insignia tags.
        var nextColor = nextState.color;
        if (nextColor) {
            console.log('color is now', nextState);
            var colorHasChanged = this.state.color != nextColor;
            if (colorHasChanged) {
                this.configureAllExistingTags(nextColor);
            }
        }

    }
});

module.exports = Insignia;