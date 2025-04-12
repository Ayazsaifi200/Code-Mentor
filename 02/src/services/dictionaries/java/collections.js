/**
 * Java collection classes and interfaces
 */
const collectionInterfaces = [
  'Collection', 'List', 'Set', 'Queue', 'Deque', 'Map', 'SortedSet', 
  'NavigableSet', 'SortedMap', 'NavigableMap', 'BlockingQueue', 'BlockingDeque'
];

const collectionClasses = [
  'ArrayList', 'LinkedList', 'Vector', 'Stack', 'HashSet', 'LinkedHashSet',
  'TreeSet', 'HashMap', 'LinkedHashMap', 'TreeMap', 'PriorityQueue', 'ArrayDeque',
  'EnumSet', 'EnumMap', 'IdentityHashMap', 'WeakHashMap', 'ConcurrentHashMap',
  'CopyOnWriteArrayList', 'CopyOnWriteArraySet', 'ConcurrentLinkedQueue',
  'ConcurrentLinkedDeque', 'ConcurrentSkipListSet', 'ConcurrentSkipListMap'
];

const utilityClasses = [
  'Collections', 'Arrays', 'Comparator', 'Comparable', 'Iterator', 'ListIterator'
];

module.exports = { collectionInterfaces, collectionClasses, utilityClasses };