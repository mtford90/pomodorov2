var React = require('react'),
    Modal = require('./Modal'),
    Confirmation = require('./Confirmation');

var placeholder = <Modal/>;

module.exports = {
    placeholder: placeholder,
    reveal: function () {
        var modal = Modal.getSingleton();
        modal.reveal.apply(modal, arguments);
    },
    hide: function () {
        var modal = Modal.getSingleton();
        modal.hideModal();
    },
    confirmation: function (content, okCallback, cancelCallback) {
        okCallback = okCallback || function () {};
        cancelCallback = cancelCallback || function () {};
        var modal = Modal.getSingleton();
        var cancel = function () {
            modal.hideModal();
            cancelCallback();
        };
        var ok = function () {
            modal.hideModal();
            okCallback();
        };
        this.reveal(<Confirmation ok={ok} cancel={cancel}>{content}</Confirmation>)
    }
};