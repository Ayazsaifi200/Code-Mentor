/**
 * Common Java keyword misspellings
 */
const keywordMisspellings = {
  'public': ['pubic', 'publik', 'publc', 'pulic', 'pulbic', 'pbulic', 'pblic', 'publci', 'puplic', 'oublic', 
             'bublic', 'piblic', 'publilc', 'pullic', 'puclic', 'pubkic', 'publick', 'Public', 'PUBLIC'],
             
  'private': ['privat', 'privte', 'privet', 'prvate', 'priviate', 'privatte', 'privete', 'privare',
              'privade', 'prevate', 'pravate', 'provate', 'pivate', 'rpivate', 'pirvate', 'prïvate'],
              
  'protected': ['protcted', 'protectd', 'proteced', 'proteted', 'proected', 'portected', 'protacted', 'pretected',
                'pritected', 'protekted', 'prottected', 'protexted', 'protcted', 'protetced', 'prtoected'],
                
  'static': ['statc', 'staic', 'sttic', 'statik', 'stattic', 'staatic', 'statiic', 'satic', 'stattic', 'Static',
             'STATIC', 'staitc', 'ststic', 'sattic', 'startc', 'statci', 'stativ', 'stacit'],
             
  'void': ['vid', 'vod', 'viod', 'voyd', 'voud', 'vioid', 'vold', 'vaid', 'voi', 'voide', 'Void', 'VOID'],
           
  'class': ['clas', 'clss', 'klass', 'classs', 'calss', 'claas', 'claess', 'clase', 'cass', 'classr', 'claas',
            'Class', 'CLASS', 'clazz', 'clsas', 'calss', 'classe', 'clss'],
            
  'extends': ['exteds', 'extens', 'xtends', 'extnds', 'extands', 'Extends', 'EXTENDS', 'exttends',
              'extebds', 'exteds', 'extendss', 'exdends', 'extensd'],
              
  'implements': ['implments', 'implemets', 'implemnts', 'implemens', 'inplements', 'impelments',
                 'implementts', 'implaments', 'iplements', 'inplements', 'implementx'],
                 
  'interface': ['intrface', 'interace', 'inteface', 'interfce', 'interrface', 'intreface', 'interfase',
                'iterface', 'intarface', 'interfcae', 'Interface', 'INTERFACE'],
                
  'return': ['retun', 'reutrn', 'retrun', 'retrn', 'rteurn', 'rturn', 'retunr', 'retutn', 'retur', 'ruturn'],
            
  'int': ['In', 'Int', 'inte', 'itn', 'INT', 'INt', 'iint', 'innt', 'intg', 'ont'],
          
  'double': ['doble', 'doubl', 'doubel', 'duble', 'doublee', 'doublle', 'doule', 'doulbe'],
            
  'boolean': ['booleen', 'boolea', 'boolan', 'bolean', 'booliean', 'boolen', 'boolan', 'bolian'],
             
  'String': ['string', 'Str', 'Stirng', 'Sring', 'Strig', 'Strng', 'Sting', 'Strign', 'Srting', 'Strnig'],
            
  'import': ['imprt', 'impot', 'improt', 'imort', 'iport', 'impurt', 'inport', 'impotr', 'Import', 'IMPORT'],
            
  'true': ['tru', 'ture', 'treu', 'ttrue', 'truu', 'True', 'TRUE', 'trure', 'truw', 'trye', 'rtue', 'treu'],
          
  'false': ['flase', 'fase', 'flse', 'fale', 'falase', 'fales', 'flase', 'flsae', 'faals', 'faulse'],
           
  'new': ['nw', 'ne', 'nwe', 'nev', 'neew', 'nee', 'mew', 'bew', 'NEW', 'New', 'nrw', 'nsw'],
         
  'if': ['If', 'IF', 'fi', 'iff', 'iif', 'uf', 'ic', 'ig', 'iv', 'ib'],
   
  'else': ['els', 'lese', 'esle', 'elze', 'eles', 'Else', 'ELSE', 'lse', 'ekse', 'epse'],
          
  'for': ['fro', 'foor', 'forr', 'fr', 'fo', 'fore', 'For', 'FOR', 'fir', 'fpr']
};

module.exports = keywordMisspellings;