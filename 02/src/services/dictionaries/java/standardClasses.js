/**
 * Standard Java classes from common packages
 */
const standardClasses = [
  // java.lang
  'String', 'Integer', 'Boolean', 'Byte', 'Short', 'Long', 'Float', 'Double', 'Character',
  'Object', 'Class', 'System', 'Runtime', 'Math', 'Thread', 'Runnable', 'Throwable',
  'Exception', 'Error', 'RuntimeException', 'StringBuilder', 'StringBuffer',
  'Enum', 'Iterable', 'Comparable', 'Number', 'Override', 'Deprecated',
  
  // java.util
  'ArrayList', 'LinkedList', 'HashMap', 'HashSet', 'TreeMap', 'TreeSet', 
  'List', 'Map', 'Set', 'Queue', 'Deque', 'Collection', 'Collections', 'Arrays',
  'Date', 'Calendar', 'Scanner', 'Random', 'UUID', 'Optional', 'Iterator',
  
  // java.io
  'File', 'FileInputStream', 'FileOutputStream', 'BufferedReader', 'BufferedWriter',
  'Reader', 'Writer', 'InputStream', 'OutputStream', 'IOException',
  
  // java.nio
  'Path', 'Paths', 'Files', 'ByteBuffer', 'Channel', 'FileChannel',
  
  // java.time
  'LocalDate', 'LocalTime', 'LocalDateTime', 'ZonedDateTime', 'Instant', 'Duration', 'Period',
  
  // javax.swing
  'JFrame', 'JPanel', 'JButton', 'JLabel', 'JTextField', 'JTable', 'JList',
  
  // java.awt
  'Frame', 'Panel', 'Button', 'Label', 'TextField', 'Color', 'Graphics'
];

module.exports = standardClasses;