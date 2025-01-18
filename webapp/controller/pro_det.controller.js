sap.ui.define([
    "aemmanagement/project1/controller/BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("aemmanagement.project1.controller.pro_det", {
        onInit: function () {
            // Attach route matched handler
            const oRouter = this.getRouter();
            oRouter.getRoute("RouteProjectDetails").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            const projectId = oEvent.getParameter("arguments").Projectid;
            const version = oEvent.getParameter("arguments").Version;

            // Apply filters to the table binding
            const aFilters = [
                new Filter("Projectid", FilterOperator.EQ, projectId), // No extra quotes needed
                new Filter("Version", FilterOperator.EQ, version) // No extra quotes needed
            ];

            const oTable = this.byId("projectDetailsTable");
            const oBinding = oTable.getBinding("items");

            if (oBinding) {
                oBinding.filter(aFilters);
            } else {
                console.error("Table binding not available.");
            }
        },
        onLineItemPress: function (oEvent) {
            const oContext = oEvent.getSource().getBindingContext();

            
            
            let projectId = oContext.getProperty("Projectid");
            let version = oContext.getProperty("Version");
            let ET_Id = oContext.getProperty("ET_Id");
        
            // Call BaseController methods using `this`
            projectId = this.uuid_encoder(projectId);
            version = this.uuid_encoder(version);
            ET_Id = this.uuid_encoder(ET_Id);
            
        
            this.getRouter().navTo("RouteTaskDetails", {
                Projectid: projectId,
                Version: version,
                ET_Id: ET_Id,
                
            });
        },
        
    });
});
