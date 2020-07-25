/// <reference path="cdentity.ts" />
/// <reference path="cdentity3d.ts" />
namespace KBim
{
    export class CdBlockReference extends CdEntity3d 
    {
        // #region Fields
        private blockName =  "" ;
        private blockSet: CdBlockSet;
        private blockInvalid = true;
        // #endregion

        //#region Props 
        public get KDocument(): KDocument
        {
            if (this.Document instanceof KDocument)
                return this.Document as KDocument;
            return null;
        } 
        public get BlockSet(): CdBlockSet
        { 
            if (!this.blockInvalid  )
                return this.blockSet;

            this.blockInvalid = false;
            var vdDoc = this.KDocument;
            var cdDrawing = this.FindAncestor(CdDrawing); 
            if (cdDrawing != null)
            {
                this.blockSet = cdDrawing.BlockSet;
            } 

            return this.blockSet;
        }
        public get Block(): CdBlock
        {
            var blockSet = this.BlockSet;
            if (blockSet == null)
                return null;

            return blockSet.GetBlock(this.BlockName);
        }
        public set(value: CdBlock)
        {
            this.BlockName = value != null ? value.Name : "";
        }
        public get BlockName()
        {
            return this.blockName;
        }
        public set BlockName(value: string)
        {
            this.SetProperty("BlockName", "blockName", value);
        }
        //#endregion

        //#region Methods
        public get PropertyCategory()
        {
            return KBimStringService.LB_BLOCK_REFERENCE;
        }

        public ReadProps(props: U1.IUPropertyBag) {
            super.ReadProps(props);

            this.BlockName = props.GetStr("BlockName", this.blockName); 
        }
        public WriteProps(props: U1.IUPropertyBag) {
            super.WriteProps(props);

            props.SetStr("BlockName", this.blockName); 
        }  
         
        protected UpdateBounding()
        {
            var v0: U1.Vector3 = CdBlockReference[".ub.v0"] || (CdBlockReference[".ub.v0"] = U1.Vector3.Zero);
            var v1: U1.Vector3 = CdBlockReference[".ub.v1"] || (CdBlockReference[".ub.v1"] = U1.Vector3.Zero);
            var cv: U1.Vector3[] = CdBlockReference[".ub.cv"] || (CdBlockReference[".ub.cv"] =
                [
                U1.Vector3.Zero, U1.Vector3.Zero, U1.Vector3.Zero, U1.Vector3.Zero,
                U1.Vector3.Zero, U1.Vector3.Zero, U1.Vector3.Zero, U1.Vector3.Zero
                ]);


            var minx = Number.MAX_VALUE;
            var miny = minx;
            var minz = minx;

            var maxx = Number.MIN_VALUE;
            var maxy = maxx;
            var maxz = maxx;

            if (this.Block == null || this.Block.Entities == null)
            {
                return;
            }

            var min = this.m_boundingBox.Min;
            var max = this.m_boundingBox.Max;
            min.SetMaxValue();
            max.SetMinValue();

            for (var blkEntity of this.Block.Entities)
            {
                var lbb = blkEntity.BoundingBox;
                var tm = blkEntity.Transform;

                v0.SetTransform(lbb.Min, tm);
                v1.SetTransform(lbb.Max, tm);

                lbb.GetCorners(cv).map(o_ => o_.Transform(tm)).forEach(o_ =>
                {
                    min.Minimize(o_);
                    max.Maximize(o_);
                });
            }

            this.m_boundingSphere.SetCreateFromBoundingBox(this.m_boundingBox);
        }

        public GetProperties(): U1.UPropertyBase[]
        {
            var result = super.GetProperties();
            var loc2 = new U1.Vector2();
            var loc3 = new U1.Vector3();

            var loc_prop = new U1.UPropLoc3();
            loc_prop.Source = this;
            loc_prop.Label = KBimStringService.LB_LOCATION;
            loc_prop.GetValueFunc = (p_) => this.Location;
            loc_prop.SetValueFunc = (p_, val_) =>
            {
                this.Location = val_;
            };

            var scale_prop = new U1.UPropScale3();
            scale_prop.Source = this;
            scale_prop.Label = KBimStringService.LB_SCALE;
            scale_prop.GetValueFunc = (p_) => this.Scale;
            scale_prop.SetValueFunc = (p_, val_) =>
            {
                this.Scale = val_;
            };

            var angle_prop = new U1.UPropAngle();

            angle_prop.Source = this;
            angle_prop.Label = KBimStringService.LB_ROTAION;
            angle_prop.GetValueFunc = (p_) => U1.MathHelper.ToDegrees(this.Angle);
            angle_prop.SetValueFunc = (p_, val_) =>
            {
                this.Angle = U1.MathHelper.ToRadians(val_);
            };

            result.push(loc_prop);
            result.push(scale_prop);
            result.push(angle_prop);

            return result;
        }

        public CovertToGroup(): CdGroup
        {
            var group: CdGroup;
            if (this.Parent instanceof CdEntitySet)
            {
                let parent = this.Parent as CdEntitySet;
                group = parent.AddEntity<CdGroup>(CdGroup);
            }

            if (this.Parent instanceof CdBlock)
            {
                let parent = this.Parent as CdBlock;
                group = parent.AddEntity<CdGroup>(CdGroup);
            }

            if (this.Parent instanceof CdGroup)
            {
                let parent = this.Parent as CdGroup;
                group = parent.AddEntity<CdGroup>(CdGroup);
            }

            if (group != null)
            {
                for (var ch of this.Block.Entities)
                {
                    group.AddEntityCopy(ch);
                }

                group.Location = this.Location;
                group.Scale = this.Scale;
                group.Axis = this.Axis;
                group.Angle = this.Angle;

                this.Detach();
            }
            return group;
        }
         
        //#endregion 
        //#region Geoms
        public GetGeomNodes(parentXForm: U1.Matrix4, nodes: Array<U1.Geoms.GeNode>): void {
            parentXForm = U1.Matrix4.Multiply(this.Transform, parentXForm);

            if (this.Block != null) {
                this.Block.GetGeomNodes(parentXForm, nodes);
            }
        }
    //#endregion
    }
    U1.UDocument.Creaters["CdBlockReference"] = CdBlockReference; 
}