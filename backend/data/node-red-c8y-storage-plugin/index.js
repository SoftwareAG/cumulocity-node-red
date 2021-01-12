const constants = require("./constants");
const C8yHandler = require("./C8yHandler");


var settings;
var c8yHandler;

var storageModule = {    
    init: function(_settings) {
        settings = _settings;
        if (
            settings.storageModuleOptions == null || 
            settings.storageModuleOptions.c8yUrl == null || 
            settings.storageModuleOptions.tenant == null || 
            settings.storageModuleOptions.user == null || 
            settings.storageModuleOptions.password == null ||
            settings.storageModuleOptions.applicationId == null) {
            throw new Error("c8y storage module's required parameters are not defined");
        }        

        this.collectionNames = Object.assign(constants.DefaultCollectionNames);
        if(settings.storageModuleOptions.collectionNames != null){
            for(let settingsColName of Object.keys(settings.storageModuleOptions.collectionNames)){
                this.collectionNames[settingsColName] = settings.storageModuleOptions.collectionNames[settingsColName];
            }
        }
                
        c8yHandler = new C8yHandler(settings.storageModuleOptions.c8yUrl, settings.storageModuleOptions.tenant, settings.storageModuleOptions.user, settings.storageModuleOptions.password, settings.storageModuleOptions.applicationId);
        return c8yHandler.connect();
    },

    getFlows: function() {
        return c8yHandler.findAll(this.collectionNames.flows);
    },

    saveFlows: function(flows) {
        return c8yHandler.saveAll(this.collectionNames.flows, flows);
    },

    getCredentials: function() {
        return c8yHandler.getFromTenantOptions(this.collectionNames.credentials, true);
    },

    saveCredentials: function(credentials) {
        return c8yHandler.saveInTenantOptions(this.collectionNames.credentials, credentials, true);
    },

    getSettings: function() {
        return c8yHandler.getAsOne(this.collectionNames.settings);
    },
    saveSettings: function(settings) {
        return c8yHandler.saveAsOne(this.collectionNames.settings, settings);
    },
    getSessions: function() {
        return c8yHandler.findAll(this.collectionNames.sessions);
    },
    saveSessions: function(sessions) {
        return c8yHandler.saveAll(this.collectionNames.sessions, sessions);
    },

    getLibraryEntry: function(type, path) {
        return c8yHandler.findOneByPath(type, path);
    },

    saveLibraryEntry: function(type, path, meta, body) {
        return c8yHandler.saveOrUpdateByPath(type, path, meta, body) ;
    }
};

module.exports = storageModule;
