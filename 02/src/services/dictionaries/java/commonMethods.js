/**
 * Common Java methods and their misspellings
 */
const commonMethods = {
  'println': ['print', 'printline', 'pintln', 'printn', 'pringln', 'pritln', 'printlns', 'prinln',
              'pritnln', 'pintln', 'printtln', 'printlin', 'prntln'],
              
  'length': ['lenght', 'lengt', 'lenth', 'lenghth', 'lngth', 'legnth', 'lentgh', 'lnegth', 
             'leength', 'lenggth', 'lenght'],
             
  'charAt': ['charat', 'charAT', 'chatat', 'chartat', 'cahrAt', 'chatAt', 'charA', 'charAtt'],
            
  'equals': ['equal', 'equalss', 'equls', 'eqals', 'equalz', 'equales', 'equalse', 'euqals'],
            
  'substring': ['subString', 'substr', 'substing', 'subsring', 'subtring', 'subsstring', 'subbstring',
                'sbustring', 'subtsring', 'substrig', 'substrng', 'subatring'],
                
  'toString': ['tostring', 'toStr', 'tooString', 'to_string', 'toStirng', 'tosting', 'tostriing',
               'tosString', 'ttoString', 'toStiring'],
               
  'indexOf': ['indexof', 'idexOf', 'indxOf', 'indexff', 'indexOff', 'indecOf', 'indesOf', 'indexov'],
             
  'parseInt': ['parseint', 'parselnt', 'parseINt', 'parsInt', 'prasInt', 'ParseInt', 'PARSEINT'],
              
  'toLowerCase': ['tolowercase', 'tolowecase', 'tolowecase', 'tolowrcase', 'tolowecase'],
                 
  'toUpperCase': ['touppercase', 'toupercase', 'toupercase', 'toupprcase', 'toupercase'],
                 
  'add': ['ad', 'addd', 'addItem', 'append', 'push', 'added'],
       
  'remove': ['remov', 'removee', 'delete', 'rmv', 'remve', 'removve', 'reemove'],
           
  'get': ['gt', 'gett', 'gat', 'git', 'fetch', 'retrieve'],
       
  'set': ['st', 'sett', 'sat', 'sit', 'setvalue', 'setVal', 'setValue'],
       
  'size': ['siz', 'sizee', 'length', 'count', 'getSize', 'getcount'],
        
  'contains': ['contain', 'containss', 'has', 'includes', 'hold', 'containsItem'],
             
  'iterator': ['itterator', 'iterrator', 'itrator', 'interator', 'iterrater'],
             
  'hasNext': ['hasnext', 'hasMoreElements', 'hasNextElement', 'hasNxt', 'hasmore'],
           
  'next': ['nxt', 'nextElement', 'getNext', 'nextItem', 'nextt']
};

// Object methods
const objectMethods = [
  'equals', 'hashCode', 'toString', 'clone', 'finalize', 'getClass', 'notify', 'notifyAll', 'wait'
];

// String methods
const stringMethods = [
  'charAt', 'codePointAt', 'codePointBefore', 'codePointCount', 'compareTo', 'compareToIgnoreCase',
  'concat', 'contains', 'contentEquals', 'endsWith', 'equals', 'equalsIgnoreCase', 'getBytes',
  'getChars', 'indexOf', 'isEmpty', 'lastIndexOf', 'length', 'matches', 'regionMatches',
  'replace', 'replaceAll', 'replaceFirst', 'split', 'startsWith', 'substring',
  'toCharArray', 'toLowerCase', 'toUpperCase', 'trim', 'strip', 'stripLeading', 'stripTrailing'
];

module.exports = {
  commonMethods,
  objectMethods,
  stringMethods
};