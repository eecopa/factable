const {
  excludeThisFunctionNode,
  wrapperOutputName,
  getAlowedNames,
  isFactableOn,
  getFunctionData,
  getRequireExpression,
  getFunctionCallExpression,
} = require("./common/utils");

module.exports = function ({ types: t }) {
  const FACTABLE_TRANSPILE = process.env.FACTABLE_TRANSPILE;
  if (FACTABLE_TRANSPILE !== "on") {
    return {};
  }

  const Visitor = {
    Function: {
      enter(path, state) {
        if (excludeThisFunctionNode(path, state)) {
          return;
        }

        const functionExpression = t.functionExpression(
          null,
          [],
          path.node.body,
          false,
          false
        );

        const wrapperCallExpression = t.callExpression(functionExpression, []);

        const newBodyBlock = t.blockStatement([
          t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier(wrapperOutputName),
              wrapperCallExpression
            ),
          ]),
          getFunctionCallExpression(getFunctionData(path)),
        ]);

        path.node.body = newBodyBlock;
      },
    },
  };

  const VisitorInitiator = {
    Program: {
      enter: (path) => {
        if (!isFactableOn(path)) return;

        const allowedNames = getAlowedNames(path);

        path.unshiftContainer("body", getRequireExpression());

        path.traverse(Visitor, {
          allowedNames,
        });
      },
    },
  };

  return {
    name: "babel-plugin-factable",
    visitor: VisitorInitiator,
  };
};