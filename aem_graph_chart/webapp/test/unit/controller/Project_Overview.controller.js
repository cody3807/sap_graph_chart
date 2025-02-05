/*global QUnit*/

sap.ui.define([
	"aem_management/project1/controller/Project_Overview.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Project_Overview Controller");

	QUnit.test("I should test the Project_Overview controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
