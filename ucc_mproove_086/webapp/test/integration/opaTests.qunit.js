sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'zm086/uccmproove086/test/integration/FirstJourney',
		'zm086/uccmproove086/test/integration/pages/Z00SAP_ProjectOverview_CList',
		'zm086/uccmproove086/test/integration/pages/Z00SAP_ProjectOverview_CObjectPage',
		'zm086/uccmproove086/test/integration/pages/Z00SAP_Projectdetails_C_LessObjectPage'
    ],
    function(JourneyRunner, opaJourney, Z00SAP_ProjectOverview_CList, Z00SAP_ProjectOverview_CObjectPage, Z00SAP_Projectdetails_C_LessObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('zm086/uccmproove086') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheZ00SAP_ProjectOverview_CList: Z00SAP_ProjectOverview_CList,
					onTheZ00SAP_ProjectOverview_CObjectPage: Z00SAP_ProjectOverview_CObjectPage,
					onTheZ00SAP_Projectdetails_C_LessObjectPage: Z00SAP_Projectdetails_C_LessObjectPage
                }
            },
            opaJourney.run
        );
    }
);