import { LightningElement, wire, api, track } from "lwc";
import getchildCases from "@salesforce/apex/caseSnapshopchild.getchildCases";
import { NavigationMixin } from "lightning/navigation";
import { refreshApex } from "@salesforce/apex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CasescreenshotchildLWC extends NavigationMixin(LightningElement) 
{
    @track cols=[

        { label: 'Case Number',fieldName: "RecordIds",  
        type: "url",  
        typeAttributes: { label: { fieldName: "CaseNumber" }, tooltip:"Casenumber", target: "_blank" }  
       },
        { label: 'Account Name', fieldName: 'Account.Name',sortable: "true" },
        { label: 'Contact', fieldName: 'Contact.Name',sortable: "true" },
        { label: 'Case Type', fieldName: 'Case_Type__c',sortable: "true" },
        { label: 'Sub catergory', fieldName: 'Sub_Category_Type__c',sortable: "true" },
        { label: 'Status', fieldName: 'Status' ,sortable: "true"}    
    
    ];
    // Parent to child communication purpose
    @track len;
    @track a='';
    @track errorMsg = '';
    @track data;
    @track count=0;
    wiredchildCases;
    @track rcount=0;
    @api cat = null;
    @api status = null;
    @api typu=null;
    @api rst=false;
    @api clr;
    // pagination
    @track vpagesize='10';
    @track startingRecord = 0;
    @track page=1;
    @track endingRecord;
    @track totalRecordCount;
    @track totalPage=0;
    @track pageSize;
    @track items;

    get comboBoxOptions() {
        var pageLimitList = [
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '20', value: '20' },
            { label: '30', value: '30' },
            { label: '50', value: '50' },
            { label: '100', value: '100' }

        ];
        return pageLimitList;
    }

    

 

    
    @wire(getchildCases, {

        cat: "$cat",
        status: "$status",
        typu: "$typu"

        
    })
    

    wiredSObjects(result) {
        console.log("wire getting called");
        this.wiredCases = result;
        
        if (result.data) {
            this.len=result.data.length;
            //this is for simple lightning data table
            //this.data=result.data;
            this.pageSize=this.vpagesize;
            this.items = result.data;
            this.totalRecordCount = result.data.length;
            this.totalPage = Math.ceil(this.totalRecordCount/this.pageSize);
            this.count=this.count+1;

           this.a=result.data.toString();
           if(this.a)
           {
            this.errorMsg='';
            this.vpagesize='10';
            if(this.rcount!=this.count)
            {
                this.page=1;
                this.vpagesize='10';
                this.pageSize=this.vpagesize;
                this.startingRecord=1;
                this.displayRecordPerPage(this.page);
                this.rcount=this.count;
            }
            
           }
           else
           {
            this.data = this.items.slice(0,0);
            this.errorMsg="NO CASE RECORDS FOUND";

           }
            



        }
        

    }

    handleRowAction(event){
        const dataRow = event.detail.row;
        window.console.log('dataRow@@ ' + dataRow);
        this.contactRow=dataRow;
        window.console.log('contactRow## ' + dataRow);
        this.modalContainer=true;
     }
   
    handleSortdata(event) {
        // field name
        this.sortBy = event.detail.fieldName;

        // sort direction
        this.sortDirection = event.detail.sortDirection;

        // calling sortdata function to sort the data based on direction and selected field
        this.sortData(event.detail.fieldName, event.detail.sortDirection);
    }
    sortData(fieldname, direction) 
    {
        // serialize the data before calling sort function
        let parseData = JSON.parse(JSON.stringify(this.data));

        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };

        // cheking reverse direction 
        let isReverse = direction === 'asc' ? 1: -1;

        // sorting data 
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';

            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });

        // set the sorted data to data table data
        this.data = parseData;

    }
    

    handleLimitChange(event){
        this.page=1;
        this.vpagesize=event.target.value;
        this.pageSize=this.vpagesize;
        //this.endingRecord=this.vpagesize;
        this.startingRecord=1;
        this.displayRecordPerPage(this.page);
        this.totalPage = Math.ceil(this.totalRecordCount/this.pageSize);

    }



    previousHandler(event){

        console.log("Previous button is working");
        if(this.page > 1){
            this.page = this.page - 1;
            this.displayRecordPerPage(this.page);
        }
        
    }

    nextHandler(event){
        
        console.log("Next button is working");
        if(this.page < this.totalPage && this.page != this.totalPage){
            this.page = this.page + 1;
            this.displayRecordPerPage(this.page);
        } 
    }

    displayRecordPerPage(page){
        //this.startingRecord = (page-1)*this.vpagesize;
        //this.endingRecord = page * this.vpagesize;

        this.startingRecord = (page-1)*this.pageSize;
        this.endingRecord = page * this.pageSize;
        this.endingRecord = (this.endingRecord > this.totalRecordCount)?this.totalRecordCount:this.endingRecord;
        this.data = this.items.slice(this.startingRecord,this.endingRecord);
        //this.data.forEach(item => item['Case_Number'] = '/lightning/r/Case/500Iw000001nyi0IAA/view');
        if(this.data)
        {
        var tempOppList = [];  
        for (var i = 0; i < this.data.length; i++) {  
        let tempRecord = Object.assign({}, this.data[i]); //cloning object  
        tempRecord.RecordIds = "/" + tempRecord.Id;  
        tempOppList.push(tempRecord);  
        }
        }  
        this.data = tempOppList; 
        //alert(this.data.CaseNumber);
        this.startingRecord = this.startingRecord + 1; 
        
        
    }
    
 
    handleNavigate(event) {
        event.preventDefault();
        this[NavigationMixin.Navigate]({
            type: "standard__recordPage",
            attributes: {
                actionName: "view",
                recordId: event.target.dataset.id
                
            }
        });

        
    }


    
    
}
