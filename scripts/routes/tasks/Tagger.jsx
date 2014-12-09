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
                    <div id="editable" className="editable"
                        contentEditable="true"
                        onKeyDown={this.onKeyDown}
                        onKeyUp={this.onKeyUp}
                        onBlur={this.onBlur}>
                    </div>
                </div>
            </div>
        )
    },
    onKeyDown: function (e) {
        var native = e.nativeEvent;
        if (e.keyCode == KeyCode.Tab || e.keyCode == KeyCode.Enter) {
            native.preventDefault();
            // Generate the tag.
            $(e.target).blur();
        }
    },
    onKeyUp: function (e) {
        e.preventDefault();
        // innerText for I.E, textContent for other browsers.
        var text = e.target.innerText || e.target.textContent;
        console.log('text', text);
        this.setState({
            text: text
        });
    },
    onChange: function () {
        console.log('on change');
    },
    onClick: function (e) {
        /* If Tagger is clicked anywhere other than the tags, we want to focus
         on the editable. */
        $(e.target).find('#editable').focus();
    },
    onBlur: function (e) {
        var text = e.target.innerText || e.target.textContent;
        text = text.trim();
        if (text.length) {
            this.setState({
                tags: this.state.tags.concat(text)
            })
        }
        // Clear any white space away.
        this.setState({
            text: ''
        });
        e.target.innerText = e.target.textContent = '';
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
    }
});

module.exports = Tagger;