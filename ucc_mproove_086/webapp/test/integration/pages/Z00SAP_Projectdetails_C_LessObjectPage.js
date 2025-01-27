sap.ui.define(['sap/fe/test/ObjectPage'], function(ObjectPage) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ObjectPage(
        {
            appId: 'zm086.uccmproove086',
            componentId: 'Z00SAP_Projectdetails_C_LessObjectPage',
            contextPath: '/Z00SAP_ProjectOverview_C/tbbview'
        },
        CustomPageDefinitions
    );
});