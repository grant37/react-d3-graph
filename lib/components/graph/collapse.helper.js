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

/**
 * @module Graph/collapse-helper
 * @description
 * Offers a series of methods that allow graph to perform the necessary operations to
 * create the collapsible behavior.
 *
 * Developer notes - collapsing nodes and maintaining state on links matrix.
 *
 * User interaction flow (for a collapsible graph)
 * 1. User clicks node
 * 2. All leaf connections of that node are not rendered anymore
 * 3. User clicks on same node
 * 4. All leaf connections of that node are rendered
 *
 * Internal react-d3-graph flow
 * 1. User clicks node
 * 2. Compute leaf connections for clicked node (rootNode, root as in 'root' of the event)
 * 3. Update connections matrix (based on 2.)
 * 4. Update d3Links array with toggled connections (based on 2.)
 */

/**
 * For directed graphs.
 * Check based on node degrees whether it is a leaf node or not.
 * @param {number} inDegree - the in degree for a given node.
 * @param {number} outDegree - the out degree for a given node.
 * @returns {boolean} based on the degrees tells whether node is leaf or not.
 * @memberof Graph/collapse-helper
 */
function _isLeafDirected(inDegree, outDegree) {
    return inDegree <= 1 && outDegree < 1;
}

/**
 * For not directed graphs.
 * Check based on node degrees whether it is a leaf node or not.
 * @param {number} inDegree - the in degree for a given node.
 * @param {number} outDegree - the out degree for a given node.
 * @returns {boolean} based on the degrees tells whether node is leaf or not.
 * @memberof Graph/collapse-helper
 */
function _isLeafNotDirected(inDegree, outDegree) {
    return inDegree <= 1 && outDegree <= 1;
}

/**
 * Given in and out degree tells whether degrees indicate a leaf or non leaf scenario.
 * @param {string} nodeId - The id of the node to get the cardinality of.
 * @param {Object.<string, number>} linksMatrix - An object containing a matrix of connections of the nodes.
 * @param {boolean} directed - whether graph in context is directed or not.
 * @returns {boolean} flag that indicates whether node is leaf or not.
 * @memberof Graph/collapse-helper
 */
function _isLeaf(nodeId, linksMatrix, directed) {
    var _computeNodeDegree = computeNodeDegree(nodeId, linksMatrix),
        inDegree = _computeNodeDegree.inDegree,
        outDegree = _computeNodeDegree.outDegree;

    return directed ? _isLeafDirected(inDegree, outDegree) : _isLeafNotDirected(inDegree, outDegree);
}

/**
 * Calculates degree (in and out) of some provided node.
 * @param {string|number} nodeId - the id of the node whom degree we want to compute.
 * @param {Object.<string, Object>} linksMatrix - an object containing a matrix of connections of the graph, for each nodeId,
 * there is an object that maps adjacent nodes ids (string) and their values (number).
 * @returns {Object.<string, number>} returns object containing in and out degree of the node:
 * - inDegree: number
 * - outDegree: number
 * @memberof Graph/collapse-helper
 */
function computeNodeDegree(nodeId) {
    var linksMatrix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return Object.keys(linksMatrix).reduce(
        function(acc, source) {
            if (!linksMatrix[source]) {
                return acc;
            }

            var currentNodeConnections = Object.keys(linksMatrix[source]);

            return currentNodeConnections.reduce(function(_acc, target) {
                if (nodeId === source) {
                    return _extends({}, _acc, {
                        outDegree: _acc.outDegree + linksMatrix[nodeId][target],
                    });
                }

                if (nodeId === target) {
                    return _extends({}, _acc, {
                        inDegree: _acc.inDegree + linksMatrix[source][nodeId],
                    });
                }

                return _acc;
            }, acc);
        },
        {
            inDegree: 0,
            outDegree: 0,
        }
    );
}

/**
 * Given a node id we want to calculate the list of leaf connections
 * @param {string} rootNodeId - node who's leafs we want to calculate.
 * @param {Object.<string, Object>} linksMatrix - an object containing a matrix of connections of the graph, for each nodeId,
 * there is an object that maps adjacent nodes ids (string) and their values (number).
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param {boolean} config.directed - tells whether linksMatrix represents a directed graph or not.
 * @returns {Array.<Object.<string, string>>} a list of leaf connections.
 * What is a leaf connection? A leaf connection is a link between some node A and other node B
 * where A has id equal to rootNodeId and B has inDegree 1 and outDegree 0 (or outDegree 1 but the connection is with A).
 * @memberof Graph/collapse-helper
 */
