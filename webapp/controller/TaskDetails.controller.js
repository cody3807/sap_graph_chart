sap.ui.define([
    "aemmanagement/project1/controller/BaseController",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("aemmanagement.project1.controller.TaskDetails", {
        onInit: function () {
            const oRouter = this.getRouter();
            oRouter.getRoute("RouteTaskDetails").attachMatched(this._onRouteMatched, this);
            sap.ui.getCore().loadLibrary("sap.suite.ui.commons", { async: true });

        },

        _onRouteMatched: function (oEvent) {
            const args = oEvent.getParameter("arguments");
            const projectId = args.Projectid;
            const version = args.Version;
            const taskName = decodeURIComponent(args.TaskName); // Decode URI

            this._fetchBackendData(projectId, version, taskName);
        },

        _fetchBackendData: function (projectId, version, taskName) {
            const oModel = this.getView().getModel();
            const aBackendFilters = [
                new sap.ui.model.Filter("Projectid", sap.ui.model.FilterOperator.EQ, projectId),
                new sap.ui.model.Filter("Version", sap.ui.model.FilterOperator.EQ, version)
            ];

            oModel.read("/Z00SAP_Projectdetails_C_Less", {
                filters: aBackendFilters,
                success: (oData) => {
                    this._processData(oData.results, taskName);
                },
                error: (oError) => {
                    console.error("Error fetching backend data:", oError);
                }
            });
        },

        _processData: function (aData, taskName) {
            console.log("Processing data for TaskName:", taskName);

            const aFilteredData = aData.filter((item) => item.TaskName === taskName);

            if (!aFilteredData || aFilteredData.length === 0) {
                console.warn(`No matching data found for TaskName: ${taskName}`);
            } else {
                console.log("Filtered data by TaskName:", aFilteredData);
            }

            const rootNode = this._createRootNode(taskName);
            const enrichedData = this._enrichData(aFilteredData, rootNode);

            // Bind data to the process flow
            this._generateProcessFlow(enrichedData);
        },

        _createRootNode: function (taskName) {
            return {
                NodeId: "1",
                TaskName: taskName,
                Hierachy: "Root",
                ParentNode: null,
                Level: 0,
                tbbname: taskName // Root node TBB name is the task name
            };
        },

        _enrichData: function (aFilteredData, rootNode) {
            let currentId = 2; // Start assigning IDs from 2, as 1 is reserved for the root node
            const enrichedData = [rootNode]; // Start with the root node
            const hierarchyMap = new Map(); // Map to store hierarchy levels for parent-child relationships

            // Add the root node to the hierarchy map
            hierarchyMap.set("Root", rootNode.NodeId);

            aFilteredData.forEach((item) => {
                const hierarchy = item.Hierachy || "";
                const parentHierarchy = hierarchy.slice(0, -1) || "Root"; // Extract parent hierarchy or default to "Root"
                const level = hierarchy.charAt(1); // Level is the second character of the Hierachy field

                // Find parent ID in the hierarchy map
                const parentNodeId = hierarchyMap.get(parentHierarchy) || rootNode.NodeId;

                // Assign a unique ID to this node and store it in the hierarchy map
                const nodeId = String(currentId++);
                hierarchyMap.set(hierarchy, nodeId);

                enrichedData.push({
                    ...item,
                    NodeId: nodeId, // Unique ID for this node
                    ParentNode: parentNodeId, // Parent node ID
                    Level: level // Correctly calculated level
                });
            });

            console.log("Enriched Data with Levels and Parents:", enrichedData);
            return enrichedData;
        },

        _generateProcessFlow: function (enrichedData) {
            const processFlowNodes = [];
            const lanes = new Map();

            // Create ProcessFlow nodes and lanes
            enrichedData.forEach((node) => {
                // Add the lane for the current level if not already added
                if (!lanes.has(node.Level)) {
                    lanes.set(node.Level, {
                        id: node.Level.toString(),
                        icon: "sap-icon://activity-items",
                        label: `Level ${node.Level}`,
                        position: parseInt(node.Level, 10)
                    });
                }

                // Add the node to the process flow
                processFlowNodes.push({
                    id: node.NodeId,
                    lane: node.Level.toString(),
                    title: node.TaskName,
                    titleAbbreviation: `L${node.Level}`,
                    children: enrichedData
                        .filter((child) => child.ParentNode === node.NodeId)
                        .map((child) => child.NodeId),
                    state: node.Level === "0" ? "Positive" : "Neutral",
                    stateText: `Level ${node.Level}`,
                    texts: [node.tbbname || "No Description"]
                });
            });

            const processFlowLanes = Array.from(lanes.values());

            // Set model
            const oProcessFlowModel = new JSONModel({
                nodes: processFlowNodes,
                lanes: processFlowLanes
            });

            this.getView().setModel(oProcessFlowModel, "processFlow");
        }
    });
});
