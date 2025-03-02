"use strict";(self.webpackChunkmain_app=self.webpackChunkmain_app||[]).push([[476],{3799:(O,p,t)=>{t.d(p,{L:()=>C});var u=t(5351),f=t(1669),s=t(9213),_=t(5596),g=t(5911),E=t(6354),h=t(6697),c=t(9417),e=t(4438),b=t(2275);function D(d,M){if(1&d){const l=e.RV6();e.j41(0,"softbar-app-dynamic-form-group",4),e.bIt("formOnSubmit",function(a){e.eBV(l);const n=e.XpG();return e.Njj(n.formOnSubmit(a))})("formOnCancel",function(){e.eBV(l);const a=e.XpG();return e.Njj(a.close())}),e.k0s()}if(2&d){const l=e.XpG();e.Y8G("hideSubmitButton","Show"===(null==l.data?null:l.data.type))("config",l.configs)("showCancelButton",!0)}}let C=(()=>{class d{constructor(l,r,a){switch(this.data=l,this.studentLocalStorageService=r,this.dialogRef=a,this.configs=[{field:"id",type:"Default",label:"Id",asyncValidation:[],errorMessages:{required:"ID is required",min:"ID must be a positive number"},data:{inputType:"number"}},{field:"studentId",type:"FormSelect",label:"Student",validation:[c.k0.required],errorMessages:{required:"Student is required"},data:{options:this.studentLocalStorageService.getCollection("student").pipe((0,E.T)(n=>n?.map(i=>({label:i?.name,value:i?.id}))))}},{field:"grade",type:"Default",label:"Grade",validation:[c.k0.required,c.k0.min(0),c.k0.max(100)],errorMessages:{required:"Grade is required",min:"Grade must be at least 0",max:"Grade cannot exceed 100"},data:{inputType:"number"}},{field:"subject",type:"Default",label:"Subject",validation:[c.k0.required],errorMessages:{required:"Subject is required"},data:{inputType:"text"}},{field:"date",type:"Default",label:"Date",validation:[c.k0.required],errorMessages:{required:"Date is required"},data:{inputType:"date"}}],this.data?.type){case"Edit":case"Show":case"Duplicate":{const{configs:n}=this;this.configs=[],this.studentLocalStorageService.get("exam",{params:{id:this.data?.id}}).pipe((0,h.s)(1)).subscribe(i=>{switch(n.forEach(o=>{Object.prototype.hasOwnProperty.call(i,o.field)&&(o.value=i[o.field])}),this.data.type){case"Edit":n.find(o=>"id"===o?.field).disabled=!0,this.configs=n;break;case"Show":n.forEach(o=>o.disabled=!0),this.configs=n;break;case"Duplicate":this.configs=n.filter(o=>"id"!=o.field)}});break}case"Create":{const n=this.configs.find(i=>"id"===i?.field);n.hidden=!0,n.disabled=!0}}}formOnSubmit(l){switch(this.data.type){case"Duplicate":case"Create":case"Edit":("Edit"===this.data.type?this.studentLocalStorageService.put:this.studentLocalStorageService.post).bind(this.studentLocalStorageService)("exam",l).pipe().subscribe(r=>{r&&this.close()})}}close(){return this.dialogRef.close()}static{this.\u0275fac=function(r){return new(r||d)(e.rXU(u.Vh),e.rXU(b.V),e.rXU(u.CP))}}static{this.\u0275cmp=e.VBU({type:d,selectors:[["ng-component"]],decls:8,vars:2,consts:[[1,"header-card","!m-0"],["color","primary",1,"header-toolbar"],[1,"form-container"],[3,"hideSubmitButton","config","showCancelButton"],[3,"formOnSubmit","formOnCancel","hideSubmitButton","config","showCancelButton"]],template:function(r,a){1&r&&(e.j41(0,"mat-card",0)(1,"mat-toolbar",1)(2,"mat-icon"),e.EFF(3,"assignment"),e.k0s(),e.j41(4,"span"),e.EFF(5),e.k0s()(),e.j41(6,"div",2),e.DNE(7,D,1,3,"softbar-app-dynamic-form-group",3),e.k0s()()),2&r&&(e.R7$(5),e.JRh(null==a.data?null:a.data.type),e.R7$(2),e.vxM(null!=a.configs&&a.configs.length?7:-1))},dependencies:[u.hM,f.QC,s.An,_.RN,g.KQ],styles:[".header-card[_ngcontent-%COMP%]{padding:20px;margin-bottom:20px;box-shadow:0 4px 10px #0000001a}.header-toolbar[_ngcontent-%COMP%]{display:flex;align-items:center;font-size:1.5rem;font-weight:700}.header-toolbar[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{margin-right:10px}.form-container[_ngcontent-%COMP%]{margin-top:20px}"]})}}return d})()},6476:(O,p,t)=>{t.r(p),t.d(p,{DataComponent:()=>M});var u=t(177),f=t(5596),s=t(2792),_=t(3799),g=t(9213),E=t(5245),h=t(6697),c=t(8834),e=t(4438),b=t(5351),D=t(2275),C=t(8147);function d(l,r){if(1&l){const a=e.RV6();e.j41(0,"softbar-app-table-paging",10),e.nI1(1,"async"),e.bIt("pageChange",function(i){e.eBV(a);const o=e.XpG();return e.Njj(o.firePage(i))}),e.k0s()}if(2&l){let a;const n=e.XpG();e.Y8G("pageSize",n.pageSize)("pageNum",((null==(a=e.bMT(1,3,n.lazyEvent))?null:a.pageNum)||0)+1)("totalRecords",n.totalRecords)}}let M=(()=>{class l extends s.Px{getLazyEvent(){return this.lazyEvent}ngOnInit(){const a=history.state?.filter;a&&this.lazyEvent.pipe((0,E.i)(1),(0,h.s)(1)).subscribe(()=>{requestAnimationFrame(()=>{this.fireFilter(a)})})}getDataProvider(a){return this.examLocalStorageService.getCollectionLazyLoad("exam",a)}constructor(a,n,i){super(),this.dialog=a,this.examLocalStorageService=n,this.class=((o="h-full")=>o)(),this.pageSize=10,this.filters=[{label:"ID",key:"id",type:"number",filterType:"freeText",matchModes:[{label:"Equals (=)",matchMode:s.V8.Equals},{label:"Less Than (>)",matchMode:s.V8.LessThan},{label:"Less Than Or Equals (>=)",matchMode:s.V8.LessThanOrEquals},{label:"Greater Than (<)",matchMode:s.V8.GreaterThan},{label:"Greater Than Or Equals (=<)",matchMode:s.V8.GreaterThanOrEquals},{label:"Contains",matchMode:s.V8.Contains},{label:"None",matchMode:void 0}]},{label:"Date",key:"date",type:"date",filterType:"freeText",matchModes:[{label:"Equals (=)",matchMode:s.V8.Equals},{label:"Before Than (>)",matchMode:s.V8.Before},{label:"Before Than Or Equals (>=)",matchMode:s.V8.BeforeOrEquals},{label:"After Than (<)",matchMode:s.V8.After},{label:"After Than Or Equals (=<)",matchMode:s.V8.EqualsOrAfter},{label:"None",matchMode:void 0}]}],this.filterLocalStorageKey="page-data-table-filters",this.columns=[{field:"id",type:"Default",label:"ID"},{field:"studentId",type:"Default",label:"Name",parsedData:o=>this.students?.find(m=>m?.id===o)?.name},{field:"date",label:"Date",type:"Date"},{field:"grade",label:"Grade",type:"Default"},{field:"subject",label:"Subject",type:"Default"},{field:"id",label:"Test Actions",type:"DynamicLazy",loadCustomCellComponent:({calBack:o})=>t.e(854).then(t.bind(t,7854)).then(m=>o({component:m.ExamActionCellComponent}))},{field:"studentId",label:"Student Actions",type:"DynamicLazy",loadCustomCellComponent:({calBack:o})=>t.e(76).then(t.bind(t,4828)).then(m=>o({component:m.StudentActionCellComponent}))}],i.getCollection("student").pipe((0,h.s)(1)).subscribe(o=>this.students=o),this.lazyEvent.next({pageNum:0,pageSize:this.pageSize})}openPopUp(a){this.dialog.open(_.L,{data:{id:void 0,type:a},width:"500px"})}firePage({pageNum:a}){this.lazyEvent?.next({...this.lazyEvent.value,pageNum:a-1})}fireFilter(a){this.lazyEvent?.next({...this.lazyEvent.value,filters:[a],pageNum:0})}static{this.\u0275fac=function(n){return new(n||l)(e.rXU(b.bZ),e.rXU(D.V),e.rXU(C.b))}}static{this.\u0275cmp=e.VBU({type:l,selectors:[["softbar-home"]],hostVars:2,hostBindings:function(n,i){2&n&&e.HbH(i.class)},features:[e.Vt3],decls:17,vars:8,consts:[["tc",""],[1,"table-card","h-full","!m-0","p-7"],[1,"flex","justify-between"],[1,"py-4"],[1,"flex","pb-2","justify-between","items-center"],["showResetFilters","Show All",3,"filterChange","saveStorageId","filters"],[1,"h-[3em]","flex","items-center","gap-2","px-4","py-2","border","border-gray-300","bg-blue-600","text-white","hover:bg-blue-700","transition","duration-200","shadow-md","rounded-lg",3,"click"],[1,"font-medium"],[3,"columns","items","loading","loadingRowsLength"],[1,"flex","print:hidden",3,"pageSize","pageNum","totalRecords"],[1,"flex","print:hidden",3,"pageChange","pageSize","pageNum","totalRecords"]],template:function(n,i){if(1&n){const o=e.RV6();e.j41(0,"mat-card",1)(1,"div",2)(2,"mat-card-title")(3,"h1"),e.EFF(4,"Trainee Data"),e.k0s()()(),e.j41(5,"h2",3),e.EFF(6,"Filters"),e.k0s(),e.j41(7,"div",4)(8,"softbar-app-table-filters",5),e.bIt("filterChange",function(v){return e.eBV(o),e.Njj(i.fireFilter(v))}),e.k0s(),e.j41(9,"button",6),e.bIt("click",function(){return e.eBV(o),e.Njj(i.openPopUp("Create"))}),e.j41(10,"mat-icon"),e.EFF(11,"add"),e.k0s(),e.j41(12,"span",7),e.EFF(13,"Add"),e.k0s()()(),e.nrm(14,"softbar-app-table",8,0),e.DNE(16,d,2,5,"softbar-app-table-paging",9),e.k0s()}2&n&&(e.R7$(8),e.Y8G("saveStorageId",i.filterLocalStorageKey)("filters",i.filters),e.R7$(6),e.Y8G("columns",i.columns)("items",i.items)("loading",i.loading)("loadingRowsLength",i.pageSize)("columns",i.columns),e.R7$(2),e.vxM(null!=i.items&&i.items.length?16:-1))},dependencies:[f.RN,f.dh,s.Or,u.Jj,g.An,s.yv,s.hq,c.Hl],encapsulation:2})}}return l})()}}]);