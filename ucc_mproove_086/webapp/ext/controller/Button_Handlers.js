sap.ui.define([
    "sap/m/MessageToast"
], function(MessageToast) {
    'use strict';

    return {
        projectsLogging: function(oEvent) {
            window.open("https://s40lp1.ucc.cit.tum.de/sap/bc/gui/sap/its/webgui?~Transaction=*Z00PROJLOG%20CUSOBJ-LOW=Z00SAP_PROJECTS;tabfirst=X;alv_grid=X;dbeg=01.01.2000;dend=31.12.9999#",
                        "Projects Logging");
            //MessageToast.show("Custom handler invoked.");
        },
        tierlevelLogging: function() {
            window.open("https://s40lp1.ucc.cit.tum.de/sap/bc/gui/sap/its/webgui?~Transaction=*Z00PROJLOG%20CUSOBJ-LOW=Z00SAP_TL;tabfirst=X;alv_grid=X;dbeg=01.01.2000;dend=31.12.9999#",
                "Projects Logging");
            //MessageToast.show("Custom handler invoked.");
        },
        styleLogging: function() {
            window.open("https://s40lp1.ucc.cit.tum.de/sap/bc/gui/sap/its/webgui?~Transaction=*Z00PROJLOG%20CUSOBJ-LOW=Z00SAP_ES;tabfirst=X;alv_grid=X;dbeg=01.01.2000;dend=31.12.9999#",
                "Projects Logging");
            //MessageToast.show("Custom handler invoked.");
        },
        taskLogging: function() {
            window.open("https://s40lp1.ucc.cit.tum.de/sap/bc/gui/sap/its/webgui?~Transaction=*Z00PROJLOG%20CUSOBJ-LOW=Z00SAP_ET;tabfirst=X;alv_grid=X;dbeg=01.01.2000;dend=31.12.9999#",
                "Projects Logging");
            //MessageToast.show("Custom handler invoked.");
        },
        TBBLogging: function() {
            window.open("https://s40lp1.ucc.cit.tum.de/sap/bc/gui/sap/its/webgui?~Transaction=*Z00PROJLOG%20CUSOBJ-LOW=Z00SAP_TBB;tabfirst=X;alv_grid=X;dbeg=01.01.2000;dend=31.12.9999#",
                "Projects Logging");
            //MessageToast.show("Custom handler invoked.");        
        },
        ColNamesLogging: function() {
            window.open("https://s40lp1.ucc.cit.tum.de/sap/bc/gui/sap/its/webgui?~Transaction=*Z00PROJLOG%20CUSOBJ-LOW=Z00SAP_COL_NAMES;tabfirst=X;alv_grid=X;dbeg=01.01.2000;dend=31.12.9999#",
                "Projects Logging");
            //MessageToast.show("Custom handler invoked.");        
        }
    };
});
