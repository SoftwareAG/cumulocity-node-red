import { Client } from '@c8y/client';
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
    console.log('Connecting..');
    try {
      const credentials = await Client.getMicroserviceSubscriptions({tenant: this.tenant, user: this.user, password: this.password}, this.url)
      const client = await Client.authenticate(credentials[0], this.url);
      if (process.env.APPLICATION_KEY) {
        const header = {'X-Cumulocity-Application-Key': this.applicationId};
        client.core.defaultHeaders = Object.assign(header, client.core.defaultHeaders);
      }
      this.client = client;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findAllMo(collectionName: string) {
    const filter = {
      pageSize: 1000,
      query: `$filter=(has(${collectionName}) and has(${defaultCollectionNames.nodeRedMarker}))`
    }
    try {
      const response = await this.client.inventory.list(filter);
      return response;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  findAll(collectionName: string) {
    return this.findAllMo(collectionName).then(result => {
      return result.data.map(tmp => tmp.full);
    });
  }


  async saveAll(collectionName: string, objects: any[]) {
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
  }

  async saveAsOne(collectionName: string, object: any) {
    await this.dropCollectionIfExists(collectionName);

    const create = {
      type: collectionName,
      [collectionName]: {},
      full: JSON.stringify(object),
      [defaultCollectionNames.nodeRedMarker]: {}
    }
    await this.client.inventory.create(create);
  }

  async getAsOne(collectionName: string) {
    const result = await this.findAllMo(collectionName)

    if (result.data.length) {
      const obj = JSON.parse(result.data[0].full);

      return obj;
    } else {
      throw Error('');
    }
  }

  async getFromTenantOptions(collectionName: string, encrypted = true) {
    try {
      const res = await this.client.options.tenant.detail({
        category: this.applicationId,
        key: `${encrypted ? 'credentials.' : '' }` + collectionName
      });
      return res.data.value ? JSON.parse(res.data.value) : {};
    } catch (e) {
      return {}
    }
  }

  async saveInTenantOptions(collectionName: string, object: any, encrypted = true) {
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

  async findOneByPath(collectionName: string, path: string) {
      return await this.findMoByPath(collectionName, path).then(result => {
        if (result.data && result.data.length) {
          const body = result.data[0].body;
          return body || {};
        } else {
          throw Error("404");
        }
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
