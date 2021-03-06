export const msgWrapper = (type, payload) => {
  return {
    type,
    payload,
  };
};

export const parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (ex) {
    return null;
  }
};

export const prettyJson = (obj) => JSON.stringify(obj, null, 2);
