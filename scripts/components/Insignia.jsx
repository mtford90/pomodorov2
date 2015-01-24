var insignia = require('../../../insignia/insignia'),
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
        getDefaultProps: function () {
            return {
                onNewTag: function () {
                }
            };
        },
        componentDidMount: function () {
            var input = this.refs.input.getDOMNode();
            // Make available the insignia API on this instance.
            var api = insignia(input, _.extend({
                delimiter: ' ',
                deletion: true
            }, this.props.opts || {}));
            _.extend(this, api);
            this.props.tags.forEach(function (tag) {
                console.log('tag', tag.text);
                try {
                    api.addTag(tag.text);
                }
                catch (e) {
                    console.error('e', e);
                }
            });
            // We don't observe new tags after initial tags have been setup.
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
                $node.css('border-color', color)
                    .css('color', color);
                $node.find('.nsg-tag-remove')
                    .addClass('fa fa-times');

            }
        },
        observeNewTags: function () {
            this.observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    // For some reason, .forEach is not available on addedNodes which is of type "NodeList"
                    console.log('state', this.state);
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        var newNode = mutation.addedNodes[i];
                        var newTag = $(newNode).text();
                        this.props.onNewTag(newTag);
                        this.configureTag(this.state.color, newNode)
                    }
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
    })
    ;

module.exports = Insignia;