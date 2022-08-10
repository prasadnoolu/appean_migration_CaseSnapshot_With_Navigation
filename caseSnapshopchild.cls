public with sharing class caseSnapshopchild {


        @AuraEnabled(cacheable=true)
        public static List<Case> getchildCases(
            String cat,
            String status,
            String typu

            
        ) {
            String query;
            String condition = (String.isNotBlank(cat)
                ? 'Sub_Category_Type__c LIKE \'' + '%' + cat + '%\''
                : '');
   
    
            condition += (String.isNotBlank(status)
                ? (String.isNotBlank(condition) ? +' AND ' : '') +
                  ' Status LIKE \'' +
                  '%' +
                  status +
                  '%\''
                : '');
    
            condition += (String.isNotBlank(typu)
                ? (String.isNotBlank(condition) ? +' AND ' : '') +
                  ' Case_Type__c LIKE \'' +
                  '%' +
                  typu +
                  '%\''
                : '');
    
    
            System.debug('condition ' + condition);
            if (String.isNotBlank(condition))
             {
                query =
                    'SELECT CaseNumber,Account.Name,Contact.Name,Case_Type__c,Sub_Category_Type__c,Status FROM Case  WHERE ' +
                    condition +
                    ' ORDER BY CaseNumber';
                    
    
            } 
            
            else
            {
                
                query='';
                
                
            }
    		System.debug(query);
            List<Case> records = Database.query(query);
            
                return records;
            
                 
            }
    
    
        
    }
