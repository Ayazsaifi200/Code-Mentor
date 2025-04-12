/**
 * Common Java operator mistakes and patterns
 */
const operatorMistakes = [
  // Assignment vs Comparison
  { 
    pattern: /([a-zA-Z0-9_)\]"])=([a-zA-Z0-9_(["[])/, 
    message: 'Using = for comparison instead of ==',
    suggestion: 'Replace = with == for comparison'
  },
  
  // JavaScript style operators in Java
  { 
    pattern: /===/, 
    message: 'Using === instead of == (Java uses == for equality)',
    suggestion: 'Replace === with =='
  },
  { 
    pattern: /!==/, 
    message: 'Using !== instead of != (Java uses != for inequality)',
    suggestion: 'Replace !== with !='
  },
  
  // Missing spaces around operators
  { 
    pattern: /(\w+)==(\w+)/, 
    message: 'Missing spaces around == operator',
    suggestion: 'Add spaces around operators for better readability'
  },
  { 
    pattern: /(\w+)!=(\w+)/, 
    message: 'Missing spaces around != operator',
    suggestion: 'Add spaces around operators for better readability'
  },
  { 
    pattern: /(\w+)>=(\w+)/, 
    message: 'Missing spaces around >= operator',
    suggestion: 'Add spaces around operators for better readability'
  },
  { 
    pattern: /(\w+)<=(\w+)/, 
    message: 'Missing spaces around <= operator',
    suggestion: 'Add spaces around operators for better readability'
  },
  
  // Logical operators
  { 
    pattern: /([^&])&([^&])/, 
    message: 'Using & instead of && for logical AND',
    suggestion: 'Use && for logical AND operations'
  },
  { 
    pattern: /([^|])\|([^|])/, 
    message: 'Using | instead of || for logical OR',
    suggestion: 'Use || for logical OR operations'
  },
  
  // Common math operator errors
  { 
    pattern: /(\w+)\+\+\+(\w+)/, 
    message: 'Invalid increment +++ operator',
    suggestion: 'Use either ++ for increment or + for addition'
  },
  { 
    pattern: /(\w+)\-\-\-(\w+)/, 
    message: 'Invalid decrement --- operator',
    suggestion: 'Use either -- for decrement or - for subtraction'
  },
  
  // Unicode vs ASCII confusion
  { 
    pattern: /−/, 
    message: 'Using Unicode minus sign instead of ASCII hyphen',
    suggestion: 'Replace with standard ASCII - character'
  },
  { 
    pattern: /'/, 
    message: 'Using curly quote instead of straight quote',
    suggestion: "Replace with standard ASCII ' character"
  },
  { 
    pattern: /"/, 
    message: 'Using curly double quote instead of straight double quote',
    suggestion: 'Replace with standard ASCII " character'
  },
  
  // Assignment operator spacing
  { 
    pattern: /(\w+)\s*=\s*=\s*(\w+)/, 
    message: 'Invalid operator = = (should be ==)',
    suggestion: 'Remove the space between = characters to form =='
  },
  
  // Unary operator spacing issues
  {
    pattern: /(\w+) \+\+/, 
    message: 'Space before postfix increment operator',
    suggestion: 'Remove space before ++ operator'
  },
  {
    pattern: /(\w+) \-\-/, 
    message: 'Space before postfix decrement operator',
    suggestion: 'Remove space before -- operator'
  },
  
  // Conditional operator issues
  {
    pattern: /\?{2,}/, 
    message: 'Multiple ? operators in a row',
    suggestion: 'Check if you meant to use the ternary operator ? :'
  },
  {
    pattern: /:{2,}/, 
    message: 'Multiple : operators in a row',
    suggestion: 'Check syntax of your conditional expression'
  }
];

module.exports = operatorMistakes;