sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'zm086.uccmproove086',
            componentId: 'Z00SAP_ProjectOverview_CList',
            contextPath: '/Z00SAP_ProjectOverview_C'
        },
        CustomPageDefinitions
    );
});