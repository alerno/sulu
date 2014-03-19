define(["sulucontact/model/account"],function(a){"use strict";return{initialize:function(){if(this.bindCustomEvents(),"list"===this.options.display)this.renderList();else{if("form"!==this.options.display)throw"display type wrong";this.renderForm()}},bindCustomEvents:function(){this.sandbox.on("sulu.contacts.account.delete",function(){this.del()},this),this.sandbox.on("sulu.contacts.accounts.save",function(a){this.save(a)},this),this.sandbox.on("sulu.contacts.accounts.load",function(a){this.load(a)},this),this.sandbox.on("sulu.contacts.accounts.new",function(a){this.add(a)},this),this.sandbox.on("sulu.contacts.accounts.delete",function(a){this.delAccounts(a)},this),this.sandbox.on("sulu.contacts.accounts.list",function(){this.sandbox.emit("sulu.router.navigate","contacts/accounts")},this)},del:function(){this.confirmSingleDeleteDialog(function(a,b){a&&(this.sandbox.emit("sulu.edit-toolbar.content.item.loading","options-button"),this.account.destroy({data:{removeContacts:!!b},processData:!0,success:function(){this.sandbox.emit("sulu.router.navigate","contacts/accounts")}.bind(this)}))}.bind(this),this.options.id)},save:function(a){this.sandbox.emit("sulu.edit-toolbar.content.item.loading","save-button"),this.account.set(a),this.account.save(null,{success:function(b){var c=b.toJSON();a.id?this.sandbox.emit("sulu.contacts.accounts.saved",c.id):this.sandbox.emit("sulu.router.navigate","contacts/accounts/edit:"+c.id+"/details")}.bind(this),error:function(){this.sandbox.logger.log("error while saving profile")}.bind(this)})},load:function(a){this.sandbox.emit("sulu.router.navigate","contacts/accounts/edit:"+a+"/details")},add:function(a){this.sandbox.emit("sulu.router.navigate","contacts/accounts/add/type:"+a)},delAccounts:function(b){return b.length<1?void this.sandbox.emit("sulu.dialog.error.show","No contacts selected for Deletion"):void this.confirmMultipleDeleteDialog(b,function(c,d){c&&b.forEach(function(b){var c=new a({id:b});c.destroy({data:{removeContacts:!!d},processData:!0,success:function(){this.sandbox.emit("husky.datagrid.row.remove",b)}.bind(this)})}.bind(this))}.bind(this))},renderList:function(){var a=this.sandbox.dom.createElement('<div id="accounts-list-container"/>');this.html(a),this.sandbox.start([{name:"accounts/components/list@sulucontact",options:{el:a}}])},renderForm:function(){this.account=new a;var b=this.sandbox.dom.createElement('<div id="accounts-form-container"/>');this.html(b),this.options.id?(this.account=new a({id:this.options.id}),this.account.fetch({success:function(a){this.sandbox.start([{name:"accounts/components/form@sulucontact",options:{el:b,data:a.toJSON()}}])}.bind(this),error:function(){this.sandbox.logger.log("error while fetching contact")}.bind(this)})):this.sandbox.start([{name:"accounts/components/form@sulucontact",options:{el:b,data:this.account.toJSON(),accountTypeName:this.options.accountType}}])},confirmSingleDeleteDialog:function(a,b){var c="/admin/api/accounts/"+b+"/deleteinfo";this.sandbox.util.ajax({headers:{"Content-Type":"application/json"},context:this,type:"GET",url:c,success:function(c){this.showConfirmSingleDeleteDialog(c,b,a)}.bind(this),error:function(a,b,c){this.sandbox.logger.error("error during get request: "+b,c)}.bind(this)})},showConfirmSingleDeleteDialog:function(a,b,c){if(c&&"function"!=typeof c)throw"callback is not a function";var d={templateType:null,title:"Warning!",content:"Do you really want to delete the selected company? All data is going to be lost.",buttonCancelText:"Cancel",buttonSubmitText:"Delete"};parseInt(a.numChildren,10)>0?(d.title="Warning! Sub-Companies detected!",d.templateType="okDialog",d.buttonCancelText="Ok",d.content=["<p>Existing sub-companies found:</p><ul>",this.template.dependencyListAccounts.call(this,a.children),"</ul>",a.numChildren>3?["<p>and <strong>",parseInt(a.numChildren,10)-a.children.length,"</strong> more.</p>"].join(""):"","<p>A company cannot be deleted as long it has sub-companies. Please delete the sub-companies or remove the relation.</p>"].join("")):parseInt(a.numContacts,10)>0&&(d.title="Warning! Related contacts detected",d.content=["<p>Related contacts found:</p>","<ul>",this.template.dependencyListContacts.call(this,a.contacts),"</ul>",a.numContacts>3?["<p>and <strong>",parseInt(a.numContacts,10)-a.contacts.length,"</strong> more.</p>"].join(""):"","<p>Would you like to delete them with the selected company?</p>","<p>",'<input type="checkbox" id="delete-contacts" />','<label for="delete-contacts">Delete all ',parseInt(a.numContacts,10)," related contacts.</label>","</p>"].join("")),this.sandbox.emit("sulu.dialog.confirmation.show",{content:{title:d.title,content:d.content},footer:{buttonCancelText:d.buttonCancelText,buttonSubmitText:d.buttonSubmitText},callback:{submit:function(){var a=this.sandbox.dom.find("#delete-contacts").length&&this.sandbox.dom.prop("#delete-contacts","checked");this.sandbox.emit("husky.dialog.hide"),c&&c(!0,a)}.bind(this),cancel:function(){this.sandbox.emit("husky.dialog.hide"),c&&c(!1)}.bind(this)}},d.templateType)},confirmMultipleDeleteDialog:function(a,b){if(0!==a.length)if(1===a.length)this.confirmSingleDeleteDialog(b,a[0]);else{var c="/admin/api/accounts/multipledeleteinfo";this.sandbox.util.ajax({headers:{Accept:"application/json","Content-Type":"application/json"},context:this,type:"GET",url:c,data:{ids:a},success:function(c){this.showConfirmMultipleDeleteDialog(c,a,b)}.bind(this),error:function(a,b,c){this.sandbox.logger.error("error during get request: "+b,c)}.bind(this)})}},showConfirmMultipleDeleteDialog:function(a,b,c){if(c&&"function"!=typeof c)throw"callback is not a function";var d={templateType:null,title:"Warning!",content:"Do you really want to delete the selected companies? All data is going to be lost.",buttonCancelText:"Cancel",buttonSubmitText:"Delete"};parseInt(a.numChildren,10)>0?(d.title="Warning! Sub-Companies detected!",d.templateType="okDialog",d.buttonCancelText="OK",d.content=["<p>One or more related sub-companies found.</p>","<p>A company cannot be deleted as long it has sub-companies. Please delete the sub-companies or remove the relation.</p>"].join("")):parseInt(a.numContacts,10)>0&&(d.title="Warning! Related contacts detected",d.content=["<p>One or more companies still have related contacts. Would you like to delete them with the selected companies?</p>","<p>",'<input type="checkbox" id="delete-contacts" />','<label for="delete-contacts">Delete all ',parseInt(a.numContacts,10)," related contacts.</label>","</p>"].join("")),this.sandbox.emit("sulu.dialog.confirmation.show",{content:{title:d.title,content:d.content},footer:{buttonCancelText:d.buttonCancelText,buttonSubmitText:d.buttonSubmitText},callback:{submit:function(){var a=this.sandbox.dom.find("#delete-contacts").length&&this.sandbox.dom.prop("#delete-contacts","checked");this.sandbox.emit("husky.dialog.hide"),c&&c(!0,a)}.bind(this),cancel:function(){this.sandbox.emit("husky.dialog.hide"),c&&c(!1)}.bind(this)}},d.templateType)},template:{dependencyListContacts:function(a){var b="<% _.each(contacts, function(contact) { %> <li><%= contact.firstName %> <%= contact.lastName %></li> <% }); %>";return this.sandbox.template.parse(b,{contacts:a})},dependencyListAccounts:function(a){var b="<% _.each(accounts, function(account) { %> <li><%= account.name %></li> <% }); %>";return this.sandbox.template.parse(b,{accounts:a})}}}});