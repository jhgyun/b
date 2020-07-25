namespace KBim
{
    export class PanelManager  
    {
        private static _instance: PanelManager;
        public static get Instance()
        {
            if (PanelManager._instance == null)
            {
                PanelManager._instance = new PanelManager();
            }
            return PanelManager._instance;
        }

        public Init()
        {
            //PanelCreate.Instance.Show();
            //PanelProp.Instance.Show();
        }

        public ShowPanelCreate()
        {
            let li_panelCreate = document.getElementById('li_panelCreate') as HTMLLIElement;
            let panelCreate = document.getElementById('panelCreate') as HTMLDivElement;

            let tabButton_children = li_panelCreate.parentElement.children;
            let content_children = panelCreate.parentElement.children;

            for (var i = 0; i < tabButton_children.length; i++)
            {
                tabButton_children[i].classList.remove('active');
            }

            for (var i = 0; i < content_children.length; i++)
            {
                content_children[i].classList.remove('in');
                content_children[i].classList.remove('active');
            }

            li_panelCreate.classList.add('active');

            panelCreate.classList.add('in');
            panelCreate.classList.add('active');
        }

        public ShowPanelProp()
        {
            let li_panelProp = document.getElementById('li_panelProp') as HTMLLIElement;
            let panelProp = document.getElementById('panelProp') as HTMLDivElement;

            let tabButton_children = li_panelProp.parentElement.children;
            let content_children = panelProp.parentElement.children;

            for (var i = 0; i < tabButton_children.length; i++)
            {
                tabButton_children[i].classList.remove('active');
            }

            for (var i = 0; i < content_children.length; i++)
            {
                content_children[i].classList.remove('in');
                content_children[i].classList.remove('active');
            }

            li_panelProp.classList.add('active');

            panelProp.classList.add('in');
            panelProp.classList.add('active');
        }
    }
}