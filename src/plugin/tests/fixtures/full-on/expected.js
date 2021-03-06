"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportada = void 0;

const Evid = require("factable").evidencer;

const FactableEvidencer = new Evid({
  port: 6789
}).getInstance();
const johndoe = "yeahhh";

function originalFunc(param1, param2 = "default_value") {
  const output = function () {
    console.log("originalFunc called! ", param1, param2);
    return param1 + param2;
  }();

  FactableEvidencer.registerFunctionCall([param1, param2], output, {
    name: "originalFunc",
    params: ["param1", "param2"],
    filename: '',
    root: '/Users/dcomesana/proy/factable'
  });
  return output;
}

const originalFuncExpresada = (param1, param2) => param3 => {
  const output = function () {
    console.log("originalFuncExpresada called! ", param1, param2);
    return param1 + param2;
  }();

  FactableEvidencer.registerFunctionCall([param1, param2, param3], output, {
    name: "originalFuncExpresada",
    params: ["param1", "param2", "param3"],
    filename: '',
    root: '/Users/dcomesana/proy/factable'
  });
  return output;
};

const originalFuncExpresada2 = (param1, param2) => {
  const output = function () {
    return lala => otra => diego => {
      return lala;
    };
  }();

  FactableEvidencer.registerFunctionCall([param1, param2], output, {
    name: "originalFuncExpresada2",
    params: ["param1", "param2"],
    filename: '',
    root: '/Users/dcomesana/proy/factable'
  });
  return output;
};

const exprCurriada = lala => () => {
  const output = function () {
    return lala;
  }();

  FactableEvidencer.registerFunctionCall([lala], output, {
    name: "exprCurriada",
    params: ["lala"],
    filename: '',
    root: '/Users/dcomesana/proy/factable'
  });
  return output;
};

const exprCurriada2 = lala => otra => diego => {
  const output = function () {
    return lala;
  }();

  FactableEvidencer.registerFunctionCall([lala, otra, diego], output, {
    name: "exprCurriada2",
    params: ["lala", "otra", "diego"],
    filename: '',
    root: '/Users/dcomesana/proy/factable'
  });
  return output;
};

const exprEnroscada = lala => {
  const output = function () {
    return () => {
      return lala;
    };
  }();

  FactableEvidencer.registerFunctionCall([lala], output, {
    name: "exprEnroscada",
    params: ["lala"],
    filename: '',
    root: '/Users/dcomesana/proy/factable'
  });
  return output;
};

const resultDeAnonimQueSeAutoEjecuta = function () {
  const output = function () {
    return true;
  }();

  FactableEvidencer.registerFunctionCall([], output, {
    name: "resultDeAnonimQueSeAutoEjecuta",
    params: [],
    filename: '',
    root: '/Users/dcomesana/proy/factable'
  });
  return output;
}();

const exportada = (str1, str2) => arr => {
  const output = function () {
    console.log("arrayElementsWrapper called! ", str1, str2);
    return arr.map(elem => `${str1}${elem}${str2}`);
  }();

  FactableEvidencer.registerFunctionCall([str1, str2, arr], output, {
    name: "exportada",
    params: ["str1", "str2", "arr"],
    filename: '',
    root: '/Users/dcomesana/proy/factable'
  });
  return output;
};

exports.exportada = exportada;