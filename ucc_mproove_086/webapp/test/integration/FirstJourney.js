sap.ui.define([
    "sap/ui/test/opaQunit"
], function (opaTest) {
    "use strict";

    var Journey = {
        run: function() {
            QUnit.module("First journey");

            opaTest("Start application", function (Given, When, Then) {
                Given.iStartMyApp();

                Then.onTheZ00SAP_ProjectOverview_CList.iSeeThisPage();

            });


            opaTest("Navigate to ObjectPage", function (Given, When, Then) {
                // Note: this test will fail if the ListReport page doesn't show any data
                
                When.onTheZ00SAP_ProjectOverview_CList.onFilterBar().iExecuteSearch();
                
                Then.onTheZ00SAP_ProjectOverview_CList.onTable().iCheckRows();

                When.onTheZ00SAP_ProjectOverview_CList.onTable().iPressRow(0);
                Then.onTheZ00SAP_ProjectOverview_CObjectPage.iSeeThisPage();

            });

            opaTest("Teardown", function (Given, When, Then) { 
                // Cleanup
                Given.iTearDownMyApp();
            });
        }
    }

    return Journey;
});