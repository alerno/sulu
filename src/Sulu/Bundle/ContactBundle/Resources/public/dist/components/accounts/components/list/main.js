define(["mvc/relationalstore","app-config"],function(a,b){"use strict";var c=function(){this.sandbox.on("husky.datagrid.item.click",function(a){this.sandbox.emit("sulu.contacts.accounts.load",a)},this),this.sandbox.on("sulu.list-toolbar.delete",function(){this.sandbox.emit("husky.datagrid.items.get-selected",function(a){this.sandbox.emit("sulu.contacts.accounts.delete",a)}.bind(this))},this),this.sandbox.on("sulu.list-toolbar.add",function(){this.sandbox.emit("sulu.contacts.accounts.new")},this)},d=function(a){this.sandbox.emit("sulu.contacts.accounts.new",a)};return{view:!0,templates:["/admin/contact/template/account/list"],initialize:function(){this.render(),c.call(this)},render:function(){a.reset(),this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/contact/template/account/list"));var c=b.getSection("sulu-contact").accountTypes;this.sandbox.start([{name:"tabs@husky",options:{el:"#filter-tabs",callback:function(a){var b="",c="";"all"!==a.id&&(c="type",b=a.id),this.sandbox.emit("husky.datagrid.data.search",b,c)},data:{items:[{id:"all",title:this.sandbox.translate("public.all")},{id:c[1].id,title:this.sandbox.translate(c[1].translation)},{id:c[2].id,title:this.sandbox.translate(c[2].translation)},{id:c[3].id,title:this.sandbox.translate(c[3].translation)}]}}}]),this.sandbox.sulu.initListToolbarAndList.call(this,"accountsFields","/admin/api/accounts/fields",{el:"#list-toolbar-container",instanceName:"accounts",parentTemplate:"default",template:function(){return[{id:"add",icon:"circle-plus","class":"highlight",title:this.sandbox.translate("sulu.list-toolbar.add"),items:[{id:"add-lead",title:this.sandbox.translate("contact.account.add-lead"),callback:d.bind(this,"lead")},{id:"add-customer",title:this.sandbox.translate("contact.account.add-customer"),callback:d.bind(this,"customer")},{id:"add-supplier",title:this.sandbox.translate("contact.account.add-supplier"),callback:d.bind(this,"supplier")}],callback:function(){this.sandbox.emit("sulu.list-toolbar.add")}.bind(this)}]}},{el:this.sandbox.dom.find("#companies-list",this.$el),url:"/admin/api/accounts?flat=true",sortable:!0,selectItem:{type:"checkbox"}})}}});