namespace KBim
{
    export class PanelProp extends U1.UIs.PanelBase
    {
        private static _instance: PanelProp;
        private _props: U1.UPropertyBase[];
        private _selectedColor: string = "";

        constructor()
        {
            super();
            this.HtmlPage = './KBim/Panels/PanelProp.html'; 
        }

        public static get Instance()
        {
            if (PanelProp._instance == null)
            {
                PanelProp._instance = new PanelProp();
            }
            return PanelProp._instance;
        } 

        public get Props()
        {
            return this._props;
        }
        public set Props(value: U1.UPropertyBase[])
        {
            if (this._props != null)
            {
                for (let prop of this._props)
                {
                    prop.Dispose();
                }
            }

            this._props = value;
            this.InvokePropertyChanged("Props");
        }

        public get SelectedColor()
        {
            return this._selectedColor;
        }
        public set SelectedColor(value: string) {
            let sel = SiteView.Instance.Document.Selection.SelectedElements;
            let sel2 = SiteView.Instance.View3.DocumentPresenter.Selection;
             
            this._selectedColor = value;

            this.InvokePropertyChanged("SelectedColor");
        }

        public get IsEnableChangeColor()
        {
            let sel = SiteView.Instance.Document.Selection.SelectedElements; 
            return false;
        }

        public Show()
        {
            if (!this._isInit)
            {
                this.Init();
            }
            var htmlPanel = document.getElementById("panelProp");
            while (htmlPanel.hasChildNodes())
            {
                htmlPanel.removeChild(htmlPanel.lastChild);
            }
            htmlPanel.appendChild(this._root);
        }
        protected InitBinders()
        {
            let this_ = this;

            this.binders["bi_PropsGrid"] = new KBim.BiPropGrid()
                .setSource(this)
                .setTarget($(this._root).find("#bi_PropsGrid").get(0) as HTMLDivElement)
                .setItemsSource("Props");

            if (document.getElementById('bi_colorPicker') != null)
            {
                this.binders["bi_colorPicker"] = new U1.UIs.BiComboBox<string>()
                    .setSource(this)
                    .setTarget($("#bi_colorPicker").get(0) as HTMLSelectElement)

                    .setItems(["노란색", "주황색", "회색", "파란색"/*, "검정색"*/, "빨간색"])
                    .setSelectedItemSource('SelectedColor')

                    .setIsEnableSource('IsEnableChangeColor');
                    //.setIsVisibleSource('IsVisibleChangeColor');
            }

            SiteView.Instance.Document.Selection.SelectionChanged.Add(this, this.SelectionChanged);
            this.InvokePropertyChanged('IsEnableChangeColor')
        }

        private SelectionChanged(selection: U1.USelection)
        {  
            this.Props = U1.UPropCategoryGroup.Categorize(selection.SelectedElements);
            this.InvokePropertyChanged('IsEnableChangeColor');
            this.SelectedColor = "";
        } 
    }
}