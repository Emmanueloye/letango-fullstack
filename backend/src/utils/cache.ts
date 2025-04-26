/// <reference path="../../types/mongoose.d.ts" />
import NodeCache from 'node-cache';
import mongoose from 'mongoose';

const appCache = new NodeCache({ stdTTL: 300 });
const exec = mongoose.Query.prototype.exec;

// Set the cache property on the prototype.
mongoose.Query.prototype.emCache = function () {
  this.useCache = true;
  return this;
};

mongoose.Query.prototype.exec = async function () {
  // Fetch data from database if the .cache flag is not used.
  if (!this.useCache) {
    return exec.apply(this, arguments as any);
  }
  // Dynamically generate unique key for cached query
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.model.collection.name,
    })
  );

  // Get data from cache and return it instead of querying database.
  const cachedResult = appCache.get(key);
  if (cachedResult) {
    return cachedResult;
  }

  //   If there is no data in the cache, then make the request to database.
  const result = await exec.apply(this, arguments as any);
  appCache.set(key, result);
  return result;
};

export const clearCache = (key: any) => {
  return appCache.del(key);
};
