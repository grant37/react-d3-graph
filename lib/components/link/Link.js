"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});

var _extends =
    Object.assign ||
    function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };

var _createClass = (function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: { value: subClass, enumerable: false, writable: true, configurable: true },
    });
    if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : (subClass.__proto__ = superClass);
}

/**
 * Link component is responsible for encapsulating link render.
 * @example
 * const onClickLink = function(source, target) {
 *      window.alert(`Clicked link between ${source} and ${target}`);
 * };
 *
 * const onRightClickLink = function(source, target) {
 *      window.alert(`Right clicked link between ${source} and ${target}`);
 * };
 *
 * const onMouseOverLink = function(source, target) {
 *      window.alert(`Mouse over in link between ${source} and ${target}`);
 * };
 *
 * const onMouseOutLink = function(source, target) {
 *      window.alert(`Mouse out link between ${source} and ${target}`);
 * };
 *
 * <Link
 *     d="M1..."
 *     source="idSourceNode"
 *     target="idTargetNode"
 *     markerId="marker-small"
 *     strokeWidth=1.5
 *     stroke="green"
 *     className="link"
 *     opacity=1
 *     mouseCursor="pointer"
 *     onClickLink={onClickLink}
 *     onRightClickLink={onRightClickLink}
 *     onMouseOverLink={onMouseOverLink}
 *     onMouseOutLink={onMouseOutLink} />
 */
var Link = (function(_React$Component) {
    _inherits(Link, _React$Component);

    function Link() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Link);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return (
            (_ret = ((_temp = ((_this = _possibleConstructorReturn(
                this,
                (_ref = Link.__proto__ || Object.getPrototypeOf(Link)).call.apply(_ref, [this].concat(args))
            )),
            _this)),
            (_this.handleOnClickLink = function() {
                return _this.props.onClickLink && _this.props.onClickLink(_this.props.source, _this.props.target);
            }),
            (_this.handleOnRightClickLink = function(event) {
                return (
                    _this.props.onRightClickLink &&
                    _this.props.onRightClickLink(event, _this.props.source, _this.props.target)
                );
            }),
            (_this.handleOnMouseOverLink = function() {
                return (
                    _this.props.onMouseOverLink && _this.props.onMouseOverLink(_this.props.source, _this.props.target)
                );
            }),
            (_this.handleOnMouseOutLink = function() {
                return _this.props.onMouseOutLink && _this.props.onMouseOutLink(_this.props.source, _this.props.target);
            }),
            _temp)),
            _possibleConstructorReturn(_this, _ret)
        );
    }
    /**
     * Handle link click event.
     * @returns {undefined}
     */

    /**
     * Handle link right click event.
     * @param {Object} event - native event.
     * @returns {undefined}
     */

    /**
     * Handle mouse over link event.
     * @returns {undefined}
     */

    /**
     * Handle mouse out link event.
     * @returns {undefined}
     */

    _createClass(Link, [
        {
            key: "render",
            value: function render() {
                var lineStyle = {
                    strokeWidth: this.props.strokeWidth,
                    stroke: this.props.stroke,
                    opacity: this.props.opacity,
                    fill: "none",
                    cursor: this.props.mouseCursor,
                };

                var lineProps = {
                    className: this.props.className,
                    d: this.props.d,
                    onClick: this.handleOnClickLink,
                    onContextMenu: this.handleOnRightClickLink,
                    onMouseOut: this.handleOnMouseOutLink,
                    onMouseOver: this.handleOnMouseOverLink,
                    style: lineStyle,
                };

                if (this.props.markerId) {
                    lineProps.markerEnd = "url(#" + this.props.markerId + ")";
                }

                var _props = this.props,
                    label = _props.label,
                    id = _props.id;

                var textProps = {
                    dy: -1,
                    style: {
                        fill: this.props.fontColor,
                        fontSize: this.props.fontSize,
                        fontWeight: this.props.fontWeight,
                    },
                };

                return _react2.default.createElement(
                    "svg",
                    null,
                    _react2.default.createElement("path", _extends({}, lineProps, { id: id })),
                    label &&
                        _react2.default.createElement(
                            "text",
                            _extends({ style: { textAnchor: "middle" } }, textProps),
                            _react2.default.createElement("textPath", { href: "#" + id, startOffset: "50%" }, label)
                        )
                );
            },
        },
    ]);

    return Link;
})(_react2.default.Component);

exports.default = Link;
