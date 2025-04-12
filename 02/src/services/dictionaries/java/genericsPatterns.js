/**
 * Java generics patterns and common errors
 */
const genericsPatterns = {
  // Common generic type declarations
  declarations: [
    { pattern: /List<(\w+)>/, usage: 'List of type' },
    { pattern: /Map<(\w+),\s*(\w+)>/, usage: 'Map with key and value types' },
    { pattern: /Set<(\w+)>/, usage: 'Set of type' },
    { pattern: /Optional<(\w+)>/, usage: 'Optional containing type' }
  ],
  
  // Common generics errors
  errors: [
    // Raw type usage
    { 
      pattern: /\bnew\s+(ArrayList|LinkedList|HashMap|HashSet|TreeMap|TreeSet)\s*\(\s*\)</, 
      message: 'Using raw type instead of generic type',
      suggestion: 'Specify the type parameter, e.g., new ArrayList<String>()'
    },
    
    // Unchecked cast
    {
      pattern: /\(\s*List<(\w+)>\s*\)\s*(\w+)/, 
      message: 'Unchecked cast with generic types',
      suggestion: 'Use proper parameterization or consider using instanceof with type checking'
    },
    
    // Array of generic type
    {
      pattern: /(\w+)<(\w+)>\[\]/, 
      message: 'Cannot create arrays of parameterized types',
      suggestion: 'Use List<Type> instead of Type<T>[]'
    },
    
    // Primitive type in generics
    {
      pattern: /<\s*(int|boolean|char|byte|short|long|float|double)\s*>/, 
      message: 'Cannot use primitive type in generics',
      suggestion: 'Use wrapper class instead, e.g., Integer instead of int'
    }
  ],
  
  // Common generic method patterns
  methods: [
    {
      pattern: /<T>\s+T\s+\w+\s*\(/, 
      usage: 'Generic method declaration',
      example: '<T> T getValue(Class<T> type)'
    },
    {
      pattern: /<T\s+extends\s+(\w+)>\s+T\s+\w+\s*\(/, 
      usage: 'Bounded generic method',
      example: '<T extends Number> T max(T a, T b)'
    }
  ],
  
  // Wildcard patterns
  wildcards: [
    {
      pattern: /<\?\s+extends\s+(\w+)>/, 
      usage: 'Upper bounded wildcard',
      example: 'List<? extends Number>'
    },
    {
      pattern: /<\?\s+super\s+(\w+)>/, 
      usage: 'Lower bounded wildcard',
      example: 'List<? super Integer>'
    },
    {
      pattern: /<\?>/, 
      usage: 'Unbounded wildcard',
      example: 'List<?>'
    }
  ],
  
  // Generic naming conventions
  namingConventions: [
    { 
      convention: 'T', 
      usage: 'Type parameter (general)'
    },
    {
      convention: 'E', 
      usage: 'Element type (for collections)'
    },
    {
      convention: 'K', 
      usage: 'Key type (for maps)'
    },
    {
      convention: 'V', 
      usage: 'Value type (for maps)'
    },
    {
      convention: 'N', 
      usage: 'Number'
    },
    {
      convention: 'S', 
      usage: 'String type'
    }
  ]
};

module.exports = genericsPatterns;