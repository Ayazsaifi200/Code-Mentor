/**
 * Exports all Java dictionaries for use in the Java analyzer
 */
const keywords = require('./keywords');
const primitiveTypes = require('./primitiveTypes');
const keywordMisspellings = require('./keywordMisspellings');
const standardClasses = require('./standardClasses');
const collections = require('./collections');
const commonMethods = require('./commonMethods');
const commonIdentifiers = require('./commonIdentifiers');
const annotations = require('./annotations');
const syntaxPatterns = require('./syntaxPatterns');
const genericsPatterns = require('./genericsPatterns');
const operatorMistakes = require('./operatorMistakes');

// Create a combined set of all Java terms for checking
const allJavaTerms = [
  ...keywords,
  ...standardClasses,
  ...Object.keys(commonMethods),
  ...Object.keys(commonIdentifiers)
];

// Create dictionaries object for comprehensive spell checking
const javaDictionaries = {
  keywords,
  primitiveTypes,
  standardClasses,
  collections: collections.collectionClasses,
  methods: Object.keys(commonMethods),
  identifiers: Object.keys(commonIdentifiers)
};

module.exports = {
  keywords,
  primitiveTypes,
  keywordMisspellings,
  standardClasses,
  collections,
  commonMethods,
  commonIdentifiers,
  annotations,
  syntaxPatterns,
  genericsPatterns,
  operatorMistakes,
  allJavaTerms,
  javaDictionaries
};