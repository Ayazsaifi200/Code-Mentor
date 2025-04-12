/**
 * Java annotations and their usage patterns
 */
const standardAnnotations = [
  '@Override', '@Deprecated', '@SuppressWarnings', '@SafeVarargs', '@FunctionalInterface',
  '@Target', '@Retention', '@Documented', '@Inherited', '@Repeatable',
  '@Generated'
];

const commonExternalAnnotations = [
  // JUnit
  '@Test', '@Before', '@After', '@BeforeClass', '@AfterClass', '@Ignore',
  // Spring
  '@Component', '@Service', '@Repository', '@Controller', '@RestController',
  '@Autowired', '@Qualifier', '@Value', '@Bean', '@Configuration',
  '@RequestMapping', '@GetMapping', '@PostMapping', '@PutMapping', '@DeleteMapping',
  // Lombok
  '@Data', '@Getter', '@Setter', '@NoArgsConstructor', '@AllArgsConstructor',
  '@Builder', '@ToString', '@EqualsAndHashCode', '@Slf4j',
  // Jakarta/Java EE
  '@Entity', '@Table', '@Id', '@Column', '@ManyToOne', '@OneToMany',
  '@ManyToMany', '@OneToOne', '@JoinColumn', '@Transactional'
];

const annotationMisspellings = {
  '@Override': ['@override', '@Overide', '@Overrride', '@Overrid', '@OverRide'],
  '@Deprecated': ['@deprecated', '@Depracated', '@Depricated', '@Depreciated', '@Deprected'],
  '@SuppressWarnings': ['@SuppresWarnings', '@SupressWarnings', '@SuppressWarning', '@SuppressWarrnings'],
  '@Test': ['@test', '@Testt', '@Tets', '@Tst'],
  '@Autowired': ['@autowired', '@AutoWired', '@Autowiered', '@Autowire'],
  '@Service': ['@service', '@Srevice', '@Servce'],
  '@Entity': ['@entity', '@Entitiy', '@Entityy', '@Entty']
};

module.exports = {
  standardAnnotations,
  commonExternalAnnotations,
  annotationMisspellings
};