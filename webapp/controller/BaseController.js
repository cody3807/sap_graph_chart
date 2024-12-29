sap.ui.define(
    ["sap/ui/core/mvc/Controller",
        "sap/ui/core/routing/History",
        "sap/ui/comp/valuehelpdialog/ValueHelpDialog",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast",
        "sap/ui/core/format/DateFormat"],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, History, ValueHelpDialog, JSONModel, MessageToast) {
        "use strict";

        return Controller.extend("project1.controller.BaseController", {
            /**
             * @override
             */
            onInit: function () { 
                
            },

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },

            onNavBack: function (oEvent) {
                var oHistory, sPreviousHash;

                oHistory = History.getInstance();
                sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    this.getRouter().navTo("home", {}, {}, true);
                }
            },
            date_converter: function (rawdate) {

                let [month, day, year] = rawdate.split("/");

                // Convert "YY" to "YYYY" (assuming dates are within the 2000s)
                year = parseInt(year) < 100 ? "20" + year : year;

                let date = new Date(`${year}-${month}-${day}`); // Create a Date object in "YYYY-MM-DD" format
                let final_date = date.toISOString().slice(0, 19); // Format as "YYYY-MM-DDTHH:MM:SS"
                return final_date
            },
            function(Controller, DateFormat) {
                "use strict";

                return Controller.extend("ticketapp093.controller.Ticket_Management", {

                    formatTime: function (oTime) {
                        if (!oTime) return "";

                        // Assuming oTime is a JavaScript Date object
                        const oDateFormat = DateFormat.getTimeInstance({ pattern: "HH:mm:ss" });
                        return oDateFormat.format(oTime);
                    }
                })
            },
            time_converter: function (rawtime) {
                let [time, modifier] = rawtime.split(" "); // Separate time and AM/PM
                let [hours, minutes, seconds] = time.split(":").map(Number); // Split hours, minutes, seconds

                // Convert 12-hour format to 24-hour format
                if (modifier === "PM" && hours < 12) {
                    hours += 12;
                }
                if (modifier === "AM" && hours === 12) {
                    hours = 0;
                }

                // Format in ISO 8601 duration format (PT#H#M#S)
                let final_time = `PT${hours.toString().padStart(2, "0")}H${minutes.toString().padStart(2, "0")}M${seconds.toString().padStart(2, "0")}S`
                return final_time
            },
            time_reverter: function (edmTime) {
                if (!edmTime || typeof edmTime.ms !== "number") return ""; // Handle invalid or empty input

                // Convert milliseconds to a Date object based on UTC
                const date = new Date(edmTime.ms);

                // Extract hours, minutes, and seconds in UTC (to avoid timezone offset)
                let hours = date.getUTCHours();
                const minutes = date.getUTCMinutes().toString().padStart(2, '0');
                const seconds = date.getUTCSeconds().toString().padStart(2, '0');

                // Determine AM/PM format
                let modifier = "AM";
                if (hours >= 12) {
                    modifier = "PM";
                    if (hours > 12) {
                        hours -= 12;
                    }
                } else if (hours === 0) {
                    hours = 12; // Adjust for 12 AM
                }

                // Format the time in `H:MM:SS AM/PM`
                return `${hours}:${minutes}:${seconds} ${modifier}`;
            },

            formatDate: function (dateObject) {
                if (!dateObject) return ""; // Handle empty or null dates

                // Check if dateObject is a Date instance
                let date = dateObject instanceof Date ? dateObject : new Date(dateObject);

                // Extract day, month, and year
                let day = date.getDate().toString().padStart(2, '0');
                let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
                let year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

                // Return formatted date as DD/MM/YY
                return `${day}/${month}/${year}`;
            },
            onSelectCheckBox: function (oEvent) {
                // Get the table item where the checkbox was selected
                const oSelectedItem = oEvent.getSource().getParent();

                // Get the ID of the table to distinguish between multiple tables (if needed)
                const sTableId = oSelectedItem.getParent().getId();

                // Find the table by its ID and get all the items
 
                const oTable =  sap.ui.getCore().byId(sTableId);//this.byId(sTableId);
                const aItems = oTable.getItems();
                
                // Iterate over all items in the table
                aItems.forEach(function (oItem) {
                    // Skip the currently selected item
                    if (oItem !== oSelectedItem) {
                        // Access the checkbox within the item and uncheck it
                        const oCheckBox = oItem.getCells()[0]; // Assuming checkbox is the first cell
                        oCheckBox.setSelected(false);
                    }
                });
            },
            // openValueHelpDialog: function (sTitle, sEntitySet, sKey, sDescriptionKey) {
            //     // Create a new ValueHelpDialog
            //     const oValueHelpDialog = new sap.ui.comp.valuehelpdialog.ValueHelpDialog({
            //         title: sTitle,
            //         supportMultiselect: false,
            //         ok: (oEvent) => {
            //             const aTokens = oEvent.getParameter("tokens");
            //             if (aTokens.length > 0) {
            //                 const selectedKey = aTokens[0].getKey();  // Get selected key
            //                 console.log(`Selected Key: ${selectedKey}`);
            //             }
            //             oValueHelpDialog.close();
            //         },
            //         cancel: () => oValueHelpDialog.close()
            //     });
            
            //     // Create a simple sap.m.Table for item selection
            //     const oTable = new sap.m.Table({
            //         mode: "SingleSelectLeft",  // Enable single selection
            //         columns: [
            //             new sap.m.Column({ header: new sap.m.Label({ text: sKey }) }),
            //             new sap.m.Column({ header: new sap.m.Label({ text: sDescriptionKey }) })
            //         ]
            //     });
            
            //     // Read the data and bind it to the table
            //     const oModel = this.getView().getModel();
            //     oModel.read(sEntitySet, {
            //         success: (oData) => {
            //             const oVHModel = new sap.ui.model.json.JSONModel(oData.results);
            //             oTable.setModel(oVHModel);
            //             oTable.bindItems({
            //                 path: "/",
            //                 template: new sap.m.ColumnListItem({
            //                     type: "Active", // To indicate selectable rows
            //                     cells: [
            //                         new sap.m.Text({ text: `{${sKey}}` }),
            //                         new sap.m.Text({ text: `{${sDescriptionKey}}` })
            //                     ]
            //                 })
            //             });
            
            //             // Attach selection change event to the table
            //             oTable.attachItemPress((oEvent) => {
            //                 const oSelectedItem = oEvent.getParameter("listItem");
            //                 if (oSelectedItem) {
            //                     const sSelectedKey = oSelectedItem.getCells()[0].getText(); // Get key
            //                     const sSelectedDescription = oSelectedItem.getCells()[1].getText(); // Get description
            
            //                     // Create a token for the selected value
            //                     oValueHelpDialog.setTokens([new sap.m.Token({ key: sSelectedKey, text: sSelectedDescription })]);
            //                 }
            //             });
            
            //             oValueHelpDialog.setTable(oTable);
            //             oValueHelpDialog.open();
            //         },
            //         error: (oError) => {
            //             sap.m.MessageToast.show(`Failed to load data for ${sTitle}.`);
            //             console.error(oError);
            //         }
            //     });
            
            //     // Add dialog as a dependent to manage its lifecycle properly
            //     this.getView().addDependent(oValueHelpDialog);
            // }
            // ,
            
            onvaluehelp_p: function (oEvent){
                
                
                this._sDynamicTableId = "Plant";
                this._supdatefield="plant"

                if (!this._oTechnicianDialog2) {
                    this._oTechnicianDialog2 = sap.ui.xmlfragment("ticketapp093.view.location", this);
                    this.getView().addDependent(this._oTechnicianDialog2);
                }
                this._oTechnicianDialog2.open()
                

            }
            ,
            onvaluehelp_m: function (oEvent){
                
                this._sDynamicTableId = "Machine";
                this._supdatefield="AssetId"

                if (!this._oTechnicianDialog) {
                    this._oTechnicianDialog = sap.ui.xmlfragment("ticketapp093.view.MachineName", this);
                    this.getView().addDependent(this._oTechnicianDialog);
                }
                this._oTechnicianDialog.open()
                

            },
            onvaluehelp_t: function (oEvent){
                
                this._sDynamicTableId = "Techs";
                this._supdatefield="TechId"

                if (!this._oTechnicianDialog) {
                    this._oTechnicianDialog = sap.ui.xmlfragment("ticketapp093.view.Techs", this);
                    this.getView().addDependent(this._oTechnicianDialog);
                }
                this._oTechnicianDialog.open()
                

            }

            ,
            onvaluehelp_d: function (oEvent){
                
                this._sDynamicTableId = "Days";
                this._supdatefield= "Text"

                if (!this._oTechnicianDialog) {
                    this._oTechnicianDialog = sap.ui.xmlfragment("ticketapp093.view.days", this);
                    this.getView().addDependent(this._oTechnicianDialog);
                }
                this._oTechnicianDialog.open()
                

            }
            ,
            onvaluehelp_df: function (oEvent){
                
                this._sDynamicTableId = "Days";
                this._supdatefield= "Text"
                this._finish_date = true

                if (!this._oTechnicianDialog) {
                    this._oTechnicianDialog = sap.ui.xmlfragment("ticketapp093.view.days", this);
                    this.getView().addDependent(this._oTechnicianDialog);
                }
                this._oTechnicianDialog.open()
                

            }
            ,
            on_close: function(oEvent) {
                if (this._oTechnicianDialog) {
                    // Clear input fields within the dialog
                    const oModel = this.getView().getModel("dialogData"); // Assuming dialogData is the model bound to the dialog
                    if (oModel) {
                        oModel.setData({}); // Reset the model data
                    }
            
                    // Alternatively, clear specific input fields
                    this._oTechnicianDialog.getContent().forEach((content) => {
                        if (content instanceof sap.m.Input || content instanceof sap.m.CheckBox) {
                            content.setValue("");  // Clear value for Input fields
                            content.setSelected(false);  // Reset CheckBox selection
                        }
                    });
            
                    // Close the dialog
                    this._oTechnicianDialog.close();
                }
            },
            on_ok_assign: function (oEvent) {
                var sTableId = oEvent.getSource().getParent().getId();
                const sTableId2 = this._sDynamicTableId;
                console.log(sTableId,sTableId2)
                const oDialog = oEvent.getSource().getParent(); // Get the parent Dialog of the button
                const oTable = sap.ui.getCore().byId(sTableId2); // Access the Table within the fragment by its ID
                
                if (!oTable) {
                    sap.m.MessageToast.show("Table not found in dialog.");
                    return;
                }
            
                const aItems = oTable.getItems(); // Get all items in the table
                let oSelectedItem = null;
            
                // Loop through the items to find the selected checkbox
                aItems.forEach(function (oItem) {
                    const oCheckBox = oItem.getCells()[0]; // Assuming CheckBox is in the first cell
                    if (oCheckBox.getSelected()) {
                        
                        oSelectedItem = oItem;
                    }
                });

                if (this._finish_date)
                {  sTableId = "FinishDay"
                    
                 }
            
                if (oSelectedItem) {
                    // Get the selected item's binding context data
                    const oSelectedData = oSelectedItem.getBindingContext().getObject();
            
                    // Update the model with the selected data
                    const oDialogData = this.getView().getModel("dialogData").getData();
                    oDialogData[sTableId] = oSelectedData[this._supdatefield].toUpperCase(); // Assuming "plant" is the key in your model
                    //oDialogData.description = oSelectedData.description; // Additional fields as needed
                    this.getView().getModel("dialogData").refresh();
                    console.log(oSelectedData)
                    // Close the dialog after successful selection
                    delete this._sDynamicTableId;
                    delete this._supdatefield;
                    delete this._finish_date;
                    
                    //oDialog.close();
                    oDialog.close()
                    
                    
                    
                } else {
                    sap.m.MessageToast.show("Please select a Plant to proceed.");
                }
            }

            
            
            
            
            
        }              
                       
        );
});