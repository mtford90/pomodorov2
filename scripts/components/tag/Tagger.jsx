var React = require('react'),
    Tag = require('./Tag');

var KeyCode = {
    Tab: 9,
    Enter: 13
};

var Tagger = React.createClass({
    render: function () {
        var self = this;
        return (
            <div className="tagger" onClick={this.onClick}>
                <div className="content">
                    {this.state.tags.map(function (t, i) {
                        return <span>
                            <Tag title={t} key={i} onDelete={self.onDeleteTag}></Tag>
                        </span>
                    })}
                    <input
                        id="editable"
                        className="editable"
                        onKeyDown={this.onKeyDown}
                        onKeyPress={this.onChange}
                        onChange={this.onChange}
                        onBlur={this.onBlur}
                        value={this.state.text}
                        ref="contentEditable">
                    </input>
                    <span ref="auxSpan"></span>
                </div>
            </div>
        )
    },
    onKeyDown: function (e) {
        var native = e.nativeEvent;
        console.log('keyDown', native);
        if (e.keyCode == KeyCode.Tab || e.keyCode == KeyCode.Enter) {
            native.preventDefault();
            // Generate the tag.
            $(e.target).blur();
            // Refocus.
            this.focus();
        }
    },
    onChange: function (e) {
        this.setState({
            text: e.target.value
        }, function () {
            this.resizeInput(e.target);
        });
    },
    /**
     * Use an auxiliary span to calculate the ideal size of the input element.
     * @param [inputElem]
     */
    resizeInput: function (inputElem) {
        if (!inputElem) inputElem = this.refs.contentEditable.getDOMNode();
        var $inputElem = $(inputElem);
        var text = $inputElem.val();
        var $span = $(this.refs.auxSpan.getDOMNode());
        $span.text(text);
        var size = $span.width();
        $span.text('');
        console.log('size', size);
        $inputElem.width(size);
    },
    onClick: function (e) {
        /* If Tagger is clicked anywhere other than the tags, we want to focus
         on the editable. */
        $(e.target).find('#editable').focus();
    },
    onBlur: function (e) {
        var text = e.target.value;
        text = text.trim();
        if (text.length) {
            this.setState({
                tags: this.state.tags.concat(text)
            })
        }
        this.clearInput();
    },
    clearInput: function () {
        this.setState({
            text: ''
        }, function () {
            this.resizeInput();
        });
    },
    getInitialState: function () {
        return {
            tags: ['tag1', 'tag2', 'tag3'],
            text: ''
        }
    },
    onDeleteTag: function (e, tagElem) {
        console.log('onDeleteTag', e, tagElem);
        var tags = this.state.tags;
        tags.splice(tagElem.key, 1);
        // TODO: Splice modifies in-place so can probably just call setState to trigger the diff?
        this.setState({
            tags: tags
        });
    },
    focus: function () {
        var contentEditableNode = this.refs.contentEditable.getDOMNode();
        $(contentEditableNode).focus();
    },
    componentDidMount: function () {
        // Ensure that the user can start typing straight away.
        this.focus();
        this.resizeInput();
    }
});

module.exports = Tagger;