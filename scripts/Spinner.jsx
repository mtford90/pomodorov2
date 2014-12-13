/**
 * A spinkit spinner with minimum display time capabilities and content fades.
 * Will display child components once loading is finished.
 * @module Spinner
 */

var React = require('react'),
    q = require('q');


var FADE_TIME = 400;

var Spinner = React.createClass({
    render: function () {
        var defaultSpinnerClass = 'sk-spinner-rotating-plane',
            spinnerClass = this.props['spinnerClass'] || defaultSpinnerClass,
            spinner = <div className={"sk-spinner " + spinnerClass}></div>,
            content = this.props.children;
        return (
            <div className="spinner-wrapper" ref="wrapper">
                {this.state.finishedLoading ? content : spinner}
            </div>
        );
    },
    fade: function (fadeOutCallback, fadeInCallback) {
        var domNode = this.refs.wrapper.getDOMNode();
        console.log('domNode', domNode);
        var $domNode = $(domNode);
        $domNode.fadeOut(FADE_TIME, function () {
            if (fadeOutCallback) fadeOutCallback();
            $domNode.fadeIn(FADE_TIME, function () {
                if (fadeInCallback) fadeInCallback();
            });
        });
    },
    startTimer: function () {
        if (!this.state.timing) {
            this.deferred = q.defer();
            this.setState({
                timing: true
            }, function () {
                var defaultMinimumTime = 3000,
                    time = this.props['minimumTime'] || defaultMinimumTime;
                setTimeout(function () {
                    var timerEnded = this.props['timerEnded'];
                    this.setState({
                        timing: false
                    }, function () {
                        if (timerEnded) timerEnded();
                        console.log('Done!');
                        this.deferred.resolve();
                        this.deferred = null;
                    });
                }.bind(this), time);
            });
        }
    },
    getInitialState: function () {
        return {
            timing: false,
            finishedLoading: this.props.finishedLoading
        }
    },
    finishLoading: function () {
        // If a timer is running, loading will finish with the timer.
        if (!this.state.finishedLoading) {
            var _finishLoading = function () {
                console.log('_finishLoading');
                this.setState({
                    finishedLoading: true
                });
                // TODO: Get fade working with the spinners.
                //this.fade(function () {
                //    this.setState({
                //        finishedLoading: true
                //    })
                //}.bind(this));
            }.bind(this);

            if (!this.state.timing) {
                _finishLoading.call(this);
            }
            else {
                var deferred = this.deferred;
                console.log('deferred', deferred);
                deferred.promise.then(_finishLoading);
            }
        }
    }
});

module.exports = Spinner;