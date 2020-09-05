/***************************************************************************************
*    Title: eivindfjeldstad/dot
*    Author: Eivind Fjeldstad
*    Date: August 28, 2020
*    Code version: 1.0.3
*    Availability: https://github.com/eivindfjeldstad/dot
*
***************************************************************************************/
function isIntegerLike(prop) {
  return !isNaN(parseInt('' + prop, 10));
}

var dot = {
  name: 'Dot',

  /**
   * Set given `path`
   *
   * @param {Object} obj
   * @param {String} path
   * @param {Mixed} val
   * @return {Object}
   * @api public
   */
  set(obj, path, val) {
    const segs = path.split('.');
    const attr = segs.pop();
    const src = obj;
    let currentLayer = obj; // if (segs.includes('c')) debugger;

    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];

      if (isSafe(currentLayer, seg)) {
        if (Array.isArray(currentLayer) && isIntegerLike(seg)) {
          currentLayer[seg] = currentLayer[seg] || [];
          currentLayer = currentLayer[seg];
        } else {
          const overCurrent = currentLayer;
          overCurrent[seg] = overCurrent[seg] || {};
          currentLayer = overCurrent[seg];
        }
      } else {
        return src;
      }
    }

    if (attr !== null && attr !== undefined && isSafe(currentLayer, attr)) {
      if (Array.isArray(currentLayer) && isIntegerLike(attr)) {
        currentLayer[attr] = val;
      } else if (isObject(currentLayer)) {
        currentLayer[attr] = val;
      }
    }

    return src;
  },

  /**
   * Get given `path`
   *
   * @param {Object} obj
   * @param {String} path
   * @return {Mixed}
   * @api public
   */
  get(obj, path) {
    const segs = path.split('.');
    const attr = segs.pop();
    let currentLayer = obj;

    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];

      if (isSafe(currentLayer, seg)) {
        if (Array.isArray(currentLayer) && isIntegerLike(seg)) {
          currentLayer = currentLayer[seg];
        } else {
          const overCurrent = currentLayer;
          currentLayer = overCurrent[seg];
        }
      } else {
        return;
      }
    }

    if (attr !== null && attr !== undefined && isSafe(currentLayer, attr)) {
      if (Array.isArray(currentLayer) && isIntegerLike(attr)) {
        return currentLayer[attr];
      } else if (isObject(currentLayer)) {
        return currentLayer[attr];
      } else {
        return;
      }
    } else {
      return;
    }
  },

  /**
   * Delete given `path`
   *
   * @param {Object} obj
   * @param {String} path
   * @return {Mixed}
   * @api public
   */
  delete(obj, path) {
    const segs = path.split('.');
    const attr = segs.pop();
    let reObj = obj;

    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      if (!isRecord(reObj) || !reObj[seg]) return;

      if (isSafe(reObj, seg)) {
        reObj = reObj[seg];
      } else {
        return;
      }
    }

    if (attr === null || attr === undefined || !isSafe(reObj, attr)) return;

    if (Array.isArray(reObj)) {
      reObj.splice(parseInt(attr), 1);
    } else {
      delete reObj[attr];
    }
  }

};

function isSafe(obj, prop) {
  if (isObject(obj)) {
    return obj[prop] === undefined || hasOwnProperty(obj, prop);
  }

  if (Array.isArray(obj)) {
    return !isNaN(parseInt('' + prop, 10));
  }

  return false;
}

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function isRecord(obj) {
  return typeof obj === 'object' && obj !== null;
}

export default dot;