function getTargetLeafConnections(rootNodeId) {
    var linksMatrix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _ref = arguments[2];
    var directed = _ref.directed;

    var rootConnectionsNodesIds = Object.keys(linksMatrix[rootNodeId]);

    return rootConnectionsNodesIds.reduce(function(leafConnections, target) {
        if (_isLeaf(target, linksMatrix, directed)) {
            leafConnections.push({
                source: rootNodeId,
                target: target,
            });
        }

        return leafConnections;
    }, []);
}

/**
 * Given a node and the connections matrix, check if node should be displayed
 * NOTE: this function is meant to be used under the `collapsible` toggle, meaning
 * that the `isNodeVisible` actually is checking visibility on collapsible graphs.
 * If you think that this code is confusing and could potentially collide (🤞) with #_isLeaf
 * always remember that *A leaf can, through time, be both a visible or an invisible node!*.
 *
 * @param {string} nodeId - The id of the node to get the cardinality of
 * @param  {Object.<string, Object>} nodes - an object containing all nodes mapped by their id.
 * @param {Object.<string, number>} linksMatrix - An object containing a matrix of connections of the nodes.
 * @returns {boolean} flag that indicates whether node should or not be displayed.
 * @memberof Graph/collapse-helper
 */
function isNodeVisible(nodeId, nodes, linksMatrix) {
    var _computeNodeDegree2 = computeNodeDegree(nodeId, linksMatrix),
        inDegree = _computeNodeDegree2.inDegree,
        outDegree = _computeNodeDegree2.outDegree;

    var orphan = !!nodes[nodeId]._orphan;

    return inDegree > 0 || outDegree > 0 || orphan;
}

/**
 * Updates d3Links by toggling given connections
 * @param {Array.<Object>} d3Links - An array containing all the d3 links.
 * @param {Array.<Object.<string, string>>} connectionMatrix - connections to toggle.
 * @returns {Array.<Object>} updated d3Links.
 * @memberof Graph/collapse-helper
 */
function toggleLinksConnections(d3Links, connectionMatrix) {
    return d3Links.map(function(d3Link) {
        var source = d3Link.source,
            target = d3Link.target;

        var sourceId = source.id || source;
        var targetId = target.id || target;
        // connectionMatrix[sourceId][targetId] can be 0 or non existent
        var connection = connectionMatrix && connectionMatrix[sourceId] && connectionMatrix[sourceId][targetId];

        return connection ? _extends({}, d3Link, { isHidden: false }) : _extends({}, d3Link, { isHidden: true });
    });
}

/**
 * Update matrix given array of connections to toggle.
 * @param {Object.<string, Object>} linksMatrix - an object containing a matrix of connections of the graph, for each nodeId,
 * there is an object that maps adjacent nodes ids (string) and their values (number).
 * @param {Array.<Object.<string, string>>} connections - connections to toggle on matrix.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param {boolean} config.directed - tells whether linksMatrix represents a directed graph or not.
 * @returns {Object.<string, Object>} updated linksMatrix
 * @memberof Graph/collapse-helper
 */
function toggleLinksMatrixConnections(linksMatrix, connections, _ref2) {
    var directed = _ref2.directed;

    return connections.reduce(function(newMatrix, link) {
        if (!newMatrix[link.source]) {
            newMatrix[link.source] = {};
        }

        if (!newMatrix[link.source][link.target]) {
            newMatrix[link.source][link.target] = 0;
        }

        var newConnectionValue = newMatrix[link.source][link.target] === 0 ? 1 : 0;

        newMatrix[link.source][link.target] = newConnectionValue;

        if (!directed) {
            newMatrix[link.target][link.source] = newConnectionValue;
        }

        return newMatrix;
    }, _extends({}, linksMatrix));
}

exports.computeNodeDegree = computeNodeDegree;
exports.getTargetLeafConnections = getTargetLeafConnections;
exports.isNodeVisible = isNodeVisible;
exports.toggleLinksConnections = toggleLinksConnections;
exports.toggleLinksMatrixConnections = toggleLinksMatrixConnections;
