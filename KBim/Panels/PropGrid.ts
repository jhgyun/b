namespace KBim
{
    export class BiPropGrid extends U1.UIs.BiBase<HTMLDivElement>
    {
        //Property 
        public Items: U1.UPropertyBase[];
        private PropertyEdits: BiPropEdit[];
        public static editCreater: (prop: U1.UPropertyBase, tr: HTMLDivElement) => BiPropEdit;
        public static createItemEdit(item: U1.UPropertyBase, row: HTMLDivElement) 
        {
            var editor = BiPropGrid.editCreater != null ? BiPropGrid.editCreater(item, row) : null;

            if (editor == null)
            {
                if (item instanceof U1.UPropCategoryGroup)
                {
                    editor = new BiPropCateGroup()
                        .setSource(item)
                        .setTarget(row);
                }
                else if (item instanceof U1.UPropCategory)
                {
                    editor = new BiPropCategory()
                        .setSource(item)
                        .setTarget(row);
                }
            }

            if (editor == null)
            {
                editor = new BiPropEdit()
                    .setSource(item)
                    .setTarget(row);
            }

            return editor;
        }
        public ItemsSource: string;

        //Setter  
        public setItemsSource(source: string): this
        {
            this.ItemsSource = source;
            return this;
        }
         
        protected OnPropertyChanged(sender, prop: string)
        {
            super.OnPropertyChanged(sender, prop);

            if (sender != this.Source || this.IsPasued) return;

            if (sender === this.Source)
            {
                if (prop === this.ItemsSource)
                {
                    this.UpdateItems();
                }
            }
        }

        //Update
        protected OnUpdate()
        {
            this.UpdateItems();
        }
        public UnBind(): this
        {
            super.UnBind();

            if (this.PropertyEdits != null)
            {
                for (var prop of this.PropertyEdits)
                {
                    prop.UnBind();
                }
            }

            if (this.Target != null)
                this.Target.onchange = null;

            return this;
        }

        private UpdateItems()
        {
            var items = this.Source[this.ItemsSource] as U1.UPropertyBase[] || [];

            var isChanged = this.Items == null;
            if (!isChanged)
                isChanged = items.length != this.Items.length;
            if (!isChanged)
            {
                for (var i = 0; i < items.length; i++)
                {
                    isChanged = items[i] != this.Items[i];
                    if (isChanged)
                        break;
                }
            }

            if (!isChanged)
                return;

            while (this.Target.children.length > 0)
            {
                this.Target.removeChild(this.Target.lastChild);
            }

           
            if (this.PropertyEdits != null)
            {
                for (var prop of this.PropertyEdits)
                {
                    prop.UnBind();
                }
            }

            this.Items = items;
            this.PropertyEdits = [];

            if (this.Items != null)
            {
                for (var i = 0; i < this.Items.length; i++)
                {
                    var item = this.Items[i];
                    var tr = document.createElement("div"); 
                    tr.className = "row"; 
                    tr.style.marginLeft = "4px";
                    tr.style.marginRight = "4px";

                    this.Target.appendChild(tr);

                    var editor = BiPropGrid.createItemEdit(item, tr); 
                    editor.Update();

                    this.PropertyEdits.push(editor);
                }
            }
        }
        public Pause(): this
        {
            super.Pause();
            if (this.PropertyEdits != null)
            {
                for (var prop of this.PropertyEdits)
                {
                    prop.Pause();
                }
            }
            return this;
        }
        public Resume(): this
        {
            super.Resume();
            if (this.PropertyEdits != null)
            {
                for (var prop of this.PropertyEdits)
                {
                    prop.Resume();
                }
            }

            return this;
        }
    }
    export class BiPropEdit extends U1.UIs.BiBase<HTMLDivElement>
    {
        private input: HTMLInputElement;
        private label: HTMLLabelElement;
        private text: string;

        public get Property(): U1.UPropertyBase
        {
            return this.Source as U1.UPropertyBase;
        }
        public ContentRenderer: (container: HTMLDivElement) => any;

        public setContentRenderer(renderer: (container: HTMLDivElement) => any): this
        {
            this.ContentRenderer = renderer;
            return this;
        }
        public setSource(source: U1.UPropertyBase): this
        {
            super.setSource(source);
            return this;
        }

        protected OnPropertyChanged(sender, prop: string)
        {
            super.OnPropertyChanged(sender, prop);

            if (sender != this.Source || this.IsPasued) return;

            if (prop == "ValueText")
            {
                this.input.value = this.Property.ValueText;
                this.text = null;
            }
        }

        protected OnUpdate()
        {
            if (this.ContentRenderer != null)
            {
                while (this.Target.children.length > 0)
                {
                    this.Target.removeChild(this.Target.lastChild);
                }
                this.ContentRenderer(this.Target as HTMLDivElement);
                return this;
            }

            /*
              <div class="row">
            <div  style="position:relative;float:left;width:50%"><lable style="float:right">{label}</label></div>
            <div  style="position:relative;float:left;width:50%"><input style="width:100%">
                <input
                        type="text"
                        value={valutText}
                        onKeyUp= {this.OnKeyUp}
                        onChange={this.OnChange} />
            </div>
          </div>
            */

            if (this.label == null)
            {
                this.label = document.createElement("label");
                this.label.textContent = this.Property.Label + " :"; 
                this.label.style.cssFloat = "right";
                this.label.style.marginRight = "4px";

                let td = document.createElement("div");
                td.style.position = "relative";
                td.style.cssFloat = "left";
                td.style.width = "50%";

                td.appendChild(this.label);
                this.Target.appendChild(td);
            }
            if (this.input == null)
            {
                this.input = document.createElement("input");
                this.input.type = "text";
                this.input.value = this.Property.ValueText;
                if (this.Property instanceof U1.UPropString)
                {
                    this.input.setAttribute("type", "text");
                }
                else
                {
                    this.input.setAttribute("type", "number"); 
                }
                this.input.style.width = "100%";
                if (this.Property.IsEditable == false)
                    this.input.disabled = true;
                               
                this.input.onkeyup = (ev) => this.OnKeyUp(ev);
                this.input.onchange = (ev) => this.OnChange(ev);

                let td = document.createElement("div");
                td.style.position = "relative";
                td.style.cssFloat = "left";
                td.style.width = "50%";

                td.appendChild(this.input);
                this.Target.appendChild(td);
            }
         
        }
        public UnBind(): this
        {
            super.UnBind();

            if (this.input != null)
            {
                this.input.onkeyup = null;
                this.input.onchange = null;
            }

            return this;
        }
        public OnChange(event: Event)
        {
            var input = event.target as HTMLInputElement;
            this.OnTextChange(input.value);
        }
        public OnKeyUp(event: KeyboardEvent)
        {
            if (event.keyCode == 13)
            {
                var input = event.target as HTMLInputElement;
                event.preventDefault();
                this.OnTextChange(input.value);
            }
        }
        private OnTextChange(text: string)
        {
            this.text = text;
            if (this.text != null && this.text != this.Property.ValueText)
                this.Property.ValueText = this.text;
            this.text = null;
        }
    }
    export class BiPropCategory extends BiPropEdit
    {
        private div: HTMLDivElement;
        private PropertyEdits: BiPropEdit[];
        public get Category(): U1.UPropCategory
        {
            return this.Source as U1.UPropCategory;
        }
        public get Items(): U1.UPropertyBase[]
        {
            return this.Category.Items;
        }
        public UnBind(): this
        {
            super.UnBind();

            if (this.PropertyEdits != null)
            {
                for (var prop of this.PropertyEdits)
                {
                    prop.UnBind();
                }
            } 
            return this;
        }
        protected OnPropertyChanged(sender, prop: string)
        {
        } 
        protected OnUpdate()
        { 
            this.UpdateItems();
            return this;
        }

        private UpdateItems()
        {
            var items = this.Items;
             
            while (this.Target.children.length > 0)
            {
                this.Target.removeChild(this.Target.lastChild);
            }


            if (this.PropertyEdits != null)
            {
                for (var prop of this.PropertyEdits)
                {
                    prop.UnBind();
                }
            }
             
            this.PropertyEdits = [];

            if (this.Items != null)
            {
                for (var i = 0; i < this.Items.length; i++)
                {
                    var item = this.Items[i];
                    var tr = document.createElement("div"); 
                    tr.className = "row";
                    tr.style.marginLeft = "4px";
                    tr.style.marginRight = "4px"; 

                    this.Target.appendChild(tr);

                    var editor = BiPropGrid.createItemEdit(item, tr);
                    editor.Update();

                    this.PropertyEdits.push(editor);
                }
            }
        }
    }
    export class BiPropCateGroup extends BiPropEdit
    {
        private divAccordian: HTMLDivElement;
        private button: HTMLButtonElement;
        private divContent: HTMLDivElement;
        private PropertyEdits: BiPropEdit[];

        public get CateGroup(): U1.UPropCategoryGroup
        {
            return this.Source as U1.UPropCategoryGroup;
        }

        protected OnPropertyChanged(sender, prop: string)
        {
        }

        protected OnUpdate()
        {
            if (this.PropertyEdits != null)
            {
                for (var prop of this.PropertyEdits)
                {
                    prop.UnBind();
                }
            }
             
            this.PropertyEdits = [];

            /*
              <button class="w3-btn-block w3-left-align w3-light-gray ">
                Primitive Meshes
              </button>
               <div  class="w3-accordion-content">
                 
               </div>
            */
            //if (this.divAccordian == null)
            //{
            //    this.divAccordian = document.createElement("div");
            //    this.divAccordian.className = "w3-accordion";
            //    this.Target.appendChild(this.divAccordian);
            //}

            if (this.button == null)
            {
                this.button = document.createElement("button");
                this.button.textContent = this.CateGroup.Label;
                this.button.className = "w3-btn-block w3-center-align w3-light-gray"; 
                let btn = this.button;
                this.button.onclick = function (ev)  
                {
                    let content = btn.nextElementSibling;
                    if (content.className.indexOf("w3-show") == -1)
                    {
                        content.className += " w3-show";
                    }
                    else
                    {
                        content.className = content.className.replace(" w3-show", "");
                    }
                }
                this.Target.appendChild(this.button);
            }

            if (this.divContent == null)
            {
                this.divContent = document.createElement("div");
                this.divContent.className = "w3-accordion-content  w3-show";
                this.divContent.style.marginTop = "4px";

                this.Target.appendChild(this.divContent);
            } 

            while (this.divContent.children.length > 0)
            {
                this.divContent.removeChild(this.divContent.lastChild);
            }

            let categories = this.CateGroup.Categories; 
            if (categories != null)
            {
                for (var i = 0; i < categories.length; i++)
                {
                    var category = categories[i] as U1.UPropCategory;
                    var tr = document.createElement("div");
                    //tr.className = "containter";

                    this.divContent.appendChild(tr); 
                    var editor = BiPropGrid.createItemEdit(category, tr);   
                    editor.Update();

                    this.PropertyEdits.push(editor);
                }
            }

            return this;
        }
        public UnBind(): this
        {
            super.UnBind();

            if (this.PropertyEdits != null)
            {
                for (var prop of this.PropertyEdits)
                {
                    prop.UnBind();
                }
            }
             
            if (this.button != null)
                this.button.onclick = undefined;

            delete this.button;
            delete this.divAccordian;
            delete this.divContent;

            return this;
        }
        /*
       */
    }
}