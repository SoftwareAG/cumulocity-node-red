import { defaultCollectionNames } from './constants';
import { C8yHandler } from './C8yHandler';


let settings;
let c8yHandler: C8yHandler;

const storageModule = {
    init(_settings: any) {
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

        // setup environment variables to use for mqtt
        process.env.MQTT_USER = process.env.C8Y_TENANT + '/' + process.env.C8Y_USER;
        process.env.MQTT_PASSWORD = process.env.C8Y_PASSWORD;
        // tslint:disable-next-line: no-console
        console.log('MQTT BASEURL: ', process.env.C8Y_BASEURL_MQTT);

        this.collectionNames = Object.assign(defaultCollectionNames);
        if(settings.storageModuleOptions.collectionNames != null){
            for(const settingsColName of Object.keys(settings.storageModuleOptions.collectionNames)){
                this.collectionNames[settingsColName] = settings.storageModuleOptions.collectionNames[settingsColName];
            }
        }

        c8yHandler = new C8yHandler(settings.storageModuleOptions.c8yUrl, settings.storageModuleOptions.tenant, settings.storageModuleOptions.user, settings.storageModuleOptions.password, settings.storageModuleOptions.applicationId);
        return c8yHandler.connect();
    },

    getFlows() {
        return c8yHandler.findAll(this.collectionNames.flows);
    },

    saveFlows(flows: any) {
        return c8yHandler.saveAll(this.collectionNames.flows, flows);
    },

    getCredentials() {
        return c8yHandler.getFromTenantOptions(this.collectionNames.credentials, true);
    },

    saveCredentials(credentials: any) {
        return c8yHandler.saveInTenantOptions(this.collectionNames.credentials, credentials, true);
    },

    getSettings() {
        return c8yHandler.getAsOne(this.collectionNames.settings);
    },
    saveSettings(newSettings: any) {
        return c8yHandler.saveAsOne(this.collectionNames.settings, newSettings);
    },
    getSessions() {
        return c8yHandler.findAll(this.collectionNames.sessions);
    },
    saveSessions(sessions: any) {
        return c8yHandler.saveAll(this.collectionNames.sessions, sessions);
    },

    getLibraryEntry(type: any, path: any) {
        return c8yHandler.findOneByPath(type, path);
    },

    saveLibraryEntry(type: any, path: any, meta: any, body: any) {
        return c8yHandler.saveOrUpdateByPath(type, path, meta, body) ;
    }
};

module.exports = storageModule;
