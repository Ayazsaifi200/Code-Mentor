/**
 * Common Java identifiers and their misspellings
 */
const commonIdentifiers = {
  'System': ['Sistem', 'Sytem', 'system', 'Systemm', 'Systemout', 'Systm', 'SSytem', 'Systeem', 'Siystem',
             'Zystem', 'Sustem', 'Sistam', 'Systim', 'Systom'],
             
  'out': ['ot', 'output', 'Out', 'outt', 'oout', 'uot', 'oute', 'otu', 'outut', 'oot', 'ouy', 'ou', 'ut',
          'OUT', 'our', 'aut', 'pout', 'lout'],
          
  'println': ['print', 'printline', 'pintln', 'printn', 'pringln', 'printLn', 'prntln', 'pritnln', 'prtln',
              'pritln', 'printls', 'printlin', 'printl', 'prntln'],
              
  'print': ['prin', 'primt', 'prit', 'pnt', 'prnt', 'ptint', 'primnt', 'pirnt', 'rprint', 'prrint', 'pront'],
           
  'main': ['man', 'mian', 'maine', 'mainn', 'mein', 'mann', 'mani', 'mian', 'mani', 'Main', 'MAIN', 'mamin',
           'min', 'mai', 'mmain', 'maiin', 'maih', 'maibn'],
           
  'String': ['string', 'Str', 'Stirng', 'Sring', 'Strig', 'Strng', 'Sting', 'Strign', 'Srting', 'Strnig'],
           
  'args': ['arg', 'arguments', 'argv', 'params', 'parameters', 'arg', 'arggs', 'argss', 'ags'],
         
  'length': ['len', 'lenght', 'lenth', 'lenght', 'lnegth', 'lentgh', 'size', 'count'],
           
  'Scanner': ['scanner', 'Scaner', 'Scannar', 'Scanr', 'Scannner', 'Scannier'],
           
  'ArrayList': ['arraylist', 'ArrayLst', 'ArayList', 'ArrayListe', 'ArrList'],
             
  'HashMap': ['hashmap', 'HashMapp', 'HasMap', 'HMap', 'Hashmap']
};

// Common variable name patterns
const commonVariablePatterns = {
  // Loop variables
  loop: ['i', 'j', 'k', 'n', 'index', 'idx', 'counter', 'cnt'],
  // Temporary variables
  temp: ['temp', 'tmp', 'tmpVar', 'tempVar'],
  // String variables
  string: ['str', 'text', 'txt', 'name', 'label'],
  // Integer variables
  integer: ['num', 'count', 'size', 'len', 'total', 'sum'],
  // Boolean variables
  boolean: ['flag', 'isValid', 'hasMore', 'found', 'done', 'ready', 'complete', 'success'],
  // Collection variables
  collection: ['list', 'array', 'arr', 'map', 'set', 'items', 'elements', 'values', 'data'],
  // Object variables
  object: ['obj', 'instance', 'item', 'element', 'entry', 'record', 'node'],
  // Result variables
  result: ['result', 'res', 'output', 'response', 'answer', 'solution']
};

module.exports = { commonIdentifiers, commonVariablePatterns };