module.exports = ({name, action}) => ...args => ({
  name, args,
  execute: done => action(...args, done),
});

// module.exports = ({name, action}) => {
//   return ...args => {
//     const startAction = done => {
//       return action(...args, done);
//     }
//     startAction.actionName = name;
//
//     return startAction;
//   }
// };
