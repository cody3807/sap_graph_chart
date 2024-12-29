sap.ui.define([
    "aemmanagement/project1/controller/BaseController",
    "sap/m/MessageToast"

], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("aemmanagement.project1.controller.Project_Overview", {
        onInit: function () {
            // Initialization code
        },

        onDeletePress: function (oEvent) {
            const oModel = this.getView().getModel();
            const oItem = oEvent.getSource().getParent();
            const sPath = oItem.getBindingContext().getPath();

            oModel.remove(sPath, {
                success: function () {
                    MessageToast.show("Deleted successfully.");
                },
                error: function (oError) {
                    const errorMessage = JSON.parse(oError.responseText).error.message.value;
                    MessageToast.show(`Deletion Failed: ${errorMessage}`);
                }
            });
        },
        onProjectSelect: function (oEvent) {
            // Get the selected project's ID and version
            const oSelectedItem = oEvent.getSource().getBindingContext();
            const projectId = oSelectedItem.getProperty("Projectid");
            const version = oSelectedItem.getProperty("Version");
            console.log(projectId)

            // Navigate to the Project Details page
            this.getRouter().navTo("RouteProjectDetails", {
                Projectid: projectId,
                Version: version
            });
        }
    });
});
