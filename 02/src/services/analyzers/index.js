/**
 * Export all language analyzers from a single entry point
 */
const javaAnalyzer = require('./javaAnalyzer');
const javascriptAnalyzer = require('./javascriptAnalyzer');
const pythonAnalyzer = require('./pythonAnalyzer');

module.exports = {
  analyzeJava: javaAnalyzer.analyzeJava,
  detailedJavaAnalysis: javaAnalyzer.detailedAnalysis,
  analyzeJavaScript: javascriptAnalyzer.analyzeJavaScript, 
  analyzePython: pythonAnalyzer.analyzePython
};