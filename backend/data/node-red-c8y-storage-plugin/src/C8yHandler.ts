import { BasicAuth, Client, FetchClient, ICredentials } from '@c8y/client';
import * as when from 'when';
import { defaultCollectionNames } from './constants';

export class C8yHandler {
  url: string;
  client: Client;
  tenant: string;
  user: string;
  password: string;
  applicationId: string;
  constructor(url: string, tenant: string, user: string, password: string, applicationId: string) {
    this.url = url;
    this.client = null;
    this.tenant = tenant;
    this.user = user;
    this.password = password;
    this.applicationId = applicationId;
  }

  async connect() {
    const credentials = await this.getMicroserviceSubscriptions({tenant: this.tenant, user: this.user, password: this.password}, this.url);
    return Client.authenticate(credentials[0], this.url).then(client => {
      if (process.env.APPLICATION_KEY) {
        const header = {'X-Cumulocity-Application-Key': this.applicationId};
        client.core.defaultHeaders = Object.assign(header, client.core.defaultHeaders);
      }
      this.client = client;
    });
  }

  async getMicroserviceSubscriptions(bootstrapCredentials: ICredentials, baseUrl: string) {
    const clientCore = new FetchClient(new BasicAuth(bootstrapCredentials), baseUrl);
    const res = await clientCore.fetch('/application/currentApplication/subscriptions');
    const {users} = await res.json();
    return users && users instanceof Array ? users.map(({tenant, name, password}) => {
      return {
        tenant,
        user: name,
        password
      };
    }) : [];
  }

  findAllMo(collectionName: string) {
    const filter = {
      pageSize: 1000,
      query: `$filter=(has(${collectionName}) and has(${defaultCollectionNames.nodeRedMarker}))`
    }
    return this.client.inventory.list(filter);
  }

  findAll(collectionName: string) {
    return this.findAllMo(collectionName).then(result => {
      return result.data.map(tmp => tmp.full);
    });
  }


  saveAll(collectionName: string, objects: any[]) {
    return when.promise<void>(async (resolve, reject) => {
      try {
        await this.dropCollectionIfExists(collectionName);

        if (objects.length) {
          const arr = Array.from(objects);
          // TODO: try to find a way of creating in parallel
          for (const entry of arr) {
            const create = {
              type: collectionName,
              [collectionName]: {},
              full: entry,
              [defaultCollectionNames.nodeRedMarker]: {}
            }
            await this.client.inventory.create(create);
          }
        }

        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  saveAsOne(collectionName: string, object: any) {
    return when.promise<void>(async (resolve, reject) => {
      try {
        await this.dropCollectionIfExists(collectionName);

        const create = {
          type: collectionName,
          [collectionName]: {},
          full: JSON.stringify(object),
          [defaultCollectionNames.nodeRedMarker]: {}
        }
        await this.client.inventory.create(create);

        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  getAsOne(collectionName: string) {
    return when.promise(async (resolve, reject) => {
      try {
        this.findAllMo(collectionName).then(result => {
          if (result.data.length) {
            const obj = JSON.parse(result.data[0].full);

            resolve(obj);
          } else {
            resolve({});
          }
        });
      } catch (ex) {
        reject(ex);
      }
    });
  }

  getFromTenantOptions(collectionName: string, encrypted = true) {
    return when.promise(async (resolve, reject) => {
      try {
        const data = await this.client.options.tenant.detail({
          category: this.applicationId,
          key: `${encrypted ? 'credentials.' : '' }` + collectionName
        }).then(res => {
          return res.data.value ? JSON.parse(res.data.value) : {};
        }, error => {
          return {};
        });
        resolve(data);
      } catch (ex) {
        reject(ex);
      }
    });
  }

  saveInTenantOptions(collectionName: string, object: any, encrypted = true) {
    return when.promise<void>(async (resolve, reject) => {
      try {
        const stored = await this.client.options.tenant.detail({
          category: this.applicationId,
          key: `${encrypted ? 'credentials.' : '' }` + collectionName
        }).then(res => res.data, err => null);

        if (!stored) {
          await this.client.options.tenant.create({
            category: this.applicationId,
            key: `${encrypted ? 'credentials.' : '' }` + collectionName,
            value: JSON.stringify(object)
          });
        } else {
          await this.client.options.tenant.update({
            category: this.applicationId,
            key: `${encrypted ? 'credentials.' : '' }` + collectionName,
            value: JSON.stringify(object)
          });
        }

        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  async dropCollectionIfExists(collectionName: string) {
    const collectionList = await this.findAllMo(collectionName);

    if (collectionList && collectionList.data.length) {
      // TODO: try to find a way of creating in parallel
      for (const mo of collectionList.data) {
        await this.client.inventory.delete(mo.id);
      }
    }
  }

  findMoByPath(collectionName: string, path: string) {
    const filter = {
      pageSize: 1,
      query: `$filter=(has(${collectionName}) and (path eq '${path}') and has(${defaultCollectionNames.nodeRedMarker}))`
    }
    return this.client.inventory.list(filter);
  }

  findOneByPath(collectionName: string, path: string) {
    return when.promise(async (resolve, reject) => {
      this.findMoByPath(collectionName, path).then(result => {
        if (result.data && result.data.length) {
          const body = result.data[0].body;
          resolve(body || {});
        } else {
          reject(404);
        }
      });
    });
  }

  saveOrUpdateByPath(collectionName: string, path: string, meta: any, body: any) {
    return this.findMoByPath(collectionName, path).then(result => {
      if (result.data.length) {
        const mo = result.data[0];
        const update = {
          id: mo.id,
          meta,
          body
        };
        return this.client.inventory.update(update);
      } else {
        const create = {
          type: collectionName,
          [collectionName]: {},
          path,
          meta,
          body,
          [defaultCollectionNames.nodeRedMarker]: {}
        };
        return this.client.inventory.create(create);
      }
    });
  }
};
