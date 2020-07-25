namespace KBim
{
    export class BaseVM implements U1.INotifyPropertyChanged
    {
        private _propertyChanged: U1.PropertyChangedEvent;
        protected _commands: { [name: string]: U1.UCommand } = {};
        protected binders: { [index: string]: U1.UIs.IBiBase } = {};

        public get PropertyChanged()
        {
            if (this._propertyChanged === undefined)
                this._propertyChanged = new U1.PropertyChangedEvent();

            return this._propertyChanged;
        }

        public InvokdPropertyChanged(name: string)
        {
            if (this._propertyChanged != null)
                this._propertyChanged.Invoke(this, name);
        }
        protected InitBinders()
        {
        }
        protected UpdateBinders()
        {
            for (var key in this.binders)
            {
                this.binders[key].Update();
            }
        }
        public PauseBinders()
        {
            for (var key in this.binders)
            {
                this.binders[key].Pause();
            }
        }
        public ResumeBinders()
        {
            for (var key in this.binders)
            {
                this.binders[key].Resume();
            }
        }
        public ClearBinders()
        {
            for (var key in this.binders)
            {
                this.binders[key].UnBind();
            }

            this.binders = {};
        }
 
    }
}