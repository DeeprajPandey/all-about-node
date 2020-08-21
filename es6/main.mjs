import { sayHi } from './util';

sayHi();


// import { sayHi as hi } from './util';

// hi();


//-----------------------------------


// When sayHi is exported as default
// import sayHi from './util';

// sayHi();

// Note: If you want node to process ES6 without the experimental-modules
// flag (and for .js instead of .mjs files - you should prefer .mjs if you
// are creating a module for reasons here: https://v8.dev/features/modules#mjs)
// then use a transpiler like Babel or switch to TypeScript. :p