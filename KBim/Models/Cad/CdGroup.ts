/// <reference path="cdentity.ts" />
namespace KBim
{
    export class CdGroup extends CdEntity3d {
        public get Items(): CdEntity[] {
            return this.Children
                .filter(o_ => o_ instanceof CdEntity)
                .OrderBy(o_ => o_.ID) as CdEntity[];
        }
        public AddEntity<T extends CdEntity>(ctor: { new(): T }): T {
            return super.AddChild<any>(ctor);
        }
        public AddEntityCopy<T extends CdEntity>(child: T): T {
            return this.AddChildCopy<any>(child);
        }
    }

    U1.UDocument.Creaters["CdGroup"] = CdGroup; 
}