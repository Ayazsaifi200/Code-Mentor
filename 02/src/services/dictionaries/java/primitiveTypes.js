/**
 * Java primitive types and their wrapper classes
 */
const primitiveTypes = new Set([
  'byte', 'short', 'int', 'long', 'float', 'double', 'boolean', 'char', 'void'
]);

const wrapperClasses = {
  'byte': 'Byte',
  'short': 'Short',
  'int': 'Integer',
  'long': 'Long',
  'float': 'Float',
  'double': 'Double',
  'boolean': 'Boolean',
  'char': 'Character',
  'void': 'Void'
};

const typeMappings = {
  'integer': 'int',
  'character': 'char',
  'bool': 'boolean',
  'string': 'String',
  'decimal': 'double',
  'number': 'int',
  'real': 'float'
};

module.exports = { primitiveTypes, wrapperClasses, typeMappings };