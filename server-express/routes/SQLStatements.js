exports.insert = (obj, collection) => {
      const keysValues = Object.keys(obj).map(key => ({key, value: obj[key]}));
      return `INSERT INTO ${collection} (${
        keysValues.map(kv => kv.key).join(', ')
      }) VALUES (${
        keysValues.map(kv => "@" + kv.key).join(', ')
      })`;
  };

exports.update = (obj, collection, filter, exclude = []) => {
  const main = `UPDATE ${collection} SET ${
    Object.keys(obj)
      .filter(key => !exclude.includes(key))
      .map(key => `${key} = @${key}`)
      .join(", ")
  }`;
  return filter ? main + ` WHERE ${filter}` : main;
}

exports.delete = (collection, filter) => {
  const main = `DELETE FROM ${collection}`;
  return filter ? main + ` WHERE ${filter}` : main;
}