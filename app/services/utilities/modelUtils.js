'use strict';

class ModelUtils {
  standardizeArrayData (data) {
    if (!Array.isArray(data)) {
      return data;
    }

    return data.reduce((arr, item) => {
      if (item.id || item.createdAt) {
        arr.push(item);
      }

      return arr;
    }, []);
  }
}

module.exports = ModelUtils;
