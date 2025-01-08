/* global html2canvas:true */
sap.ui.define([
    "aemmanagement/project1/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "aemmanagement/project1/libs/html2canvas",
    "sap/suite/ui/commons/networkgraph/layout/LayeredLayout",
    "aemmanagement/project1/libs/dom-to-image.min",
    
    //"html2canvas",  // Ensure the html2canvas library is loaded
    // "jspdf"         // Ensure the jsPDF library is loaded
], function (Controller, JSONModel, html2canvasjs, jsPDFjs) {
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
            const taskName = decodeURIComponent(args.TaskName);

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
            const aFilteredData = aData.filter((item) => item.TaskName === taskName);

            if (!aFilteredData || aFilteredData.length === 0) {
                console.warn(`No matching data found for TaskName: ${taskName}`);
            } else {
                console.log("Filtered data by TaskName:", aFilteredData);
            }

            const rootNode = this._createRootNode(taskName);
            const enrichedData = this._enrichData(aFilteredData, rootNode);

            this._bindDataToTable(enrichedData);
            this._generateProcessFlow(enrichedData);
            //this._saveProcessFlowToFile(enrichedData);
            this._generateNetworkGraph(enrichedData);
        },

        _createRootNode: function (taskName) {
            return {
                NodeId: "1",
                TaskName: taskName,
                Hierachy: "Root",
                ParentNode: null,
                Level: 0,
                tbbname: taskName
            };
        },
        _enrichData: function (aFilteredData, rootNode) {
            let currentId = 2;
            const enrichedData = [rootNode];
            const hierarchyMap = new Map();
        
            hierarchyMap.set("Root", rootNode.NodeId);
        
            // Sort data based on hierarchy for proper parent-child assignment
            aFilteredData.sort((a, b) => a.Hierachy.localeCompare(b.Hierachy));
        
            aFilteredData.forEach((item) => {
                const hierarchy = item.Hierachy || "";
                const parentHierarchy = hierarchy.slice(0, -1) || "Root"; // Extract parent hierarchy or default to "Root"
                const level = parseInt(hierarchy.charAt(1), 10); // Level from the second character of Hierachy
                
                const combinedKey = `${parentHierarchy}${level - 1}`; 
                
                const parentNodeId = hierarchyMap.get(combinedKey ) || rootNode.NodeId;
                
                // A2= A parentHierarchy, level is 2, A(2-1), A1
                const nodeId = String(currentId++);
                
                
                if (hierarchy.length=== 5) {
                    hierarchyMap.set(hierarchy.substring(0,2), nodeId);
                    hierarchyMap.set(hierarchy.substring(3,5), nodeId);
                    console.log(hierarchyMap)
                } else {
                    hierarchyMap.set(hierarchy, nodeId);
                    console.log(hierarchyMap)
                }
        
                enrichedData.push({
                    ...item,
                    NodeId: nodeId,
                    ParentNode: parentNodeId,
                    Level: level
                });
            });
        
            return enrichedData;
        },
        
        
        

        _bindDataToTable: function (enrichedData) {
            const oJSONModel = new JSONModel();
            oJSONModel.setData({ filteredResults: enrichedData });
            this.getView().setModel(oJSONModel);
        },

        _generateProcessFlow: function (enrichedData) {
            const processFlowNodes = [];
            const lanes = new Map();
        
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
                 // Determine the state based on the level
        let nodeState = "Neutral"; // Default state
        if (node.Level === 1) {
            nodeState = "Positive"; // Green background
        } else if (node.Level === 2) {
            nodeState = "Critical"; // Orange background
        } else if (node.Level >= 3) {
            nodeState = "Negative"; // Red background
        }
        
                // Add the node to the process flow
                processFlowNodes.push({
                    id: node.NodeId,
                    lane: node.Level.toString(), // Use the level as the lane
                    title: node.tbbname,
                    titleAbbreviation: `L${node.Level}`,
                    children: enrichedData
                        .filter((child) => child.ParentNode === node.NodeId)
                        .map((child) => child.NodeId),
                    state: nodeState,
                    //stateText: `Level ${node.Level}`,
                    texts: [node.Hierachy || "No Description"]
                });
            });
        
            const processFlowLanes = Array.from(lanes.values());
        
            // Set the model for Process Flow
            const oProcessFlowModel = new JSONModel({
                nodes: processFlowNodes,
                lanes: processFlowLanes
            });
        
            this.getView().setModel(oProcessFlowModel, "processFlow");
        },
        
        onExportAsImage2: function () {
            //const networkGraph = this.byId("networkGraph"); // ID of your ProcessFlow control
            //const domElement = networkGraph.getDomRef();
            const domElement = document.querySelector("#application-aemmanagementproject1-display-component---TaskDetails--networkGraph-scroller");
            
            domtoimage.toPng(domElement)
            .then((dataUrl) => {
                // Create a link element to download the image
                const link = document.createElement("a");
                link.href = dataUrl;
                link.download = "networkGraph.png";
                link.click();
            })
            .catch((error) => {
                console.error("Error exporting image with dom-to-image:", error);
            });

            // html2canvas(domElement).then((canvas) => {
            //     const imgData = canvas.toDataURL("image/png");
        
            //     // Create a link element to download the image
            //     const link = document.createElement("a");
            //     link.href = imgData;
            //     link.download = "networkGraph.png";
            //     link.click();
            // }).catch((err) => {
            //     console.error("Error exporting as Image:", err);
            // });
        },

        onExportAsImage: function () {
            const processFlow = this.byId("processFlow"); // ID of your ProcessFlow control
            const domElement = processFlow.getDomRef();
        
            html2canvas(domElement).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
        
                // Create a link element to download the image
                const link = document.createElement("a");
                link.href = imgData;
                link.download = "ProcessFlow.png";
                link.click();
            }).catch((err) => {
                console.error("Error exporting as Image:", err);
            });
        },
        onExportAsPDF: function () {
            const processFlow = this.byId("processFlow"); // ID of your ProcessFlow control
            const domElement = processFlow.getDomRef();

            html2canvas(domElement).then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [canvas.width, canvas.height]
                });

                pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
                pdf.save("ProcessFlow.pdf");
            }).catch((err) => {
                console.error("Error exporting as PDF:", err);
            });
        }
    //     ,
        
        

    //     _saveProcessFlowToFile: function (enrichedData) {
    //         const processFlowNodes = enrichedData.map((node) => ({
    //             id: node.NodeId,
    //             lane: node.Level.toString(),
    //             title: node.TaskName,
    //             children: enrichedData
    //                 .filter((child) => child.ParentNode === node.NodeId)
    //                 .map((child) => child.NodeId),
    //             state: node.Level === "0" ? "Positive" : "Neutral",
    //             stateText: `Level ${node.Level}`,
    //             texts: [node.tbbname || "No Description"]
    //         }));

    //         const processFlowLanes = Array.from(
    //             new Map(
    //                 enrichedData.map((node) => [
    //                     node.Level,
    //                     {
    //                         id: node.Level.toString(),
    //                         icon: "sap-icon://activity-items",
    //                         label: `Level ${node.Level}`,
    //                         position: parseInt(node.Level, 10)
    //                     }
    //                 ])
    //             ).values()
    //         );

    //         const jsonData = JSON.stringify({ nodes: processFlowNodes, lanes: processFlowLanes }, null, 2);
    //         File.save(jsonData, "processflow", "json", "application/json");
    //     }
    ,
    _generateNetworkGraph: function (enrichedData) {
        const nodes = [];
        const lines = [];
        let x1 = 0;
        let y1 = 0;
        // Generate nodes and lines for the network graph
        enrichedData.forEach((node) => {
            if (node.Level === 0 ) {
                x1 = 0;
                y1 =120;
                
            }
            else {
                x1="auto";
                y1 ="auto";
                


            }
            
            // Add nodes
            nodes.push({
                key: node.NodeId,
                title: node.tbbname || node.TaskName,
                description: `Level: ${node.Level}`,
                // icon: "sap-icon://activity-items",
                x: x1,
                y: y1,
  
                shape: "Box",
                 height: 80,
                 width: 150,
                
                status: node.Level === 0 ? "default" : node.Level === 1 ? "Success" : node.Level === 2 ? "Warning" : "Error",
                //group: `Level ${node.Level}`,
            });
    
            // Add lines
            if (node.NodeId !== "1") {
                const parentExists = nodes.some((n) => n.key === node.ParentNode);
                if (parentExists) {
                    lines.push({
                        from: node.ParentNode,
                        to: node.NodeId,
                    });
                } else {
                    console.error("Invalid ParentNode reference:", node.ParentNode);
                }
            }
        });
    
      
    
        // Set up the model
        const oNetworkGraphModel = new sap.ui.model.json.JSONModel({
            nodes: nodes,
            lines: lines,
        });
        oNetworkGraphModel.setSizeLimit(10000); // Increase size limit
        console.log("Generated Nodes:", nodes);
        console.log("Generated Lines:", lines);
        this.getView().setModel(oNetworkGraphModel, "network");
    }
    
    
    
     });
});

