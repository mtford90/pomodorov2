/**
 * A spinkit spinner with minimum display time capabilities and content fades.
 * Will display child components once loading is finished.
 * @module Spinner
 */

var React = require('react'),
    q = require('q');


var FADE_TIME = 2000;

var Spinner = React.createClass({
    render: function () {
        var self = this,
            defaultSpinnerClass = 'sk-spinner-rotating-plane',
            spinnerClass = this.props['spinnerClass'] || defaultSpinnerClass,
            spinner = <div className={"sk-spinner " + spinnerClass}></div>,
            content = this.props.children,
            classes = self.getAdditionalClasses();
        console.log('classes', classes);
        return (
            <div className={"spinner-wrapper " + classes}>
                {this.state.finishedLoading ? content : spinner}
            </div>
        );
    },
    fade: function (fadeOutCallback, fadeInCallback) {
        this.setState({
            additionalClasses: ['hidden']
        }, function () {
            setTimeout(function () {
                if (fadeOutCallback) fadeOutCallback();
                this.setState({
                    additionalClasses: ['visible']
                }, function () {
                    setTimeout(fadeInCallback ? fadeInCallback : function () {}, FADE_TIME);
                })
            }.bind(this), FADE_TIME);
        })
    },
    getAdditionalClasses: function () {
        return _.reduce(this.state.additionalClasses, function (m, x) {return m + x + ' '}, '')
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
            finishedLoading: this.props.finishedLoading,
            additionalClasses: ['visible']
        }
    },
    finishLoading: function () {
        // If a timer is running, loading will finish with the timer.
        if (!this.state.finishedLoading) {
            var _finishLoading = function () {
                console.log('_finishLoading');
                this.fade(function () {
                    this.setState({
                        finishedLoading: true
                    })
                }.bind(this));
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