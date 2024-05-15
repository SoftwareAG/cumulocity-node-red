import { Client } from "@c8y/client";
import { defaultCollectionNames } from "./constants";

export class C8yHandler {
  url: string;
  client: Client;
  tenant: string;
  user: string;
  password: string;
  applicationId: string;
  constructor(
    url: string,
    tenant: string,
    user: string,
    password: string,
    applicationId: string
  ) {
    this.url = url;
    this.client = null;
    this.tenant = tenant;
    this.user = user;
    this.password = password;
    this.applicationId = applicationId;
  }

  async connect() {
    console.log("Connecting..");
    try {
      const credentials = await Client.getMicroserviceSubscriptions(
        { tenant: this.tenant, user: this.user, password: this.password },
        this.url
      );
      const client = await Client.authenticate(credentials[0], this.url);
      if (process.env.APPLICATION_KEY) {
        const header = { "X-Cumulocity-Application-Key": this.applicationId };
        client.core.defaultHeaders = Object.assign(
          header,
          client.core.defaultHeaders
        );
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
      query: `$filter=(has(${collectionName}) and has(${defaultCollectionNames.nodeRedMarker}))`,
    };
    try {
      const response = await this.client.inventory.list(filter);
      return response;
    } catch (e) {
      console.error(`Failed to during "findAllMo" for ${collectionName}`, e);
      throw e;
    }
  }

  async findAll(collectionName: string) {
    try {
      const result = await this.findAllMo(collectionName);
      return result.data.map((tmp) => tmp.full);
    } catch (e) {
      console.error(`Failed to during "findAll" for ${collectionName}`, e);
      throw e;
    }
  }

  async saveAll(collectionName: string, objects: any[]) {
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
            [defaultCollectionNames.nodeRedMarker]: {},
          };
          await this.client.inventory.create(create);
        }
      }
    } catch (e) {
      console.error(`Failed to during "saveAll" for ${collectionName}`, e);
      throw e;
    }
  }

  async saveAsOne(collectionName: string, object: any) {
    try {
      await this.dropCollectionIfExists(collectionName);

      const create = {
        type: collectionName,
        [collectionName]: {},
        full: JSON.stringify(object),
        [defaultCollectionNames.nodeRedMarker]: {},
      };
      await this.client.inventory.create(create);
    } catch (e) {
      console.error(`Failed to during "saveAsOne" for ${collectionName}`, e);
      throw e;
    }
  }

  async getAsOne(collectionName: string, notExistingFallBackValue?: any) {
    try {
      const result = await this.findAllMo(collectionName);

      if (result.data.length) {
        const obj = JSON.parse(result.data[0].full);

        return obj;
      } else {
        if (notExistingFallBackValue !== undefined) {
          return notExistingFallBackValue
        }
        throw Error("");
      }
    } catch (e) {
      console.error(`Failed to during "getAsOne" for ${collectionName}`, e);
      throw e;
    }
  }

  async getFromTenantOptions(collectionName: string, encrypted = true) {
    try {
      const res = await this.client.options.tenant.detail({
        category: this.applicationId,
        key: `${encrypted ? "credentials." : ""}` + collectionName,
      });
      return res.data.value ? JSON.parse(res.data.value) : {};
    } catch (e) {
      return {};
    }
  }

  async saveInTenantOptions(
    collectionName: string,
    object: any,
    encrypted = true
  ) {
    try {
      const stored = await this.client.options.tenant
        .detail({
          category: this.applicationId,
          key: `${encrypted ? "credentials." : ""}` + collectionName,
        })
        .then(
          (res) => res.data,
          (err) => null
        );

      if (!stored) {
        await this.client.options.tenant.create({
          category: this.applicationId,
          key: `${encrypted ? "credentials." : ""}` + collectionName,
          value: JSON.stringify(object),
        });
      } else {
        await this.client.options.tenant.update({
          category: this.applicationId,
          key: `${encrypted ? "credentials." : ""}` + collectionName,
          value: JSON.stringify(object),
        });
      }
    } catch (e) {
      console.error(
        `Failed to during "saveInTenantOptions" for ${collectionName}`,
        e
      );
      throw e;
    }
  }

  async dropCollectionIfExists(collectionName: string) {
    try {
      const collectionList = await this.findAllMo(collectionName);

      if (collectionList && collectionList.data.length) {
        // TODO: try to find a way of creating in parallel
        for (const mo of collectionList.data) {
          await this.client.inventory.delete(mo.id);
        }
      }
    } catch (e) {
      console.error(
        `Failed to during "dropCollectionIfExists" for ${collectionName}`,
        e
      );
      throw e;
    }
  }

  async findMoByPath(collectionName: string, path: string) {
    try {
      const filter = {
        pageSize: 1,
        query: `$filter=(has(${collectionName}) and (path eq '${path}') and has(${defaultCollectionNames.nodeRedMarker}))`,
      };
      return await this.client.inventory.list(filter);
    } catch (e) {
      console.error(`Failed to during "findMoByPath" for ${collectionName}`, e);
      throw e;
    }
  }

  async findOneByPath(collectionName: string, path: string) {
    try {
      const result = await this.findMoByPath(collectionName, path);
      if (result.data && result.data.length) {
        const body = result.data[0].body;
        return body || {};
      } else {
        throw Error("404");
      }
    } catch (e) {
      console.error(`Failed to during "findOneByPath" for ${collectionName}`, e);
      throw e;
    }
  }

  async saveOrUpdateByPath(
    collectionName: string,
    path: string,
    meta: any,
    body: any
  ) {
    try {
      const result = await this.findMoByPath(collectionName, path);
      if (result.data.length) {
        const mo = result.data[0];
        const update = {
          id: mo.id,
          meta,
          body,
        };
        return this.client.inventory.update(update);
      } else {
        const create = {
          type: collectionName,
          [collectionName]: {},
          path,
          meta,
          body,
          [defaultCollectionNames.nodeRedMarker]: {},
        };
        return this.client.inventory.create(create);
      }
    } catch (e) {
      console.error(`Failed to during "saveOrUpdateByPath" for ${collectionName}`, e);
      throw e;
    }
  }
}
