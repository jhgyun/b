namespace KBim
{
    export class KDocument extends U1.UDocument
    { 
        //#region Children
        protected namedElements: { [index: string]: KElement };
        private GetNamedElement<T extends KElement>(ctor: { new (): T }, name: string): T 
        {
            if (this.namedElements == null)
                this.namedElements = {};

            var old = this.namedElements[name];
            if (old == null || old.Document != this || !(old instanceof ctor))
            {
                old = this.namedElements[name] = this
                    .GetElementsByType(ctor) 
                    .filter(o_ => (o_ as T).Name === name)[0];
            }

            return old as T;
        }
        //#endregion

        public InvokeElementAttached(element: KElement)
        {
            super.InvokeElementAttached(element);
            if (this.isLoading)
                return;
             
        }
        public InvokeElementRemoving(element: KElement)
        {
            super.InvokeElementRemoving(element);
            if (this.isLoading)
                return; 

        }
        public InvokeAfterUndoRedo(isUndo: boolean)
        {
            super.InvokeAfterUndoRedo(isUndo);
            if (this.isLoading)
                return;
             
        }
        public InvokeBeforeEndTransaction()
        {
            super.InvokeBeforeEndTransaction(); 
            if (this.isLoading)
                return; 
        }
        public InvokeAfterEndTransaction()
        {
            super.InvokeAfterEndTransaction(); 
            if (this.isLoading)
                return; 

        }
        public InvokeAfterAbortTransaction()
        {
            super.InvokeAfterAbortTransaction(); 
            if (this.isLoading)
                return; 
        }
        public InvokeElementChanged(element: KElement, prop: string)
        {
            super.InvokeElementChanged(element, prop);  
            if (this.isLoading)
                return;
             
        }
        public InvokeBeforeClear()
        {
            super.InvokeBeforeClear();    
        }
        public InvokeAfterClear()
        {
            super.InvokeAfterClear();    
        }
        public InvokeAfterChanged()
        {
            super.InvokeAfterChanged();  
        } 

        public LoadXML(doc: XMLDocument) {
            this.Clear();
            this.BeginLoad();
            this.ReadXmlDocument(doc);
            this.EndLoad();
        }
        public LoadZip(doc: XMLDocument) { 
            this.ReadXmlDocument(doc);
        }
    }
}