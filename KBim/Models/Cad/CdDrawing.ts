/// <reference path="cdentity.ts" />
namespace KBim
{
    export class CdDrawing extends U1.UNode
    {
        // #region Fields
        public get BlockSet(): CdBlockSet
        {
            return this.GetNamedChild<CdBlockSet>(CdBlockSet, "Blocks");
        }
        public get EntitySet(): CdEntitySet
        { 
            return this.GetNamedChild<CdEntitySet>(CdEntitySet, "Entities"); 
        }
        public get LayerSet(): CdLayerSet
        {
            return this.GetNamedChild<CdLayerSet>(CdLayerSet, "Layers");
        }
        //#endregion

        //#region Methods
        protected Initialize( )
        { 
            //base.Initialize(document, parent, id, name);
            this.AddChild<CdBlockSet>(CdBlockSet, "Blocks");
            this.AddChild<CdEntitySet>(CdEntitySet, "Entities");
            this.namedChildren = {};
        }
        public AddEntity<T extends CdEntity>(ctor: { new (): T } ) : T 
        {
            return this.EntitySet.AddEntity<T>(ctor);
        }
        protected OnChildAdded(child: U1.UGeomElement)
        {
            super.OnChildAdded(child);
            this.namedChildren = {};

        }
        protected OnChildDeleting(child: U1.UGeomElement)
        {
            super.OnChildDeleting(child); 
            this.namedChildren = {}; 
        }
        //#endregion

       // #region Children
        private namedChildren: { [index: string]: U1.UNode } = {};
        private GetNamedChild<T extends U1.UNode>(ctor: { new (): T }, name: string): T
        {
            if (this.namedChildren[name] == null)
                this.namedChildren[name] = this.GetChild<T>(ctor, name);

            return this.namedChildren[name] as T;
        }
        //#endregion

        public LoadDXF(dxfFileData:string )
        {
        }
    }
    export class CdDrawingSet extends U1.UNode  
    {
        private namedItems: { [index: string]: CdDrawing } = {};
         
        public AddDrawing(name): CdDrawing
        {
            return super.AddChild(CdDrawing, name);
        } 
        public GetDrawing(name: string): CdDrawing
        {
            if (this.namedItems[name] == null)
                this.namedItems[name] = this.GetChild(CdDrawing, name);
            return this.namedItems[name];
        } 
        protected OnChildAdded(child: U1.UNode)
        {
            super.OnChildAdded(child);
            this.namedItems = {};
        }
        protected OnChildDeleting(child: U1.UNode)
        {
            super.OnChildDeleting(child);
            this.namedItems = {};
        }
    }

    U1.UDocument.Creaters["CdDrawing"] = CdDrawing; 
    U1.UDocument.Creaters["CdDrawingSet"] = CdDrawingSet; 
}