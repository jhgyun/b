declare namespace libtess {
    class DictNode {
        key: any;
        next: DictNode;
        prev: DictNode;
        constructor(opt_key?: any, opt_nextNode?: DictNode, opt_prevNode?: DictNode);
        getKey(): any;
        getSuccessor(): DictNode;
        getPredecessor(): DictNode;
    }
}
declare namespace libtess {
    class Dict {
        head_: DictNode;
        frame_: any;
        leq_: any;
        constructor(frame: any, leq: any);
        deleteDict_(): void;
        insertBefore(node: any, key: any): DictNode;
        insert(key: any): DictNode;
        deleteNode(node: any): void;
        search(key: any): DictNode;
        getMin(): DictNode;
        getMax(): DictNode;
    }
}
interface String {
    EndsWith(suffix: string, isgnoreCase?: boolean): boolean;
    StartsWith(prefix: string, isgnoreCase?: boolean): boolean;
}
interface StringConstructor {
    IsNullOrEmpty(value: string): boolean;
    Compare(a: string, b: string, isgnoreCase?: boolean): number;
}
interface Array<T> {
    Contains(item: T): boolean;
    AddRange(items: ArrayLike<T>): void;
    OrderBy(func: (item: T) => number | string): Array<T>;
}
interface ArrayConstructor {
    ArrayCopy(src: any[], srcstart: number, tgt: any[], tgtstar: number, length: number): any;
}
interface BooleanConstructor {
    Parse(value: string): boolean;
}
declare namespace U1 {
    interface IUValue {
        ConvertFromStr(value: string): any;
        ConvertToStr(): string;
        CopyFrom(other: IUValue): any;
        Equals(other: IUValue): boolean;
        Clone(): IUValue;
    }
    class UValueUtil {
        static ConvertArrFromString<T extends IUValue>(ctor: {
            new (): T;
        }, str: string): T[];
        static ConvertArrToString<T extends IUValue>(val: T[]): string;
        static ConvertNumberArrFromString(str: string): number[];
        static ConvertNumberArrToString(...val: number[]): string;
        static ConvertTypedArrayToString(val: ArrayLike<number>): string;
        static ConvertStrArrFromString(str: string): string[];
        static ConvertStrArrToString(...val: string[]): string;
        static Fill_A_With_B<T>(a: T[], b: T[]): void;
    }
    class LogService {
        static WriteExceptionFunc: (err: any) => any;
        static WriteLogsFunc: (logs: string[]) => any;
        static WriteException(err: any): void;
        static WriteLogs(...logs: string[]): void;
    }
    class Event1<S> {
        private listeners;
        Add(thisArg: any, listener: (arg1: S) => any): void;
        Remove(thisArg: any, listener: (arg1: S) => any): void;
        Invoke(arg1: S): void;
        Clear(): void;
    }
    class Event2<S, T> {
        private listeners;
        Add(thisArg: any, listener: (arg1: S, srg2: T) => any): void;
        Remove(thisArg: any, listener: (arg1: S, srg2: T) => any): void;
        Invoke(arg1: S, arg2: T): void;
        Clear(): void;
    }
    class Event3<S, T, U> {
        private listeners;
        Add(thisArg: any, listener: (arg1: S, arg2: T, arg3: U) => any): void;
        Remove(thisArg: any, listener: (arg1: S, arg2: T, arg3: U) => any): void;
        Invoke(arg1: S, arg2: T, arg3: U): void;
        Clear(): void;
    }
    class PropertyChangedEvent extends Event2<Object, string> {
    }
    interface INotifyPropertyChanged {
        PropertyChanged: PropertyChangedEvent;
    }
    interface IDisposable {
        Dispose(): any;
    }
    interface IPropertyContainer extends INotifyPropertyChanged {
        SetProp(prop: string, value: string): any;
        GetProp(prop: string): string;
    }
    interface IUCommandData {
        Label?: string;
        ID?: string;
        ToolTip?: string;
        CanExecuteFunc?: () => boolean;
        ExecuteFunc?: (arg: any) => void;
    }
    class UCommand implements IDisposable {
        private _canExecuteFunc;
        private _executeFunc;
        private _toolTip;
        private _label;
        private _id;
        private static _key;
        private _key;
        constructor(data?: IUCommandData);
        get CanExecuteFunc(): () => boolean;
        set CanExecuteFunc(value: () => boolean);
        get ExecuteFunc(): (arg: any) => void;
        set ExecuteFunc(value: (arg: any) => void);
        get Key(): string;
        set Key(value: string);
        get ID(): string;
        set ID(value: string);
        get ToolTip(): string;
        set ToolTip(value: string);
        get Label(): string;
        set Label(value: string);
        CanExecute(parameter: any): boolean;
        CanExecuteChanged: Event1<UCommand>;
        Execute(arg: any): void;
        InvokeCanExecuteChanged(): void;
        PropertyChanged: PropertyChangedEvent;
        InvokePropertyChanged(prop: string): void;
        Dispose(): void;
    }
    class StringUtil {
        static IsWhiteSpace(char: string): boolean;
        static IsDigit(char: string): boolean;
        static IsLetterOrDigit(char: string): boolean;
        static IsLetter(char: string): boolean;
    }
    class StringBuilder {
        private buffer;
        private length;
        Append(value: string): void;
        toString(): string;
        get Length(): number;
    }
    class Utf8Util {
        static Utf8Encode(strUni: string): string;
        static Utf8Decode(strUtf: string): string;
    }
    function utf8_to_b64(str: any): string;
    function b64_to_utf8(str: any): string;
    function decimalToHex(d: number, padding?: number): string;
    function OpenFileDialog(calback: (files: FileList) => void, accept?: string): void;
    function SaveTextFile(output: string, type?: string, file?: string): void;
    function SaveImageFile(canvas: HTMLCanvasElement, file?: string): void;
    enum MessageBoxButton {
        OK = 0,
        OKCancel = 1
    }
    enum MessageBoxResult {
        None = 0,
        OK = 1,
        Cancel = 2,
        Yes = 6,
        No = 7
    }
    class MessageBox {
        static Show(message: string, title?: string, button?: MessageBoxButton): MessageBoxResult;
    }
    class UDispatcher {
        static BeginInvoke(func: (...arg: any[]) => any, ...arg: any[]): void;
        static BeginInvokeDelay(func: (...arg: any[]) => any, delay: number, ...arg: any[]): void;
    }
    class AddressParams {
        static getParameter(name: any): string;
        static getParameters(): {
            [index: string]: string;
        };
    }
    function isIE9(): boolean;
    function IsLeftMouseDown(event: MouseEvent | any): boolean;
    function IsRightMouseDown(event: MouseEvent | any): boolean;
    function IsMiddleMouseDown(event: MouseEvent | any): boolean;
    function IsLeftMouseDrag(event: MouseEvent | any): boolean;
    function IsRightMouseDrag(event: MouseEvent | any): boolean;
    function IsMiddleMouseDrag(event: MouseEvent | any): boolean;
    function IsLeftMouseUp(event: MouseEvent | any): boolean;
    function IsRightMouseUp(event: MouseEvent | any): boolean;
    function IsMiddleMouseUp(event: MouseEvent | any): boolean;
    class Random {
        seed: number;
        constructor(seed: number);
        next(): number;
    }
    class BinaryReader {
        private _loc;
        private _dataView;
        constructor(buffer: ArrayBuffer | DataView);
        get Location(): number;
        set Location(value: number);
        get Length(): number;
        get IsEOF(): boolean;
        ReadInt8(): number;
        ReadInt16(): number;
        ReadInt32(): number;
        ReadUint8(): number;
        ReadUint16(): number;
        ReadUint32(): number;
        ReadFloat32(): number;
        ReadFloat64(): number;
        Slice(begin: number, end: number): ArrayBuffer;
    }
}
declare namespace U1 {
    class UDocument implements INotifyPropertyChanged {
        private static last_type_id;
        private static m_element_dumy_instancs;
        static Creaters: {
            [type_name: string]: {
                new (): U1.UElement;
            };
        };
        static Register(name: string | {
            new (): U1.UElement;
        }, c?: {
            new (): U1.UElement;
        }): void;
        private file;
        protected isLoading: boolean;
        protected isUndoRedo: boolean;
        private _last_id;
        private m_elementsByTypes;
        private _elements;
        private _undoStack;
        private _redoStack;
        private _currentTransaction;
        private _rootTransaction;
        AddMaterial(name: string): Material;
        GetMaterialById(id: number): Material;
        GetMaterialByName(name: string): Material;
        GetMaterialItems(): Material[];
        AddTexture(name: string): MTexture;
        GetTextureById(id: number): MTexture;
        GetTextureByName(name: string): MTexture;
        GetTextureItems(): MTexture[];
        protected _selection: USelection;
        constructor();
        get CurrentTransaction(): U1.UTransactoin;
        get IsLoading(): boolean;
        get IsUndoRedo(): boolean;
        get Elements(): Array<UElement>;
        GetElementsByType<T extends UElement>(ctor: {
            new (): T;
        }): T[];
        get Selection(): USelection;
        get CanUndo(): boolean;
        get CanRedo(): boolean;
        GetElement(id: number): UElement;
        Append(element: UElement): void;
        Remove(element: UElement): void;
        private AddInstance;
        private AssignDocument;
        private WithdrawDocument;
        private AddElementToTypeTable;
        private RemoveElementFromTypeTable;
        BeginTransaction(): UTransactoin;
        EndTransaction(transaction?: UTransactoin): void;
        AbortTransaction(transaction?: UTransactoin): void;
        Undo(): void;
        Redo(): void;
        Clear(): void;
        ClearUndoHistory(): void;
        BeginLoad(): void;
        EndLoad(): void;
        PropertyChanged: PropertyChangedEvent;
        ElementAdded: Event2<UDocument, UElement>;
        ElementRemoving: Event2<UDocument, UElement>;
        AfterUndoRedo: Event2<UDocument, boolean>;
        BeforeEndTransaction: Event1<UDocument>;
        AfterEndTransaction: Event1<UDocument>;
        AfterAbortTransaction: Event1<UDocument>;
        ElementChanged: Event3<UDocument, UElement, string>;
        BeforeClear: Event1<UDocument>;
        AfterClear: Event1<UDocument>;
        BeforeLoading: Event1<UDocument>;
        AfterLoaded: Event1<UDocument>;
        AfterChanged: Event1<UDocument>;
        InvokeElementAttached(element: U1.UElement): void;
        InvokeElementRemoving(element: U1.UElement): void;
        InvokeAfterUndoRedo(isUndo: boolean): void;
        InvokeBeforeEndTransaction(): void;
        InvokeAfterEndTransaction(): void;
        InvokeAfterAbortTransaction(): void;
        InvokeElementChanged(element: UElement, prop: string): void;
        InvokeBeforeClear(): void;
        InvokeAfterClear(): void;
        InvokeAfterChanged(): void;
        InvokePropertyChanged(prop: string): void;
        ReadFromFile(file: File): void;
        ReadFromXMLDocument(xml: XMLDocument, callback?: () => any): void;
        private ReadXmlDocumentZip;
        Load(xDoc: XMLDocument): void;
        protected ReadXmlDocument_(xml: XMLDocument): void;
        protected ReadXmlDocument(xml: XMLDocument): void;
        static formatXml(xml: string): string;
        ToXmlString(): string;
        getXmlZipStringAsync(callback: (data: string) => void): void;
    }
    class UEditor {
        PickPoint(): U1.Vector3;
    }
    class USelection {
        SelectionChanged: Event1<USelection>;
        private _selection;
        private _selectionFilter;
        private _document;
        constructor(doc: UDocument);
        InvokeSelectionChanged(): void;
        get Document(): UDocument;
        get Count(): number;
        get SelectedElements(): Array<UElement>;
        get SelectionFilter(): (element: UElement) => boolean;
        set SelectionFilter(value: (element: UElement) => boolean);
        Contains(element: UElement): boolean;
        Add(element: UElement, clear: boolean): void;
        Remove(element: UElement): void;
        RemoveRange(elements: UElement[]): void;
        AddRange(elements: Array<UElement>, clear?: boolean): void;
        Clear(): void;
        private UnSelect;
    }
}
declare namespace U1 {
    class Vector2 implements U1.IUValue {
        X: number;
        Y: number;
        Tag: any;
        constructor(x?: number, y?: number);
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        CopyFrom(other: Vector2): this;
        toString(): string;
        Clone(): Vector2;
        get Left(): Vector2;
        get Right(): Vector2;
        LeftRef(ref: Vector2): Vector2;
        RightRef(ref: Vector2): Vector2;
        static LeftTop(ps: Array<Vector2>): Vector2;
        static RightTop(ps: Array<Vector2>): Vector2;
        static RightBottom(ps: Array<Vector2>): Vector2;
        static LeftBottom(ps: Array<Vector2>): Vector2;
        static get MaxValue(): Vector2;
        static get MinValue(): Vector2;
        SetMaxValue(): Vector2;
        SetMinValue(): Vector2;
        Set(x: number | Vector2, y: number): Vector2;
        Equals(other: Vector2): boolean;
        EpsilonEquals(point1: Vector2, epsilon?: number): boolean;
        static EpsilonEquals(point0: Vector2, point1: Vector2, epsilon?: number): boolean;
        Length(): number;
        LengthSquareduared(): number;
        static Distance(value1: Vector2, value2: Vector2): number;
        static DistanceSquared(value1: Vector2, value2: Vector2): number;
        static Dot(a: Vector2, b: Vector2): number;
        Normalize(): Vector2;
        static Normalize(value: Vector2, result?: Vector2): Vector2;
        SetNormalize(value: Vector2): Vector2;
        static Reflect(vector: Vector2, normal: Vector2, result?: Vector2): Vector2;
        SetReflect(vector: Vector2, normal: Vector2): Vector2;
        static Min(value1: Vector2, value2: Vector2, result?: Vector2): Vector2;
        SetMin(value1: Vector2, value2: Vector2): Vector2;
        static Max(value1: Vector2, value2: Vector2, result?: Vector2): Vector2;
        SetMax(value1: Vector2, value2: Vector2): Vector2;
        static Clamp(value1: Vector2, min: Vector2, max: Vector2, result?: Vector2): Vector2;
        SetClamp(value1: Vector2, min: Vector2, max: Vector2): Vector2;
        static Lerp(value1: Vector2, value2: Vector2, amount: number, result?: Vector2): Vector2;
        SetLerp(value1: Vector2, value2: Vector2, amount: number): Vector2;
        static Barycentric(value1: Vector2, value2: Vector2, value3: Vector2, amount1: number, amount2: number, result?: Vector2): Vector2;
        SetBarycentric(value1: Vector2, value2: Vector2, value3: Vector2, amount1: number, amount2: number): Vector2;
        static SmoothStep(value1: Vector2, value2: Vector2, amount: number, result?: Vector2): Vector2;
        SetSmoothStep(value1: Vector2, value2: Vector2, amount: number): Vector2;
        static CatmullRom(value1: Vector2, value2: Vector2, value3: Vector2, value4: Vector2, amount: number, result: Vector2): Vector2;
        SetCatmullRom(value1: Vector2, value2: Vector2, value3: Vector2, value4: Vector2, amount: number): Vector2;
        static Hermite(value1: Vector2, tangent1: Vector2, value2: Vector2, tangent2: Vector2, amount: number, result?: Vector2): Vector2;
        SetHermite(value1: Vector2, tangent1: Vector2, value2: Vector2, tangent2: Vector2, amount: number): Vector2;
        Transform(matrix: Matrix4): void;
        static Transform(position: Vector2, matrix: Matrix4, result?: Vector2): Vector2;
        SetTransform(position: Vector2, matrix: Matrix4): Vector2;
        static TransformNormal(normal: Vector2, matrix: Matrix4, result?: Vector2): Vector2;
        SetTransformNormal(normal: Vector2, matrix: Matrix4): Vector2;
        static TransformQuaternion(value: Vector2, rotation: Quaternion, result?: Vector2): Vector2;
        SetTransformQuaternion(value: Vector2, rotation: Quaternion): Vector2;
        Negate(): Vector2;
        static Negate(value: Vector2, result?: Vector2): Vector2;
        SetNegate(value: Vector2): Vector2;
        Add(value1: Vector2): Vector2;
        static Add(value1: Vector2, value2: Vector2, result?: Vector2): Vector2;
        SetAdd(value1: Vector2, value2: Vector2): Vector2;
        ScaleAdd(scale: number, dir: Vector2): Vector2;
        static ScaleAdd(pos: Vector2, scale: number, dir: Vector2, result?: Vector2): Vector2;
        SetScaleAdd(pos: Vector2, scale: number, dir: Vector2): Vector2;
        Subtract(value1: Vector2): Vector2;
        static Subtract(value1: Vector2, value2: Vector2, result?: Vector2): Vector2;
        SetSubtract(value1: Vector2, value2: Vector2): Vector2;
        Multiply(value1: Vector2): Vector2;
        static Multiply(value1: Vector2, value2: Vector2, result?: Vector2): Vector2;
        SetMultiply(value1: Vector2, value2: Vector2): Vector2;
        Scale(scaleFactor: number): Vector2;
        static Scale(value1: Vector2, scaleFactor: number, result?: Vector2): Vector2;
        SetScale(value1: Vector2, scaleFactor: number): Vector2;
        Divide(value1: Vector2): Vector2;
        static Divide(value1: Vector2, value2: Vector2, result?: Vector2): Vector2;
        SetDivide(value1: Vector2, value2: Vector2): Vector2;
        Minimize(other: Vector2 | Vector2[]): Vector2;
        static Minimize(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        SetMinimize(left: Vector2, right: Vector2): Vector2;
        Maximize(other: Vector2 | Vector2[]): Vector2;
        static Maximize(left: Vector2, right: Vector2, result?: Vector2): Vector2;
        SetMaximize(left: Vector2, right: Vector2): Vector2;
        FromArray(array: ArrayLike<number>, index?: number): Vector2;
        ToArray(array: number[] | Float32Array | Float64Array, index?: number): Vector2;
        AsArray(): number[];
        static Create(x: number, y: number): Vector2;
        static get Zero(): Vector2;
        static get One(): Vector2;
        static get UnitX(): Vector2;
        static get UnitY(): Vector2;
        SetZero(): Vector2;
        SetOne(): Vector2;
        SetUnitX(): Vector2;
        SetUnitY(): Vector2;
        get IsZero(): boolean;
        static TransformValues(values: number[] | Float32Array | Float64Array, matrix: Matrix4): void;
        static NormalizeValues(values: number[] | Float32Array | Float64Array, matrix: Matrix4): void;
    }
}
declare namespace U1 {
    class Vector3 implements U1.IUValue {
        X: number;
        Y: number;
        Z: number;
        static Dot(a: Vector3, b: Vector3): number;
        Dot(b: Vector3): number;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        toString(): string;
        constructor(x?: number | Vector3 | Vector2, y?: number, z?: number);
        static Create(x: number, y: number, z: number): Vector3;
        Set(x: number | Vector3, y?: number, z?: number): this;
        Clone(): Vector3;
        CopyFrom(source: Vector3): Vector3;
        static get Zero(): Vector3;
        SetZero(): Vector3;
        get IsZero(): boolean;
        static get One(): Vector3;
        SetOne(): Vector3;
        get IsOne(): boolean;
        static get UnitX(): Vector3;
        SetUnitX(): Vector3;
        get IsUnitX(): boolean;
        static get UnitY(): Vector3;
        SetUnitY(): Vector3;
        get IsUnitY(): boolean;
        static get UnitZ(): Vector3;
        SetUnitZ(): Vector3;
        get IsUnitZ(): boolean;
        static get Up(): Vector3;
        SetUp(): Vector3;
        static get Down(): Vector3;
        SetDown(): Vector3;
        static get Right(): Vector3;
        SetRight(): Vector3;
        static get Left(): Vector3;
        SetLeft(): Vector3;
        static get Forward(): Vector3;
        SetForward(): Vector3;
        static get Backward(): Vector3;
        SetBackward(): Vector3;
        get IsMaxValue(): boolean;
        static get MaxValue(): Vector3;
        SetMaxValue(): Vector3;
        static get MinValue(): Vector3;
        SetMinValue(): Vector3;
        get IsMinValue(): boolean;
        Equals(other: Vector3): boolean;
        static Equals(value1: Vector3, value2: Vector3): boolean;
        EpsilonEquals(other: Vector3, epsilon: number): boolean;
        static EpsilonEquals(point0: Vector3, point1: Vector3, epsilon?: number): boolean;
        static Length(offset: Vector3): number;
        Length(): number;
        LengthSquareduared(): number;
        static Distance(value1: Vector3, value2: Vector3): number;
        Distance(value2: Vector3): number;
        static DistanceSquared(value1: Vector3, value2: Vector3): number;
        DistanceSquared(value2: Vector3): number;
        Normalize(): Vector3;
        static Normalize(value: Vector3, result?: Vector3): Vector3;
        SetNormalize(value: Vector3): Vector3;
        static Cross(vector1: Vector3, vector2: Vector3, result?: Vector3): Vector3;
        SetCross(vector1: Vector3, vector2: Vector3): Vector3;
        Cross(vector2: Vector3): Vector3;
        static Reflect(vector: Vector3, normal: Vector3, result?: Vector3): Vector3;
        SetReflect(vector: Vector3, normal: Vector3): Vector3;
        Reflect(normal: Vector3): Vector3;
        static Min(v1: Vector3, v2: Vector3, result?: Vector3): Vector3;
        static Min1(vs: Vector3[], res?: Vector3): Vector3;
        SetMin(v1: Vector3, v2: Vector3): Vector3;
        static Max(v1: Vector3, v2: Vector3, res?: Vector3): Vector3;
        static Max1(vs: Vector3[], result?: Vector3): Vector3;
        SetMax(value1: Vector3, value2: Vector3): Vector3;
        static Clamp(value1: Vector3, min: Vector3, max: Vector3, result?: Vector3): Vector3;
        SetClamp(value1: Vector3, min: Vector3, max: Vector3): Vector3;
        static Lerp(value1: Vector3, value2: Vector3, amount: number, result?: Vector3): Vector3;
        SetLerp(value1: Vector3, value2: Vector3, amount: number): Vector3;
        Lerp(value2: Vector3, amount: number): Vector3;
        static Barycentric(value1: Vector3, value2: Vector3, value3: Vector3, amount1: number, amount2: number, result?: Vector3): Vector3;
        SetBarycentric(value1: Vector3, value2: Vector3, value3: Vector3, amount1: number, amount2: number): Vector3;
        Barycentric(value2: Vector3, value3: Vector3, amount1: number, amount2: number): Vector3;
        static SmoothStep(value1: Vector3, value2: Vector3, amount: number, result?: Vector3): Vector3;
        SetSmoothStep(value1: Vector3, value2: Vector3, amount: number): Vector3;
        SmoothStep(value2: Vector3, amount: number): Vector3;
        static CatmullRom(value1: Vector3, value2: Vector3, value3: Vector3, value4: Vector3, amount: number, result?: Vector3): Vector3;
        SetCatmullRom(value1: Vector3, value2: Vector3, value3: Vector3, value4: Vector3, amount: number): Vector3;
        CatmullRom(value2: Vector3, value3: Vector3, value4: Vector3, amount: number): Vector3;
        static Hermite(value1: Vector3, tangent1: Vector3, value2: Vector3, tangent2: Vector3, amount: number, result?: Vector3): Vector3;
        SetHermite(value1: Vector3, tangent1: Vector3, value2: Vector3, tangent2: Vector3, amount: number): Vector3;
        static Transform(position: Vector3, matrix: Matrix4, result?: Vector3): Vector3;
        SetTransform(position: Vector3, matrix: Matrix4): Vector3;
        Transform(matrix: Matrix4): Vector3;
        static TransformNormal(normal: Vector3, matrix: Matrix4, result?: Vector3): Vector3;
        SetTransformNormal(normal: Vector3, matrix: Matrix4): Vector3;
        TransformNormal(matrix: Matrix4): Vector3;
        static Negate(value: Vector3, result?: Vector3): Vector3;
        SetNegate(value: Vector3): Vector3;
        Negate(): Vector3;
        static Add(value1: Vector3, value2: Vector3, result?: Vector3): Vector3;
        SetAdd(value1: Vector3, value2: Vector3): Vector3;
        Add(value2: Vector3): Vector3;
        static Subtract(value1: Vector3, value2: Vector3, result?: Vector3): Vector3;
        SetSubtract(value1: Vector3, value2: Vector3): Vector3;
        Subtract(value2: Vector3): Vector3;
        static Multiply(value1: Vector3, value2: Vector3, result?: Vector3): Vector3;
        SetMultiply(value1: Vector3, value2: Vector3): Vector3;
        Multiply(value2: Vector3): Vector3;
        static Scale(value1: Vector3, scaleFactor: number, result?: Vector3): Vector3;
        SetScale(value1: Vector3, scaleFactor: number): Vector3;
        Scale(scaleFactor: number): Vector3;
        static ScaleAdd(pos: Vector3, scale: number, dir: Vector3, result?: Vector3): Vector3;
        SetScaleAdd(pos: Vector3, scale: number, dir: Vector3): Vector3;
        ScaleAdd(scale: number, dir: Vector3): Vector3;
        static Divide(value1: Vector3, value2: Vector3, result?: Vector3): Vector3;
        SetDivide(value1: Vector3, value2: Vector3): Vector3;
        Divide(value2: Vector3): Vector3;
        static Project(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4, screenSize: Vector2, mindepth: number, maxdepth: number, result?: Vector3): Vector3;
        SetProject(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4, screenSize: Vector2, mindepth: number, maxdepth: number): Vector3;
        Minimize(other: Vector3 | Vector3[]): Vector3;
        static Minimize(left: Vector3, right: Vector3, result?: Vector3): Vector3;
        SetMinimize(left: Vector3, right: Vector3): Vector3;
        Maximize(other: Vector3 | Vector3[]): Vector3;
        static Maximize(left: Vector3, right: Vector3, result: Vector3): Vector3;
        SetMaximize(left: Vector3, right: Vector3): Vector3;
        XY(result?: Vector2): Vector2;
        YZ(result?: Vector2): Vector2;
        FromArray(array: ArrayLike<number>, index?: number): Vector3;
        ToArray(array: number[] | Float32Array | Float64Array, index?: number): Vector3;
        static TransformValues(values: number[] | Float32Array | Float64Array, matrix: Matrix4): void;
        static TransformNormalValues(values: number[] | Float32Array | Float64Array, matrix: Matrix4): void;
        static NormalizeValues(values: number[] | Float32Array | Float64Array, matrix: Matrix4): void;
    }
}
declare namespace U1 {
    class Vector4 implements U1.IUValue {
        X: number;
        Y: number;
        Z: number;
        W: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        toString(): string;
        Set(x?: number, y?: number, z?: number, w?: number): Vector4;
        static get Zero(): Vector4;
        static ZeroRef(ref: Vector4): Vector4;
        SetZero(): Vector4;
        static get One(): Vector4;
        SetOne(): Vector4;
        static get UnitX(): Vector4;
        SetUnitX(): Vector4;
        static get UnitY(): Vector4;
        SetUnitY(ref: Vector4): Vector4;
        static get UnitZ(): Vector4;
        SetUnitZ(ref: Vector4): Vector4;
        static get UnitW(): Vector4;
        SetUnitW(ref: Vector4): Vector4;
        GetXYZ(result?: Vector3): Vector3;
        Clone(): Vector4;
        CopyFrom(source: Vector4): Vector4;
        static FromArray(array: number[], offset?: number): Vector4;
        Equals(other: Vector4): boolean;
        EpsilonEquals(other: Vector4, epsilon: number): boolean;
        static EpsilonEquals(point0: Vector4, point1: Vector4, epsilon?: number): boolean;
        Length(): number;
        LengthXYZ(): number;
        LengthSquareduared(): number;
        LengthSquareduaredXYZ(): number;
        static Distance(value1: Vector4, value2: Vector4): number;
        static DistanceSquared(value1: Vector4, value2: Vector4): number;
        static Dot(vector1: Vector4, vector2: Vector4): number;
        Normalize(): void;
        static Normalize(vector: Vector4, result?: Vector4): Vector4;
        SetNormalize(vector: Vector4): Vector4;
        static Min(value1: Vector4, value2: Vector4, result?: Vector4): Vector4;
        SetMin(value1: Vector4, value2: Vector4): Vector4;
        static Max(value1: Vector4, value2: Vector4, result?: Vector4): Vector4;
        SetMax(value1: Vector4, value2: Vector4): Vector4;
        static Clamp(value1: Vector4, min: Vector4, max: Vector4, result?: Vector4): Vector4;
        SetClamp(value1: Vector4, min: Vector4, max: Vector4): Vector4;
        static Lerp(value1: Vector4, value2: Vector4, amount: number, result?: Vector4): Vector4;
        SetLerp(value1: Vector4, value2: Vector4, amount: number): Vector4;
        static Barycentric(value1: Vector4, value2: Vector4, value3: Vector4, amount1: number, amount2: number, result?: Vector4): Vector4;
        SetBarycentric(value1: Vector4, value2: Vector4, value3: Vector4, amount1: number, amount2: number): Vector4;
        static SmoothStepRef(value1: Vector4, value2: Vector4, amount: number, result?: Vector4): Vector4;
        SetSmoothStep(value1: Vector4, value2: Vector4, amount: number): Vector4;
        static CatmullRomRef(value1: Vector4, value2: Vector4, value3: Vector4, value4: Vector4, amount: number, result?: Vector4): Vector4;
        SetCatmullRom(value1: Vector4, value2: Vector4, value3: Vector4, value4: Vector4, amount: number): Vector4;
        static HermiteRef(value1: Vector4, tangent1: Vector4, value2: Vector4, tangent2: Vector4, amount: number, result?: Vector4): Vector4;
        SetHermite(value1: Vector4, tangent1: Vector4, value2: Vector4, tangent2: Vector4, amount: number): Vector4;
        static TransformVector2(position: Vector2, matrix: Matrix4, result?: Vector4): Vector4;
        SetTransformVector2(position: Vector2, matrix: Matrix4): Vector4;
        static TransformVector3(position: Vector3, matrix: Matrix4, result?: Vector4): Vector4;
        SetTransformVector3(position: Vector3, matrix: Matrix4): Vector4;
        static Transform(vector: Vector4, matrix: Matrix4, result?: Vector4): Vector4;
        SetTransform(vector: Vector4, matrix: Matrix4): Vector4;
        static TransformVector2Quaternion(value: Vector2, rotation: Quaternion, result?: Vector4): Vector4;
        SetTransformVector2Quaternion(value: Vector2, rotation: Quaternion): Vector4;
        static TransformVector3Quaternion(value: Vector3, rotation: Quaternion, result?: Vector4): Vector4;
        SetTransformVector3Quaternion(value: Vector3, rotation: Quaternion): Vector4;
        static TransformVector4Quaternion(value: Vector4, rotation: Quaternion, result?: Vector4): Vector4;
        SetTransformVector4Quaternion(value: Vector4, rotation: Quaternion): Vector4;
        static Negate(value: Vector4, result: Vector4): Vector4;
        SetNegate(value: Vector4): Vector4;
        Negate(): Vector4;
        static Add(value1: Vector4, value2: Vector4, result?: Vector4): Vector4;
        SetAdd(value1: Vector4, value2: Vector4): Vector4;
        Add(value1: Vector4): Vector4;
        static Subtract(value1: Vector4, value2: Vector4, result?: Vector4): Vector4;
        SetSubtract(value1: Vector4, value2: Vector4): Vector4;
        Subtract(value2: Vector4): Vector4;
        static Multiply(value1: Vector4, value2: Vector4, result?: Vector4): Vector4;
        SetMultiply(value1: Vector4, value2: Vector4): Vector4;
        Multiply(value2: Vector4): Vector4;
        static Scale(value1: Vector4, scaleFactor: number, result?: Vector4): Vector4;
        SetScale(value1: Vector4, scaleFactor: number): Vector4;
        Scale(scaleFactor: number): Vector4;
        static Divide(value1: Vector4, value2: Vector4, result?: Vector4): Vector4;
        SetDivide(value1: Vector4, value2: Vector4): Vector4;
        Divide(value2: Vector4): Vector4;
        FromArray(array: ArrayLike<number>, index?: number): this;
        ToArray(array: number[] | Float32Array | Float64Array, index?: number): this;
    }
}
declare namespace U1 {
    class Ray2 implements U1.IUValue {
        Position: Vector2;
        Direction: Vector2;
        constructor(position?: Vector2, direction?: Vector2);
        Clone(): Ray2;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        CopyFrom(source: Ray2): void;
        Equals(other: Ray2): boolean;
        static DistanceSquared(ray: Ray2, pt: Vector2): number;
        static Distance(ray: Ray2, pt: Vector2): number;
    }
}
declare namespace U1 {
    class Ray3 implements U1.IUValue {
        private static tmp;
        Position: Vector3;
        Direction: Vector3;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        Equals(other: Ray3): boolean;
        CopyFrom(other: Ray3): Ray3;
        Clone(): Ray3;
        constructor(position?: Vector3, direction?: Vector3);
        IntersectsBoundingBox(box: BoundingBox): number;
        IntersectsBoundingFrustum(frustum: BoundingFrustum): number;
        IntersectsPlane(plane: Plane): number;
        IntersectsBoundingSphere(sphere: BoundingSphere): number;
        static DistanceSquared(ray: Ray3, point: Vector3): number;
        static DistanceSquared1(ray_p: Vector3, ray_dir: Vector3, point: Vector3): number;
        Transform(matrix: Matrix4): Ray3;
    }
}
declare namespace U1 {
    class Segment2 {
        Start: Vector2;
        End: Vector2;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        constructor(start?: Vector2, end?: Vector2);
        Equals(other: Segment2): boolean;
        static CheckCross(seg0: Segment2, seg1: Segment2, result?: Vector2): Vector2;
        static IsIntersectPolylines(source: Vector2[], target: Vector2[]): boolean;
        static DistanceSquaredPoint(segment: Segment2, point: Vector2): number;
        static DistancePoint(segment: Segment2, point: Vector2): number;
    }
}
declare namespace U1 {
    class Matrix4 implements U1.IUValue {
        private m;
        get M11(): number;
        set M11(value: number);
        get M12(): number;
        set M12(value: number);
        get M13(): number;
        set M13(value: number);
        get M14(): number;
        set M14(value: number);
        get M21(): number;
        set M21(value: number);
        get M22(): number;
        set M22(value: number);
        get M23(): number;
        set M23(value: number);
        get M24(): number;
        set M24(value: number);
        get M31(): number;
        set M31(value: number);
        get M32(): number;
        set M32(value: number);
        get M33(): number;
        set M33(value: number);
        get M34(): number;
        set M34(value: number);
        get M41(): number;
        set M41(value: number);
        get M42(): number;
        set M42(value: number);
        get M43(): number;
        set M43(value: number);
        get M44(): number;
        set M44(value: number);
        private static tv0;
        private static tv1;
        private static tv2;
        private static tv3;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        Clone(): Matrix4;
        Equals(other: Matrix4): boolean;
        CopyFrom(other: Matrix4): Matrix4;
        constructor(m11?: number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number);
        Set(m11?: number, m12?: number, m13?: number, m14?: number, m21?: number, m22?: number, m23?: number, m24?: number, m31?: number, m32?: number, m33?: number, m34?: number, m41?: number, m42?: number, m43?: number, m44?: number): this;
        static get Identity(): Matrix4;
        SetIdentity(): Matrix4;
        get Up(): Vector3;
        set Up(value: Vector3);
        GetUp(result?: Vector3): Vector3;
        get Down(): Vector3;
        set Down(value: Vector3);
        GetDown(result?: Vector3): Vector3;
        get Right(): Vector3;
        set Right(value: Vector3);
        GetRight(result?: Vector3): Vector3;
        get Left(): Vector3;
        set Left(value: Vector3);
        GetLeft(result?: Vector3): Vector3;
        get Forward(): Vector3;
        set Forward(value: Vector3);
        GetForward(result?: Vector3): Vector3;
        get Backward(): Vector3;
        set Backward(value: Vector3);
        GetBackward(result?: Vector3): Vector3;
        get Translation(): Vector3;
        set Translation(value: Vector3);
        GetTranslation(result?: Vector3): Vector3;
        static CreateFromAxes(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3, result?: Matrix4): Matrix4;
        static CreateBillboard(objectPosition: Vector3, cameraPosition: Vector3, cameraUpVector: Vector3, cameraForwardVector: Vector3, result?: Matrix4): Matrix4;
        SetCreateBillboard(objectPosition: Vector3, cameraPosition: Vector3, cameraUpVector: Vector3, cameraForwardVector: Vector3): Matrix4;
        static CreateConstrainedBillboard(objectPosition: Vector3, cameraPosition: Vector3, rotateAxis: Vector3, cameraForwardVector: Vector3, objectForwardVector: Vector3, result?: Matrix4): Matrix4;
        SetCreateConstrainedBillboard(objectPosition: Vector3, cameraPosition: Vector3, rotateAxis: Vector3, cameraForwardVector: Vector3, objectForwardVector: Vector3): Matrix4;
        static CreateTranslation(position: Vector3, result?: Matrix4): Matrix4;
        static CreateTranslationFloats(x: number, y: number, z: number, result?: Matrix4): Matrix4;
        SetCreateTranslation(position: Vector3): Matrix4;
        SetCreateTranslationFloats(x: number, y: number, z: number): Matrix4;
        static CreateScaleByFloats(xScale: number, yScale: number, zScale: number, result?: Matrix4): Matrix4;
        SetCreateScaleByFloats(xScale: number, yScale: number, zScale: number): Matrix4;
        static CreateScale(scales: Vector3, reslut?: Matrix4): Matrix4;
        SetCreateScale(scales: Vector3): Matrix4;
        static CreateRotationX(radians: number, result?: Matrix4): Matrix4;
        SetCreateRotationX(radians: number): Matrix4;
        static CreateRotationY(radians: number, result?: Matrix4): Matrix4;
        SetCreateRotationY(radians: number): Matrix4;
        static CreateRotationZ(radians: number, result?: Matrix4): Matrix4;
        SetCreateRotationZ(radians: number): Matrix4;
        static CreateFromAxisAngle(axis: Vector3, angle: number, result?: Matrix4): Matrix4;
        SetCreateFromAxisAngle(axis: Vector3, angle: number): Matrix4;
        static CreatePerspectiveFieldOfView(fieldOfView: number, aspectRatio: number, nearPlaneDistance: number, farPlaneDistance: number, result?: Matrix4): Matrix4;
        SetCreatePerspectiveFieldOfView(fieldOfView: number, aspectRatio: number, nearPlaneDistance: number, farPlaneDistance: number): Matrix4;
        static CreatePerspective(width: number, height: number, nearPlaneDistance: number, farPlaneDistance: number): Matrix4;
        SetCreatePerspective(width: number, height: number, nearPlaneDistance: number, farPlaneDistance: number): Matrix4;
        static CreatePerspectiveOffCenter(left: number, right: number, bottom: number, top: number, nearPlaneDistance: number, farPlaneDistance: number, result?: Matrix4): Matrix4;
        SetCreatePerspectiveOffCenter(left: number, right: number, bottom: number, top: number, nearPlaneDistance: number, farPlaneDistance: number): Matrix4;
        static CreateOrthographic(width: number, height: number, zNearPlane: number, zFarPlane: number, result?: Matrix4): Matrix4;
        SetCreateOrthographic(width: number, height: number, zNearPlane: number, zFarPlane: number): Matrix4;
        static CreateOrthographicOffCenter(left: number, right: number, bottom: number, top: number, zNearPlane: number, zFarPlane: number, result?: Matrix4): Matrix4;
        SetCreateOrthographicOffCenter(left: number, right: number, bottom: number, top: number, zNearPlane: number, zFarPlane: number): Matrix4;
        static CreateLookAt(cameraPosition: Vector3, cameraTarget: Vector3, cameraUpVector: Vector3, result?: Matrix4): Matrix4;
        SetCreateLookAt(cameraPosition: Vector3, cameraTarget: Vector3, cameraUpVector: Vector3): Matrix4;
        static CreateWorld(position: Vector3, forward: Vector3, up: Vector3, result?: Matrix4): Matrix4;
        static CreateWorldFormXY(pos: Vector3, xdir: Vector3, ydir: Vector3, result?: Matrix4): Matrix4;
        SetCreateWorldFormXY(pos: Vector3, xdir: Vector3, ydir: Vector3): Matrix4;
        SetCreateWorld(position: Vector3, forward: Vector3, up: Vector3): Matrix4;
        static CreateFromQuaternion(quaternion: Quaternion, result?: Matrix4): Matrix4;
        SetCreateFromQuaternion(quaternion: Quaternion): Matrix4;
        static CreateFromYawPitchRoll(yaw: number, pitch: number, roll: number, result?: Matrix4): Matrix4;
        SetCreateFromYawPitchRoll(yaw: number, pitch: number, roll: number): Matrix4;
        static CreateShadow(lightDirection: Vector3, plane: Plane, result?: Matrix4): Matrix4;
        SetCreateShadow(lightDirection: Vector3, plane: Plane): Matrix4;
        static CreateReflection(value: Plane, result?: Matrix4): Matrix4;
        SetCreateReflection(value: Plane): Matrix4;
        static TransformByQuaternion(value: Matrix4, rotation: Quaternion, result?: Matrix4): Matrix4;
        SetTransformByQuaternion(value: Matrix4, rotation: Quaternion): Matrix4;
        static Transpose(matrix: Matrix4, result?: Matrix4): Matrix4;
        SetTranspose(matrix: Matrix4): Matrix4;
        Determinant(): number;
        static Invert(matrix: Matrix4, result?: Matrix4): Matrix4;
        SetInvert(source: Matrix4): Matrix4;
        Invert(): Matrix4;
        static Lerp(matrix1: Matrix4, matrix2: Matrix4, amount: number, result?: Matrix4): Matrix4;
        SetLerp(matrix1: Matrix4, matrix2: Matrix4, amount: number): Matrix4;
        static Negate(matrix: Matrix4, result?: Matrix4): Matrix4;
        SetNegate(matrix: Matrix4): Matrix4;
        Negate(matrix: Matrix4): Matrix4;
        static Add(matrix1: Matrix4, matrix2: Matrix4, result?: Matrix4): Matrix4;
        SetAdd(matrix1: Matrix4, matrix2: Matrix4): Matrix4;
        Add(matrix2: Matrix4): Matrix4;
        static Subtract(matrix1: Matrix4, matrix2: Matrix4, result?: Matrix4): Matrix4;
        SetSubtract(matrix1: Matrix4, matrix2: Matrix4): Matrix4;
        Subtract(matrix2: Matrix4): Matrix4;
        static Multiply(matrix1: Matrix4, matrix2: Matrix4, result?: Matrix4): Matrix4;
        SetMultiply(m1: Matrix4, m2: Matrix4): Matrix4;
        Multiply(matrix2: Matrix4): Matrix4;
        static Scale(matrix1: Matrix4, scaleFactor: number, result?: Matrix4): Matrix4;
        SetScale(matrix1: Matrix4, scaleFactor: number): Matrix4;
        Scale(scaleFactor: number): Matrix4;
        static Divide(matrix1: Matrix4, matrix2: Matrix4, result?: Matrix4): Matrix4;
        SetDivide(matrix1: Matrix4, matrix2: Matrix4): Matrix4;
        Divide(matrix2: Matrix4): Matrix4;
        static DivideFloat(matrix1: Matrix4, divider: number, result?: Matrix4): Matrix4;
        SetDivideFloat(matrix1: Matrix4, divider: number): Matrix4;
        get M1(): Vector4;
        set M1(value: Vector4);
        GetM1(result?: Vector4): Vector4;
        get M2(): Vector4;
        set M2(value: Vector4);
        GetM2(result?: Vector4): Vector4;
        get M3(): Vector4;
        set M3(value: Vector4);
        GetM3(result?: Vector4): Vector4;
        get M4(): Vector4;
        set M4(value: Vector4);
        GetM4(result?: Vector4): Vector4;
        ToSRT(Scale: Vector3, AxisAngle: Vector4, Loc: Vector3): void;
    }
}
declare namespace U1 {
    class Circle2 {
        Center: Vector2;
        Radius: number;
        constructor(center?: Vector2, radius?: number);
        Equals(other: Circle2): boolean;
        static IsIntersectPolyline(center: Vector2, sqRadius: number, path: Array<Vector2>): boolean;
        static IsIntersectPolygon(center: Vector2, sqRadius: number, path: Array<Vector2>): boolean;
    }
}
declare namespace U1 {
    class Color implements U1.IUValue {
        A: number;
        R: number;
        G: number;
        B: number;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        Equals(other: Color): boolean;
        CopyFrom(other: Color): void;
        Clone(): Color;
        constructor(r?: number, g?: number, b?: number, a?: number);
        static FromUInt32(argb: number): Color;
        toString(): string;
        toHexString(): string;
        toHexRGBString(): string;
        static fromHexString(strVal: string): Color;
        toVector4(): Vector4;
    }
}
declare namespace U1 {
    class Colors {
        static get AliceBlue(): Color;
        static get AntiqueWhite(): Color;
        static get Aqua(): Color;
        static get Aquamarine(): Color;
        static get Azure(): Color;
        static get Beige(): Color;
        static get Bisque(): Color;
        static get Black(): Color;
        static get BlanchedAlmond(): Color;
        static get Blue(): Color;
        static get BlueViolet(): Color;
        static get Brown(): Color;
        static get BurlyWood(): Color;
        static get CadetBlue(): Color;
        static get Chartreuse(): Color;
        static get Chocolate(): Color;
        static get Coral(): Color;
        static get CornflowerBlue(): Color;
        static get Cornsilk(): Color;
        static get Crimson(): Color;
        static get Cyan(): Color;
        static get DarkBlue(): Color;
        static get DarkCyan(): Color;
        static get DarkGoldenrod(): Color;
        static get DarkGray(): Color;
        static get DarkGreen(): Color;
        static get DarkKhaki(): Color;
        static get DarkMagenta(): Color;
        static get DarkOliveGreen(): Color;
        static get DarkOrange(): Color;
        static get DarkOrchid(): Color;
        static get DarkRed(): Color;
        static get DarkSalmon(): Color;
        static get DarkSeaGreen(): Color;
        static get DarkSlateBlue(): Color;
        static get DarkSlateGray(): Color;
        static get DarkTurquoise(): Color;
        static get DarkViolet(): Color;
        static get DeepPink(): Color;
        static get DeepSkyBlue(): Color;
        static get DimGray(): Color;
        static get DodgerBlue(): Color;
        static get Firebrick(): Color;
        static get FloralWhite(): Color;
        static get ForestGreen(): Color;
        static get Fuchsia(): Color;
        static get Gainsboro(): Color;
        static get GhostWhite(): Color;
        static get Gold(): Color;
        static get Goldenrod(): Color;
        static get Gray(): Color;
        static get Green(): Color;
        static get GreenYellow(): Color;
        static get Honeydew(): Color;
        static get HotPink(): Color;
        static get IndianRed(): Color;
        static get Indigo(): Color;
        static get Ivory(): Color;
        static get Khaki(): Color;
        static get Lavender(): Color;
        static get LavenderBlush(): Color;
        static get LawnGreen(): Color;
        static get LemonChiffon(): Color;
        static get LightBlue(): Color;
        static get LightCoral(): Color;
        static get LightCyan(): Color;
        static get LightGoldenrodYellow(): Color;
        static get LightGray(): Color;
        static get LightGreen(): Color;
        static get LightPink(): Color;
        static get LightSalmon(): Color;
        static get LightSeaGreen(): Color;
        static get LightSkyBlue(): Color;
        static get LightSlateGray(): Color;
        static get LightSteelBlue(): Color;
        static get LightYellow(): Color;
        static get Lime(): Color;
        static get LimeGreen(): Color;
        static get Linen(): Color;
        static get Magenta(): Color;
        static get Maroon(): Color;
        static get MediumAquamarine(): Color;
        static get MediumBlue(): Color;
        static get MediumOrchid(): Color;
        static get MediumPurple(): Color;
        static get MediumSeaGreen(): Color;
        static get MediumSlateBlue(): Color;
        static get MediumSpringGreen(): Color;
        static get MediumTurquoise(): Color;
        static get MediumVioletRed(): Color;
        static get MidnightBlue(): Color;
        static get MintCream(): Color;
        static get MistyRose(): Color;
        static get Moccasin(): Color;
        static get NavajoWhite(): Color;
        static get Navy(): Color;
        static get OldLace(): Color;
        static get Olive(): Color;
        static get OliveDrab(): Color;
        static get Orange(): Color;
        static get OrangeRed(): Color;
        static get Orchid(): Color;
        static get PaleGoldenrod(): Color;
        static get PaleGreen(): Color;
        static get PaleTurquoise(): Color;
        static get PaleVioletRed(): Color;
        static get PapayaWhip(): Color;
        static get PeachPuff(): Color;
        static get Peru(): Color;
        static get Pink(): Color;
        static get Plum(): Color;
        static get PowderBlue(): Color;
        static get Purple(): Color;
        static get Red(): Color;
        static get RosyBrown(): Color;
        static get RoyalBlue(): Color;
        static get SaddleBrown(): Color;
        static get Salmon(): Color;
        static get SandyBrown(): Color;
        static get SeaGreen(): Color;
        static get SeaShell(): Color;
        static get Sienna(): Color;
        static get Silver(): Color;
        static get SkyBlue(): Color;
        static get SlateBlue(): Color;
        static get SlateGray(): Color;
        static get Snow(): Color;
        static get SpringGreen(): Color;
        static get SteelBlue(): Color;
        static get Tan(): Color;
        static get Teal(): Color;
        static get Thistle(): Color;
        static get Tomato(): Color;
        static get Transparent(): Color;
        static get Turquoise(): Color;
        static get Violet(): Color;
        static get Wheat(): Color;
        static get White(): Color;
        static get WhiteSmoke(): Color;
        static get Yellow(): Color;
        static get YellowGreen(): Color;
    }
}
declare namespace U1 {
    enum LightTypeEnum {
        POINT = 1,
        SPOT = 2,
        DIRECTIONAL = 3
    }
    class Light implements U1.IUValue {
        Type: LightTypeEnum;
        Diffuse: Color;
        Specular: Color;
        Ambient: Color;
        Position: Vector3;
        Direction: Vector3;
        Range: number;
        Falloff: number;
        Attenuation0: number;
        Attenuation1: number;
        Attenuation2: number;
        Theta: number;
        Phi: number;
        Clone(): Light;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        CopyFrom(source: Light): void;
        Equals(source: Light): boolean;
    }
}
declare namespace U1 {
    class Line2 {
        Position: Vector2;
        Direction: Vector2;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        Equals(other: Line2): boolean;
        constructor(position?: Vector2, direction?: Vector2);
        CopyFrom(line2: Line2): void;
        CopyFromRay(ray: Ray2): void;
        static GetIntersectPoint(line0: Line2, line1: Line2, result?: Vector2): Vector2;
        static GetIntersectInfo(line0: Line2, line1: Line2, result?: {
            IsectP: Vector2;
            s: number;
            t: number;
        }): {
            IsectP: Vector2;
            s: number;
            t: number;
        };
        static DistanceSquared(line: Line2, point: Vector2): number;
    }
}
declare namespace U1 {
    class OrientedBox3 {
        Axes: Vector3[];
        Center: Vector3;
        Extents: number[];
        constructor(src?: OrientedBox3);
        CopyFrom(src: OrientedBox3): this;
        get Radius(): number;
        get IsEmpty(): boolean;
        Clone(): OrientedBox3;
        static get Empty(): OrientedBox3;
        static get Identity(): OrientedBox3;
        SetIdentity(): this;
        static CheckIntersect(rkBox0: OrientedBox3, rkBox1: OrientedBox3): boolean;
        static GetOrientMatrix(obx: OrientedBox3, result?: Matrix4): Matrix4;
        static GetMatrix(obx: OrientedBox3, result?: Matrix4): Matrix4;
        GetMatrix(result?: Matrix4): Matrix4;
        GetOrientMatrix(result?: Matrix4): Matrix4;
        LFB(result?: Vector3): Vector3;
        LKB(result?: Vector3): Vector3;
        LFT(result?: Vector3): Vector3;
        LKT(result?: Vector3): Vector3;
        RFB(result?: Vector3): Vector3;
        RKB(result?: Vector3): Vector3;
        RFT(result?: Vector3): Vector3;
        RKT(result?: Vector3): Vector3;
        FrontPlane(result?: Plane): Plane;
        BackPlane(result?: Plane): Plane;
        RightPlane(result?: Plane): Plane;
        LeftPlane(result?: Plane): Plane;
        TopPlane(result?: Plane): Plane;
        BottomPlane(result?: Plane): Plane;
        GetVs(points?: Vector3[]): Vector3[];
        private GetVertex;
        static Transform(source: OrientedBox3, matrix: Matrix4, result?: OrientedBox3): OrientedBox3;
        Transform(matrix: Matrix4): OrientedBox3;
        SetTransform(source: OrientedBox3, matrix: Matrix4): OrientedBox3;
        ScaleWithTwoPoints(cent: Vector3, p0: Vector3, p1: Vector3): OrientedBox3;
        Scale(cent: Vector3, axisScale: Vector3): OrientedBox3;
        SetScale(source: OrientedBox3, cent: Vector3, axisScale: Vector3): OrientedBox3;
        SetScaleWithTowPoints(source: OrientedBox3, cent: Vector3, p0: Vector3, p1: Vector3): OrientedBox3;
        static ScaleWithTowPoints(source: OrientedBox3, cent: Vector3, p0: Vector3, p1: Vector3): OrientedBox3;
        static Rotate(source: OrientedBox3, center: Vector3, axis: Vector3, angle: number): OrientedBox3;
        static Translate(source: OrientedBox3, offset: Vector3): OrientedBox3;
        static GetMatrixBetween(from: OrientedBox3, to: OrientedBox3): Matrix4;
        static Scale(source: OrientedBox3, cent: Vector3, p0: Vector3, p1: Vector3): OrientedBox3;
        private static Scale1;
        Rotate(source: OrientedBox3, center: Vector3, axis: Vector3, angle: number): OrientedBox3;
        SetRotate(source: OrientedBox3, center: Vector3, axis: Vector3, angle: number): OrientedBox3;
    }
}
declare namespace U1 {
    class Plane implements U1.IUValue {
        Normal: Vector3;
        D: number;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        Equals(other: Plane): boolean;
        Set(nx: number, ny: number, nz: number, d: number): Plane;
        Clone(): Plane;
        CopyFrom(source: Plane): Plane;
        constructor(a?: number, b?: number, c?: number, d?: number);
        static Zero(): Plane;
        SetZero(): Plane;
        get IsZero(): boolean;
        Normalize(): Plane;
        static Normalize(value: Plane, result?: Plane): Plane;
        SetNormalize(value: Plane): Plane;
        static Transform(plane: Plane, matrix: Matrix4, result?: Plane): Plane;
        SetTransform(plane: Plane, matrix: Matrix4): Plane;
        static TransformQuaternion(plane: Plane, rotation: Quaternion, result?: Plane): Plane;
        SetTransformQuaternion(plane: Plane, rotation: Quaternion): Plane;
        Dot(value: Vector4): number;
        DotCoordinate(value: Vector3): number;
        DotNormal(value: Vector3): number;
        IntersectsBoundingBox(box: BoundingBox): PlaneIntersectionTypeEnum;
        IntersectsLine(position: Vector3, direction: Vector3, isectRes?: Vector3): number;
        Intersects(frustum: BoundingFrustum): PlaneIntersectionTypeEnum;
        IntersectsBoundingSphere(sphere: BoundingSphere): PlaneIntersectionTypeEnum;
        static FromPointNormal(point: Vector3, normal: Vector3, result?: Plane): Plane;
        SetFromPointNormal(point: Vector3, normal: Vector3): Plane;
        static FromTriangle(point1: Vector3, point2: Vector3, point3: Vector3, result?: Plane): Plane;
        SetFromTriangle(point1: Vector3, point2: Vector3, point3: Vector3): Plane;
    }
}
declare namespace U1 {
    class Quaternion implements U1.IUValue {
        X: number;
        Y: number;
        Z: number;
        W: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        Equals(other: Quaternion): boolean;
        CopyFrom(other: Quaternion): void;
        Clone(): Quaternion;
        static get Identity(): Quaternion;
        LengthSquareduared(): number;
        Length(): number;
        Normalize(): void;
        static Normalize(quaternion: Quaternion, result?: Quaternion): Quaternion;
        SetNormalize(quaternion: Quaternion): Quaternion;
        Conjugate(): void;
        static Conjugate(value: Quaternion, result?: Quaternion): Quaternion;
        SetConjugate(value: Quaternion): Quaternion;
        static Inverse(quaternion: Quaternion, result?: Quaternion): Quaternion;
        SetInverse(quaternion: Quaternion): Quaternion;
        Inverse(): Quaternion;
        static CreateFromAxisAngle(axis: Vector3, angle: number, result?: Quaternion): Quaternion;
        SetCreateFromAxisAngle(axis: Vector3, angle: number): Quaternion;
        static CreateFromYawPitchRoll(yaw: number, pitch: number, roll: number, result?: Quaternion): Quaternion;
        SetCreateFromYawPitchRoll(yaw: number, pitch: number, roll: number): Quaternion;
        static CreateFromRotationMatrix(matrix: Matrix4, result?: Quaternion): Quaternion;
        SetCreateFromRotationMatrix(matrix: Matrix4): Quaternion;
        static Dot(quaternion1: Quaternion, quaternion2: Quaternion): number;
        static Slerp(quaternion1: Quaternion, quaternion2: Quaternion, amount: number, result?: Quaternion): Quaternion;
        SetSlerp(quaternion1: Quaternion, quaternion2: Quaternion, amount: number): Quaternion;
        Slerp(quaternion2: Quaternion, amount: number): Quaternion;
        static Lerp(quaternion1: Quaternion, quaternion2: Quaternion, amount: number, result?: Quaternion): Quaternion;
        SetLerp(quaternion1: Quaternion, quaternion2: Quaternion, amount: number): Quaternion;
        Lerp(quaternion2: Quaternion, amount: number): Quaternion;
        static Concatenate(value1: Quaternion, value2: Quaternion, result?: Quaternion): Quaternion;
        SetConcatenate(value1: Quaternion, value2: Quaternion): Quaternion;
        Concatenate(value2: Quaternion): Quaternion;
        static Negate(quaternion: Quaternion): Quaternion;
        SetNegate(quaternion: Quaternion): Quaternion;
        Negate(): Quaternion;
        static Add(quaternion1: Quaternion, quaternion2: Quaternion, result?: Quaternion): Quaternion;
        SetAdd(quaternion1: Quaternion, quaternion2: Quaternion): Quaternion;
        Add(quaternion2: Quaternion): Quaternion;
        static Subtract(quaternion1: Quaternion, quaternion2: Quaternion, result?: Quaternion): Quaternion;
        SetSubtract(quaternion1: Quaternion, quaternion2: Quaternion): Quaternion;
        Subtract(quaternion2: Quaternion): Quaternion;
        static Multiply(quaternion1: Quaternion, quaternion2: Quaternion, result?: Quaternion): Quaternion;
        SetMultiply(quaternion1: Quaternion, quaternion2: Quaternion): Quaternion;
        Multiply(quaternion2: Quaternion): Quaternion;
        static Scale(quaternion1: Quaternion, scaleFactor: number, result?: Quaternion): Quaternion;
        SetScale(quaternion1: Quaternion, scaleFactor: number): Quaternion;
        Scale(scaleFactor: number): Quaternion;
        static Divide(quaternion1: Quaternion, quaternion2: Quaternion, result?: Quaternion): Quaternion;
        SetDivide(quaternion1: Quaternion, quaternion2: Quaternion): Quaternion;
        Divide(quaternion2: Quaternion): Quaternion;
        ToAxisAngle1(result?: {
            Axis: Vector3;
            Angle: number;
        }): {
            Axis: Vector3;
            Angle: number;
        };
        ToAxisAngle(result?: Vector4): Vector4;
    }
}
declare namespace U1.CGAL {
    enum BOUNDED_SIDES {
        ON_BOUNDED_SIDE = 0,
        ON_BOUNDARY = 1,
        ON_UNBOUNDED_SIDE = 2
    }
    enum ORIENTED_SIDES {
        ON_NEGATIVE_SIDE = 0,
        ON_ORIENTED_BOUNDARY = 1,
        ON_POSITIVE_SIDE = 2
    }
    class Util {
        static PRECISION: number;
        static DoInersect(polygon0: Vector2[], polygon1: Vector2[]): boolean;
        static DoInersectLoops(loopsA: Array<Vector2[]>, loopsB: Array<Vector2[]>): boolean;
        static Min(points: Vector2[]): Vector2;
        static Max(points: Vector2[]): Vector2;
        static IntersectSegmentSegment(s0: Vector2, s1: Vector2, t0: Vector2, t1: Vector2, result: {
            s: number;
            t: number;
        }): boolean;
        static IntersectSegmentPoint(s0: Vector2, s1: Vector2, p: Vector2, result: {
            s: number;
        }): boolean;
        static DistanceSquared(s0: Vector2, s1: Vector2, p: Vector2): number;
        static CollectPolygonWithHoles(loops: Array<Vector2[]>, isIntersection?: boolean): Array<PolygonWithHoles2>;
    }
    class Polygon2 {
        private m_points;
        private static tmp_v0;
        private static tmp_v1;
        private static tmp_v2;
        private static tmp_v3;
        constructor(arg?: Polygon2 | Vector2[]);
        get Count(): number;
        Add(pt: Vector2): void;
        AddRange(collection: Array<Vector2>): void;
        Area(): number;
        Length(): number;
        Clear(): void;
        HasOnNegativeSide(pt: Vector2): boolean;
        HasOnPositiveSide(pt: Vector2): boolean;
        static DoIntersect(A: Polygon2, B: Polygon2): boolean;
        BoundedSide(pt: Vector2): BOUNDED_SIDES;
        OrientedSide(pt: Vector2): ORIENTED_SIDES;
        HasOnBoundary(pt: Vector2): boolean;
        HasOnBoundedSide(pt: Vector2): boolean;
        HasOnUnboundedSide(pt: Vector2): boolean;
        IsCCW(): boolean;
        IsConvex(): boolean;
        IsCW(): boolean;
        IsEmpty(): boolean;
        IsSimple(): boolean;
        Reverse(): void;
        LeftVertex(): Vector2;
        RightVertex(): Vector2;
        TopVertex(): Vector2;
        BottomVertex(): Vector2;
        private LeftVertexIndex;
        private RightVertexIndex;
        private TopVertexIndex;
        private BottomVertexIndex;
        get Points(): Vector2[];
        set Points(points: Vector2[]);
        DoIntersectEdge(pgon: Polygon2): boolean;
        DoIntersect(pgon: Polygon2): boolean;
        GetPolygonList(): Array<Vector2[]>;
        GetAllPolygons(): Array<Polygon2>;
        private GetNotIsectSegs;
        static GetArea(points: Vector2[]): number;
        MakeSimple(): void;
        static Reverse(m_points: Vector2[]): void;
    }
    class PolygonSet2 {
        PolygonsWithHoles: Array<PolygonWithHoles2>;
        constructor(param?: Polygon2);
        get NumberOfPolygonsWithHoles(): number;
        get IsEmpty(): boolean;
        HasOnNegativeSide(pt: Vector2): boolean;
        HasOnPositiveSide(pt: Vector2): boolean;
        Area(): number;
        Clear(): void;
        Insert(polygon: Polygon2 | PolygonWithHoles2): void;
        DoIntersect(pgon: Polygon2 | PolygonWithHoles2 | PolygonSet2): boolean;
        Intersection(pgons: Polygon2 | PolygonWithHoles2 | PolygonSet2): void;
        private DoIntersection;
        Join(polygons: Polygon2 | PolygonWithHoles2 | PolygonSet2): void;
        private DoJoin;
        Difference(polygons: Polygon2 | PolygonWithHoles2 | PolygonSet2): void;
        private DoDifference;
        IntersectLine(line: Line2): boolean;
        Slice(line: Line2, res: {
            left: PolygonSet2;
            right: PolygonSet2;
        }): boolean;
        GetPolygonList(): Array<Vector2[]>;
        GetAllPolygons(): Array<Polygon2>;
    }
    class PolygonWithHoles2 {
        private m_outerBoundary;
        private m_holes;
        constructor(param?: Polygon2);
        get OuterBoundary(): Polygon2;
        set OuterBoundary(value: Polygon2);
        HasOnNegativeSide(pt: Vector2): boolean;
        HasOnPositiveSide(pt: Vector2): boolean;
        Area(): number;
        get Holes(): Polygon2[];
        set Holes(value: Polygon2[]);
        get HasHoles(): boolean;
        get IsUnbounded(): boolean;
        Clear(): void;
        AddHole(pgn_hole: Polygon2): void;
        EraseHole(pgn_hole: Polygon2): void;
        get PolygonsAll(): Array<Polygon2>;
        DoIntersect(B: Polygon2 | PolygonWithHoles2): boolean;
        GetPolygonList(): Array<Vector2[]>;
        GetAllPolygons(): Array<Polygon2>;
    }
}
declare namespace U1.CGAL {
    class LoopFinder {
        private VLIST;
        private ELIST;
        private AddVtx;
        private GetVtx;
        private static res_p;
        private AddEdge;
        private GetVTXsOnSement;
        private InsertEdge;
        private Split;
        private GetCrossEdge;
        AddLoop(path: Array<Vector2>, isReverse: boolean): void;
        AddPath(path: Array<Vector2>, isReverse: boolean): void;
        AddLoops(loops: Array<Vector2[]>, isReverse: boolean): void;
        GetLoops(inward: boolean): Array<Vector2[]>;
    }
}
declare namespace U1.Triangulations {
    import Polygon2 = U1.CGAL.Polygon2;
    import PolygonSet2 = U1.CGAL.PolygonSet2;
    import PolygonWithHols = U1.CGAL.PolygonWithHoles2;
    class Vtx {
        P: Vector2;
        ID: number;
        Prev: Vtx;
        Next: Vtx;
        ELsit: Edge[];
        Left0: Vector2;
        Left1: Vector2;
        BiSect: Vector2;
        Index: number;
        private static tmp;
        Init(): void;
        IsBoundedSide(pt: Vector2): boolean;
        toString(): string;
    }
    class Edge {
        V0: Vtx;
        V1: Vtx;
        IsNew: boolean;
        Face0: Face;
        Face1: Face;
        IntersectSegment(p0: Vtx, p1: Vtx): boolean;
        private static tmp;
        IntersectLine(t0: Vector2, td: Vector2): number;
        toString(): string;
    }
    class Face {
        V0: Vtx;
        V1: Vtx;
        V2: Vtx;
        static tripoints: Vector2[];
        Area(): number;
        toString(): string;
    }
    class TDS {
        private VList;
        private EList;
        private FList;
        private v_id;
        static MIN_FACE_AREA: number;
        AddPolygon(polygon: Array<Vector2> | Polygon2): void;
        AddPolygonVtx(polygon: Array<Vtx>): void;
        private CalculateEdges;
        private CalculateFaces;
        private IsInside;
        GetMesh(): Mesh2;
    }
    class Face2 {
        V0: number;
        V1: number;
        V2: number;
        constructor(v0: number, v1: number, v2: number);
        toString(): string;
    }
    class Mesh2 {
        FList: Face2[];
        VList: Vector2[];
        Area(): number;
    }
    class PolygonTriangulation2 {
        private m_TDS;
        Fill(pgon: Vector2[] | Polygon2): void;
        FillPWH(pwh: PolygonWithHols): void;
        FillPSet(pgonSet: PolygonSet2): void;
        GetMesh(): Mesh2;
    }
}
declare namespace U1 {
    class BoundingBox implements U1.IUValue {
        Min: Vector3;
        Max: Vector3;
        constructor(min?: Vector3, max?: Vector3);
        GetCorners(result?: Vector3[]): Array<Vector3>;
        Equals(other: BoundingBox): boolean;
        Set(...params: Vector3[]): BoundingBox;
        Clone(): BoundingBox;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        CopyFrom(source: BoundingBox): void;
        static CreateMerged(original: BoundingBox, additional: BoundingBox, result?: BoundingBox): BoundingBox;
        SetCreateMerged(original: BoundingBox, additional: BoundingBox): BoundingBox;
        Merge(additional: BoundingBox, tm?: Matrix4): BoundingBox;
        static CreateFromSphere(sphere: BoundingSphere, result?: BoundingBox): BoundingBox;
        SetCreateFromSphere(sphere: BoundingSphere): BoundingBox;
        static CreateFromPoints(points: Array<Vector3>, result?: BoundingBox): BoundingBox;
        SetCreateFromPoints(points: Array<Vector3>): BoundingBox;
        SetFromBox(box: BoundingBox, m: Matrix4): BoundingBox;
        IntersectsBoundingBox(box: BoundingBox): boolean;
        IntersectsBoundingFrustum(frustum: BoundingFrustum): boolean;
        IntersectsPlane(plane: Plane): PlaneIntersectionTypeEnum;
        IntersectsRay(ray: Ray3): number;
        IntersectsBoundingSphere(sphere: BoundingSphere): boolean;
        ContainsBoundingBox(box: BoundingBox): ContainmentTypeEnum;
        ContainsBoundingFrustum(frustum: BoundingFrustum): ContainmentTypeEnum;
        ContainsPoint(point: Vector3): ContainmentTypeEnum;
        ContainsBoundingSphere(sphere: BoundingSphere): ContainmentTypeEnum;
        SupportMapping(v: Vector3): Vector3;
    }
}
declare namespace U1 {
    class BoundingFrustum {
        static CornerCount: number;
        private static NearPlaneIndex;
        private static FarPlaneIndex;
        private static LeftPlaneIndex;
        private static RightPlaneIndex;
        private static TopPlaneIndex;
        private static BottomPlaneIndex;
        private static NumPlanes;
        private gjk;
        private matrix;
        private cornerArray;
        private planes;
        constructor(value?: Matrix4);
        Equals(other: BoundingFrustum): boolean;
        private static ComputeIntersection;
        static ComputeIntersectionLine(p1: Plane, p2: Plane, result?: Ray3): Ray3;
        ContainsBoundingBox(box: BoundingBox): ContainmentTypeEnum;
        ContainsBoundingFrustum(frustum: BoundingFrustum): ContainmentTypeEnum;
        ContainsBoundingSphere(sphere: BoundingSphere): ContainmentTypeEnum;
        ContainsPoint(point: Vector3): ContainmentTypeEnum;
        get CornerArray(): Vector3[];
        GetCornersCopy(): Vector3[];
        private static tmp_v3_0;
        private static tmp_v3_1;
        private static tmp_v3_2;
        private static tmp_v3_3;
        private static tmp_box_points;
        IntersectsBoundingBox(box: BoundingBox): boolean;
        IntersectsBoundingFrustum(frustum: BoundingFrustum): boolean;
        IntersectsBoundingSphere(sphere: BoundingSphere): boolean;
        IntersectsPlane(plane: Plane): PlaneIntersectionTypeEnum;
        IntersectsRay(ray: Ray3): number;
        SupportMapping(v: Vector3): Vector3;
        SetMatrix(value: Matrix4): void;
        get Bottom(): Plane;
        get Far(): Plane;
        get Left(): Plane;
        get Near(): Plane;
        get Right(): Plane;
        get Top(): Plane;
        get Matrix(): Matrix4;
        set Matrix(value: Matrix4);
    }
}
declare namespace U1 {
    class BoundingSphere implements U1.IUValue {
        Center: Vector3;
        Radius: number;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        Equals(other: BoundingSphere): boolean;
        Clone(): BoundingSphere;
        CopyFrom(source: BoundingSphere): void;
        constructor(center?: Vector3, radius?: number);
        static CreateMerged(original: BoundingSphere, additional: BoundingSphere, result?: BoundingSphere): BoundingSphere;
        SetCreateMerged(original: BoundingSphere, additional: BoundingSphere): BoundingSphere;
        static CreateFromBoundingBox(box: BoundingBox, result?: BoundingSphere): BoundingSphere;
        SetCreateFromBoundingBox(box: BoundingBox): BoundingSphere;
        static CreateFromPoints(points: Array<Vector3>, result?: BoundingSphere): BoundingSphere;
        SetCreateFromPoints(points: Array<Vector3>): BoundingSphere;
        static CreateFromFrustum(frustum: BoundingFrustum, result?: BoundingSphere): BoundingSphere;
        SetCreateFromFrustum(frustum: BoundingFrustum): BoundingSphere;
        IntersectsBoundingBox(box: BoundingBox): boolean;
        IntersectsBoundingFrustum(frustum: BoundingFrustum): boolean;
        IntersectsPlane(plane: Plane): PlaneIntersectionTypeEnum;
        Intersects(ray: Ray3): number;
        IntersectsBoundingSphere(sphere: BoundingSphere): boolean;
        ContainsBoundingBox(box: BoundingBox): ContainmentTypeEnum;
        ContainsBoundingFrustum(frustum: BoundingFrustum): ContainmentTypeEnum;
        ContainsPoint(point: Vector3): ContainmentTypeEnum;
        ContainsBoundingSphere(sphere: BoundingSphere): ContainmentTypeEnum;
        SupportMapping(v: Vector3, result?: Vector3): Vector3;
        static Transform(src: BoundingSphere, matrix: Matrix4, result?: BoundingSphere): BoundingSphere;
        Transform(matrix: Matrix4, result?: BoundingSphere): BoundingSphere;
    }
}
declare namespace U1 {
    class GeometryHelper2 {
        static AngleBetween(start: Vector2, end: Vector2): number;
        static AngleCCW(baseAxis: Vector2, vector: Vector2): number;
        static CrossLineLine(s0: Vector2, sd: Vector2, t0: Vector2, td: Vector2): {
            s: number;
            t: number;
        };
        static CrossLineLine1(line0: Line2, line1: Line2, result?: Vector2): Vector2;
        static CrossSegSeg(s0: Vector2, s1: Vector2, t0: Vector2, t1: Vector2, SAME_DIST?: number): {
            ss: number[];
            ts: number[];
        };
        static CrossCircleCircle(circle0: Circle2, circle1: Circle2): Vector2[];
        static CrossSegmentSegment(segment0: Segment2, segment1: Segment2): Vector2[];
        static CrossLineCircle(line: Line2, circle: Circle2): Vector2[];
        static CrossSegmentCircle(segment: Segment2, circle: Circle2): Vector2[];
        static CrossSegmentArc(segment: Segment2, arc: Arc2): Vector2[];
        static CrossArcArc(arc0: Arc2, arc1: Arc2): Vector2[];
        static IsSame(point0: Vector2, point1: Vector2): boolean;
        static CheckOnArc(pos: Vector2, arc: Arc2): boolean;
        static GetOffsetArc(arc: Arc2, offset: number): Arc2;
        static SplitArc(baseAxis: Vector2, startAngle: number, endAngle: number, segmentCount: number): Vector2[];
        static OffsetPolygon(polygon: Vector2[], offset: number): Vector2[];
        static OffsetPolyline(polyline: Vector2[], offset: number): Vector2[];
    }
}
declare namespace U1 {
    class GeometryHelper3 {
        static AngleBetween(start: Vector3, end: Vector3): number;
        static AngleCCW(baseVector: Vector3, planeNormal: Vector3, vector: Vector3): number;
        static PolygonNormal(points: Array<Vector3>, start: number, length: number, normalize: boolean, res_normal: Vector3): boolean;
        static PolygonNormalByValues(values: ArrayLike<number>, start: number, normalize: boolean, res_normal: Vector3): boolean;
        static GetArbitraryAxis(normal: Vector3, udir: Vector3, vdir: Vector3): void;
        static GetArcCenter(start: Vector3, end: Vector3, normal: Vector3, bulge: number): Vector3;
        static SplitArc(baseAxis: Vector3, normal: Vector3, startAngle: number, endAngle: number, segmentCount: number): Vector3[];
        static GetRotationM2M(src: Matrix4, target: Matrix4): {
            axis: Vector3;
            angle: number;
            roll: number;
        };
        private static tmp_v30;
        private static tmp_v31;
        static RayBoxIntersection(rayOrigin: Vector3, rayDir: Vector3, boxMin: Vector3, boxMax: Vector3, dirCheck: boolean): boolean;
        static BoxBoxIntersection(min1: Vector3, max1: Vector3, min2: Vector3, max2: Vector3): boolean;
        static PolygonPlaneIntersection(pgon: Vector3[], plane: Plane): PlaneIntersectionTypeEnum;
    }
}
declare namespace U1 {
    class Line3 {
        Position: Vector3;
        Direction: Vector3;
        constructor(position?: Vector3, direction?: Vector3);
        static SquardDistance(line0: Line3, line1: Line3, result: {
            s: number;
            t: number;
        }): number;
        static SquardDistance1(p0: Vector3, d0: Vector3, p1: Vector3, d1: Vector3, result: {
            s: number;
            t: number;
        }): number;
    }
}
declare namespace U1 {
    var PRECISION: number;
    var Epsilon: number;
    function WithinEpsilon(a: number, b: number): boolean;
    function Clamp(value: number, min: number, max: number): number;
    function EpsilonEqualsPointPoint(point0: Vector2, point1: Vector2, epsilon?: number): boolean;
    function RandomVector3(): Vector3[];
    enum PlaneIntersectionTypeEnum {
        Front = 0,
        Back = 1,
        Intersecting = 2
    }
    enum FaceIntersectionTypeEnum {
        Outside = 0,
        Inside = 1,
        Boundary = 2
    }
    enum ContainmentTypeEnum {
        Disjoint = 0,
        Contains = 1,
        Intersects = 2
    }
    enum ProjectionTypeEnum {
        Perspective = 0,
        Orthographic = 1
    }
    class Viewport {
        static PRECISION: number;
        X: number;
        Y: number;
        Width: number;
        Height: number;
        MinDepth: number;
        MaxDepth: number;
        toString(): string;
        Project(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4, result?: Vector3): Vector3;
        ProjectWVP(source: Vector3, wvp: Matrix4, result?: Vector3): Vector3;
        Unproject(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4, result?: Vector3): Vector3;
        get AspectRatio(): number;
        static Project(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4, minDepth: number, maxDepth: number, x: number, y: number, width: number, heiht: number, result?: Vector3): Vector3;
        Equals(other: Viewport): boolean;
    }
}
declare namespace U1 {
    class UElement {
        private static s_hnd;
        private _id;
        private _hnd;
        private _document;
        private _PropertyChanged;
        private _Removing;
        private _inv_map;
        protected _isfrozen: boolean;
        get PropertyChanged(): PropertyChangedEvent;
        get Removing(): Event1<UElement>;
        constructor();
        get ID(): number;
        get Document(): U1.UDocument;
        get HND(): number;
        get IsFrozen(): boolean;
        GetTypeName(): string;
        InvokePropertyChanged(prop: string): void;
        InvokeRemoving(): void;
        protected OnPropertyChanged(prop: string): void;
        get PropertyCategory(): string;
        GetProperties(): UPropertyBase[];
        protected ClassifiedByType(): boolean;
        OnInitAfterLoaded(): void;
        OnInitAfterCreated(): void;
        OnBeforeEndTransaction(): void;
        protected SetProperty<T>(prop_name: keyof this, field_name: string, new_val: T): void;
        protected SetRelProperty<T>(prop_name: keyof this, field_name: string, new_val: T): void;
        protected UpdateInverce(prop_name: string, ov: any, nv: any): void;
        protected GetInverse<T extends UElement>(type: {
            new (): T;
        }, prop: string): T[];
        protected AddInv(source: UElement, prop: string): void;
        protected RemoveInv(source: UElement, prop: string): void;
        Detach(): void;
        Attach(doc: UDocument): void;
        Clone(res_map?: {
            [src_hnd: number]: UElement;
        }): this;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
        protected freeze(): void;
        protected unfreeze(): void;
        GetUPropsCategory(): string;
        GetUProps(): UPropertyBase[];
    }
}
declare namespace U1 {
    class UNode extends UElement {
        private parent;
        private num;
        private name;
        IsInvokePropertyChanged: boolean;
        protected last_num: number;
        get Parent(): UNode;
        set Parent(val: UNode);
        get Num(): number;
        set Num(value: number);
        get Name(): string;
        set Name(value: string);
        get Children(): Array<UNode>;
        FindAncestor<T extends UNode>(type: {
            new (): T;
        }): T;
        GetChildren<T extends UNode>(type: {
            new (): T;
        }, name?: string): T[];
        Append(child: UNode): void;
        Remove(child: UNode): void;
        AddChild<T extends UNode>(ctr: {
            new (): T;
        }, name?: string): T;
        AddChildCopy<T extends UNode>(child: T, name?: string): T;
        GetChild<T extends UNode>(ctor: {
            new (): T;
        }, name: string): T;
        protected OnPropertyChanged(prop: string): void;
        protected OnChildPropertyChanged(source: UNode, name: string): void;
        protected OnChildAdded(child: UNode): void;
        protected OnChildDeleting(child: UNode): void;
        protected TransmitChildPropertyChanged(source: UNode, name: string): boolean;
        protected InvokeChildPropertyChanged(source: UNode, name: string): void;
        Clone(res_map?: {
            [src_hnd: number]: UElement;
        }): this;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
        protected freeze(): void;
        protected unfreeze(): void;
    }
}
declare namespace U1.Meshes {
    class MModel extends UNode {
        private _mesh;
        protected _transform: Matrix4;
        protected _isWorldTransfornInvalid: boolean;
        protected _worldTransform: Matrix4;
        get Transform(): Matrix4;
        set Transform(value: Matrix4);
        get WorldTransform(): Matrix4;
        get Mesh(): MMesh;
        set Mesh(value: MMesh);
        get Mats(): MMtlUse[];
        set Mats(value: MMtlUse[]);
        GetMat(mgrp: number): MMtlUse;
        SetMat(mgrp: number, mtl: MMtl): void;
        GetWorldOBB(res?: BoundingBox): BoundingBox;
        protected InvalidWorldTransform(): void;
        protected OnPropertyChanged(prop: string): void;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
        Clone(res_map?: {
            [src_hnd: number]: UElement;
        }): this;
    }
}
declare namespace U1.Meshes {
    class MParamModel extends MModel {
        private isMeshInvalid;
        UpdateMesh(): void;
        protected OnPropertyChanged(prop: string): void;
        OnBeforeEndTransaction(): void;
    }
}
declare namespace U1.Meshes {
    class MWindowCube extends MParamModel {
        private _w;
        private _l;
        private _h;
        private static _bottomThick;
        private static _topThick;
        private static _leftThick;
        private static _rightThick;
        private static _backThick;
        get W(): number;
        set W(value: number);
        get L(): number;
        set L(value: number);
        get H(): number;
        set H(value: number);
        get BottomMargin(): number;
        get TopMargin(): number;
        get LeftMargin(): number;
        get RightMargin(): number;
        private static _vs;
        private static _fs;
        UpdateMesh(): void;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
        GetUPropsCategory(): string;
        GetUProps(): UPropertyBase[];
    }
}
declare namespace U1.Meshes {
    class MHoleyCube extends MParamModel {
        private _w;
        private _l;
        private _h;
        get W(): number;
        set W(value: number);
        get L(): number;
        set L(value: number);
        get H(): number;
        set H(value: number);
        get BottomMargin(): number;
        get TopMargin(): number;
        get LeftMargin(): number;
        get RightMargin(): number;
        private static _bottomThick;
        private static _topThick;
        private static _leftThick;
        private static _rightThick;
        private static _backThick;
        private static _backExpansionThick;
        private static _leftExpansionThick;
        private static _rightExpansionThick;
        private static _vs;
        private static _fs;
        UpdateMesh(): void;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
        GetUPropsCategory(): string;
        GetUProps(): UPropertyBase[];
    }
}
declare namespace U1 {
    interface IXWallShape {
    }
}
declare namespace U1 {
    class UGeomElement extends UNode {
        protected _afterGeometryChanged: U1.Event2<UGeomElement, Object>;
        protected _afterTransformChanged: U1.Event2<UGeomElement, Object>;
        get AfterGeometryChanged(): Event2<UGeomElement, Object>;
        get AfterTransformChanged(): Event2<UGeomElement, Object>;
        private propagateInvalidGeom;
        private propagateInvalidTran;
        protected m_invalidTransform: boolean;
        protected m_invalidBounding: boolean;
        protected m_invalidOBB: boolean;
        protected m_transform: Matrix4;
        protected m_boundingBox: BoundingBox;
        protected m_boundingSphere: BoundingSphere;
        protected m_obb3: OrientedBox3;
        protected m_obb2: OrientedBox3;
        protected axis: Vector3;
        protected angle: number;
        protected importBase: Vector3;
        protected basePosition: Vector3;
        protected scale: Vector3;
        protected location: Vector3;
        protected basePositionType: number;
        protected isUpdating: boolean;
        IsInvalid: boolean;
        CanUserRotate(): boolean;
        CanUserScale(): boolean;
        CanUserTranslate(): boolean;
        get Transform(): Matrix4;
        get BoundingBox(): BoundingBox;
        get BoundingSphere(): BoundingSphere;
        get OrientedBBox3(): OrientedBox3;
        get OrientedBBox2(): OrientedBox3;
        get GeometryParent(): UGeomElement;
        getPivot(): Vector3;
        get Axis(): Vector3;
        set Axis(value: Vector3);
        get Angle(): number;
        set Angle(value: number);
        get ImportBase(): Vector3;
        set ImportBase(value: Vector3);
        get BasePosition(): Vector3;
        set BasePosition(value: Vector3);
        get Scale(): Vector3;
        set Scale(value: Vector3);
        get Location(): Vector3;
        set Location(value: Vector3);
        get BasePositionType(): number;
        set BasePositionType(value: number);
        init(): void;
        Detach(): void;
        Invalidate(): void;
        protected OnInvalidated(source: UElement): void;
        Update(): void;
        OnUpdate(): void;
        GeometryChanged(source: UGeomElement): void;
        TransformChanged(source: UGeomElement): void;
        OnBeforeEndTransaction(): void;
        protected OnGeometryChanged(source: UGeomElement): void;
        protected OnTransformChanged(source: UGeomElement): void;
        InvokeGeometryChanged(): void;
        InvokeTransformChanged(): void;
        InvalidateBounding(): void;
        protected OnChildAdded(child: UNode): void;
        protected OnChildDeleting(element: UNode): void;
        GetGeomNodes(parentXForm: Matrix4, nodes: Array<U1.Geoms.GeNode>): void;
        UpdateGeoms(geoms: U1.Geoms.GeEntity[]): void;
        protected UpdateOBB(): void;
        protected UpdateTransform(): void;
        protected UpdateBounding(): void;
        SetTransform(xform: Matrix4): void;
        AddTransform(xform: Matrix4): void;
        AddTranslation(offset: Vector3): void;
        AddRotation(center: Vector3, axis: Vector3, angle: number): void;
        AddScale(center: Vector3, from: Vector3, to: Vector3): void;
        static GetOrientedBox2(obb3: OrientedBox3, result?: OrientedBox3): OrientedBox3;
        static CreateOBBScaleMatrix(obb: OrientedBox3, center: Vector3, from: Vector3, to: Vector3, result?: Matrix4): Matrix4;
    }
}
declare namespace U1 {
    class UItemSet<T> extends UNode {
        Items<T extends UNode>(type: {
            new (): T;
        }): T[];
        get count(): number;
        Clear(): void;
        AddItem<T extends UNode>(type: {
            new (): T;
        }): T;
        SetItem<T extends UNode>(type: {
            new (): T;
        }, name: string): T;
        GetOrCreateItem<T extends UNode>(type: {
            new (): T;
        }, name: string): T;
        GetItemByID<T extends UNode>(type: {
            new (): T;
        }, id: number): T;
        GetItemByName<T extends UNode>(type: {
            new (): T;
        }, name: string): T;
        AddItemByName<T extends UNode>(type: {
            new (): T;
        }, name: string): T;
        AddItemCopy<T extends UNode>(item: T, name: string): T;
    }
}
declare namespace U1 {
    class GeomUtils {
        static Project2D(v3List: Array<Vector3>, center: Vector3, uVector: Vector3, vVector: Vector3): Array<Vector2>;
        static Project2DList(v3List: Array<Vector3>, center: Vector3, normal: Vector3, uVector: Vector3, vVector: Vector3): Array<Vector2>;
        static GetNormal(points: Vector3[]): Vector3;
        static GetLeftMost(points: Vector3[], lmostIx: number, lmostP: Vector3): void;
    }
}
declare namespace U1.Geoms {
    enum BoxCornerTypes {
        None = 0,
        LFB = 1,
        RFB = 2,
        RKB = 3,
        LKB = 4,
        LFT = 5,
        RFT = 6,
        RKT = 7,
        LKT = 8,
        Center = 9,
        LC = 10,
        FC = 11,
        RC = 12,
        KC = 13,
        TC = 14,
        BC = 15
    }
}
declare namespace LibEarcus {
    function earcut(data: number[], holeIndices: number[], dim?: number): number[];
    function signedArea(data: any, start: any, end: any, dim: any): number;
    function flatten(data: any): {
        vertices: any[];
        holes: any[];
        dimensions: any;
    };
}
declare namespace U1.BRep {
    class Face implements OctreeNode {
        Shell: Shell;
        Boundary: number[];
        Holes: number[][];
        Deleted: boolean;
        private _plane;
        private _normal;
        private _min;
        private _max;
        private _triFaces;
        State: FaceStates;
        MId: number;
        get IsFlat(): boolean;
        set IsFlat(isFlat: boolean);
        get IsCap(): boolean;
        set IsCap(value: boolean);
        get HasHoles(): boolean;
        get HoleCount(): number;
        get Normal(): Vector3;
        get Plane(): Plane;
        get TriFaces(): number[];
        set TriFaces(value: number[]);
        Invalidate(): void;
        Clone(): Face;
        CutByFace(face: Face, front: Face[], back: Face[]): boolean;
        CutByPlane(plane: Plane, fronts: Face[], backs: Face[]): boolean;
        getMin(): Vector3;
        getMax(): Vector3;
        CheckCross(plane: Plane): boolean;
        private SplitPolygon;
        private ConnectPolygon;
        Tesselate_(): void;
        Tesselate(vmap?: {
            [index: number]: Vertex;
        }): number[];
        CheckIntersectRay(p: Vector3, dir: Vector3): FaceIntersectionTypeEnum;
        ArbitrarilyInsidePoint(res?: Vector3): Vector3;
        private CheckInside;
        SetBoundary(points: number[]): this;
        SetHoles(points: number[][]): this;
        SetIsCap(isCap: boolean): this;
        SetIsFlat(isFlat: boolean): this;
    }
}
declare namespace U1.BRep {
    enum FaceStates {
        None = 0,
        Cutted = 2,
        Cap = 4,
        Flat = 8
    }
}
declare namespace U1.BRep {
    class ShellUtil {
        static CreateBox(): Shell;
    }
}
declare namespace U1.BRep {
    class Vertex extends Vector3 {
        Num: number;
        Normal: Vector3;
        UV0: Vector2;
        constructor(x?: number | Vector3 | Vector2, y?: number, z?: number);
        Clone(): Vertex;
        SetLerp(a: Vector3, b: Vector3, amount: number): Vector3;
        SetNormal(x: number | Vector3, y?: number, z?: number): void;
        SetUV0(x: number | Vector2, y?: number): void;
    }
}
declare namespace U1.BRep {
    class ShellModel {
        Shell: Shell;
        Material: MeshMaterial;
        protected _transform: Matrix4;
        protected _parent: ShellModel;
        protected _children: Array<ShellModel>;
        private _bbx;
        ID: number;
        get Transform(): Matrix4;
        set Transform(value: Matrix4);
        get Children(): Array<ShellModel>;
        set Children(value: Array<ShellModel>);
        AddChild(child: ShellModel): void;
        get BoundingBox(): BoundingBox;
        static ReadMesh(reader: BinaryReader, mesh: ShellModel, brep: BRepFile): void;
        static ReadMatrix(reader: BinaryReader, m: Matrix4): void;
    }
    class BRepFile {
        Materials: MeshMaterial[];
        Shells: Shell[];
        Models: ShellModel[];
        JsonData: any;
        Load(dataView: DataView): void;
        private ReadVer1;
        private static ReadMaterial;
    }
}
declare namespace U1.Meshes {
}
declare namespace U1 {
    interface IUPropertyBag {
        Doc: UDocument;
        GetInt(prop: string, def_value: number): any;
        GetIntArr(prop: string, def_value: number[]): number[];
        GetFloat(prop: string, def_value: number): any;
        GetFloatArr(prop: string, def_value: number[]): number[];
        GetBool(prop: string, def_value: boolean): any;
        GetStr(prop: string, def_value: string): any;
        GetStrArr(prop: string, def_value: string[]): string[];
        GetValue<T extends IUValue>(type: {
            new (): T;
        }, prop: string, def_value: T): T;
        GetValueArr<T extends IUValue>(type: {
            new (): T;
        }, prop: string, def_value: T[]): T[];
        GetRef<T extends UElement>(prop: string, def_value: T): T;
        GetRefArr<T extends UElement>(prop: string, def_value: T[]): T[];
        SetInt(prop: string, value: number): any;
        SetIntArr(prop: string, value: number[]): any;
        SetFloat(prop: string, value: number): any;
        SetFloatArr(prop: string, value: number[]): any;
        SetBool(prop: string, value: boolean): any;
        SetStr(prop: string, value: string): any;
        SetStrArr(prop: string, value: string[]): any;
        SetValue<T extends IUValue>(prop: string, value: T): any;
        SetValueArr<T extends IUValue>(prop: string, value: T[]): any;
        SetRef(prop: string, value: UElement): any;
        SetRefArr(prop: string, value: UElement[]): any;
    }
    class UPropertyBag implements IUPropertyBag {
        Doc: UDocument;
        Props: {
            [prop: string]: any;
        };
        GetInt(prop: string, def_value: number): any;
        GetIntArr(prop: string, def_value: number[]): number[];
        GetFloat(prop: string, def_value: number): any;
        GetFloatArr(prop: string, def_value: number[]): number[];
        GetBool(prop: string, def_value: boolean): any;
        GetStr(prop: string, def_value: string): any;
        GetStrArr(prop: string, def_value: string[]): string[];
        GetValue<T extends IUValue>(type: {
            new (): T;
        }, prop: string, def_value: T): T;
        GetValueArr<T extends IUValue>(type: {
            new (): T;
        }, prop: string, def_value: T[]): T[];
        GetRef<T extends UElement>(prop: string, def_value: T): T;
        GetRefArr<T extends UElement>(prop: string, def_value: T[]): T[];
        SetInt(prop: string, value: number): void;
        SetIntArr(prop: string, value: number[]): void;
        SetFloat(prop: string, value: number): void;
        SetFloatArr(prop: string, value: number[]): void;
        SetBool(prop: string, value: boolean): void;
        SetStr(prop: string, value: string): void;
        SetStrArr(prop: string, value: string[]): void;
        SetValue<T extends IUValue>(prop: string, value: T): void;
        SetValueArr<T extends IUValue>(prop: string, value: T[]): void;
        SetRef(prop: string, value: UElement): void;
        SetRefArr(prop: string, value: UElement[]): void;
    }
    class UPropertyStrBag implements IUPropertyBag {
        Doc: UDocument;
        Props: {
            [prop: string]: string;
        };
        GetInt(prop: string, def_value: number): number;
        GetIntArr(prop: string, def_value: number[]): number[];
        GetFloat(prop: string, def_value: number): number;
        GetFloatArr(prop: string, def_value: number[]): number[];
        GetBool(prop: string, def_value: boolean): boolean;
        GetStr(prop: string, def_value: string): string;
        GetStrArr(prop: string, def_value: string[]): string[];
        GetValue<T extends IUValue>(type: {
            new (): T;
        }, prop: string, def_value: T): T;
        GetValueArr<T extends IUValue>(type: {
            new (): T;
        }, prop: string, def_value: T[]): T[];
        GetRef<T extends UElement>(prop: string, def_value: T): T;
        GetRefArr<T extends UElement>(prop: string, def_value: T[]): T[];
        SetInt(prop: string, value: number): void;
        SetIntArr(prop: string, value: number[]): void;
        SetFloat(prop: string, value: number): void;
        SetFloatArr(prop: string, value: number[]): void;
        SetBool(prop: string, value: boolean): void;
        SetStr(prop: string, value: string): void;
        SetStrArr(prop: string, value: string[]): void;
        SetValue<T extends IUValue>(prop: string, value: T): void;
        SetValueArr<T extends IUValue>(prop: string, value: T[]): void;
        SetRef(prop: string, value: UElement): void;
        SetRefArr(prop: string, value: UElement[]): void;
    }
}
declare namespace U1 {
    interface IUndoCmd {
        Redo(): any;
        Undo(): any;
    }
    class UUndoCmdProp implements IUndoCmd {
        element: UElement;
        prop: string;
        field: string;
        old_value: any;
        new_value: any;
        constructor(element: UElement, prop: string, field: string, old_value: any, new_value: any);
        Redo(): void;
        Undo(): void;
    }
    class UUndoCmdRefProp implements IUndoCmd {
        element: UElement;
        prop: string;
        field: string;
        old_value: any;
        new_value: any;
        constructor(element: UElement, prop: string, field: string, old_value: any, new_value: any);
        Redo(): void;
        Undo(): void;
    }
    class UUndoCmdAppend implements IUndoCmd {
        document: UDocument;
        element: UElement;
        constructor(document: UDocument, element: UElement);
        Redo(): void;
        Undo(): void;
    }
    class UUndoCmdRemove implements IUndoCmd {
        document: UDocument;
        element: UElement;
        constructor(document: UDocument, element: UElement);
        Redo(): void;
        Undo(): void;
    }
    class UUndoCmdGroup implements IUndoCmd {
        Commands: IUndoCmd[];
        AddCommand(cmd: IUndoCmd): void;
        Redo(): void;
        Undo(): void;
    }
    class UTransactoin extends UUndoCmdGroup {
        private changedProps;
        Children: UTransactoin[];
        Parent: UTransactoin;
        Append(child: UTransactoin): void;
        Remove(child: UTransactoin): void;
        Cancel(): void;
        OnEnd(): void;
        HasCommands(): boolean;
        AddCommand(cmd: IUndoCmd): void;
    }
}
declare namespace U1.Meshes {
    class MFace extends UNode {
        private loops;
        private sg;
        private fg;
        private mg;
        private _cache;
        get Mesh(): MMesh;
        get SG(): number;
        set SG(value: number);
        get FG(): number;
        set FG(value: number);
        get MG(): number;
        set MG(value: number);
        get Loops(): MEdg[];
        set Loops(value: MEdg[]);
        get OuterVs(): MVert[];
        get HolesVs(): MVert[][];
        ApplyTexProj(tex_prj: MTexPrj): void;
        GetNorm(res?: Vector3): Vector3;
        GetBBX(res?: BoundingBox): BoundingBox;
        GetPlane(res?: Plane): Plane;
        GetInnerPoint(res?: Vector3): Vector3;
        GetArea(): number;
        Init(f: {
            loops?: MVert[][];
            smgrp?: number;
            mgrp?: number;
            texPrj?: MTexPrj;
        }): void;
        private UpdateCache;
        Tesselate(res_verts?: MVert[]): number[];
        getMin(): Vector3;
        getMax(): Vector3;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
        Clone(): this;
        toString(): string;
    }
}
declare namespace U1.Meshes {
    class MMesh extends UNode {
        CacheVer: number;
        private _cache;
        get Vertics(): MVert[];
        get Edges(): MEdg[];
        get Faces(): MFace[];
        NewVert(p?: Vector3): MVert;
        NewVerts(ps: Vector3[]): MVert[];
        NewEdge(): MEdg;
        NewFace(f?: {
            loops?: MVert[][];
            smgrp?: number;
            mgrp?: number;
            texPrj?: MTexPrj;
        }): MFace;
        RemoveUnused(): void;
        RemoveEmptyFaces(): void;
        RemoveUnusedEdges(): void;
        RemoveUnusedVerts(): void;
        GetShellsByMid(): {
            [index: number]: BRep.Shell[];
        };
        private CreateShellsByMid;
        GetMeshBuffersByMid(): {
            [mid: number]: MeshBufferGeometry;
        };
        private CreateMeshBuffersByMid;
        GetEdgeGeometry(): LineBufferGeometry;
        RegisterEdge(s: MVert, e: MVert): MEdg;
        GetBoundingBox(result?: BoundingBox, matrix?: Matrix4): BoundingBox;
        Flip(): void;
        ApplyTexProj(tex_prj: MTexPrj): void;
        GetRelModels(): MModel[];
        protected InvokeChildPropertyChanged(source: UNode, name: string): void;
        protected OnChildAdded(child: UNode): void;
        private UpdateCache;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
        Clone(res_map?: {
            [src_hnd: number]: UElement;
        }): this;
    }
}
declare namespace U1.Meshes {
    class MMtl extends UNode {
        private alpha;
        get Alpha(): number;
        set Alpha(value: number);
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
    }
    class MMtlUse extends UNode {
        private _mat;
        private _mgrp;
        get MGrp(): number;
        set MGrp(value: number);
        get Mat(): MMtl;
        set Mat(value: MMtl);
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
    }
    class MMtlColr extends MMtl {
        private color;
        get Color(): Color;
        set Color(value: Color);
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
    }
    class MMtlTex extends MMtl {
        private diffuse;
        private difTex;
        get Diffuse(): Color;
        set Diffuse(value: Color);
        get DifTex(): MTexture;
        set DifTex(value: MTexture);
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
    }
}
declare namespace U1.Meshes {
    enum MTexPrjKinds {
        Plane = 0,
        Box = 1,
        Sphere = 2,
        Cylinder = 3
    }
    class MTexPrj extends UNode {
        private xform;
        private prjkind;
        get XForm(): Matrix4;
        set XForm(value: Matrix4);
        get PrjKind(): MTexPrjKinds;
        set PrjKind(value: MTexPrjKinds);
        GetUV(p: Vector3, n: Vector3, result?: Vector2): Vector2;
        IsCylinderSide(p: Vector3, n: Vector3): boolean;
        CopyFrom(other: MTexPrj): void;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
    }
}
declare namespace U1.Meshes {
    class MTexture extends UNode {
        private uri;
        constructor(name?: string);
        get Uri(): string;
        set Uri(value: string);
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
    }
}
declare namespace U1.Meshes {
    class MVert extends UNode {
        private p;
        get Mesh(): MMesh;
        get P(): Vector3;
        set P(value: Vector3);
        protected ClassifiedByType(): boolean;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
    }
}
declare namespace U1.Meshes {
    class MEdg extends UNode {
        private v;
        private n;
        private o;
        private uv;
        get V(): MVert;
        set V(value: MVert);
        get UV(): Vector2;
        set UV(value: Vector2);
        get Next(): MEdg;
        set Next(value: MEdg);
        get Opp(): MEdg;
        set Opp(value: MEdg);
        protected ClassifiedByType(): boolean;
        GetLoop(): MEdg[];
        GetLoopVs(): MVert[];
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
        toString(): string;
    }
}
declare namespace U1.Meshes {
    class MCube extends MParamModel {
        private _w;
        private _l;
        private _h;
        get W(): number;
        set W(value: number);
        get L(): number;
        set L(value: number);
        get H(): number;
        set H(value: number);
        private static _vs;
        private static _fs;
        UpdateMesh(): void;
        ReadProps(props: IUPropertyBag): void;
        WriteProps(props: IUPropertyBag): void;
        GetUPropsCategory(): string;
        GetUProps(): UPropertyBase[];
    }
}
declare namespace U1 {
    class GeometryModel {
        Geometry: Geometry;
        Material: MeshMaterial;
        protected _transform: Matrix4;
        protected _parent: GeometryModel;
        protected _children: Array<GeometryModel>;
        private _bbx;
        private _id;
        private static _id;
        get ID(): number;
        get Transform(): Matrix4;
        set Transform(value: Matrix4);
        get Children(): Array<GeometryModel>;
        set Children(value: Array<GeometryModel>);
        AddChild(child: GeometryModel): void;
        get BoundingBox(): BoundingBox;
    }
}
declare namespace U1.Geoms {
    enum EdgeTypeEnum {
        Solid = 0,
        Hidden = 1,
        Dot = 2
    }
}
declare namespace U1.Geoms {
    enum FontStyleEnum {
        Normal = 0,
        Italic = 1,
        Oblique = 2
    }
}
declare namespace U1.Geoms {
    enum FontWeightEnum {
        Normal = 0,
        Black = 1,
        Bold = 2,
        DemiBold = 3,
        ExtraBlack = 4,
        ExtraBold = 5,
        ExtraLight = 6,
        Heavy = 7,
        Light = 8,
        Medium = 9,
        Regular = 10,
        SemiBold = 11,
        Thin = 12,
        UltraBlack = 13,
        UltraBold = 14,
        UltraLight = 15
    }
}
declare namespace U1.Geoms {
    enum TextAlignmentEnum {
        Left = 0,
        Right = 1,
        Center = 2,
        Justify = 3
    }
}
declare namespace U1.Geoms {
    enum TextWrappingEnum {
        WrapWithOverflow = 0,
        NoWrap = 1,
        Wrap = 2
    }
}
declare namespace U1.Geoms {
    class GeEntity {
        Pickable: boolean;
        Visible: boolean;
        SnapPoints: GeSnapPoint[];
        Color: Color;
        Min(result?: Vector3): Vector3;
        Max(result?: Vector3): Vector3;
        constructor(other?: GeEntity);
    }
}
declare namespace U1.Geoms {
    class GeArc extends GeEntity {
        Center: Vector3;
        Radius: number;
        StartAngle: number;
        EndAngle: number;
        Thick: number;
        LinePattern: number[];
        private step;
        private tesseleted_points;
        private _min;
        private _max;
        get Points(): Vector3[];
        Tesselate(angle_step?: number): Vector3[];
        Min(result?: Vector3): Vector3;
        Max(result?: Vector3): Vector3;
    }
    class GeArcFill extends GeArc {
        FillColor: Color;
        private m_faceIndices;
        get FaceIndices(): number[];
    }
}
declare namespace U1.Geoms {
    class GeCircle extends GeEntity {
        Center: Vector3;
        Radius: number;
        Thick: number;
        LinePattern: number[];
        private step;
        private tesseleted_points;
        private _min;
        private _max;
        get Points(): Vector3[];
        Tesselate(angle_step?: number): Vector3[];
        Min(result?: Vector3): Vector3;
        Max(result?: Vector3): Vector3;
    }
    class GeCircleFill extends GeCircle {
        FillColor: Color;
        private m_faceIndices;
        get FaceIndices(): number[];
    }
}
declare namespace U1.Geoms {
    class GeLine extends GeEntity {
        Start: Vector3;
        End: Vector3;
        Thick: number;
        LinePattern: number[];
        Min(result?: Vector3): Vector3;
        Max(result?: Vector3): Vector3;
        constructor(other?: GeLine);
        Set(start: Vector3, end: Vector3, color: Color, thick: number, linePattern: number[]): void;
    }
}
declare namespace U1.Geoms {
    class GeLineData extends GeEntity {
        Thick: number;
        LinePattern: number[];
        LineData: LineBufferGeometry | LineGeometry;
        Min(result?: Vector3): Vector3;
        Max(result?: Vector3): Vector3;
    }
}
declare namespace U1.Geoms {
    class GeNode {
        Element: UElement;
        Children: GeNode[];
        Entities: GeEntity[];
        Transform: Matrix4;
        IsSelected: boolean;
        private _boundingBox;
        get BoundingBox(): BoundingBox;
        private UpdateBoundingBox;
        HasEntities(): boolean;
        AddChild(child: GeNode): this;
        AddEntity(entity: GeEntity): void;
        AddEntities(entities: GeEntity[]): void;
        Clone(): GeNode;
        GetMeshData(): MeshBufferGeometry;
        private AddToMesh;
        GetLineData(): LineBufferGeometry;
        private AddToLineData;
    }
}
declare namespace U1.Geoms {
    class GePolygon extends GeEntity {
        Thick: number;
        Points: Vector3[];
        LinePattern: number[];
        Min(result?: Vector3): Vector3;
        Max(result?: Vector3): Vector3;
        constructor(initData?: {
            color: Color;
            thick: number;
            points: Vector3[];
            linePattern: number[];
        });
    }
    class GePolygonFill extends GePolygon {
        FillColor: Color;
        NoFill: boolean;
        constructor(initData?: {
            fillColor: Color;
            color: Color;
            thick: number;
            points: Vector3[];
            linePattern: number[];
        });
    }
}
declare namespace U1.Geoms {
    class GePolyline extends GeEntity {
        Thick: number;
        Points: Vector3[];
        LinePattern: number[];
        Min(result?: Vector3): Vector3;
        Max(result?: Vector3): Vector3;
        constructor(initData?: {
            color: Color;
            thick: number;
            points: Vector3[];
            linePattern: number[];
        });
    }
    class GePolylineFill extends GePolyline {
        FillColor: Color;
        constructor(initData?: {
            fillColor: Color;
            color: Color;
            thick: number;
            points: Vector3[];
            linePattern: number[];
        });
    }
}
declare namespace U1.Geoms {
    class GeSnapPoint {
        Pos: Vector3;
        SnapType: GeSnapTypeEnum;
        constructor(pos?: Vector3, snaptype?: GeSnapTypeEnum);
        Clone(): this;
        CopyFrom(other: this): this;
    }
    class GeSnapPointArr extends GeSnapPoint {
        Points: Vector3[];
        constructor(points?: Vector3[], snaptype?: GeSnapTypeEnum);
        CopyFrom(other: this): this;
    }
}
declare namespace U1.Geoms {
    enum GeSnapTypeEnum {
        None = 0,
        End = 1,
        Middle = 2,
        Center = 4,
        Vertex = 8,
        All = 15
    }
}
declare namespace U1 {
    class Arc3 implements IUValue {
        private start;
        private end;
        private up;
        private center;
        private bulge;
        private isCenterDirty;
        get Start(): Vector3;
        set Start(value: Vector3);
        get End(): Vector3;
        set End(value: Vector3);
        get Up(): Vector3;
        set Up(value: Vector3);
        get Bulge(): number;
        set Bulge(value: number);
        get Radius(): number;
        get Angle(): number;
        get Center(): Vector3;
        get Direction(): Vector3;
        get Right(): Vector3;
        get Length(): number;
        Slice(segmentCount: any): Vector3[];
        private GetCenter;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        CopyFrom(other: IUValue): void;
        Equals(other: IUValue): boolean;
        Clone(): IUValue;
    }
}
declare namespace U1 {
    class Rect {
        X: number;
        Y: number;
        Width: number;
        Height: number;
        ConvertFrom(value: string): void;
        ConvertTo(): string;
        static Equals(rect1: Rect, rect2: Rect): boolean;
        Equals(value: Rect): boolean;
        toString(): string;
        constructor(x?: number, y?: number, width?: number, height?: number);
        static get Zero(): Rect;
        get IsZero(): boolean;
        get Location(): Vector2;
        set Location(value: Vector2);
        get Size(): Vector2;
        set Size(value: Vector2);
        get Left(): number;
        get Top(): number;
        get Right(): number;
        get Bottom(): number;
        get TopLeft(): Vector2;
        get TopRight(): Vector2;
        get BottomLeft(): Vector2;
        get BottomRight(): Vector2;
        Contains2(x: number, y: number): boolean;
        Contains3(rect: Rect): boolean;
        IntersectsWith(rect: Rect): boolean;
        Intersect(rect: Rect): void;
        static Intersect2(rect1: Rect, rect2: Rect): Rect;
        Union(rect: Rect): void;
        static Union(rect1: Rect, rect2: Rect): Rect;
        Offset(offsetVector: Vector2): void;
        Offset2(offsetX: number, offsetY: number): void;
        static Offset(rect1: Rect, offsetVector: Vector2): Rect;
        Inflate(width: number, height: number): void;
        Scale(scaleX: number, scaleY: number): void;
        private ContainsInternal;
    }
}
declare namespace U1 {
    interface IUPropertyBaseArgs {
        Source?: any;
        SourceProperty?: string;
        Category?: string;
        Group?: string;
        Name?: string;
        Label?: string;
        ValueText?: string;
        IsEditable?: boolean;
        DisposingAction?: (prop: UPropertyBase) => any;
        IsVisible?: boolean;
        Tag?: any;
        Background?: string;
        GetIsVibible?: (prop: UPropertyBase) => boolean;
    }
    class UPropertyBase {
        protected _valueText: string;
        private _label;
        protected _category: string;
        protected _group: string;
        protected _name: string;
        protected _sourceProp: string;
        protected _source: INotifyPropertyChanged;
        protected _isDisposed: boolean;
        protected _isReadOnly: boolean;
        protected _isVisible: boolean;
        protected _tag: any;
        protected _childProps: UPropertyBase[];
        protected _document: UDocument;
        protected _backGround: string;
        private static _key;
        private _key;
        constructor(arg?: IUPropertyBaseArgs);
        DisposingAction: (prop: UPropertyBase) => any;
        GetIsVibible: (prop: UPropertyBase) => boolean;
        get Key(): string;
        set Key(value: string);
        get Source(): any;
        set Source(value: any);
        get IsDisposed(): boolean;
        get SourceProperty(): string;
        set SourceProperty(value: string);
        get Category(): string;
        set Category(value: string);
        get Group(): string;
        set Group(value: string);
        get Name(): string;
        set Name(value: string);
        get Label(): string;
        set Label(value: string);
        get LabelColon(): string;
        get ValueText(): string;
        set ValueText(value: string);
        get IsReadOnly(): boolean;
        set IsReadOnly(value: boolean);
        get IsEditable(): boolean;
        get IsVisible(): boolean;
        set IsVisible(value: boolean);
        get Tag(): any;
        set Tag(value: any);
        get ChildProperties(): UPropertyBase[];
        get Background(): string;
        set Background(value: string);
        GetSourceAll<T extends UPropertyBase>(ctr: {
            new (): T;
        }): Array<T>;
        AddChild(other: UPropertyBase): void;
        PropertyChanged: PropertyChangedEvent;
        protected InvokeValueChanged(): void;
        InvokePropertyChanged(name?: string): void;
        Dispose(): void;
        protected OnDisposing(): void;
        private AddSourceEventHandlers;
        OnPropertyChanged(sender: any, propName: string): void;
        private RemoveSourceEventHandlers;
        private AddDocumentEventHandlers;
        private RemoveDocumentEventHandlers;
        protected OnDocument_AfterUndoRedo(arg1: UDocument, arg2: boolean): void;
        protected OnDocument_AfterEndTransaction(obj: UDocument): void;
        protected OnElementDisposing(sender: UElement): void;
    }
    interface IUPropertyArgs<T> extends IUPropertyBaseArgs {
        GetValueFunc?: (a: UProperty<T>) => T;
        SetValueFunc?: (a: UProperty<T>, value: T) => any;
        BeginChangeFunc?: (a: UProperty<T>) => any;
        EndChangeFunc?: (a: UProperty<T>) => any;
    }
    class UProperty<T> extends UPropertyBase {
        GetValueFunc: (a: UProperty<T>) => T;
        SetValueFunc: (a: UProperty<T>, value: T) => any;
        BeginChangeFunc: (a: UProperty<T>) => any;
        EndChangeFunc: (a: UProperty<T>) => any;
        constructor(arg?: IUPropertyArgs<T>);
        protected _value: T;
        protected _parent: UProperty<T>;
        protected _children: Array<UProperty<T>>;
        get ValueText(): string;
        set ValueText(value: string);
        get TheValue(): T;
        set TheValue(value: T);
        get Value(): T;
        set Value(value: T);
        protected setValue(value: T): void;
        get Parent(): UProperty<T>;
        get Children(): Array<UProperty<T>>;
        get IsReadOnly(): boolean;
        set IsReadOnly(value: boolean);
        AddChild(other: UPropertyBase): void;
        protected InvokeValueChanged(): void;
        protected OnDisposing(): void;
        protected EndTransaction(): void;
        protected BeginTransaction(): void;
    }
    class UPropBool extends UProperty<boolean> {
        constructor(arg?: IUPropertyArgs<boolean>);
        get ValueText(): string;
        set ValueText(value: string);
    }
    class UPropString extends UProperty<string> {
        private _acceptsReturn;
        constructor(arg?: IUPropertyArgs<string>);
        get ValueText(): string;
        set ValueText(value: string);
        get AcceptsReturn(): boolean;
        set AcceptsReturn(value: boolean);
    }
    class UPropDouble extends UProperty<number> {
        protected increment: number;
        protected formatString: string;
        constructor(arg?: IUPropertyArgs<number>);
        FromDisplay(str: string): number;
        ToDisplay(len: number): string;
        get FormatString(): string;
        set FormatString(value: string);
        get Increment(): number;
        set Increment(value: number);
        get Value(): number;
        set Value(value: number);
        get ValueText(): string;
        set ValueText(value: string);
    }
    class UPropInt extends UPropDouble {
        constructor(arg?: IUPropertyArgs<number>);
    }
}
declare namespace U1 {
    class UPropAngle extends UProperty<number> {
        FromDisplay(strAngle: string): number;
        ToDisplay(angle: number): string;
        get Value(): number;
        set Value(value: number);
        get ValueText(): string;
        set ValueText(value: string);
        protected InvokeValueChanged(): void;
    }
}
declare namespace U1 {
    class UPropColor extends UProperty<Color> {
        get ValueText(): string;
        set ValueText(value: string);
        get RText(): string;
        set RText(value: string);
        get GText(): string;
        set GText(value: string);
        get BText(): string;
        set BText(value: string);
        GetText(name: string): string;
        SetText(name: string, valstr: string): void;
        GetProperty(name: string): number;
        SetProperty(name: string, value: number): void;
        get R(): number;
        set R(value: number);
        get G(): number;
        set G(value: number);
        get B(): number;
        set B(value: number);
        protected InvokeValueChanged(): void;
    }
}
declare namespace U1 {
    class UPropertyService {
        private static distToString;
        private static distFromUIString;
        static get DistToString(): (dist: number) => string;
        set DistToString(value: (dist: number) => string);
        static get DistFromUIString(): (uiString: string) => number;
        private static DefDistFromUIString;
    }
}
declare namespace U1 {
    class UPropVect2 extends UProperty<Vector2> {
        constructor();
        get ValueText(): string;
        set ValueText(value: string);
        get XText(): string;
        set XText(value: string);
        get YText(): string;
        set YText(value: string);
        GetText(name: string): string;
        SetText(name: string, valstr: string): void;
        GetProperty(name: string): number;
        SetProperty(name: string, value: number): void;
        get X(): number;
        set X(value: number);
        get Y(): number;
        set Y(value: number);
        protected InvokeValueChanged(): void;
    }
    class UPropLoc2 extends UPropVect2 {
    }
    class UPropScale2 extends UPropVect2 {
    }
    class UPropSize2 extends UPropVect2 {
    }
    class UPropVect2CustomUI extends UPropVect2 {
        private _uiElement;
        CreateUI: (prop: UPropVect2CustomUI) => HTMLElement;
        get UIElement(): HTMLElement;
    }
}
declare namespace U1 {
    class UPropVect3 extends UProperty<Vector3> {
        get ValueText(): string;
        set ValueText(value: string);
        get XText(): string;
        set XText(value: string);
        get YText(): string;
        set YText(value: string);
        get ZText(): string;
        set ZText(value: string);
        GetText(name: string): string;
        SetText(name: string, valstr: string): void;
        GetProperty(name: string): number;
        SetProperty(name: string, value: number): void;
        get X(): number;
        set X(value: number);
        get Y(): number;
        set Y(value: number);
        get Z(): number;
        set Z(value: number);
        protected InvokeValueChanged(): void;
    }
    class UPropLoc3 extends UPropVect3 {
    }
    class UPropScale3 extends UPropVect3 {
    }
    class UPropSize3 extends UPropVect3 {
    }
    class UPropVect3CustomUI extends UPropVect3 {
        private _uiElement;
        CreateUI: (prop: UPropVect3CustomUI) => HTMLElement;
        get UIElement(): HTMLElement;
    }
}
declare namespace U1.Geoms {
    class GeText extends GeEntity {
        Text: string;
        FontSize: number;
        FontStyle: FontStyleEnum;
        FontWeight: FontWeightEnum;
        FontFamily: string;
        TextAlignment: TextAlignmentEnum;
        Width: number;
        WidthFactor: number;
        Height: number;
        IsSingleLine: boolean;
        Position: Vector3;
        Rotation: number;
        Max(result?: Vector3): Vector3;
        Min(result?: Vector3): Vector3;
    }
}
declare namespace U1.Geoms {
    class GeTriFace extends GeEntity {
        private _points;
        Min(result?: Vector3): Vector3;
        Max(result?: Vector3): Vector3;
        get P1(): Vector3;
        set P1(value: Vector3);
        get P2(): Vector3;
        set P2(value: Vector3);
        get P3(): Vector3;
        set P3(value: Vector3);
        get Points(): Vector3[];
        set Points(value: Vector3[]);
        E1: EdgeTypeEnum;
        E2: EdgeTypeEnum;
        E3: EdgeTypeEnum;
        IsFilled: boolean;
        GetNormal(result?: Vector3): Vector3;
    }
}
declare namespace U1 {
    enum ArcCrossStates {
        None = 0,
        SameLine = 1,
        FirstOnly = 2,
        SecondOnly = 3,
        Both = 4,
        RemoveFirst = 5
    }
    class Arc2 implements IUValue {
        private _start;
        private _end;
        private _center;
        private _bulge;
        private _isCenterDirty;
        Tag: any;
        constructor(start?: Vector2 | Arc2, end?: Vector2, bulge?: number);
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        CopyFrom(other: Arc2): this;
        Clone(): Arc2;
        Equals(other: Arc2): boolean;
        toString(): string;
        static get Zero(): Arc2;
        get Start(): Vector2;
        set Start(value: Vector2);
        get End(): Vector2;
        set End(value: Vector2);
        get Bulge(): number;
        set Bulge(value: number);
        get Radius(): number;
        get Angle(): number;
        get Center(): Vector2;
        Direction(result?: Vector2): Vector2;
        Right(result?: Vector2): Vector2;
        get Length(): number;
        static ExtendArc(arc0: Arc2, arc1: Arc2): boolean;
        private static ExtendArc_LineLine;
        private static ExtendArc_LineArc;
        private static ExtendArc_ArcLine;
        private static ExtendArc_ArcArc;
        static TrimA(A: Arc2, B: Arc2): boolean;
        static CrossArc(arc0: Arc2, arc1: Arc2, newArc0s: Arc2[], newArc1s: Arc2[]): ArcCrossStates;
        private static CrossArc_LineLine;
        private static CrossArc_LineArc;
        private static CrossArc_ArcArc;
        static CalNewBulge(start: Vector2, end: Vector2, cent: Vector2, radius: number, orignBulge: number): number;
        static SplitWithPoints(ps: Vector2[], arc: Arc2): Arc2[];
        static SplitWithPoint(arc: Arc2, p: Vector2): Arc2[];
        static MakeArc(start: Vector2, end: Vector2, center: Vector2, bulgeSign: number): Arc2;
        Offset(distance: number): void;
        Slice(segmentCount: number): Vector2[];
        private GetCenter;
        StartTangent(): Vector2;
        EndTangent(): Vector2;
        Opposite(): Arc2;
        GetDistance(p: Vector2): number;
        GetDistance1(p: Vector2, pOnArc: Vector2): number;
        IsOver(p: Vector2): boolean;
        static Translate(source: Arc2, offset: Vector2): Arc2;
        Translate(offset: Vector2): void;
        SetBulgePosition(bulge_point: Vector2): void;
        GetU(p: Vector2): number;
        GetPositionAtU(u: number, result?: Vector2): Vector2;
    }
}
declare namespace U1 {
    class Camera {
        Position: Vector3;
        LookAt: Vector3;
        Up: Vector3;
        FOV: number;
        Near: number;
        Far: number;
        OrthoHeight: number;
        ProjectionMode: ProjectionTypeEnum;
        Viewport: Viewport;
        private _BoundingFrustum;
        get Frustum(): BoundingFrustum;
        get Right(): Vector3;
        get Direction(): Vector3;
        get ProjMatrix(): Matrix4;
        get ViewMatrix(): Matrix4;
        get Aspect(): number;
        static get Default(): Camera;
        CalPickingRay(x: number, y: number, result?: Ray3): Ray3;
        WorldToScreen(wp: Vector3, result?: Vector3): Vector3;
        ScreenToWorld(sp: Vector3, result?: Vector3): Vector3;
        GetRotation(targetCamera: Camera): {
            axis: Vector3;
            angle: number;
            roll: number;
        };
        static GetRotation(src: Matrix4, target: Matrix4): {
            axis: Vector3;
            angle: number;
            roll: number;
        };
        Roll(roll: number): void;
        Rotate(position: Vector3, axis: Vector3, ang: number): void;
        ScreenToPlane(pt: Vector2, plane: Plane): Vector3;
        Move(dir: Vector3): void;
        Clone(): Camera;
        Equals(other: Camera): boolean;
    }
}
declare namespace U1 {
    class MathHelper {
        static E: number;
        static Log10E: number;
        static Log2E: number;
        static Pi: number;
        static PiOver2: number;
        static PiOver4: number;
        static TwoPi: number;
        static PRECISION: number;
        static Barycentric(value1: number, value2: number, value3: number, amount1: number, amount2: number): number;
        static CatmullRom(value1: number, value2: number, value3: number, value4: number, amount: number): number;
        static Clamp(value: number, min: number, max: number): number;
        static Distance(value1: number, value2: number): number;
        static Hermite(value1: number, tangent1: number, value2: number, tangent2: number, amount: number): number;
        static Lerp(value1: number, value2: number, amount: number): number;
        static Max(value1: number, value2: number): number;
        static Min(value1: number, value2: number): number;
        static SmoothStep(value1: number, value2: number, amount: number): number;
        static ToDegrees(radians: number): number;
        static ToRadians(degrees: number): number;
        static signum(x: number): number;
        static IEEEremainder(f1: number, f2: number): number;
        static WrapAngle(angle: number): number;
        static Round(vector3: Vector3): Vector3;
        static MatrixToEulerZYX(m: Matrix4, result?: Vector3): Vector3;
        static MatrixToEulerXYZ(m: Matrix4, result?: Vector3): Vector3;
        static GetAxisAngle(xdir: Vector3, ydir: Vector3, result?: Vector4): Vector4;
        static MatrixToAxisAngle(mat: Matrix4, result?: Vector4): Vector4;
        static IsNaN(v: Vector2 | Vector3 | Vector4): boolean;
    }
}
declare module collections {
    interface ICompareFunction<T> {
        (a: T, b: T): number;
    }
    interface IEqualsFunction<T> {
        (a: T, b: T): boolean;
    }
    interface ILoopFunction<T> {
        (a: T): boolean;
    }
    function defaultCompare<T>(a: T, b: T): number;
    function defaultEquals<T>(a: T, b: T): boolean;
    function defaultToString(item: any): string;
    function makeString<T>(item: T, join?: string): string;
    function isFunction(func: any): boolean;
    function isUndefined(obj: any): boolean;
    function isString(obj: any): boolean;
    function reverseCompareFunction<T>(compareFunction: ICompareFunction<T>): ICompareFunction<T>;
    function compareToEquals<T>(compareFunction: ICompareFunction<T>): IEqualsFunction<T>;
    module arrays {
        function indexOf<T>(array: T[], item: T, equalsFunction?: collections.IEqualsFunction<T>): number;
        function lastIndexOf<T>(array: T[], item: T, equalsFunction?: collections.IEqualsFunction<T>): number;
        function contains<T>(array: T[], item: T, equalsFunction?: collections.IEqualsFunction<T>): boolean;
        function remove<T>(array: T[], item: T, equalsFunction?: collections.IEqualsFunction<T>): boolean;
        function frequency<T>(array: T[], item: T, equalsFunction?: collections.IEqualsFunction<T>): number;
        function equals<T>(array1: T[], array2: T[], equalsFunction?: collections.IEqualsFunction<T>): boolean;
        function copy<T>(array: T[]): T[];
        function swap<T>(array: T[], i: number, j: number): boolean;
        function toString<T>(array: T[]): string;
        function forEach<T>(array: T[], callback: (item: T) => boolean): void;
    }
    interface ILinkedListNode<T> {
        element: T;
        next: ILinkedListNode<T>;
    }
    class LinkedList<T> {
        firstNode: ILinkedListNode<T>;
        private lastNode;
        private nElements;
        constructor();
        add(item: T, index?: number): boolean;
        first(): T;
        last(): T;
        elementAtIndex(index: number): T;
        indexOf(item: T, equalsFunction?: IEqualsFunction<T>): number;
        contains(item: T, equalsFunction?: IEqualsFunction<T>): boolean;
        remove(item: T, equalsFunction?: IEqualsFunction<T>): boolean;
        clear(): void;
        equals(other: LinkedList<T>, equalsFunction?: IEqualsFunction<T>): boolean;
        private equalsAux;
        removeElementAtIndex(index: number): T;
        forEach(callback: (item: T) => boolean): void;
        reverse(): void;
        toArray(): T[];
        size(): number;
        isEmpty(): boolean;
        toString(): string;
        private nodeAtIndex;
        private createNode;
    }
    class Dictionary<K, V> {
        private table;
        private nElements;
        private toStr;
        constructor(toStrFunction?: (key: K) => string);
        getValue(key: K): V;
        setValue(key: K, value: V): V;
        remove(key: K): V;
        keys(): K[];
        values(): V[];
        forEach(callback: (key: K, value: V) => any): void;
        containsKey(key: K): boolean;
        clear(): void;
        size(): number;
        isEmpty(): boolean;
        toString(): string;
    }
    class MultiDictionary<K, V> {
        private dict;
        private equalsF;
        private allowDuplicate;
        constructor(toStrFunction?: (key: K) => string, valuesEqualsFunction?: IEqualsFunction<V>, allowDuplicateValues?: boolean);
        getValue(key: K): V[];
        setValue(key: K, value: V): boolean;
        remove(key: K, value?: V): boolean;
        keys(): K[];
        values(): V[];
        containsKey(key: K): boolean;
        clear(): void;
        size(): number;
        isEmpty(): boolean;
    }
    class Heap<T> {
        private data;
        private compare;
        constructor(compareFunction?: ICompareFunction<T>);
        private leftChildIndex;
        private rightChildIndex;
        private parentIndex;
        private minIndex;
        private siftUp;
        private siftDown;
        peek(): T;
        add(element: T): boolean;
        removeRoot(): T;
        contains(element: T): boolean;
        size(): number;
        isEmpty(): boolean;
        clear(): void;
        forEach(callback: (item: T) => boolean): void;
    }
    class Stack<T> {
        private list;
        constructor();
        push(elem: T): boolean;
        add(elem: T): boolean;
        pop(): T;
        peek(): T;
        size(): number;
        contains(elem: T, equalsFunction?: IEqualsFunction<T>): boolean;
        isEmpty(): boolean;
        clear(): void;
        forEach(callback: ILoopFunction<T>): void;
    }
    class Queue<T> {
        private list;
        constructor();
        enqueue(elem: T): boolean;
        add(elem: T): boolean;
        dequeue(): T;
        peek(): T;
        size(): number;
        contains(elem: T, equalsFunction?: IEqualsFunction<T>): boolean;
        isEmpty(): boolean;
        clear(): void;
        forEach(callback: ILoopFunction<T>): void;
    }
    class PriorityQueue<T> {
        private heap;
        constructor(compareFunction?: ICompareFunction<T>);
        enqueue(element: T): boolean;
        add(element: T): boolean;
        dequeue(): T;
        peek(): T;
        contains(element: T): boolean;
        isEmpty(): boolean;
        size(): number;
        clear(): void;
        forEach(callback: ILoopFunction<T>): void;
    }
    class Set<T> {
        private dictionary;
        constructor(toStringFunction?: (item: T) => string);
        contains(element: T): boolean;
        add(element: T): boolean;
        intersection(otherSet: Set<T>): void;
        union(otherSet: Set<T>): void;
        difference(otherSet: Set<T>): void;
        isSubsetOf(otherSet: Set<T>): boolean;
        remove(element: T): boolean;
        forEach(callback: ILoopFunction<T>): void;
        toArray(): T[];
        isEmpty(): boolean;
        size(): number;
        clear(): void;
        toString(): string;
    }
    class Bag<T> {
        private toStrF;
        private dictionary;
        private nElements;
        constructor(toStrFunction?: (item: T) => string);
        add(element: T, nCopies?: number): boolean;
        count(element: T): number;
        contains(element: T): boolean;
        remove(element: T, nCopies?: number): boolean;
        toArray(): T[];
        toSet(): Set<T>;
        forEach(callback: ILoopFunction<T>): void;
        size(): number;
        isEmpty(): boolean;
        clear(): void;
    }
    class BSTree<T> {
        private root;
        private compare;
        private nElements;
        constructor(compareFunction?: ICompareFunction<T>);
        add(element: T): boolean;
        clear(): void;
        isEmpty(): boolean;
        size(): number;
        contains(element: T): boolean;
        remove(element: T): boolean;
        inorderTraversal(callback: ILoopFunction<T>): void;
        preorderTraversal(callback: ILoopFunction<T>): void;
        postorderTraversal(callback: ILoopFunction<T>): void;
        levelTraversal(callback: ILoopFunction<T>): void;
        minimum(): T;
        maximum(): T;
        forEach(callback: ILoopFunction<T>): void;
        toArray(): T[];
        height(): number;
        private searchNode;
        private transplant;
        private removeNode;
        private inorderTraversalAux;
        private levelTraversalAux;
        private preorderTraversalAux;
        private postorderTraversalAux;
        private minimumAux;
        private maximumAux;
        private heightAux;
        private insertNode;
        private createNode;
    }
}
declare namespace U1 {
    enum UDistanceUnit {
        Meter = 0,
        Feet = 1
    }
}
declare namespace U1 {
    class UPropertySelection extends UProperty<string> {
        private _items;
        get Items(): string[];
        set Items(value: string[]);
    }
}
declare namespace U1 {
    class UPropContainer extends UPropertyBase {
        protected static s_isExpandeds: {
            [index: string]: boolean;
        };
        protected _items: UPropertyBase[];
        get Items(): UPropertyBase[];
        ParentContainer: UPropContainer;
        get Path(): string;
        get IsExpanded(): boolean;
        set IsExpanded(value: boolean);
        InvokePropertyChanged(prop?: string): void;
        AddChild(other: UPropertyBase): void;
        protected OnDisposing(): void;
    }
}
declare namespace U1 {
    class UPropCategory extends UPropContainer {
        CategoryGroup: UPropCategoryGroup;
        static Categorize(props: UPropertyBase[]): UPropCategory[];
        get Path(): string;
    }
}
declare namespace U1 {
    interface IUPropsContainer {
        GetUPropsCategory(): string;
        GetUProps(): UPropertyBase[];
    }
    class UPropCategoryGroup extends UPropContainer {
        private static MaxCount;
        get Path(): string;
        get Categories(): UPropCategory[];
        set Categories(value: UPropCategory[]);
        static Categorize(selection: IUPropsContainer[]): Array<UPropCategoryGroup>;
    }
}
declare namespace U1 {
    class UPropGroup extends UPropContainer {
    }
}
declare namespace U1 {
    enum CullModeEnum {
        NONE = 0,
        CW = 1,
        CCW = 2
    }
    enum TextureAddressModeEnum {
        Wrap = 0,
        Clamp = 1,
        Mirror = 2
    }
    enum SnapTypeEnum {
        None = 0,
        Point = 1,
        Edge = 2,
        MidEdge = 4,
        Face = 8,
        Grid = 16,
        Angle = 32
    }
    enum SnapTargetEnum {
        None = 0,
        Curve = 1,
        Surface = 2,
        Grid = 4
    }
    enum VerticalAlignment {
        Top = 0,
        Center = 1,
        Bottom = 2,
        Stretch = 3
    }
    enum MappingTypeEnum {
        RealWorldSize = 0,
        SurfaceSize = 1
    }
    class ISectInfo {
        Source: Object;
        Geometry: Geometry;
        Distance: number;
        IsectPosition: Vector3;
        IsectNormal: Vector3;
        Snap: SnapTypeEnum;
        FaceID: number;
        Attr: number;
        Pos: Vector3[];
        UV0: Vector2[];
        UV1: Vector2[];
        Indices: number[];
        S: number;
        T: number;
        UV: Vector2;
        Tag: Object;
        Clone(): ISectInfo;
        CompareTo(other: ISectInfo): number;
        Reset(): void;
    }
    interface SnapConfigListener {
        OnUseSnapChanged?: () => void;
        OnSnapChanged?: () => void;
        OnAngleSnapChanged?: () => void;
        OnGridSnapChanged?: () => void;
        OnDistSnapChanged?: () => void;
        OnSnapTargetChanged?: () => void;
    }
    class SnapConfig {
        private static s_listeners;
        static AddListener(listener: SnapConfigListener): void;
        static RemoveListener(listener: SnapConfigListener): void;
        static UseSnapChanged(): void;
        static SnapChanged(): void;
        static AngleSnapChanged(): void;
        static GridSnapChanged(): void;
        static DistSnapChanged(): void;
        static SnapTargetChanged(): void;
        private static m_snap;
        private static m_snapTarget;
        private static m_useSnap;
        private static m_angleSnap;
        private static m_gridSnap;
        private static m_distSnap;
        private static m_snapPixel;
        static get UseSnap(): boolean;
        static set UseSnap(value: boolean);
        static get Snap(): SnapTypeEnum;
        static set Snap(value: SnapTypeEnum);
        static get SnapTarget(): SnapTargetEnum;
        static set SnapTarget(value: SnapTargetEnum);
        static GetSnap(snap: SnapTypeEnum): boolean;
        static GetSnapTarget(target: SnapTargetEnum): boolean;
        static SetSnap(snap: SnapTypeEnum, state: boolean): void;
        static SetSnapTarget(target: SnapTargetEnum, state: boolean): void;
        static get AngelSnap(): number;
        static set AngelSnap(value: number);
        static get GridSnap(): number;
        static set GridSnap(value: number);
        static get SnapPixel(): number;
        static set SnapPixel(value: number);
        static get DistSnap(): number;
        static set DistSnap(value: number);
        static WithinSnapPixel(mouse: Vector2, px: number, py: number): boolean;
        static GetSnapedDist(dist: number): void;
        static GetGridSnapedPoint(plane: Plane, point: Vector3): void;
        static GetGridSnapedPointGrid(grdOrign: Vector3, grdX: Vector3, grdY: Vector3, point: Vector3): void;
    }
    class MeshMaterial {
        private _id;
        private static _id;
        constructor();
        get ID(): number;
        Diffuse: Color;
        Ambient: Color;
        Emissive: Color;
        Specular: Color;
        SpecularPower: number;
        DiffuseTexture: Texture;
        Cull: CullModeEnum;
        Flag: number;
        Tag: number;
        Opacity: number;
        get Pickable(): boolean;
        set Pickable(value: boolean);
        get AlwaysZWrite(): boolean;
        set AlwaysZWrite(value: boolean);
        Clone(): MeshMaterial;
    }
    class Material extends UNode {
        private ambient;
        private diffuse;
        private specular;
        private emissive;
        private shininess;
        private texOffset;
        private texScale;
        private texRotate;
        private texMirrU;
        private texMirrV;
        private opacity;
        private diffuseTexture;
        get Ambient(): Color;
        set Ambient(value: Color);
        get Diffuse(): Color;
        set Diffuse(value: Color);
        get Specular(): Color;
        set Specular(value: Color);
        get Emissive(): Color;
        set Emissive(value: Color);
        get Shininess(): number;
        set Shininess(value: number);
        get TexOffset(): Vector2;
        set TexOffset(value: Vector2);
        get TexScale(): Vector2;
        set TexScale(value: Vector2);
        get TexRotate(): number;
        set TexRotate(value: number);
        get TexMirrU(): boolean;
        set TexMirrU(value: boolean);
        get TexMirrV(): boolean;
        set TexMirrV(value: boolean);
        get Opacity(): number;
        set Opacity(value: number);
        get DiffuseTexture(): string;
        set DiffuseTexture(value: string);
        get RefElement(): UElement[];
        get RefCount(): number;
        Read(meshMaterial: MeshMaterial): void;
        GetMeshMaterial(): MeshMaterial;
    }
    class MaterialSet extends UItemSet<Material> {
    }
    class Texture {
        Url: string;
        Offset: Vector2;
        Scale: Vector2;
        Rotate: number;
        AddressU: TextureAddressModeEnum;
        AddressV: TextureAddressModeEnum;
        AddressW: TextureAddressModeEnum;
        constructor();
        Clone(): Texture;
    }
    class MTexture extends UNode {
    }
    class TextureSet extends UItemSet<MTexture> {
    }
    class Geometry {
        private _isBoundingInvalid;
        private _boundingBox;
        private _boundingSphere;
        private _id;
        private static _id;
        get ID(): number;
        get BoundingBox(): BoundingBox;
        get BoundingSphere(): BoundingSphere;
        UpdateBounding(boundingBox: BoundingBox, boundingSphere: BoundingSphere): void;
        MarkChanged(): void;
        GetSnapedPoint(mouse: Vector2, transform: Matrix4, camera: Camera): ISectInfo;
        IsInside(planes: Plane[], checkCross: boolean): boolean;
        IntersectW(ray: Ray3, worldM: Matrix4): ISectInfo;
        Intersect(ray: Ray3): ISectInfo;
        BeginAppend(): void;
        EndAppend(): void;
    }
    class ISectContext {
        PickDist: number;
        View: Vector2;
        Ray: Ray3;
        MaxDistance: number;
        PickingOsnapTarget: boolean;
        PickingOrbitPoint: boolean;
        WorldToScreenFunc: (wp: Vector3) => Vector3;
        ScreenWithinSq: number;
        Planes: Plane[];
        Result: ISectInfo;
        IsScreenSpace: boolean;
        private _maxDistance;
        constructor(view: Vector2, ray: Ray3, maxDistance: number);
        WorldToScreen(world: Vector3): Vector3;
        CanPickable(p: Vector3, transform?: Matrix4): boolean;
        IsLineIsect(pOnRay: Vector3, pOnObject: Vector3, lineWidth: number): boolean;
        AddIntersect(isect: ISectInfo): void;
        ClearResults(): void;
    }
    class ContainContext {
        private _selectionPlanes;
        LeftTop: Vector2;
        RightBottom: Vector2;
        SelectionBoxConers: Vector3[];
        get SelectionPlanes(): Plane[];
        AllowCross: boolean;
    }
}
declare namespace U1 {
    class LineBufferGeometry extends Geometry {
        private _pos;
        private _color;
        private _indices;
        get pos(): Float32Array;
        set pos(value: Float32Array);
        get indices(): Uint16Array;
        set indices(value: Uint16Array);
        get color(): Float32Array;
        set color(value: Float32Array);
        get hasColor(): boolean;
        get PointCount(): number;
        get IndexCount(): number;
        UpdateBounding(boundingBox: BoundingBox, boundingSphere: BoundingSphere): void;
        IsInside(planes: Plane[], fCross: boolean): boolean;
        GetSnapedPoint(mouse: Vector2, transform: Matrix4, camera: Camera): ISectInfo;
        Transform(matrix: Matrix4): this;
        private tmp_pos;
        private tmp_col;
        private tmp_idx;
        BeginAppend(): void;
        EndAppend(): void;
        AppendLine(p0: Vector3, p1: Vector3, xform?: Matrix4): void;
        AddppendPolygon(points: Vector3[], xform?: Matrix4): void;
        AddppendPolyline(points: Vector3[], xform?: Matrix4): void;
        CopyFrom(other: LineBufferGeometry): this;
        Clone(): LineBufferGeometry;
        static Merges(lines: LineBufferGeometry[]): LineBufferGeometry;
        Merge(other: LineBufferGeometry, m?: Matrix4): this;
    }
}
declare namespace U1 {
    class LineGeometry extends Geometry {
        Points: LineVertex[];
        Indexes: number[];
        get PointCount(): number;
        get IndexCount(): number;
        SetColor(color: Color): void;
        UpdateBounding(boundingBox: BoundingBox, boundingSphere: BoundingSphere): void;
        IsInside(planes: Plane[], fCross: boolean): boolean;
        GetSnapedPoint(mouse: Vector2, transform: Matrix4, camera: Camera): ISectInfo;
        static IsInside(planes: Plane[], path: Vector3[], fCross: boolean): boolean;
        static IsInside1(planes: Plane[], bsphere: BoundingSphere, path: Vector3[], fCross: boolean): boolean;
    }
    class LineVertex {
        Position: Vector3;
        Color: Color;
        constructor(pos?: Vector3, color?: Color);
        Transform(matrix: Matrix4): void;
        Clone(): LineVertex;
    }
}
declare namespace U1 {
    class MeshBufferGeometry extends Geometry {
        private _pos;
        private _norm;
        private _color;
        private _uv0;
        private _uv1;
        private _indices;
        private _edgeIndices;
        Attributes: number[];
        Materials: MeshMaterial[];
        get pos(): Float32Array;
        set pos(value: Float32Array);
        get normal(): Float32Array;
        set normal(value: Float32Array);
        get hasNormal(): boolean;
        get color(): Float32Array;
        set color(value: Float32Array);
        get hasColor(): boolean;
        get uv0(): Float32Array;
        set uv0(value: Float32Array);
        get hasUv0(): boolean;
        get uv1(): Float32Array;
        set uv1(value: Float32Array);
        get hasUv1(): boolean;
        get indices(): Uint16Array;
        set indices(value: Uint16Array);
        get edgeindices(): Uint16Array;
        set edgeindices(value: Uint16Array);
        UpdateBounding(boundingBox: BoundingBox, boundingSphere: BoundingSphere): void;
        get VertexCount(): number;
        get IndexCount(): number;
        get FaceCount(): number;
        Copy(): MeshBufferGeometry;
        Transform(matrix: Matrix4): this;
        private IntersectTriangle;
        Intersect(ray: Ray3): ISectInfo;
        IntersectCount(ray: Ray3, result: {
            front: number;
            back: number;
            surface: number;
        }): void;
        IntersectW(wray: Ray3, worldM: Matrix4): ISectInfo;
        GetSnapedPoint(mouse: Vector2, worldM: Matrix4, camera: Camera): ISectInfo;
        IsInside(planes: Plane[], checkCross: boolean): boolean;
        SmoothNormal(): void;
        CopyFromMeshGeomerty(mesh: MeshGeometry): this;
        CopyFromShell(shell: BRep.Shell): this;
        CopyFrom(other: MeshBufferGeometry): this;
        Clone(): MeshBufferGeometry;
        ApplyTransform(transform: Matrix4): void;
        private tmp_pos;
        private tmp_nom;
        private tmp_col;
        private tmp_uv0;
        private tmp_idx;
        BeginAppend(): void;
        EndAppend(): void;
        AppendFace(p0: Vector3, p1: Vector3, p2: Vector3, xform?: Matrix4): void;
        AppendFace1(p0: Vector3, p1: Vector3, p2: Vector3, uv0: Vector2, uv1: Vector2, uv2: Vector2, xform?: Matrix4): void;
        AppendFace2(p0: Vector3, p1: Vector3, p2: Vector3, color: Color, xform?: Matrix4): void;
        static Merges(meshes: MeshBufferGeometry[]): MeshBufferGeometry;
        Merge(other: MeshBufferGeometry, m?: Matrix4): this;
        static CreateFromTriangles(triangles: Vector3[]): MeshBufferGeometry;
    }
}
declare namespace U1 {
    class MeshGeometry extends Geometry {
        private static tmp_v2_0;
        private static tmp_v2_1;
        private static tmp_v2_2;
        private static tmp_v2_3;
        private static tmp_v3_0;
        private static tmp_v3_1;
        private static tmp_v3_2;
        private static tmp_v3_3;
        Vertices: MeshVertex[];
        Indexes: number[];
        Attributes: number[];
        Materials: MeshMaterial[];
        Obj: string[];
        UpdateBounding(boundingBox: BoundingBox, boundingSphere: BoundingSphere): void;
        get VertexCount(): number;
        get IndexCount(): number;
        get FaceCount(): number;
        get ObjectCount(): number;
        Clone(): MeshGeometry;
        Transform(matrix: Matrix4): void;
        static IntersectTriangle(ray: Ray3, v0: MeshVertex, v1: MeshVertex, v2: MeshVertex, dirCheck?: boolean): ISectInfo;
        Intersect(ray: Ray3): ISectInfo;
        IntersectCount(ray: Ray3, result: {
            front: number;
            back: number;
            surface: number;
        }): void;
        IntersectW(wray: Ray3, worldM: Matrix4): ISectInfo;
        GetSnapedPoint(mouse: Vector2, worldM: Matrix4, camera: Camera): ISectInfo;
        IsInside(planes: Plane[], checkCross: boolean): boolean;
        SmoothNormal(): void;
        MakeFlatFaceMesh(): MeshGeometry;
        private static s_box;
        static CreateRectangle(points: Vector3[]): MeshGeometry;
        static CreateBox(): MeshGeometry;
        static Merges(meshes: MeshGeometry[]): MeshGeometry;
        Merge(mesh: MeshGeometry, transform?: Matrix4): void;
    }
    class MeshVertex {
        Position: Vector3;
        Normal: Vector3;
        UV0: Vector2;
        constructor(pos?: Vector3, normal?: Vector3, uv?: Vector2);
        Clone(): MeshVertex;
        Transform(matrix: Matrix4): void;
    }
}
declare namespace U1 {
    class MeshUtil {
        static FillPolygon(polygon: Vector3[]): MeshGeometry;
        static FillPolygonWithHoles(polygon: Vector3[], holes: Array<Vector3[]>, basepos: Vector3, normal: Vector3, mappingType: MappingTypeEnum, uvScale: number, pgonset2: U1.CGAL.PolygonSet2): MeshGeometry;
        private static SetMappingType;
        static FillConvexPolygon(polygon: Vector3[], basepos: Vector3, normal: Vector3, u: Vector3, v: Vector3): MeshGeometry;
        static Intersect_RayTriangle(ray: Ray3, v0: Vector3, v1: Vector3, v2: Vector3, dirCheck: boolean, res: {
            r: number;
            u: number;
            v: number;
        }): Vector3;
        static CheckEdgeCross(planes: Plane[], sv: Vector3, ev: Vector3): boolean;
    }
}
declare namespace U1 {
    class Rectangle {
        static Empty: Rectangle;
        private x;
        private y;
        private width;
        private height;
        constructor(x?: number, y?: number, width?: number, height?: number);
        get X(): number;
        set X(value: number);
        get Y(): number;
        set Y(value: number);
        get Width(): number;
        set Width(value: number);
        get Height(): number;
        set Height(value: number);
        get MinX(): number;
        get MinY(): number;
        get MaxX(): number;
        get MaxY(): number;
        get Left(): number;
        get Top(): number;
        get Right(): number;
        get Bottom(): number;
        get IsEmpty(): boolean;
        Equals(obj: any): boolean;
        Contains(x: number, y: number): boolean;
        Contains1(x: number, y: number, w: number, h: number): boolean;
        ContainsRect(rect: Rectangle): boolean;
        GetHashCode(): number;
        Inflate(width: number, height: number): void;
        Set(x: number, y: number, w: number, h: number): this;
        static Inflate(rect: Rectangle, x: number, y: number): Rectangle;
        Intersect(rect: Rectangle): void;
        static Intersect(a: Rectangle, b: Rectangle): Rectangle;
        IntersectsWith(rect: Rectangle): boolean;
        IntersectsWith1(x: number, y: number, w: number, h: number): boolean;
        static Union(a: Rectangle, b: Rectangle): Rectangle;
        Union(b: Rectangle): void;
        Offset(x: number, y: number): void;
        Add(x: number, y: number): void;
        static FromPoints(points: Vector2[] | Vector3[], result?: Rectangle): Rectangle;
        toString(): string;
    }
}
declare namespace U1.BRep {
    class Shell {
        private static N_RANDOMS;
        private static _randomVectors;
        private _vertices;
        private _faces;
        private _edges;
        get Vertices(): Vertex[];
        set Vertices(value: Vertex[]);
        get Faces(): Face[];
        set Faces(value: Face[]);
        get Edges(): number[];
        set Edges(value: number[]);
        private _octree;
        private _id;
        private static _id;
        static get RANDOMVECTORS(): Vector3[];
        constructor(other?: Shell);
        get Octree(): Octree<Face>;
        get ID(): any;
        AddVertex(p?: Vector3, n?: Vector3, uv?: Vector2): Vertex;
        SplitEdge(p0: Vertex, p1: Vertex, amount: number): Vertex;
        SplitByShell(other: Shell): void;
        AddFace(boundary: number[], holes?: number[][], mId?: number): void;
        CheckInside(p: Vector3): boolean;
        static Union(a: Shell, b: Shell): Shell;
        Read(reader: BinaryReader, ver?: number): void;
        Merge(other: Shell): void;
    }
}
declare namespace U1 {
    class Octree<T extends OctreeNode> {
        private static DEFAULT_MAX_LEVEL;
        private static DEFAULT_MIN_LEVEL_DATA;
        private static INDEX_POSITIVE_X;
        private static INDEX_POSITIVE_Y;
        private static INDEX_POSITIVE_Z;
        private static INDEX_NONE;
        private min;
        private max;
        private childArray;
        private nodeArray;
        private static getOctreeIndex;
        static createOctree<T extends OctreeNode>(nodes: T[]): Octree<T>;
        static createOctree1<T extends OctreeNode>(nodes: T[], maxLevel: number, minLevelNodes: number): Octree<T>;
        private addToBound;
        constructor(allNodes: T[], level: number, maxLevel: number, minLevelNodes: number);
        getChildren(): Octree<T>[];
        getMin(): Vector3;
        getMax(): Vector3;
        searchRay(rayOrigin: Vector3, rayDir: Vector3, checkDir: boolean, result: T[]): void;
        searchBox(searchMin: Vector3, searchMax: Vector3, result: Array<T>): void;
    }
}
declare namespace U1 {
    interface OctreeNode {
        getMin(): Vector3;
        getMax(): Vector3;
    }
}
declare namespace U1 {
    class Cookie {
        static setCookie(cname: string, cvalue: string, exdays?: number): void;
        static getCookie(cname: string): string;
    }
}
declare namespace U1 {
    enum ContainmentType {
        Disjoint = 0,
        Contains = 1,
        Intersects = 2
    }
}
declare namespace U1.Views {
    class VcControl implements INotifyPropertyChanged {
        private _container;
        private _isDisposed;
        protected _ver: number;
        protected _updatever: number;
        protected _transform: Matrix4;
        Tag: any;
        Tag1: any;
        constructor();
        IsPickable: boolean;
        Order: number;
        get Container(): VcControlContainer;
        set Container(value: VcControlContainer);
        get IsDisposed(): boolean;
        get View(): ViewBase;
        get Scene(): Scene;
        get Transform(): Matrix4;
        set Transform(value: Matrix4);
        protected MarkChanged(): void;
        CheckIntersect(isectContext: ISectContext): U1.ISectInfo;
        Update(): void;
        protected OnUpdate(): void;
        Dispose(): void;
        Clear(): void;
        OnMouseEnter(ev: MouseEvent): boolean;
        OnMouseLeave(ev: MouseEvent): boolean;
        OnMouseMove(ev: MouseEvent): boolean;
        OnMouseUp(ev: MouseEvent): boolean;
        OnMouseDown(ev: MouseEvent): boolean;
        OnMouseWheel(ev: MouseWheelEvent): boolean;
        OnPress(ev: HammerInput): boolean;
        OnPanMove(ev: HammerInput): boolean;
        OnPanStart(ev: HammerInput): boolean;
        OnPanEnd(ev: HammerInput): boolean;
        OnPinch(ev: HammerInput): boolean;
        OnTouchStart(ev: TouchEvent): boolean;
        OnTouchMove(ev: TouchEvent): boolean;
        OnTouchEnd(ev: TouchEvent): boolean;
        AfterMouseDown: Event2<VcControl, MouseEvent>;
        AfterMouseUp: Event2<VcControl, MouseEvent>;
        Invalidate(): void;
        private _propertyChanged;
        get PropertyChanged(): PropertyChangedEvent;
        InvokePropertyChanged(prop: string): void;
    }
}
declare namespace U1.Views {
    class VcNavigator extends VcControl {
        private _meshGeom;
        private _material;
        private _meshModel;
        protected OnUpdate(): void;
    }
}
declare namespace U1.Views {
    type OnRotateDelegate = (sender: VcXForm, cent: Vector3, norm: Vector3, angle: number) => any;
    type OnScaleDelegate = (sender: VcXForm, cent: Vector3, from: Vector3, to: Vector3) => any;
    type OnMoveDelegate = (sender: VcXForm, from: Vector3, to: Vector3) => any;
    class VcXForm extends VcControl {
        static TM_Modes: {
            None: number;
            Move: number;
            Rotate: number;
            Scale: number;
            MovePivot: number;
        };
        private _obb;
        private _color;
        private _pivot;
        GetOBB: (s: VcXForm) => OrientedBox3;
        SetOBB: (s: VcXForm, value: OrientedBox3) => any;
        GetColor: (s: VcXForm) => Color;
        SetColor: (s: VcXForm, value: Color) => any;
        GetPivot: (s: VcXForm) => Vector3;
        SetPivot: (s: VcXForm, value: Vector3) => any;
        OnBeginRotate: (s: VcXForm) => any;
        OnBeginMove: (s: VcXForm) => any;
        OnBeginScale: (s: VcXForm) => any;
        OnBeginMovePivot: (s: VcXForm) => any;
        OnMove: (sender: VcXForm, tc: UTranslateContext) => any;
        OnRotate: (sender: VcXForm, rc: URotateContext) => any;
        OnScale: (sender: VcXForm, sc: UScaleContext) => any;
        OnMovePivot: (sender: VcXForm, tc: UTranslateContext) => any;
        OnEndRotate: (sender: VcXForm, rc: URotateContext) => any;
        OnEndMove: (sender: VcXForm, tc: UTranslateContext) => any;
        OnEndScale: (sender: VcXForm, sc: UScaleContext) => any;
        OnEndMovePivot: (sender: VcXForm, tc: UTranslateContext) => any;
        OnCancelRotate: (s: VcXForm) => any;
        OnCancelMove: (s: VcXForm) => any;
        OnCancelScale: (s: VcXForm) => any;
        OnCancelMovePivot: (s: VcXForm) => any;
        constructor();
        get OBB(): OrientedBox3;
        set OBB(value: OrientedBox3);
        get Color(): Color;
        set Color(value: Color);
        get HasPivot(): boolean;
        get Center(): Vector3;
        get Pivot(): Vector3;
        set Pivot(value: Vector3);
        TM_Mode: number;
        private m_canScale;
        private m_canRotate;
        private m_canMove;
        private m_canMovePivot;
        get CanScale(): boolean;
        set CanScale(value: boolean);
        get CanRotate(): boolean;
        set CanRotate(value: boolean);
        get CanMove(): boolean;
        set CanMove(value: boolean);
        get CanMovePivot(): boolean;
        set CanMovePivot(value: boolean);
        private m_oldOBB;
        private old_pivot;
        private has_pivot;
        MovingFrom: Vector3;
        MovingTo: Vector3;
        BeginMove(): void;
        Move(from: Vector3, to: Vector3): void;
        EndMove(from: Vector3, to: Vector3): void;
        CancelMove(): void;
        private MakeSnapped;
        BeginMovePivot(): void;
        MovePivot(from: Vector3, to: Vector3): void;
        EndMovePivot(from: Vector3, to: Vector3): void;
        CancelMovePivot(): void;
        BeginRotate(): void;
        Rotate(cent: Vector3, norm: Vector3, from: Vector3, to: Vector3): void;
        EndRotate(cent: Vector3, norm: Vector3, from: Vector3, to: Vector3): void;
        CancelRotate(): void;
        BeginScale(): void;
        Scale(cent: Vector3, from: Vector3, to: Vector3): void;
        EndScale(cent: Vector3, from: Vector3, to: Vector3): void;
        CancelScale(): void;
        Init(nodes: ScEntity[]): void;
        Clear(): void;
    }
}
declare namespace U1.Views {
    class MathExtensions {
        static WithinEpsilon(a: number, b: number): boolean;
        static Project1(source: Vector3, matrix: Matrix4): Vector3;
        static Project2(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4, minDepth: number, maxDepth: number, x: number, y: number, width: number, heiht: number): Vector3;
    }
}
declare namespace U1.Views {
    enum RenderingPriorityEnum {
        Normal = 0,
        High = 1,
        Low = 2
    }
}
declare namespace U1.Views {
    class UDocumentPresenter {
        private document;
        private view;
        private _elementPresenters;
        private m_selection;
        private m_selectionBoxDirty;
        private m_vcSelBox;
        private m_sortedPresenters;
        static Creaters: {
            [index: string]: {
                new (): U1.Views.UElementPresenter;
            };
        };
        static Register<E extends UElement, P extends UElementPresenter>(ecreater: {
            new (): U1.UElement;
        }, pcreate: {
            new (): U1.Views.UElementPresenter;
        }): void;
        constructor();
        get Document(): UDocument;
        set Document(value: UDocument);
        get View(): ViewBase;
        set View(value: ViewBase);
        get Selection(): Array<UElementPresenter3D>;
        get ElementPresenters(): {
            [index: number]: UElementPresenter;
        };
        Update(): void;
        InvalidateAll(): void;
        protected OnElementAdded(doc_: UDocument, elm_: UElement): void;
        protected OnElementRemoving(doc_: UDocument, elm_: UElement): void;
        protected OnElementPropertyChanged(doc_: UDocument, elem: UElement, prop: string): void;
        protected OnSelectionChanged(selectin: USelection): void;
        protected OnAfterUndoRedo(doc: UDocument, isUndo: boolean): void;
        protected OnAfterLoaded(doc: UDocument): void;
        protected OnAfterClear(doc: UDocument): void;
        protected OnAfterAbortTransaction(doc: UDocument): void;
        protected OnAfterEndTransaction(doc: UDocument): void;
        protected xform: VcXForm;
        protected OnAttach(elm: UElement): void;
        protected CreatePresenter(elm_: UElement): UElementPresenter;
        protected Clear(): void;
        GetPresenter<T extends UElementPresenter>(ctr: {
            new (): T;
        }, elm: UElement): T;
        ShowSelectionBox(): void;
        GetWorldBoundingSelection(): BoundingBox;
        GetWorldBounding(): BoundingBox;
        private AddRotateHandlers;
        private AddMoveHandlers;
        private AddScaleHandlers;
        StartMove(): void;
        Move(from: Vector3, to: Vector3): void;
        EndMove(from: Vector3, to: Vector3): void;
        CancelMove(): void;
        Pick(isectContext: ISectContext): PickResult;
        SelectRegion(lt: Vector2, rb: Vector2, allowCross?: boolean): UElementPresenter[];
        UpdateVisible(): void;
    }
}
declare namespace U1.Views {
    class ScEntity {
        private static _handle;
        protected _transform: Matrix4;
        protected _worldTransform: Matrix4;
        protected _boundingBox: BoundingBox;
        protected _boundingSphere: BoundingSphere;
        protected _geometryBBx: BoundingBox;
        protected _worldBoundingSphere: BoundingSphere;
        protected _isInvalidBounding: boolean;
        protected _isInvalidWorldBounding: boolean;
        protected _parent: ScEntity;
        protected _children: Array<ScEntity>;
        protected _orderedChildren: Array<ScEntity>;
        protected _order: number;
        protected _invalidOrder: boolean;
        protected _presenter: UElementPresenter;
        protected _control: VcControl;
        Ver: number;
        protected UpdateVer: number;
        private _isDisposed;
        IsPickable: boolean;
        Handle: number;
        IsInvalid: boolean;
        get IsDisposed(): boolean;
        Name: string;
        get Presenter(): UElementPresenter;
        set Presenter(value: UElementPresenter);
        get Control(): VcControl;
        set Control(value: VcControl);
        Tag: any;
        constructor();
        get Parent(): ScEntity;
        get Order(): number;
        set Order(order: number);
        Visible: boolean;
        get Transform(): Matrix4;
        set Transform(value: Matrix4);
        get WorldTransform(): Matrix4;
        get BoundingBox(): BoundingBox;
        get BoundingSphere(): BoundingSphere;
        get WorldBoundingSphere(): BoundingSphere;
        get Container(): ScEntityContainer;
        get Scene(): Scene;
        get Children(): Array<ScEntity>;
        get OrderedChildren(): Array<ScEntity>;
        AddChild(entity: ScEntity): ScEntity;
        RemoveChild(entity: ScEntity): void;
        Dispose(): void;
        SetChanged(): void;
        protected UpdateBounding(): void;
        protected UpdateGeometryBounding(): void;
        protected OnDisposing(): void;
        CheckIntersect(isectContext: ISectContext): U1.ISectInfo;
        protected OnCheckIntersect(isectContext: ISectContext, result?: U1.ISectInfo): U1.ISectInfo;
        protected OnCheckInsideLocal(local_planes: Plane[], checkCross: boolean): boolean;
        private static l_planes;
        private static inv_wm;
        CheckInside(wplanes: Plane[], checkCross: boolean): boolean;
        Invalidate(): void;
        InvalidateBounding(): void;
        InvalidateOrderedChildren(): void;
        protected static tmp_m0: Matrix4;
        protected static tmp_m1: Matrix4;
        protected static tmp_m2: Matrix4;
        protected static tmp_m3: Matrix4;
        protected static tmp_v30: Vector3;
        protected static tmp_v31: Vector3;
        protected static tmp_v32: Vector3;
        protected static tmp_v33: Vector3;
        protected static tmp_v34: Vector3;
        protected static tmp_bx0: BoundingBox;
        protected static tmp_bx1: BoundingBox;
        protected static tmp_bx2: BoundingBox;
        protected static tmp_r30: Ray3;
        protected static tmp_r31: Ray3;
        protected static tmp_sphere_1: BoundingSphere;
        Update(context: UpdateContext): void;
        protected OnUpdate(context: UpdateContext): void;
        Draw(context: DrawContext): void;
        protected OnDraw(context: DrawContext): void;
        protected OnClear(): void;
        protected InvalidateWorldTransform(): void;
        private static _wsphere;
        static NeedDrawing1(context: ScRenderContext, RenderingPriority: RenderingPriorityEnum, localSphere: BoundingSphere, transform: Matrix4): boolean;
        static NeedDrawing2(context: ScRenderContext, RenderingPriority: RenderingPriorityEnum, wsphere: BoundingSphere): boolean;
    }
    class ScGroup extends ScEntity {
    }
}
declare namespace U1.Views {
    class ScMeshBatch extends ScEntity {
        m_pointCount: number;
        protected m_items: {
            [index: number]: ScMeshBatchItem;
        };
        protected m_isInvalid: boolean;
        protected m_lastNum: number;
        get PointCount(): number;
        set PointCount(value: number);
        get Items(): {
            [index: number]: ScMeshBatchItem;
        };
        protected CreateItem(): ScMeshBatchItem;
        AddItem(): ScMeshBatchItem;
        RemoveItem(inst: ScMeshBatchItem): void;
    }
    class ScMeshBatchItem {
        protected m_transform: Matrix4;
        protected m_xformedGeom: MeshBufferGeometry;
        protected m_Geom: MeshBufferGeometry;
        protected m_color: Color;
        protected m_wbsphere: BoundingSphere;
        protected m_lbsphere: BoundingSphere;
        IsDirty: boolean;
        IsInsideView: boolean;
        Container: ScMeshBatch;
        UpdateVer: number;
        Number: number;
        Visible: boolean;
        get Geom(): MeshBufferGeometry;
        set Geom(value: MeshBufferGeometry);
        get XFormedGeom(): MeshBufferGeometry;
        get Color(): Color;
        set Color(value: Color);
        get Transform(): Matrix4;
        set Transform(value: Matrix4);
        RenderingPriority: RenderingPriorityEnum;
        NeedDrawing(context: ScRenderContext): boolean;
        Intersect(isectContext: ISectContext): ISectInfo;
        Contains(planes: Plane[], fCross: boolean): boolean;
        Remove(): void;
    }
}
declare namespace U1.Views {
    class ScText3 extends ScEntity {
        protected _width: number;
        protected _height: number;
        protected _isMultiLine: boolean;
        protected _orign: Vector3;
        protected _axisY: Vector3;
        protected _axisX: Vector3;
        protected _text: string;
        protected _fontSize: number;
        protected _fontStyle: Geoms.FontStyleEnum;
        protected _fontWeight: Geoms.FontWeightEnum;
        protected _textAlignment: Geoms.TextAlignmentEnum;
        protected _fontFamily: string;
        protected _geometryInvalid: boolean;
        protected _transformInvalid: boolean;
        protected _boundingInvalid: boolean;
        protected _transform: Matrix4;
        protected _color: Color;
        get Text(): string;
        set Text(value: string);
        get FontSize(): number;
        set FontSize(value: number);
        get FontStyle(): U1.Geoms.FontStyleEnum;
        set FontStyle(value: U1.Geoms.FontStyleEnum);
        get FontWeight(): U1.Geoms.FontWeightEnum;
        set FontWeight(value: U1.Geoms.FontWeightEnum);
        get TextAlignment(): U1.Geoms.TextAlignmentEnum;
        set TextAlignment(value: U1.Geoms.TextAlignmentEnum);
        get FontFamily(): string;
        set FontFamily(value: string);
        get Width(): number;
        set Width(value: number);
        get Height(): number;
        set Height(value: number);
        get IsMultiLine(): boolean;
        set IsMultiLine(value: boolean);
        get Orign(): Vector3;
        set Orign(value: Vector3);
        get AxisY(): Vector3;
        set AxisY(value: Vector3);
        get AxisX(): Vector3;
        set AxisX(value: Vector3);
        get Transform(): Matrix4;
        get Color(): Color;
        set Color(value: Color);
    }
}
declare namespace U1.Views {
    class ScEntityContainer extends ScEntity {
        private _scene;
        private _namedEntities;
        constructor(scene: Scene);
        get Scene(): Scene;
        Invalidate(): void;
        Pick(isectContext: ISectContext): PickResult;
        SelectRegion(lt: Vector2, rb: Vector2, allowCross?: boolean): ScEntity[];
        Clear(): void;
        AddEntity<T extends ScEntity>(ctor: {
            new (): T;
        }): T;
        GetNamedEntity<T extends ScEntity>(ctor: {
            new (): T;
        }, name: string): T;
        AddNamedEntity<T extends ScEntity>(ctor: {
            new (): T;
        }, name: string): T;
        GetOrAddNamedEntity<T extends ScEntity>(ctor: {
            new (): T;
        }, name: string): T;
        RemoveChild(entity: ScEntity): void;
    }
    class ScWorld extends ScEntityContainer {
        private m_grid;
        private m_showGrid;
        constructor(scene: Scene);
        get ShowGrid(): boolean;
        set ShowGrid(value: boolean);
        get Grid(): ScGrid;
        protected OnUpdate(context: UpdateContext): void;
        Clear(): void;
    }
    class ScOverlayWorld extends ScEntityContainer {
        constructor(scene: Scene);
    }
    class ScScreenWorld extends ScEntityContainer {
        constructor(scene: Scene);
    }
}
declare namespace U1.Views {
    class ScLight extends ScEntity {
        Light: Light;
        DropShadow: boolean;
    }
}
declare namespace U1.Views {
    class ScLineBatch extends ScEntity {
        m_pointCount: number;
        m_indexCount: number;
        protected m_items: {
            [index: number]: ScLineBatchItem;
        };
        protected m_isInvalid: boolean;
        protected m_lastNum: number;
        get PointCount(): number;
        set PointCount(value: number);
        get IndexCount(): number;
        set IndexCount(value: number);
        get Items(): {
            [index: number]: ScLineBatchItem;
        };
        protected CreateItem(): ScLineBatchItem;
        AddItem(): ScLineBatchItem;
        RemoveItem(inst: ScLineBatchItem): void;
    }
    class ScLineBatchItem {
        protected m_transform: Matrix4;
        protected m_xFormedPath: Vector3[];
        protected m_path: Vector3[];
        protected m_color: Color;
        protected m_pattern: number[];
        protected m_wbsphere: BoundingSphere;
        protected m_lbsphere: BoundingSphere;
        protected m_lbbx: BoundingBox;
        IsDirty: boolean;
        IsInsideView: boolean;
        Container: ScLineBatch;
        UpdateVer: number;
        Number: number;
        Visible: boolean;
        get LocalBBX(): BoundingBox;
        get Pattern(): number[];
        set Pattern(value: number[]);
        get Path(): Vector3[];
        set Path(value: Vector3[]);
        get XFormedPath(): Vector3[];
        get Color(): Color;
        set Color(value: Color);
        get Transform(): Matrix4;
        set Transform(value: Matrix4);
        protected ApplyPattern(): void;
        RenderingPriority: RenderingPriorityEnum;
        NeedDrawing(context: ScRenderContext): boolean;
        Intersect(isectContext: ISectContext): ISectInfo;
        Contains(planes: Plane[], fCross: boolean): boolean;
        Remove(): void;
    }
}
declare namespace U1.Views {
    class ScRenderContext {
        private m_WorldM;
        private m_ViewM;
        private m_ProjM;
        private m_ViewProjM;
        private m_InvViewM;
        private m_view;
        getWorldM(): Matrix4;
        setWorldM(value: Matrix4): void;
        getViewM(): Matrix4;
        setViewM(value: Matrix4): void;
        getProjM(): Matrix4;
        setProjM(value: Matrix4): void;
        getViewProjM(): Matrix4;
        setViewProjM(value: Matrix4): void;
        getInvViewM(): Matrix4;
        setInvViewM(value: Matrix4): void;
        ViewFrustum: BoundingFrustum;
        RenderOpacity: boolean;
        RenderOverlay: boolean;
        visibleObjectCount: number;
        getView(): ViewBase;
        setView(value: ViewBase): void;
        FastRender: boolean;
        WorldToScreenRation: number;
        WorldCamera: ScCamera;
        GetWVP(): Matrix4;
        RenderingMode: URenderingMode;
        EntityAlpha: number;
        IsEntitySelected: boolean;
        XRayAlpha: number;
        constructor(other?: ScRenderContext);
    }
}
declare namespace U1.Views {
    enum URenderingMode {
        Solid = 0,
        Wireframe = 1,
        RemoveHiddenLine = 2,
        XRay = 3,
        SolidWithOutline = 4,
        XRayWithOutline = 5
    }
}
declare namespace U1.LibTess {
    enum WindingRule {
        EvenOdd = 0,
        NonZero = 1,
        Positive = 2,
        Negative = 3,
        AbsGeqTwo = 4
    }
    enum ElementType {
        Polygons = 0,
        ConnectedPolygons = 1,
        BoundaryContours = 2
    }
    enum ContourOrientation {
        Original = 0,
        Clockwise = 1,
        CounterClockwise = 2
    }
    class PQHandle {
        static Invalid: number;
        _handle: number;
        constructor(handle?: number);
    }
    class Vec3 {
        static get Zero(): Vec3;
        constructor(X?: number, Y?: number, Z?: number);
        SetValues(x: number, y: number, z: number): void;
        CopyFrom(source: Vec3): void;
        get X(): number;
        set X(value: number);
        get Y(): number;
        set Y(value: number);
        get Z(): number;
        set Z(value: number);
        static Sub(lhs: Vec3, rhs: Vec3, result: Vec3): void;
        static Neg(v: Vec3): void;
        static Dot(u: Vec3, v: Vec3): number;
        static Normalize(v: Vec3): void;
        static LongAxis(v: Vec3): number;
        toString(): string;
    }
    class Vertex {
        _prev: Vertex;
        _next: Vertex;
        _anEdge: Edge;
        _coords: Vec3;
        _s: number;
        _t: number;
        _pqHandle: PQHandle;
        _n: number;
        _data: any;
    }
    class Face {
        _prev: Face;
        _next: Face;
        _anEdge: Edge;
        _trail: Face;
        _n: number;
        _marked: boolean;
        _inside: boolean;
        get VertsCount(): number;
    }
    class EdgePair {
        _e: Edge;
        _eSym: Edge;
        static Create(): EdgePair;
    }
    class Edge {
        _pair: EdgePair;
        _next: Edge;
        _Sym: Edge;
        _Onext: Edge;
        _Lnext: Edge;
        _Org: Vertex;
        _Lface: Face;
        _activeRegion: ActiveRegion;
        _winding: number;
        get _Rface(): Face;
        set _Rface(value: Face);
        get _Dst(): Vertex;
        set _Dst(value: Vertex);
        get _Oprev(): Edge;
        set _Oprev(value: Edge);
        get _Lprev(): Edge;
        set _Lprev(value: Edge);
        get _Dprev(): Edge;
        set _Dprev(value: Edge);
        get _Rprev(): Edge;
        set _Rprev(value: Edge);
        get _Dnext(): Edge;
        set _Dnext(value: Edge);
        get _Rnext(): Edge;
        set _Rnext(value: Edge);
        static EnsureFirst(e: Edge): Edge;
    }
    class MeshUtils {
        static Undef: number;
        static MakeEdge(eNext: Edge): Edge;
        static Splice(a: Edge, b: Edge): void;
        static MakeVertex(vNew: Vertex, eOrig: Edge, vNext: Vertex): void;
        static MakeFace(fNew: Face, eOrig: Edge, fNext: Face): void;
        static KillEdge(eDel: Edge): void;
        static KillVertex(vDel: Vertex, newOrg: Vertex): void;
        static KillFace(fDel: Face, newLFace: Face): void;
    }
    class ContourVertex {
        Position: Vec3;
        Data: any;
        toString(): any;
    }
    class Node<TValue> {
        _key: TValue;
        _prev: Node<TValue>;
        _next: Node<TValue>;
        get Key(): TValue;
        get Prev(): Node<TValue>;
        get Next(): Node<TValue>;
    }
    class Dict<TValue> {
        _leq: (lhs: TValue, rhs: TValue) => boolean;
        _head: Node<TValue>;
        constructor(leq: (lhs: TValue, rhs: TValue) => boolean);
        Insert(key: TValue): Node<TValue>;
        InsertBefore(node: Node<TValue>, key: TValue): Node<TValue>;
        Find(key: TValue): Node<TValue>;
        Min(): Node<TValue>;
        Remove(node: Node<TValue>): void;
    }
    class HandleElem<TValue> {
        _key: TValue;
        _node: number;
    }
    class PriorityHeap<TValue> {
        _leq: (lhs: TValue, rhs: TValue) => boolean;
        private _nodes;
        private _handles;
        private _size;
        private _max;
        private _freeList;
        private _initialized;
        get Empty(): boolean;
        constructor(initialSize: number, leq: (lhs: TValue, rhs: TValue) => boolean);
        private FloatDown;
        private FloatUp;
        Init(): void;
        Insert(value: TValue): PQHandle;
        ExtractMin(): TValue;
        Minimum(): TValue;
        Remove(handle: PQHandle): void;
    }
    class StackItem {
        p: number;
        r: number;
        constructor(ap: number, ar: number);
    }
    class PriorityQueue<TValue> {
        private _leq;
        private _heap;
        private _keys;
        private _order;
        private _size;
        private _max;
        private _initialized;
        get Empty(): boolean;
        constructor(initialSize: number, leq: (lhs: TValue, rhs: TValue) => boolean);
        static Swap(ab: {
            a: number;
            b: number;
        }): void;
        Init(): void;
        Insert(value: TValue): PQHandle;
        ExtractMin(): TValue;
        Minimum(): TValue;
        Remove(handle: PQHandle): void;
    }
    class Geom {
        static IsWindingInside(rule: WindingRule, n: number): boolean;
        static VertCCW(u: Vertex, v: Vertex, w: Vertex): boolean;
        static VertEq(lhs: Vertex, rhs: Vertex): boolean;
        static VertLeq(lhs: Vertex, rhs: Vertex): boolean;
        static EdgeEval(u: Vertex, v: Vertex, w: Vertex): number;
        static EdgeSign(u: Vertex, v: Vertex, w: Vertex): number;
        static TransLeq(lhs: Vertex, rhs: Vertex): boolean;
        static TransEval(u: Vertex, v: Vertex, w: Vertex): number;
        static TransSign(u: Vertex, v: Vertex, w: Vertex): number;
        static EdgeGoesLeft(e: Edge): boolean;
        static EdgeGoesRight(e: Edge): boolean;
        static VertL1dist(u: Vertex, v: Vertex): number;
        static AddWinding(eDst: Edge, eSrc: Edge): void;
        static Interpolate(a: number, x: number, b: number, y: number): number;
        static EdgeIntersect(o1: Vertex, d1: Vertex, o2: Vertex, d2: Vertex, v: Vertex): void;
    }
    class Mesh {
        _vHead: Vertex;
        _fHead: Face;
        _eHead: Edge;
        _eHeadSym: Edge;
        constructor();
        MakeEdge(): Edge;
        Splice(eOrg: Edge, eDst: Edge): void;
        Delete(eDel: Edge): void;
        AddEdgeVertex(eOrg: Edge): Edge;
        SplitEdge(eOrg: Edge): Edge;
        Connect(eOrg: Edge, eDst: Edge): Edge;
        ZapFace(fZap: Face): void;
        MergeConvexFaces(maxVertsPerFace: number): void;
        Check(): void;
    }
    class ActiveRegion {
        _eUp: Edge;
        _nodeUp: Node<ActiveRegion>;
        _windingNumber: number;
        _inside: boolean;
        _sentinel: boolean;
        _dirty: boolean;
        _fixUpperEdge: boolean;
    }
    class Tess {
        private _mesh;
        private _normal;
        private _sUnit;
        private _tUnit;
        private _bminX;
        private _bminY;
        private _bmaxX;
        private _bmaxY;
        private _windingRule;
        private _dict;
        private _pq;
        private _event;
        private _combineCallback;
        private _vertices;
        private _vertexCount;
        private _elements;
        private _elementCount;
        get Normal(): Vec3;
        set Normal(value: Vec3);
        SUnitX: number;
        SUnitY: number;
        SentinelCoord: number;
        get Vertices(): ContourVertex[];
        get VertexCount(): number;
        get Elements(): number[];
        get ElementCount(): number;
        constructor();
        private ComputeNormal;
        private CheckOrientation;
        private ProjectPolygon;
        private TessellateMonoRegion;
        private TessellateInterior;
        private DiscardExterior;
        private SetWindingNumber;
        private GetNeighbourFace;
        private OutputPolymesh;
        private OutputContours;
        private SignedArea;
        AddContour(vertices: ContourVertex[], forceOrientation?: ContourOrientation): void;
        Tessellate(windingRule: WindingRule, elementType: ElementType, polySize: number, combineCallback: (position: Vec3, data: any[], weights: number[]) => any): void;
        private RegionBelow;
        private RegionAbove;
        private EdgeLeq;
        private DeleteRegion;
        private FixUpperEdge;
        private TopLeftRegion;
        private TopRightRegion;
        private AddRegionBelow;
        private ComputeWinding;
        private FinishRegion;
        private FinishLeftRegions;
        private AddRightEdges;
        private SpliceMergeVertices;
        private VertexWeights;
        private GetIntersectData;
        private CheckForRightSplice;
        private CheckForLeftSplice;
        private CheckForIntersect;
        private WalkDirtyRegions;
        private ConnectRightVertex;
        private ConnectLeftDegenerate;
        private ConnectLeftVertex;
        private SweepEvent;
        private AddSentinel;
        private InitEdgeDict;
        private DoneEdgeDict;
        private RemoveDegenerateEdges;
        private InitPriorityQ;
        private DonePriorityQ;
        private RemoveDegenerateFaces;
        protected ComputeInterior(): void;
    }
}
declare namespace U1.Views {
    class ViewBase {
        private _board;
        private document;
        private documentPresenter;
        private _workingPlane;
        private _controlComponent;
        private _scene;
        private _needZoomFit;
        private _afterUpdated;
        private _activeToolChanged;
        private _viewMode;
        private _isMouseDragging;
        IsInvalid: boolean;
        constructor();
        private isCtrlDown;
        get Document(): UDocument;
        set Document(value: UDocument);
        get DocumentPresenter(): UDocumentPresenter;
        set DocumentPresenter(value: UDocumentPresenter);
        get Controls(): VcControlContainer;
        get Scene(): Scene;
        get Width(): number;
        get Height(): number;
        get Board(): HTMLElement;
        set Board(value: HTMLElement);
        get WorkingPlane(): Plane;
        set WorkingPlane(value: Plane);
        get ActiveControl(): VcControl;
        set ActiveControl(value: VcControl);
        RenderingMode: URenderingMode;
        ShowNavigater: boolean;
        CanPaning: boolean;
        private _timerToken;
        private _oldw;
        private _oldh;
        Activate(): void;
        DeActive(): void;
        Invalidate(): void;
        Update(): void;
        protected OnBeginUpdate(): void;
        protected OnEndUpdate(): void;
        ZomFitMinSize: number;
        ZoomFit(bbx?: BoundingBox): void;
        HomeView(box?: BoundingBox): void;
        ZoomView(focus: Vector2, delt: number, min?: number, max?: number): void;
        ScaleView(focus: Vector2, scale: number): void;
        PanPlane(plane: Plane, sp0: Vector2, sp1: Vector2): void;
        Pan(sp0: Vector2, sp1: Vector2): void;
        WorldToView(wp: Vector3): Vector3;
        WorldToScene2D(world: Vector3): Vector2;
        protected orbit_click: Vector2;
        PickOrbitPoint(view: Vector2): ISectInfo;
        UpdatePanPlane(): void;
        GetClippingCorners(p1: Vector2, p2: Vector2): Vector3[];
        GetRay(screen: Vector2, result?: Ray3): Ray3;
        private picking_ray;
        Pick(screen_pos: Vector2): PickResult;
        SelectRegion(lt: Vector2, rb: Vector2, allowCross?: boolean): UElementPresenter[];
        private _defaultTool;
        private _activeTool;
        get DefaultTool(): VcTool;
        set DefaultTool(value: VcTool);
        get ActiveTool(): VcTool;
        set ActiveTool(value: VcTool);
        private static tmp_v20;
        private static tmp_v21;
        private static tmp_v22;
        private static tmp_v23;
        private static tmp_v30;
        private static tmp_v31;
        private static tmp_v32;
        private static tmp_v33;
        get AfterUpdated(): Event1<ViewBase>;
        get ActiveToolChanged(): Event3<ViewBase, VcTool, VcTool>;
        protected _pan_pos: Vector2;
        protected _prev_scale: number;
        CurMv: Vector2;
        CurDn: Vector2;
        CurUp: Vector2;
        OldMv: Vector2;
        OldDn: Vector2;
        OldUp: Vector2;
        get Mode(): ViewModes;
        set Mode(value: ViewModes);
        protected AttachUIEventHandlers(board: HTMLElement): void;
        protected DetachUIEventHandlers(board: HTMLElement): void;
        protected _onTouchStart: (ev: TouchEvent) => void;
        protected _onTouchMove: (ev: TouchEvent) => boolean;
        protected _onTouchEnd: (ev: TouchEvent) => boolean;
        protected _onMouseEnter: (ev: MouseEvent) => void;
        protected _onMouseLeave: (ev: MouseEvent) => void;
        protected _onMouseMove: (ev: MouseEvent) => void;
        protected _onMouseUp: (ev: MouseEvent) => void;
        protected _onMouseDown: (ev: MouseEvent) => void;
        protected _onMouseWheel: (ev: WheelEvent) => void;
        protected _onDblClick: (ev: MouseEvent) => void;
        protected _isMouseDown: boolean;
        get IsMouseDown(): boolean;
        protected OnMouseEnter(ev: MouseEvent): void;
        protected OnMouseLeave(ev: MouseEvent): void;
        protected OnMouseMove(ev: MouseEvent): void;
        protected OnMouseUp(ev: MouseEvent): void;
        protected OnMouseDown(ev: MouseEvent): void;
        protected OnMouseWheel(ev: MouseWheelEvent): void;
        protected OnDblClick(ev: MouseEvent): void;
        private _touchDown;
        private _touchDist;
        private getTouchCenter;
        private getTouchDist;
        protected OnTouchStart(te: TouchEvent): void;
        protected OnTouchMove(ev: TouchEvent): boolean;
        protected OnTouchEnd(te: TouchEvent): boolean;
        protected OnSelectionChanged(sel: USelection): void;
        protected CreateScene(): Scene;
        protected OnDefaultMouseEnter(ev: MouseEvent): boolean;
        protected OnDefaultMouseLeave(ev: MouseEvent): boolean;
        protected OnDefaultMouseMove(ev: MouseEvent): boolean;
        protected OnDefaultMouseUp(ev: MouseEvent): boolean;
        protected OnDefaultMouseDown(ev: MouseEvent): boolean;
        protected OnDefaultMouseWheel(ev: MouseWheelEvent): boolean;
        protected OnDefaultPress(ev: TouchEvent): boolean;
        protected OnDefaultPanMove(ev: TouchEvent): boolean;
        PivotPoint: Vector3;
        private panplane;
        Orbit(delt: Vector2): void;
        RotateView(epos: Vector3, axis: Vector3, p: number): void;
        newControlInstance<T extends VcControl>(ctor: {
            new (): T;
        }): T;
        DrawSelectionBox(dn: Vector2, mv: Vector2, p: number, color: Color): void;
        HideSelectionBox(): void;
        ShowSelectionBox(): void;
        ViewToPlane(screen: Vector2 | Vector3, plane: Plane, result?: Vector3): Vector3;
        ScreenToWorkingPlane(screen: Vector2 | Vector3, result?: Vector3): Vector3;
    }
    enum ViewModes {
        None = 0,
        CaptureMouse = 1,
        Selecting = 2,
        Paning = 3,
        Zooming = 4,
        Orbitting = 5,
        Moving = 6,
        Rotating = 7,
        Scaling = 8
    }
}
declare namespace U1.Views {
    class VcTool {
        private _active;
        private _view;
        get View(): ViewBase;
        set View(value: ViewBase);
        get Document(): UDocument;
        OnAttach(view: ViewBase): void;
        OnDetach(view: ViewBase): void;
        OnMouseMove(ev: MouseEvent): boolean;
        OnMouseUp(ev: MouseEvent): boolean;
        OnMouseDown(ev: MouseEvent): boolean;
        OnMouseWheel(ev: MouseWheelEvent): boolean;
        OnMouseEnter(ev: MouseEvent): boolean;
        OnMouseLeave(ev: MouseEvent): boolean;
        OnPress(ev: HammerInput): boolean;
        OnPanMove(ev: HammerInput): boolean;
        OnPanStart(ev: HammerInput): boolean;
        OnPanEnd(ev: HammerInput): boolean;
        OnPinch(ev: HammerInput): boolean;
        OnTouchStart(ev: TouchEvent): boolean;
        OnTouchMove(ev: TouchEvent): boolean;
        OnTouchEnd(ev: TouchEvent): boolean;
        GetOptions(): UPropertyBase[];
    }
}
declare namespace U1.Views {
    class SelectionTool extends VcTool {
        static Modes: {
            None: number;
            Select: number;
            Drag: number;
            PrepareMove: number;
            Move: number;
        };
        CustomAddSelectionFunc: (elms: UElement[], clear: boolean) => boolean;
        CustomClearSelectionFunc: () => boolean;
        protected m_mode: number;
        protected get Mode(): number;
        protected set Mode(value: number);
        OnAttach(view: ViewBase): void;
        OnDetach(view: ViewBase): void;
        private ShowSelectionBox;
        private UpdateSelectionBox;
        private HideSelectionBox;
        OnMouseDown(ev: MouseEvent): boolean;
        private PrepareMove;
        private m_isRegionSelecting;
        OnMouseMove(e: MouseEvent): boolean;
        OnMouseUp(ev: MouseEvent): boolean;
        OnMouseWheel(ev: MouseWheelEvent): boolean;
        OnMouseLeave(e: MouseEvent): boolean;
        OnMouseEnter(e: MouseEvent): boolean;
    }
}
declare namespace U1.UIs {
    interface IBiBase {
        Pause(): any;
        Resume(): any;
        UnBind(): any;
        Update(): any;
    }
    abstract class BiBase<T extends HTMLElement> implements IBiBase {
        Source: INotifyPropertyChanged;
        Target: T;
        private old_display;
        private old_pointerEvents;
        protected isUpdating: boolean;
        IsPasued: any;
        IsEnable: boolean;
        IsVisible: boolean;
        IsEnabledSource: string;
        IsVisibleSource: string;
        get Old_display(): string;
        set Old_display(value: string);
        Pause(): this;
        Resume(): this;
        UnBind(): this;
        Update(): this;
        protected OnUpdate(): void;
        setSource(source: INotifyPropertyChanged): this;
        setTarget(target: T): this;
        setIsEnableSource(prop: string): this;
        setIsVisibleSource(prop: string): this;
        setIsEnable(isEnable: boolean): this;
        setIsVisible(isVisible: boolean): this;
        private CallOnPropertyChanged;
        protected OnPropertyChanged(sender: any, prop: string): void;
        static GetOrSetChild<T extends HTMLElement>(ctr: {
            new (): T;
        }, container: HTMLElement, tag: string): T;
    }
    class BiCollection implements IBiBase {
        Children: IBiBase[];
        Pause(): void;
        Resume(): void;
        UnBind(): void;
        Update(): void;
    }
}
declare namespace U1.UIs {
    class BiCommand<T extends HTMLElement> extends BiBase<T> {
        private _command;
        get Command(): UCommand;
        set Command(value: UCommand);
        Content: any;
        ContentSource: string;
        ContentRenderer: (container: T, content: any) => any;
        CommandSource: string;
        CommandArg: any;
        CommandArgGetter: (sender: this) => any;
        setTarget(target: T): this;
        setContentRenderer(renderer: (container: T, content: any) => any): this;
        setContentSource(content: string): this;
        setCommandSource(source: string): this;
        setCommand(command: UCommand): this;
        setCommandArgumentGetter(argFunc: (sender: this) => any): this;
        protected OnPropertyChanged(sender: any, prop: string): void;
        protected OnUpdate(): void;
        private UpdateCommand;
        private UpdateContent;
        UnBind(): this;
    }
    class BiButton extends BiCommand<HTMLButtonElement> {
    }
}
declare namespace U1.UIs {
    class BiCheckBox extends BiBase<HTMLInputElement> {
        IsChecked: boolean;
        ContentRenderer: (container: HTMLInputElement, isChecked: boolean) => any;
        IsCheckedSource: string;
        setTarget(target: HTMLInputElement): this;
        setContentRenderer(renderer: (container: HTMLInputElement) => any): this;
        setIsChecked(value: boolean): this;
        setIsCheckedSource(source: string): this;
        setIsVisible(isVisible: boolean): this;
        protected OnPropertyChanged(sender: any, prop: string): void;
        private OnTargetChanged;
        protected OnUpdate(): void;
        UnBind(): this;
        private UpdateIsChecked;
    }
}
declare namespace U1.UIs {
    class BiColorPicker extends BiBase<HTMLInputElement> {
        ColorSource: string;
        Color: Color;
        UseAlpha: boolean;
        ContentRenderer: (container: HTMLLabelElement, content: any) => any;
        setTarget(target: HTMLInputElement): this;
        setUserAlpha(useAlpha: boolean): this;
        setColorSource(content: string): this;
        private OnColorChange;
        protected OnPropertyChanged(sender: any, prop: string): void;
        protected OnUpdate(): void;
        private UpdateColor;
        UnBind(): this;
    }
}
declare namespace U1.UIs {
    class BiComboBox<T> extends BiBase<HTMLSelectElement> {
        private _oldSelectedItem;
        private _oldItms;
        private _itemsMap;
        private _isItemsUpdated;
        SelectedItem: T;
        Items: T[];
        ItemRenderer: (itemcontainer: HTMLSelectElement | HTMLOptionElement, item: T) => any;
        SelectedItemSource: string;
        ItemsSource: string;
        setTarget(target: HTMLSelectElement): this;
        setItemRenderer(renderer: (itemcontainer: HTMLSelectElement | HTMLOptionElement, item: T) => any): this;
        setSelectedItemSource(source: string): this;
        setItemsSource(source: string): this;
        setItems(items: T[]): this;
        protected OnPropertyChanged(sender: any, prop: string): void;
        private OnTargetChanged;
        protected OnUpdate(): void;
        UnBind(): this;
        private UpdateSelectedItem;
        private UpdateItems;
    }
}
declare namespace U1.UIs {
    class BiContent<T> extends BiBase<HTMLElement> {
        Content: T;
        ContentSource: string;
        ContentRenderer: (container: HTMLElement, content: T) => any;
        setContentRenderer(renderer: (container: HTMLElement, content: T) => any): this;
        setContentSource(content: string): this;
        protected OnPropertyChanged(sender: any, prop: string): void;
        protected OnUpdate(): void;
        private UpdateContent;
        UnBind(): this;
    }
}
declare namespace U1.UIs {
    class BiEnable extends BiBase<HTMLElement> {
    }
}
declare namespace U1.UIs {
    class BiItemsControl<T> extends BiBase<HTMLUListElement> {
        private item_edits;
        Items: T[];
        ItemRenderer: (itemcontainer: HTMLLIElement, item: T) => any;
        ItemsSource: string;
        ItemClickHandler: (item: T) => any;
        setTarget(target: HTMLUListElement): this;
        setItemRenderer(renderer: (itemcontainer: HTMLLIElement, item: T) => any): this;
        setItemsSource(source: string): this;
        setClickHandler(handler: (item: T) => any): this;
        protected OnPropertyChanged(sender: any, prop: string): void;
        private OnItemClick;
        protected OnUpdate(): void;
        UnBind(): this;
        private UpdateItems;
    }
}
declare namespace U1.UIs {
    class BiLabel extends BiBase<HTMLLabelElement> {
        Content: any;
        ContentSource: string;
        ContentRenderer: (container: HTMLLabelElement, content: any) => any;
        setTarget(target: HTMLLabelElement): this;
        setContentRenderer(renderer: (container: HTMLLabelElement, content: any) => any): this;
        setContentSource(content: string): this;
        protected OnPropertyChanged(sender: any, prop: string): void;
        protected OnUpdate(): void;
        private UpdateContent;
        UnBind(): this;
    }
}
declare namespace U1.UIs {
    class BiListBox<T> extends BiBase<HTMLUListElement> {
        private lielements;
        SelectedItem: T;
        Items: T[];
        ItemRenderer: (itemcontainer: HTMLLIElement, item: T, isSelected: boolean) => any;
        SelectedItemSource: string;
        ItemsSource: string;
        setTarget(target: HTMLUListElement): this;
        setItemRenderer(renderer: (itemcontainer: HTMLLIElement, item: T, isSelected: boolean) => any): this;
        setSelectedItemSource(source: string): this;
        setItemsSource(source: string): this;
        protected OnPropertyChanged(sender: any, prop: string): void;
        private OnItemClick;
        protected OnUpdate(): void;
        UnBind(): this;
        private UpdateSelectedItem;
        private UpdateItems;
    }
}
declare namespace U1.UIs {
    class BiNumber extends BiBase<HTMLInputElement> {
        ValueSource: string;
        Value: number;
        ChangeAfterEnter: boolean;
        setTarget(target: HTMLInputElement): this;
        setValueSource(content: string): this;
        setChangeAfterEnter(value: boolean): this;
        OnKeyUp(event: KeyboardEvent): void;
        private OnTextChange;
        protected OnPropertyChanged(sender: any, prop: string): void;
        protected OnUpdate(): void;
        private UpdateValue;
        UnBind(): this;
    }
}
declare namespace U1.UIs {
    class BiPropertyEdit extends BiBase<HTMLTableRowElement> {
        private input;
        private label;
        private text;
        get Property(): UPropertyBase;
        ContentRenderer: (container: HTMLTableRowElement) => any;
        setContentRenderer(renderer: (container: HTMLTableRowElement) => any): this;
        setSource(source: UPropertyBase): this;
        protected OnPropertyChanged(sender: any, prop: string): void;
        protected OnUpdate(): this;
        UnBind(): this;
        OnChange(event: Event): void;
        OnKeyUp(event: KeyboardEvent): void;
        private OnTextChange;
    }
    class BiPropertyEditSelection extends BiPropertyEdit {
        private selectElement;
        protected OnUpdate(): this;
    }
    class BiPropertyEditCategory extends BiPropertyEdit {
        private selectElement;
        protected OnUpdate(): this;
    }
}
declare namespace U1.UIs {
    class BiPropertyGrid extends BiBase<HTMLTableElement> {
        Items: UPropertyBase[];
        private PropertyEdits;
        private editCreater;
        ItemsSource: string;
        setItemsSource(source: string): this;
        setEditCreater(creater: (prop: UPropertyBase, tr: HTMLTableRowElement) => BiPropertyEdit): void;
        protected OnPropertyChanged(sender: any, prop: string): void;
        protected OnUpdate(): void;
        UnBind(): this;
        private UpdateItems;
        Pause(): this;
        Resume(): this;
    }
}
declare namespace U1.UIs {
    class BiTextArea extends BiBase<HTMLTextAreaElement> {
        TextSource: string;
        Text: string;
        AfterTextChangedFunc: (binder: BiTextArea, text: string) => any;
        setTarget(target: HTMLTextAreaElement): this;
        setTextSource(content: string): this;
        setAfterTextChangedFunc(func: (binder: BiTextArea, text: string) => any): this;
        private OnTargetChanged;
        protected OnPropertyChanged(sender: any, prop: string): void;
        protected OnUpdate(): void;
        private UpdateText;
        UnBind(): this;
    }
}
declare namespace U1.UIs {
    class BiTextBox extends BiBase<HTMLInputElement> {
        TextSource: string;
        Text: string;
        AfterTextChangedFunc: (binder: BiTextBox, text: string) => any;
        setTarget(target: HTMLInputElement): this;
        setTextSource(content: string): this;
        setText(value: string): this;
        setAfterTextChangedFunc(func: (binder: BiTextBox, text: string) => any): this;
        OnKeyUp(event: KeyboardEvent): void;
        private OnTextChange;
        protected OnPropertyChanged(sender: any, prop: string): void;
        protected OnUpdate(): void;
        private UpdateText;
        UnBind(): this;
    }
}
declare namespace U1.UIs {
    class BiVisibility extends BiBase<HTMLElement> {
    }
}
declare namespace U1.UIs {
    class DialogBase {
        protected _root: HTMLDivElement;
        protected _isInit: boolean;
        protected _isIniting: boolean;
        protected _isActive: boolean;
        protected binders: {
            [index: string]: IBiBase;
        };
        protected commands: {
            [index: string]: UCommand;
        };
        protected HtmlPage: string;
        AfterClosed: Event1<DialogBase>;
        Init(): void;
        protected InitBinders(): void;
        protected UnBinde(): void;
        protected UpdateBinders(): void;
        protected Accept(): void;
        ShowDialog(): void;
        protected OnClose(ev: JQueryEventObject): void;
        protected OnLoaded(): void;
    }
}
declare namespace U1.UIs {
    class PanelBase implements INotifyPropertyChanged {
        protected _root: HTMLDivElement;
        protected _isInit: boolean;
        protected _isIniting: boolean;
        protected _isActive: boolean;
        protected binders: {
            [index: string]: IBiBase;
        };
        protected HtmlPage: string;
        Init(): void;
        get Root(): HTMLDivElement;
        get IsActive(): boolean;
        set IsActive(value: boolean);
        protected InitBinders(): void;
        protected UpdateBinders(): void;
        PauseBinders(): void;
        ResumeBinders(): void;
        ClearBinders(): void;
        ClearChildren(parent: HTMLElement): void;
        private _propertyChanged;
        get PropertyChanged(): PropertyChangedEvent;
        protected OnPropertyChanged(prop: string): void;
        InvokePropertyChanged(prop: string): void;
    }
}
declare namespace U1.Views {
    class VcControlContainer {
        private _activeControl;
        private _orderedItems;
        private _view;
        constructor(view: ViewBase);
        get View(): ViewBase;
        get ActiveControl(): VcControl;
        set ActiveControl(value: VcControl);
        Controls: Array<VcControl>;
        get OrderedControls(): Array<VcControl>;
        AddControl<T extends VcControl>(ctor: {
            new (): T;
        }): T;
        RemoveControl(item: VcControl): void;
        private _controlAdded;
        private _controlRemoving;
        get ControlAdded(): Event2<VcControlContainer, VcControl>;
        get ControlRemoving(): Event2<VcControlContainer, VcControl>;
        InvokeControlAdded(entity: VcControl): void;
        InvokeControlRemoving(item: VcControl): void;
        Pick(isectContext: ISectContext): PickResult;
        Update(): void;
    }
}
declare namespace U1.Views {
    class UpdateContext extends ScRenderContext {
        IsScreenSpace: boolean;
        IsOveraySpace: boolean;
        Scene: Scene;
        WorldToScreen: (wpos: Vector3, result?: Vector3) => Vector3;
    }
    class DrawContext extends ScRenderContext {
        get ViewMatrix(): Matrix4;
        set ViewMatrix(value: Matrix4);
        get ProjMatrix(): Matrix4;
        set ProjMatrix(value: Matrix4);
        ViewProjMatrix: Matrix4;
        Scene: Scene;
        IsScreenSpace: boolean;
        IsOveraySpace: boolean;
        WorldToScreen: (wpos: Vector3, result?: Vector3) => Vector3;
    }
    class PickResult {
        ISect: ISectInfo;
        Node: ScEntity;
        Control: VcControl;
        private _presenter;
        get Presenter(): UElementPresenter;
        set Presenter(value: UElementPresenter);
    }
}
declare namespace U1.Views {
    class ScPolyLine extends ScEntity {
        protected _points: Vector3[];
        protected _triangles: Vector3[];
        protected _style: ScStyle;
        constructor();
        get Style(): ScStyle;
        set Style(value: ScStyle);
        get Points(): Vector3[];
        set Points(value: Vector3[]);
        get Triangles(): Vector3[];
        protected UpdateGeometryBounding(): void;
        SetChanged(): void;
        protected OnCheckIntersect(context: ISectContext, result?: ISectInfo): ISectInfo;
        private static tmp_st;
        static GetNearestPoint(ray: Ray3, points: U1.Vector3[], isClosed: boolean, min_dist: number, result_ptRay: Vector3, result_ptPath: Vector3): void;
        static Tesselate(points: U1.Vector3[]): Vector3[];
        static CheckPolygonInside(ray: Ray3, point: Vector3, points: U1.Vector3[]): boolean;
    }
}
declare namespace U1.Views {
    class ScPolygon extends ScPolyLine {
        constructor();
        protected OnCheckIntersect(context: ISectContext, result?: ISectInfo): U1.ISectInfo;
    }
}
declare namespace U1.Views {
    class ScEllipse extends ScPolygon {
        private static _ellipse_side;
        private _width;
        private _height;
        get Width(): number;
        set Width(value: number);
        get Height(): number;
        set Height(value: number);
        get Points(): Vector3[];
        Invalidate(): void;
    }
}
declare namespace U1.Views {
    class ScGrid extends ScEntity {
        static GridCount: number;
        private m_isInitialized;
        protected m_distanceUnit: UDistanceUnit;
        protected m_gridScale: number;
        private m_lineData;
        get Unit(): UDistanceUnit;
        set Unit(value: UDistanceUnit);
        get GridScale(): number;
        protected OnUpdate(context: UpdateContext): void;
        protected OnDraw(context: DrawContext): void;
        GetLineData(): LineGeometry;
        protected Initialize(): void;
    }
}
declare namespace U1.Views {
    class ScModel extends ScEntity {
        private _geometry;
        private _edgeGeometry;
        get Geometry(): MeshBufferGeometry;
        set Geometry(value: MeshBufferGeometry);
        get EdgeGeometry(): LineBufferGeometry;
        set EdgeGeometry(value: LineBufferGeometry);
        Material: ScMaterial;
        EdgeColor: Color;
        constructor();
        protected UpdateGeometryBounding(): void;
        protected OnCheckIntersect(isectContext: ISectContext, result?: U1.ISectInfo): U1.ISectInfo;
        protected OnCheckInsideLocal(lplanes: Plane[], checkCross: boolean): boolean;
    }
}
declare namespace U1.Views {
    class ScPoint extends ScEntity {
        private _position;
        private _radius;
        private _points;
        private _triangles;
        private _consDivID;
        get ConsDivID(): string;
        set ConsDivID(value: string);
        protected _style: ScStyle;
        protected _side: number;
        constructor();
        get Side(): number;
        set Side(value: number);
        get Style(): ScStyle;
        set Style(value: ScStyle);
        get Position(): Vector3;
        set Position(value: Vector3);
        get Radius(): number;
        set Radius(value: number);
        get Points(): Vector3[];
        get Triangles(): Vector3[];
        protected OnCheckIntersect(context: ISectContext, result?: ISectInfo): ISectInfo;
        Invalidate(): void;
        static GetNearestPoint(ray: Ray3, point: U1.Vector3, res?: Vector3): Vector3;
    }
}
declare namespace U1.Views {
    class ScStyle {
        private static s_id;
        protected _strokeStr: string;
        protected _fillStr: string;
        protected _stroke: Color;
        protected _strokeDash: number[];
        protected _fill: Color;
        protected _alpha: number;
        protected _strokeThickness: number;
        protected _ver: number;
        protected _id: number;
        get Id(): number;
        get Ver(): number;
        get Stroke(): Color;
        set Stroke(value: Color);
        get StrokeStr(): string;
        get Fill(): Color;
        set Fill(value: Color);
        get FillStr(): string;
        get Filled(): boolean;
        get Alpha(): number;
        set Alpha(value: number);
        get StrokeThickness(): number;
        set StrokeThickness(val: number);
        get StrokeDash(): number[];
        set StrokeDash(value: number[]);
        Invalidate(): void;
    }
    class ScTextStyle extends ScStyle {
        private _background;
        private _backgroundStr;
        get Background(): Color;
        set Background(value: Color);
        get BackgroundStr(): string;
    }
}
declare namespace U1.Views {
    class ScText extends ScEntity {
        private _text;
        private _fontSize;
        private _height;
        private _width;
        private _actualWidth;
        private _lines;
        private _max_line_index;
        private _style;
        private m_xFormedPath;
        private m_wbsphere;
        static MeasureTextureWidthFunc: (text: string, fontsize: number) => number;
        constructor();
        get Style(): ScTextStyle;
        set Style(value: ScTextStyle);
        get Text(): string;
        set Text(value: string);
        get Lines(): string[];
        get Width(): number;
        set Width(value: number);
        get Height(): number;
        set Height(value: number);
        get ActualWidth(): number;
        IsSingeLine: boolean;
        get FontSize(): number;
        set FontSize(value: number);
        SetChanged(): void;
        protected UpdateGeometryBounding(): void;
        Intersect(context: ISectContext): U1.ISectInfo;
        Contains(planes: Plane[], fCross: boolean): boolean;
    }
}
declare namespace U1.Views {
    class ScCamera {
        private position;
        private lookat;
        private up;
        private fov;
        private near;
        private far;
        private orthoheight;
        private projectionmode;
        private viewport;
        ver: number;
        private ViewProj;
        private vpVer;
        GetPosition(result?: Vector3): Vector3;
        get Position(): Vector3;
        set Position(value: Vector3);
        GetLookAt(result?: Vector3): Vector3;
        get LookAt(): Vector3;
        set LookAt(value: Vector3);
        GetUp(result?: Vector3): Vector3;
        get Up(): Vector3;
        set Up(value: Vector3);
        get FOV(): number;
        set FOV(value: number);
        get Near(): number;
        set Near(value: number);
        get Far(): number;
        set Far(value: number);
        get OrthoHeight(): number;
        set OrthoHeight(value: number);
        get ProjectionMode(): ProjectionTypeEnum;
        set ProjectionMode(value: ProjectionTypeEnum);
        get ViewportWidth(): number;
        set ViewportWidth(value: number);
        get ViewportHeight(): number;
        set ViewportHeight(value: number);
        get ViewportX(): number;
        set ViewportX(value: number);
        get ViewportY(): number;
        set ViewportY(value: number);
        constructor();
        GetFrustum(result?: BoundingFrustum): BoundingFrustum;
        GetRight(result?: Vector3): Vector3;
        GetDirection(result?: Vector3): Vector3;
        get Aspect(): number;
        GetViewMatrix(result?: Matrix4): Matrix4;
        GetProjMatrix(result?: Matrix4): Matrix4;
        static get Default(): ScCamera;
        CalPickingRay(x: number, y: number, result?: Ray3): Ray3;
        WorldToScreen(wp: Vector3, result?: Vector3): Vector3;
        ScreenToWorld(sp: Vector3, result?: Vector3): Vector3;
        GetRotation(targetCamera: ScCamera): {
            axis: Vector3;
            angle: number;
            roll: number;
        };
        static GetRotation(src: Matrix4, target: Matrix4): {
            axis: Vector3;
            angle: number;
            roll: number;
        };
        Roll(roll: number): void;
        Rotate(pos: Vector3, axis: Vector3, ang: number): void;
        ScreenToPlane(pt: Vector2 | Vector3, plane: Plane, result?: Vector3): Vector3;
        Move(offset: Vector3): void;
        Clone(): ScCamera;
        GetCamera(result?: U1.Camera): Camera;
        SetCamera(camera: U1.Camera): this;
    }
}
declare namespace U1.Views {
    class ScResource {
        private _name;
        private _isDisposed;
        private _container;
        get Container(): ScResourceContainer;
        get Name(): string;
        set Name(value: string);
        get Scene(): Scene;
        get IsDisposed(): boolean;
        Ver: number;
        UpdateVer: number;
        OnUpdate(context: UpdateContext): void;
        Dispose(): void;
        protected OnDisposing(): void;
    }
    class ScResourceContainer {
        private _scene;
        constructor(scene: Scene);
        get Scene(): Scene;
        Remove(res: ScResource): void;
    }
    class ScResourceContainerTyped<R extends ScResource> extends ScResourceContainer {
        Resources: {
            [index: string]: R;
        };
        GetOrAdd<T extends R>(c: {
            new (): T;
        }, name: string): T;
        Get<T extends R>(c: {
            new (): T;
        }, name: string): R;
        Add<T extends R>(c: {
            new (): T;
        }, name: string): T;
        Remove(entity: R): void;
        Clear(): void;
        Update(context: UpdateContext): void;
    }
}
declare namespace U1.Views {
    class ScMaterial extends ScResource {
        Diffuse: Color;
        Ambient: Color;
        Specular: Color;
        Emissive: Color;
        Shininess: number;
        DiffuseTexture: ScTexture;
        SpecularTexture: ScTexture;
        EmissiveTexture: ScTexture;
        BumpTexture: ScTexture;
        Alpha: number;
    }
    class ScMultiMaterial extends ScMaterial {
        Materials: ScMaterial[];
        constructor(materials?: ScMaterial[]);
    }
    class ScMaterialContainer extends ScResourceContainerTyped<ScMaterial> {
        constructor(scene: Scene);
    }
}
declare namespace U1.Views {
    class ScTexture extends ScResource {
        Uri: string;
    }
    class ScTextureContainer extends ScResourceContainerTyped<ScTexture> {
        constructor(scene: Scene);
    }
}
declare namespace U1.Views {
    class UElementPresenter {
        static SelectStrokeColor: Color;
        static SelectFillColor: Color;
        Order: number;
        protected _element: UElement;
        Invalid: boolean;
        protected _isDisposed: boolean;
        protected _isSelected: boolean;
        IsFreezed: boolean;
        LastVisible: boolean;
        Visible(): boolean;
        get Element(): UElement;
        set Element(value: UElement);
        get IsSelected(): boolean;
        set IsSelected(value: boolean);
        get ShowBoundingBox(): boolean;
        get CanMove(): boolean;
        protected OnSelected(): void;
        protected OnDeselected(): void;
        DocumentPresesnter: UDocumentPresenter;
        get View(): ViewBase;
        get Scene(): Scene;
        get IsDisposed(): boolean;
        Update(): void;
        protected OnUpdate(): void;
        Dispose(): void;
        OnClear(): void;
        OnElementPropertyChanged(sender: UElement, prop: string): void;
        CheckIntersect(isectContext: ISectContext): U1.ISectInfo;
        CheckContains(containContext: ContainContext): boolean;
    }
    class UElementPresenter3D extends UElementPresenter {
        protected _obb: OrientedBox3;
        protected _lbb: BoundingBox;
        protected _wsp: BoundingSphere;
        protected _obbInvalid: boolean;
        protected _lbbInvalid: boolean;
        protected _wspInvalid: boolean;
        protected _xform: Matrix4;
        get Transform(): Matrix4;
        set Transform(value: Matrix4);
        get LBB(): BoundingBox;
        get WSP(): BoundingSphere;
        get OBB(): OrientedBox3;
        AddTransform(matrix: Matrix4): void;
        UpdateBoundingBox(): void;
        Visible(): boolean;
        protected m_isTransforming: boolean;
        protected m_baseOBB: OrientedBox3;
        get CanMove(): boolean;
        get CanMovePivot(): boolean;
        get CanRotate(): boolean;
        get CanScale(): boolean;
        private BeginTransform;
        protected EndTransform(): void;
        OnStartMove(): void;
        OnMove(tc: UTranslateContext): void;
        OnEndMove(tc: UTranslateContext): void;
        OnCancelMove(): void;
        OnStartRotate(): void;
        OnRotate(rc: URotateContext): void;
        OnEndRotate(rc: URotateContext): void;
        OnCancelRotate(): void;
        OnStartScale(): void;
        OnScale(sc: UScaleContext): void;
        OnEndScale(sc: UScaleContext): void;
        OnCancelScale(): void;
        OnMouseMove(ev: MouseEvent): boolean;
        OnMouseUp(ev: MouseEvent): boolean;
        OnMouseDown(ev: MouseEvent): boolean;
        OnMouseWheel(ev: MouseWheelEvent): boolean;
        InvalidateBounding(): void;
        InvalidateWorldBounding(): void;
        OnElementPropertyChanged(sender: UElement, prop: string): void;
    }
    interface UScaleContext {
        SM: Matrix4;
        Base: Vector3;
        From: Vector3;
        To: Vector3;
    }
    interface UTranslateContext {
        TM: Matrix4;
        From: Vector3;
        To: Vector3;
        Offset: Vector3;
    }
    interface URotateContext {
        RM: Matrix4;
        Norm: Vector3;
        Angle: number;
        Base: Vector3;
        From: Vector3;
        To: Vector3;
    }
}
declare namespace U1.Views {
    class Scene {
        private _camera;
        private _view;
        Light1: U1.Light;
        Light2: U1.Light;
        Light3: U1.Light;
        constructor(view: ViewBase);
        get View(): ViewBase;
        get Camera(): ScCamera;
        World: ScWorld;
        Overlay: ScOverlayWorld;
        Screen: ScScreenWorld;
        QualityLevel: number;
        MinimumVolumnVisibleSize: number;
        Textures: ScTextureContainer;
        Materials: ScMaterialContainer;
        ClearColor: Color;
        Update(): void;
        Draw(): void;
        Clear(): void;
        protected CreateDrawContext(): DrawContext;
        protected CreateUpdateContext(): UpdateContext;
        protected OnBeginUpdate(): void;
        protected OnEndUpdate(): void;
        protected OnBeginDraw(context: DrawContext): void;
        protected OnEndDraw(context: DrawContext): void;
        MeasureTextureWidth(text: string, fontsize: number): number;
        newEntity<T extends ScEntity>(ctor: {
            new (): T;
        }): T;
        newResource<T extends ScResource>(ctor: {
            new (): T;
        }): T;
    }
}
declare namespace U1.Views {
    class DefaultTool extends VcTool {
        constructor();
        OnAttach(view: ViewBase): void;
        OnDetach(view: ViewBase): void;
        protected isPanning: boolean;
        OnMouseMove(ev: MouseEvent): boolean;
        OnMouseUp(ev: MouseEvent): boolean;
        OnMouseDown(ev: MouseEvent): boolean;
        OnMouseWheel(ev: MouseWheelEvent): boolean;
        OnPanMove(ev: HammerInput): boolean;
        OnPanStart(ev: HammerInput): boolean;
        OnPanEnd(ev: HammerInput): boolean;
        OnPinch(ev: HammerInput): boolean;
        OnTouchStart(ev: TouchEvent): boolean;
        OnTouchMove(ev: TouchEvent): boolean;
        OnTouchEnd(ev: TouchEvent): boolean;
        protected Finish(): void;
    }
}
declare namespace U1.Views {
    class USectionView extends ViewBase {
        protected _viewInfo: SectionViewInfo;
        protected _viewVersion: number;
        protected _viewportHeight: number;
        protected _viewportCent: Vector2;
        USectionView(): void;
        get ViewInfo(): SectionViewInfo;
        set ViewInfo(value: SectionViewInfo);
        HomeView(wbbx: BoundingBox): void;
        private old_z;
        protected OnBeginUpdate(): void;
        Orbit(delt: Vector2): void;
        RotateView(epos: Vector3, axis: Vector3, p: number): void;
        protected UpdateViewport2D(): void;
    }
}
declare namespace U1.Views {
    class Viewport {
        X: number;
        Y: number;
        Width: number;
        Height: number;
        MinDepth: number;
        MaxDepth: number;
        ConvertFromStr(value: string): void;
        ConvertToStr(): string;
        Equals(other: Viewport): boolean;
        constructor(x?: number, y?: number, w?: number, h?: number, min?: number, max?: number);
        Project(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4): Vector3;
        ProjectRef(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4, ref: Vector3): Vector3;
        ProjectM(source: Vector3, matrix: Matrix4, result?: Vector3): Vector3;
        Unproject(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4): Vector3;
        UnprojectRef(source: Vector3, projection: Matrix4, view: Matrix4, world: Matrix4, ref: Vector3): Vector3;
        get AspectRatio(): number;
        private static tmp_v30;
        private static tmp_v31;
        private static tmp_v32;
        private static tmp_v33;
        private static tmp_m0;
        private static tmp_m1;
        private static tmp_m2;
        private static tmp_m3;
        private static tmp_m4;
    }
}
declare namespace U1.Views {
    class SectionViewInfo {
        private _isPlaneInvalid;
        private _planes;
        private _position;
        private _direction;
        private _up;
        private _width;
        private _height;
        private _depth;
        private _version;
        get Position(): Vector3;
        set Position(value: Vector3);
        get Direction(): Vector3;
        set Direction(value: Vector3);
        get Up(): Vector3;
        set Up(value: Vector3);
        get Width(): number;
        set Width(value: number);
        get Height(): number;
        set Height(value: number);
        get Depth(): number;
        set Depth(value: number);
        get Planes(): Plane[];
        get NearPlane(): Plane;
        get FarPlane(): Plane;
        get LeftPlane(): Plane;
        get RightPlane(): Plane;
        get TopPlane(): Plane;
        get DownPlane(): Plane;
        get AXIS_Z(): Vector3;
        get AXIS_X(): Vector3;
        get AXIS_Y(): Vector3;
        get Matrix(): Matrix4;
        get Version(): number;
        Clone(): SectionViewInfo;
        private UpdatePlanes;
        Contains(sphere: BoundingSphere): ContainmentType;
    }
}
declare namespace U1 {
    enum UVariantTypes {
        Number = 0,
        Bool = 1,
        String = 2,
        Vector = 3,
        Matrix = 4
    }
    enum UOperationType {
        None = 0,
        Logical_Or = 1,
        Logical_And = 2,
        Equal = 3,
        NotEqual = 4,
        Less = 5,
        Great = 6,
        LessEqual = 7,
        GreatEqual = 8,
        Add = 9,
        Sub = 10,
        Multiply = 11,
        Divide = 12,
        Parenthesis = 13,
        Dot = 14,
        Index = 15
    }
    class UVariant {
        VariantType: UVariantTypes;
        private _value;
        get Value(): Object;
        set Value(val: Object);
        constructor();
        static get Zero(): UVariant;
        SetNumber(value: number): this;
        SetBool(value: boolean): this;
        SetString(value: string): this;
        SetVector(value: number[]): this;
        SetMatrix(value: number[][]): this;
        CopyFrom(src: UVariant): this;
        SetColor(color: Color): this;
        SetVector2(vector: Vector2): this;
        SetVector3(vector: Vector3): this;
        SetVector4(vector: Vector4): this;
        get ItemCount(): number;
        GetNumber(): number;
        GetBool(): boolean;
        GetString(): string;
        private GetNumberAt;
        toString(): string;
        GetNumbers(): number[];
        GetNumber2(): number[];
        GetNumber3(): number[];
        GetNumber4(): number[];
        GetMatrix(): number[][];
        GetVector2(): Vector2;
        GetVector3(): Vector3;
        GetVector4(): Vector4;
        GetColor(): Color;
        static ToString(expVar: UVariant): string;
        static FromString(variantString: string): UVariant;
        static Negate(value: UVariant): UVariant;
        static Add(value1: UVariant, value2: UVariant): UVariant;
        static Sub(value1: UVariant, value2: UVariant): UVariant;
        static Multiply(value1: UVariant, value2: UVariant): UVariant;
        static Divide(value1: UVariant, value2: UVariant): UVariant;
        private static VectorOperation;
        private static MatrixOperation;
        static Transform(expValue: UVariant, func: (a: number) => number): UVariant;
        static Transform2(expValue1: UVariant, expValue2: UVariant, func: (a: number, b: number) => number): UVariant;
        static ToColor(expVariant: UVariant): Color;
        static ToVector3(expVariant: UVariant): Vector3;
        static ToVector2(expVariant: UVariant): Vector2;
        static ToVector4(expVariant: UVariant): Vector4;
        Equals(other: UVariant): boolean;
    }
}
declare var default_font_data: any;
declare namespace U1.Graphics {
    enum FontStyleEnum {
        Normal = 0,
        Italic = 1,
        Oblique = 2
    }
    enum FontWeightEnum {
        Normal = 0,
        Black = 1,
        Bold = 2,
        DemiBold = 3,
        ExtraBlack = 4,
        ExtraBold = 5,
        ExtraLight = 6,
        Heavy = 7,
        Light = 8,
        Medium = 9,
        Regular = 10,
        SemiBold = 11,
        Thin = 12,
        UltraBlack = 13,
        UltraBold = 14,
        UltraLight = 15
    }
    class MeshChar {
        private _faces;
        Width: number;
        Height: number;
        Outlines: Array<Vector2[]>;
        get Faces(): Array<Vector2>;
        private Tessellate;
        private static tMin;
        private static tMax;
        Read(data: number[]): void;
    }
    class MeshFont {
        FontFamilyName: string;
        Chars: {
            [index: number]: MeshChar;
        };
        GetChar(c: number): MeshChar;
        GetMesh(text: string, fontSize: number, width: number, height: number, isMultiline: boolean): Vector2[];
        GetOutlines(text: string, fontSize: number, width: number, height: number, isMultiline: boolean): Array<Vector2[]>;
        Read(charsData: any): void;
        private static _default;
        static get Default(): MeshFont;
    }
}
declare namespace U1.Views {
    class VcXForm2 extends VcControl {
        private static _tmp_m0;
        private static _tmp_m1;
        private static _tmp_v30;
        private static _tmp_v31;
        private static _tmp_v32;
        private static _radius;
        private static _fillcolor;
        private m_selected_nodes;
        private m_curObb;
        private m_oldObb;
        private m_mode;
        private m_prev_loc;
        private m_cur_loc;
        private m_active_hp;
        private m_points;
        get CurOBB(): OrientedBox3;
        CheckIntersect(isectContext: ISectContext): U1.ISectInfo;
        private GetIntersectNode;
        Init(nodes: ScEntity[]): void;
        Update(): void;
        Clear(): void;
        OnMouseMove(ev: MouseEvent): boolean;
        OnMouseUp(ev: MouseEvent): boolean;
        OnMouseDown(ev: MouseEvent): boolean;
        OnMouseWheel(ev: MouseWheelEvent): boolean;
        OnPanMove(ev: HammerInput): boolean;
        OnPanStart(ev: HammerInput): boolean;
        OnPanEnd(ev: HammerInput): boolean;
        OnPinch(ev: HammerInput): boolean;
        Move(): boolean;
        PrepareTransform(): boolean;
        BeginTransform(): boolean;
        Translate(matrix: Matrix4): void;
        Scale(center: Vector3, p1: Vector3, p2: Vector3): void;
        EndTransform(): boolean;
        private ApplyMove;
        private ApplyRotate;
        private ApplyScale;
        CreateOBBScaleMatrix(obb: OrientedBox3, center: Vector3, from: Vector3, to: Vector3, result?: Matrix4): Matrix4;
    }
}
