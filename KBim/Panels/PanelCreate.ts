namespace KBim
{
    interface CmdBtnInfo
    {
        icon: string,
        cmd: string,
        label: string,
        index:number
    }

    export class PanelCreate extends U1.UIs.PanelBase
    {
        constructor()
        {
            super();
            this.HtmlPage = './KBim/Panels/PanelCreate.html';
            
        }

        private static _propPanelSize = 150;
        private static _instance: PanelCreate;
        private _options: U1.UPropertyBase[];

        public static get Instance()
        {
            if (PanelCreate._instance == null)
            {
                PanelCreate._instance = new PanelCreate();
            }
            return PanelCreate._instance;
        }
         
        public Show()
        {
            if (!this._isInit)
            {
                this.Init();
            }
            var htmlPanel = document.getElementById("panelCreate");
            if (htmlPanel == null)
                return;

            while (htmlPanel.hasChildNodes())
            {
                htmlPanel.removeChild(htmlPanel.lastChild);
            }
            htmlPanel.appendChild(this._root);
        } 
    }
}