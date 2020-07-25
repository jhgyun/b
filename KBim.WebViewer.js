var KBim;
(function (KBim) {
    class BaseVM {
        constructor() {
            this._commands = {};
            this.binders = {};
        }
        get PropertyChanged() {
            if (this._propertyChanged === undefined)
                this._propertyChanged = new U1.PropertyChangedEvent();
            return this._propertyChanged;
        }
        InvokdPropertyChanged(name) {
            if (this._propertyChanged != null)
                this._propertyChanged.Invoke(this, name);
        }
        InitBinders() {
        }
        UpdateBinders() {
            for (var key in this.binders) {
                this.binders[key].Update();
            }
        }
        PauseBinders() {
            for (var key in this.binders) {
                this.binders[key].Pause();
            }
        }
        ResumeBinders() {
            for (var key in this.binders) {
                this.binders[key].Resume();
            }
        }
        ClearBinders() {
            for (var key in this.binders) {
                this.binders[key].UnBind();
            }
            this.binders = {};
        }
    }
    KBim.BaseVM = BaseVM;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class BuildingView_ToolbarVM extends KBim.BaseVM {
        constructor() {
            super();
            this._clipboard = [];
            this._isShowGrid = true;
        }
        get KDocument() {
            var doc = this.BuildingView.Document;
            return doc;
        }
        get rootelement() {
            return document.getElementById('id_tool_bar');
        }
        get IsShowGrid() {
            return this.BuildingView.View3.Scene.World.ShowGrid;
        }
        set IsShowGrid(value) {
            if (value)
                this.BuildingView.View3.Scene.World.ShowGrid = true;
            else
                this.BuildingView.View3.Scene.World.ShowGrid = false;
            this.BuildingView.View3.Invalidate();
            if (value != this._isShowGrid) {
                if (value) {
                    $("#bi_toolbar_onoffgrid").css("background-color", "lightblue");
                }
                else {
                    $("#bi_toolbar_onoffgrid").css("background-color", "white");
                }
            }
            this._isShowGrid = value;
            this.InvokdPropertyChanged('IsShowGrid');
            $("#bi_toolbar_onoffgrid").focusout();
        }
        get IsPerspectiveView() {
            return this.BuildingView.View3.Scene.SceneMode == KBim.Views.SceneMode.Perspective3D;
        }
        set IsPerspectiveView(value) {
            if (value) {
                this.BuildingView.View3.Scene.SceneMode = KBim.Views.SceneMode.Perspective3D;
                $("#bi_toolbar_toggleProjection").attr("src", "./icons/PerspectiveView.png");
                this.BuildingView.View3.Invalidate();
            }
            else {
                this.BuildingView.View3.Scene.SceneMode = KBim.Views.SceneMode.Orthographic3D;
                $("#bi_toolbar_toggleProjection").attr("src", "./icons/OrthoView.png");
                this.BuildingView.View3.Invalidate();
            }
            $("#bi_toolbar_toggleProjection").focusout();
        }
        Init() {
            this.InitBinders();
            this.UpdateBinders();
            var doc = this.BuildingView.Document;
            doc.Selection.SelectionChanged.Add(this, this.OnSelectionChanged);
            this.BuildingView.Document.AfterChanged.Add(this, this.OnAfterChanged);
            this.InvokeProps();
        }
        InitBinders() {
            if (document.getElementById('bi_toolbar_undo') != null) {
                this.binders["bi_toolbar_undo"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdUndo")
                    .setTarget($("#bi_toolbar_undo").get(0))
                    .setIsVisibleSource('IsVisibleUndo');
            }
            if (document.getElementById('bi_toolbar_onoffgrid') != null) {
                this.binders["bi_toolbar_onoffgrid"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleGridOnOff")
                    .setTarget($("#bi_toolbar_onoffgrid").get(0));
            }
            if (document.getElementById('bi_toolbar_toggleProjection') != null) {
                this.binders["bi_toolbar_toggleProjection"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleProjectionMode")
                    .setTarget($("#bi_toolbar_toggleProjection").get(0));
            }
            if (document.getElementById('bi_toolbar_zoomfit') != null) {
                this.binders["bi_toolbar_zoomfit"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdZoomFit")
                    .setTarget($("#bi_toolbar_zoomfit").get(0));
            }
            if (document.getElementById('bi_toolbar_homeview') != null) {
                this.binders["bi_toolbar_homeview"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdHomeView")
                    .setTarget($("#bi_toolbar_homeview").get(0));
            }
            if (document.getElementById('bi_toolbar_toggleExtend') != null) {
                this.binders["bi_toolbar_toggleExtend"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleExtend")
                    .setTarget($("#bi_toolbar_toggleExtend").get(0));
            }
            let color = this.BuildingView.ViewBackground.toHexRGBString();
            document.getElementById('bi_color_picker')
                .value = color;
            $("#bi_color_picker")
                .on("change", (e_, args_) => {
                let input = e_.currentTarget;
                this.BuildingView.ViewBackground = U1.Color.fromHexString(input.value);
            });
        }
        OnAfterChanged(document) {
            this.UpdateBinders();
        }
        InvokeProps() {
            this.InvokdPropertyChanged('IsShowGrid');
            this.InvokdPropertyChanged('IsPerspectiveView');
            this.InvokdPropertyChanged('IsVisibleOnOffGrid');
            this.InvokdPropertyChanged('IsVisibleViewMode');
            this.UpdateBinders();
        }
        updateVisibleTypes() {
            let items = this.BuildingView.View3Context.getTypeVisibles();
            let view3content = this.BuildingView.View3Context;
            $("#bi_show_hide").dxDropDownButton({
                items: items,
                splitButton: true,
                dropDownOptions: {
                    width: 330,
                    maxHeight: 400
                },
                itemTemplate: (data_, num_, dxitem_) => {
                    let $div = $("<div>");
                    $div.dxCheckBox({
                        value: view3content.getTypeVisible(data_.ifcType),
                        width: 300,
                        text: data_.ifcType.substr(3),
                        onValueChanged: (opt_) => {
                            view3content.setTypeVisible(data_.ifcType, opt_.value);
                        }
                    });
                    return $div;
                },
                onButtonClick: function (e) {
                },
                onItemClick: function (e) {
                },
                icon: "icons/ShowHide.png",
                useSelectMode: false
            });
        }
        get CmdToggleGridOnOff() {
            if (this._cmdToggleGridOnOff === undefined) {
                this._cmdToggleGridOnOff = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.IsShowGrid = !this.IsShowGrid;
                    }
                });
            }
            return this._cmdToggleGridOnOff;
        }
        get CmdToggleProjectionMode() {
            if (this._cmdProjectionMode === undefined) {
                this._cmdProjectionMode = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.IsPerspectiveView = !this.IsPerspectiveView;
                    }
                });
            }
            return this._cmdProjectionMode;
        }
        get CmdToggleExtend() {
            if (this._cmdToggleExtend === undefined) {
                this._cmdToggleExtend = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.BuildingView.IsExtended = !this.BuildingView.IsExtended;
                    }
                });
            }
            return this._cmdToggleExtend;
        }
        get CmdZoomFit() {
            if (this._cmdZoomFit === undefined) {
                this._cmdZoomFit = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.BuildingView.View3.ZoomFit();
                    }
                });
            }
            return this._cmdZoomFit;
        }
        get CmdHomeView() {
            if (this._cmdHomeView === undefined) {
                this._cmdHomeView = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.BuildingView.View3.HomeView();
                        $("#bi_toolbar_homeview").focusout();
                    }
                });
            }
            return this._cmdHomeView;
        }
        OnSelectionChanged(sel) {
        }
    }
    KBim.BuildingView_ToolbarVM = BuildingView_ToolbarVM;
})(KBim || (KBim = {}));
var minX;
var minY;
var minZ;
var maxX;
var maxY;
var maxZ;
var KBim;
(function (KBim) {
    class ViewPageContext {
        constructor() {
            this._doc = new KBim.KDocument();
            this._models = new Map();
            this._mdlObj3s = new Map();
            this._mdlObj2s = new Map();
            this._mdlLine2s = new Map();
            this._hiddenNodes = [];
            ViewPageContext.instance = this;
        }
        get Models() {
            return this._models;
        }
        get ModelMesh3s() {
            return this._mdlObj3s;
        }
        get ModelMesh2s() {
            return this._mdlObj2s;
        }
        get ModelLine2s() {
            return this._mdlLine2s;
        }
        get Document() {
            return this._doc;
        }
        get View3() {
            var _a;
            return (_a = this._view3Context) === null || _a === void 0 ? void 0 : _a.View;
        }
        get View2() {
            var _a;
            return (_a = this._view2Context) === null || _a === void 0 ? void 0 : _a.View;
        }
        get View3Context() {
            return this._view3Context;
        }
        get View2Context() {
            return this._view2Context;
        }
        get IfcTypes() {
            var set = new Set();
            for (let mdl of this._models.values()) {
                for (let nd of mdl.node_map.values()) {
                    if (nd.ifcType != null)
                        set.add(nd.ifcType);
                }
            }
            return Array.from(set.values());
        }
        updateLoading3D(hidden, msg) {
            let loading = this.LoadingBar3;
            let loadingvalue = this.LoadingValue3;
            if (loading != null && loadingvalue != null) {
                loadingvalue.innerText = msg !== null && msg !== void 0 ? msg : "";
                loading.hidden = hidden;
                loadingvalue.hidden = hidden;
            }
        }
        updateLoading2D(hidden, msg) {
            let loading = this.LoadingBar2;
            let loadingvalue = this.LoadingValue2;
            if (loading != null && loadingvalue != null) {
                loadingvalue.innerText = msg;
                loading.hidden = hidden;
                loadingvalue.hidden = hidden;
            }
        }
        getNode(obj3d, view) {
            for (let mdl of this._models.values()) {
                if (!mdl.contains(obj3d, view))
                    continue;
                let node = mdl.getNode(obj3d);
                if (node != null)
                    return node;
            }
            return null;
        }
        loadModelScene3D(idx) {
            if (ModelNums.length <= idx) {
                this.updateLoading3D(true);
                this.loadModel(0);
                return;
            }
            var fnum = ModelNums[idx];
            var fileURL = "project?prj="
                + ProjNo
                + "&model=" + fnum
                + "&file=gltf";
            this.updateLoading3D(false, "0%");
            KBim.KmGLTFLoader.instance.load({
                url: fileURL,
                onLoad: (gltf) => {
                    this._mdlObj3s.set(fnum, gltf.scene);
                    let mdl = this._models.get(fnum);
                    if (mdl != null) {
                        mdl.model3Context.rootMesh = gltf.scene;
                    }
                    this.loadModelScene3D(idx + 1);
                    this.updateLoading3D(true);
                    this.updateMinMax();
                },
                onProgress: (xhr) => {
                    this.updateLoading3D(false, `${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
                },
                onError: (error) => {
                    console.error('An error happened', error);
                    this.updateLoading3D(true);
                }
            });
            return;
        }
        loadModel(idx) {
            if (ModelNums.length <= idx) {
                this.updateExplorer();
                KBim.KmMesh3Loader.instance.start();
                return;
            }
            var fnum = ModelNums[idx];
            $.ajax({
                url: `products?prj=${ProjNo}&fnum=${fnum}`
            })
                .done((data) => {
                let kmModel = new KBim.KmModel();
                kmModel.ReadJson(data);
                kmModel.viewPageContext = this;
                this._models.set(kmModel.fnum, kmModel);
                let obj3D = this._mdlObj3s.get(fnum);
                if (obj3D != null) {
                    kmModel.model3Context.rootMesh = obj3D;
                }
                this._doc.Append(kmModel);
                this.loadModel(idx + 1);
            })
                .always(() => {
            });
            ;
        }
        selectAndFocus(node) {
            if (node instanceof KBim.KmNode) {
                node.Document.Selection.Add(node, true);
                let min = node.Min.Clone();
                let max = node.Max.Clone();
                min.Subtract(new U1.Vector3(2, 2, 2));
                max.Add(new U1.Vector3(2, 2, 2));
                if (min != null && min != max) {
                    for (let kview of [this.View2, this.View3]) {
                        if (kview == null)
                            continue;
                        kview.PivotPoint = U1.Vector3.Add(min, max).Scale(0.5);
                        kview.ZoomFit(new U1.BoundingBox(min, max));
                    }
                }
            }
        }
        updateMinMax() {
            let min = null;
            let max = null;
            if (minX != null && minY != null && minZ != null) {
                min = new U1.Vector3(minX, minY, minZ);
                max = new U1.Vector3(maxX, maxY, maxZ);
            }
            else {
                for (let mdl of this.Models.values()) {
                    if (min == null)
                        min = mdl.geomMin;
                    else
                        min = U1.Vector3.Min(min, mdl.geomMin);
                    if (max == null)
                        max = mdl.geomMax;
                    else
                        max = U1.Vector3.Max(max, mdl.geomMax);
                }
            }
            for (let kview of [this.View2, this.View3]) {
                if (kview == null)
                    continue;
                kview.Min = min;
                kview.Max = max;
                kview.WorkingPlane = U1.Plane.FromPointNormal(kview.Min, U1.Vector3.UnitZ);
                kview.HomeView(new U1.BoundingBox(kview.Min, kview.Max));
            }
        }
        updateExplorer() {
        }
        isMobile() {
            var filter = "win16|win32|win64|mac|macintel";
            if (navigator.platform) {
                if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
                    return true;
                }
                return false;
            }
        }
    }
    KBim.ViewPageContext = ViewPageContext;
})(KBim || (KBim = {}));
var AppRoot;
var ProjNo;
var ModelNo;
var KBim;
(function (KBim) {
    class BuildingView extends KBim.ViewPageContext {
        constructor() {
            super(...arguments);
            this._hideBottomArea = true;
            this._splitterThick = 6;
            this._isExtended = false;
            this._bottomAreaHeight = 220;
            this._rightAreaWidth = 300;
            this._propAreaHeight = 200;
        }
        get IsExtended() {
            return this._isExtended;
        }
        set IsExtended(value) {
            this._isExtended = value;
            this.resize();
        }
        intialize() {
            this._toolbar = new KBim.BuildingView_ToolbarVM();
            this._toolbar.BuildingView = this;
            this._doc = new KBim.KDocument();
            this._doc.Selection.SelectionChanged.Add(this, this.SelectionChanged);
            window.onresize = (ev) => { this.resize(ev); };
            this._panelProp = document.getElementById("panelProp");
            this.LoadingBar3 = document.getElementById("3dLoading");
            this.LoadingValue3 = document.getElementById("3dLoading_value");
            this._mainArea = document.getElementById("MainArea");
            this._viewArea = document.getElementById("ViewArea");
            this._workArea = document.getElementById("WorkArea");
            this._rightArea = document.getElementById("RightArea");
            this._bottomArea = document.getElementById("BottomArea");
            this._panelExplorer = document.getElementById("panelExplorer");
            this._vSplitter = document.createElement("div");
            this._hSplitter = document.createElement("div");
            this._vSplitterProp = document.createElement("div");
            this._workArea.appendChild(this._vSplitter);
            this._mainArea.appendChild(this._hSplitter);
            this._rightArea.appendChild(this._vSplitterProp);
            this._hSplitter.style.position = "absolute";
            this._hSplitter.style.cursor = "w-resize";
            this._hSplitter.style.backgroundColor = "lightgray";
            this._hSplitter.style.width = `${this._splitterThick}px`;
            this._hSplitter.style.height = "100%";
            this._vSplitter.style.position = "absolute";
            this._vSplitter.style.cursor = "s-resize";
            this._vSplitter.style.backgroundColor = "lightgray";
            this._vSplitter.style.height = `${this._splitterThick}px`;
            this._vSplitter.style.width = "100%";
            this._vSplitterProp.style.position = "absolute";
            this._vSplitterProp.style.cursor = "s-resize";
            this._vSplitterProp.style.backgroundColor = "lightgray";
            this._vSplitterProp.style.height = `${this._splitterThick}px`;
            this._vSplitterProp.style.width = "100%";
            $(this._hSplitter).hover(q_ => { $(this._hSplitter).css("background-color", "lightblue"); }, q_ => { $(this._hSplitter).css("background-color", "lightgray"); });
            $(this._vSplitter).hover(q_ => { $(this._vSplitter).css("background-color", "lightblue"); }, q_ => { $(this._vSplitter).css("background-color", "lightgray"); });
            $(this._vSplitterProp).hover(q_ => { $(this._vSplitterProp).css("background-color", "lightblue"); }, q_ => { $(this._vSplitterProp).css("background-color", "lightgray"); });
            this._viewArea.style.position = "absolute";
            this._bottomArea.style.position = "absolute";
            this.InitViews();
            this.resize(null);
            this.initHSplitter();
            this.initVSplitter();
            this.initVSplitterProp();
            this._toolbar.Init();
            this.loadScene();
            this.loadElements();
            this.init3DContextMenu();
        }
        resize(ev) {
            var hideBottom = this._hideBottomArea;
            var ma = this._mainArea;
            var wa = this._workArea;
            var btmAraHeight = hideBottom ? 0 : this._bottomAreaHeight;
            var maW = ma.clientWidth;
            var maH = ma.clientHeight;
            var work_h = wa.clientHeight;
            var work_w = ma.clientWidth - this._rightAreaWidth - this._splitterThick;
            var prop_h = this._propAreaHeight;
            var x1 = work_w;
            var x2 = ma.clientWidth - this._rightAreaWidth;
            var y1 = work_h - btmAraHeight - this._splitterThick;
            var y2 = work_h - btmAraHeight;
            var y3 = maH - prop_h;
            if (this._isExtended) {
                this._workArea.style.width = `${maW}px`;
                this._viewArea.style.width = `${maW}px`;
                this._viewArea.style.height = `${maH}px`;
                this._view3Context.setSize(0, 0, maW, maH);
                this._bottomArea.hidden = true;
                this._rightArea.hidden = true;
                this._vSplitter.hidden = true;
                this._hSplitter.hidden = true;
            }
            else {
                this._bottomArea.hidden = hideBottom ? true : false;
                this._rightArea.hidden = false;
                this._vSplitter.hidden = hideBottom ? true : false;
                ;
                this._hSplitter.hidden = false;
                this._workArea.style.width = `${work_w}px`;
                this._viewArea.style.width = `${work_w}px`;
                this._rightArea.style.width = `${this._rightAreaWidth}px`;
                this._rightArea.style.left = `${x2}`;
                this._panelExplorer.style.height = `${y3}px`;
                this._panelProp.style.top = `${y3 + this._splitterThick}px`;
                this._panelProp.style.height = `${prop_h - this._splitterThick}px`;
                this._viewArea.style.top = "0px";
                this._viewArea.style.height = `${y1}px`;
                this._vSplitter.style.top = `${y1}px`;
                this._hSplitter.style.left = `${x1}px`;
                this._vSplitterProp.style.top = `${y3}px`;
                this._bottomArea.style.top = `${y2}px`;
                this._bottomArea.style.height = `${btmAraHeight}px`;
                this._view3Context.setSize(0, 0, work_w, work_h);
            }
        }
        initHSplitter() {
            let start_x = 0;
            let cur_x = 0;
            let start_w = this._rightAreaWidth;
            $(this._hSplitter).kendoDraggable({
                axis: "x",
                dragstart: (e_) => {
                    start_x = cur_x = e_.clientX;
                    start_w = this._rightAreaWidth;
                },
                drag: (e_) => {
                    cur_x = e_.clientX;
                    this._rightAreaWidth = start_w - (cur_x - start_x);
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._rightAreaWidth = start_w - (cur_x - start_x);
                    this.resize(null);
                }
            });
        }
        initVSplitter() {
            let start_y = 0;
            let cur_y = 0;
            let start_h = this._bottomAreaHeight;
            $(this._vSplitter).kendoDraggable({
                axis: "y",
                dragstart: (e_) => {
                    start_y = e_.clientY;
                    cur_y = start_y;
                    start_h = this._bottomAreaHeight;
                },
                drag: (e_) => {
                    cur_y = e_.clientY;
                    this._bottomAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._bottomAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                }
            });
        }
        initVSplitterProp() {
            let start_y = 0;
            let cur_y = 0;
            let start_h = this._propAreaHeight;
            $(this._vSplitterProp).kendoDraggable({
                axis: "y",
                dragstart: (e_) => {
                    start_y = e_.clientY;
                    cur_y = start_y;
                    start_h = this._propAreaHeight;
                },
                drag: (e_) => {
                    cur_y = e_.clientY;
                    this._propAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._propAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                }
            });
        }
        init3DContextMenu() {
            var miHideSel = {
                text: "Hide selected object"
            };
            var miUnhideAll = {
                text: "Unhide all"
            };
            var miToggleSpace = {
                text: "Space show/hide"
            };
            var menuitems = [
                miHideSel, miUnhideAll, miToggleSpace
            ];
            $(() => {
                $("#context-menu").dxContextMenu({
                    items: menuitems,
                    width: 200,
                    target: "#ViewArea",
                    onShowing: (e_) => {
                        let canHide = this._doc.Selection.Count;
                        let canUnhide = this._hiddenNodes.length > 0;
                        e_.component.option("items[0].disabled", !canHide);
                        e_.component.option("items[1].disabled", !canUnhide);
                        if (this.View3.Mode == U1.Views.ViewModes.Orbitting) {
                            e_.cancel = true;
                        }
                    },
                    onItemClick: (e_) => {
                        var _a;
                        if (e_.itemData == miHideSel) {
                            for (let elm of this._doc.Selection.SelectedElements) {
                                if (elm instanceof KBim.KmNode) {
                                    this._doc.Selection.Clear();
                                    this._hiddenNodes.push(elm);
                                    elm.SetHidden3(true);
                                }
                            }
                        }
                        else if (e_.itemData == miUnhideAll) {
                            for (let node of this._hiddenNodes) {
                                node.SetHidden3(false, "all", true);
                            }
                            this._hiddenNodes.length = 0;
                        }
                        else if (e_.itemData == miToggleSpace) {
                            for (let mdl of this._models.values()) {
                                mdl.space3Visible = !mdl.space3Visible;
                            }
                            (_a = this.View3) === null || _a === void 0 ? void 0 : _a.Invalidate();
                        }
                    }
                });
            });
        }
        initTreeviewContextMenu(treeList) {
            return;
            var miHideSel = {
                id: 0,
                text: "Hide All"
            };
            var miUnhide = {
                id: 1,
                text: "Show All"
            };
            var menuitems = [
                miHideSel, miUnhide
            ];
            var contextMenu = $('#treeviewContextMenu').dxContextMenu({
                items: menuitems,
                target: '#treeviewExplorer .dx-row',
                onItemClick: (e_) => {
                    let selNode = treeList.getSelectedRowsData()[0];
                    if (selNode instanceof KBim.KmNode) {
                        this._doc.Selection.Clear();
                        this._hiddenNodes.push(selNode);
                        if (e_.itemData.id == 0)
                            selNode.SetHidden3(true, "all", true);
                        else if (e_.itemData.id == 1)
                            selNode.SetHidden3(false, "all", true);
                        this.View3.Invalidate();
                    }
                }
            }).dxContextMenu('instance');
        }
        loadScene() {
            var fileURL = "project?prj="
                + ProjNo
                + "&model=" + ModelNo
                + "&file=gltf";
            this.updateLoading3D(false, "0%");
            KBim.KmGLTFLoader.instance.load({
                url: fileURL,
                onLoad: (gltf) => {
                    this.ModelMesh3s.set(ModelNo, gltf.scene);
                    let mdl = this._models.get(ModelNo);
                    if (mdl != null) {
                        mdl.model3Context.rootMesh = gltf.scene;
                    }
                    this.updateLoading3D(true);
                },
                onProgress: (xhr) => {
                    this.updateLoading3D(false, `${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
                },
                onError: (error) => {
                    console.error('An error happened', error);
                    this.updateLoading3D(true);
                }
            });
            return;
        }
        loadElements() {
            var fnum = ModelNo;
            $.ajax({
                url: `products?prj=${ProjNo}&fnum=${fnum}`
            })
                .done((data) => {
                let kmModel = new KBim.KmModel();
                kmModel.ReadJson(data);
                kmModel.viewPageContext = this;
                this._models.set("" + kmModel.fnum, kmModel);
                let obj3D = this.ModelMesh3s.get(fnum);
                if (obj3D != null) {
                    kmModel.model3Context.rootMesh = obj3D;
                }
                this._doc.Append(kmModel);
                this.updateMinMax();
                this.updateExplorer();
                this._toolbar.updateVisibleTypes();
            })
                .always(() => {
            });
            ;
        }
        loadPSets(node) {
            var fnum = node.Model.fnum;
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + fnum
                + "&eid=" + node.ifcId
                + "&file=" + "pset";
            $.ajax({
                url: fileURL
            })
                .done((data) => {
                var psets = KBim.KmPSet.ReadFromJson(data);
                var props = KBim.KmPSet.GetAllPropItems(psets);
                $("#gridProp").dxDataGrid({
                    dataSource: props,
                    columns: [
                        {
                            dataField: "psetName",
                            groupIndex: 0,
                            caption: ":"
                        },
                        {
                            dataField: "name",
                            width: 120
                        },
                        {
                            dataField: "value",
                            width: 80,
                        },
                        {
                            dataField: "unit",
                            width: 60
                        }
                    ],
                    showBorders: true,
                    showRowLines: true,
                    showColumnLines: true,
                    rowAlternationEnabled: true,
                    grouping: {
                        autoExpandAll: false
                    },
                    searchPanel: {
                        visible: true,
                        searchVisibleColumnsOnly: true
                    },
                    selection: {
                        mode: "single"
                    }
                });
            })
                .always(() => {
            });
            ;
        }
        InitViews() {
            let vcontext = this._view3Context = new KBim.ViewContext(this, true);
            vcontext.canvas3 = document.getElementById("view3DCanvas");
            vcontext.svg3dcanvas = document.getElementById("view3DSvgOverlay");
            vcontext.textSvg = document.getElementById("view3DTextSvg");
            vcontext.view3DTextCanvas = document.getElementById("view3DTextCanvas");
            vcontext.board3 = document.getElementById("ViewArea");
            vcontext.Init();
            this.View3.Scene.World.ShowGrid = false;
            this._toolbar.IsShowGrid = false;
            this.View3.Scene.ClearColor = this.ViewBackground;
            this.View3.ShowNavicator = true;
            this.View3.CanPaning = true;
            this.View3.Scene.SceneMode = KBim.Views.SceneMode.Perspective3D;
            this.View3.DefaultTool = new KBim.Views.Selection3DTool();
            this.View3.ActiveTool = null;
            var cam3d = this.View3.Scene.Camera;
            cam3d.Position = new U1.Vector3(0, 0, 10);
            cam3d.LookAt = new U1.Vector3(0, 0, 0);
            cam3d.Up = new U1.Vector3(0, 1, 1).Normalize();
        }
        get ViewBackground() {
            if (this._viewbackground == null) {
                let strClr = U1.Cookie.getCookie("background");
                if (String.IsNullOrEmpty(strClr))
                    strClr = "#a9a9a9";
                this._viewbackground = U1.Color.fromHexString(strClr);
            }
            return this._viewbackground;
        }
        set ViewBackground(value) {
            this._viewbackground = value;
            this.View3.Scene.ClearColor = this._viewbackground;
            U1.Cookie.setCookie("background", this._viewbackground.toHexString());
            this.View3.Invalidate();
        }
        SelectionChanged(selection) {
            this.updateSelection(this.oldselection, false);
            this.oldselection = selection === null || selection === void 0 ? void 0 : selection.SelectedElements.map((o_, i_) => o_);
            this.updateSelection(this.oldselection, true);
        }
        ResultSelectionChanged(results) {
            if (this._ccvControl == null) {
                this._ccvControl = this.View3.Controls.AddControl(KBim.Views.CcvControl);
            }
            var selEntities = [];
            results.map((o_, i_) => {
                var _a;
                let res = o_;
                let ent = (_a = res === null || res === void 0 ? void 0 : res.selector) === null || _a === void 0 ? void 0 : _a.Entity;
                selEntities.push(ent);
            });
            this._ccvControl.SelectedAreas = selEntities;
        }
        updateSelection(elements, isSelected) {
            var _a;
            if (elements == null)
                return;
            (_a = this._ccvControl) === null || _a === void 0 ? void 0 : _a.SetSelectedAreas(null);
            for (var elm of elements) {
                if (elm instanceof KBim.KmNode) {
                    elm.SetIsSelected(isSelected);
                }
            }
            if (isSelected && elements.length == 1 && elements[0] instanceof KBim.KmNode) {
                this.loadPSets(elements[0]);
            }
        }
        updateExplorer() {
            let nodes = this._doc.Elements
                .filter(elm_ => elm_ instanceof KBim.KmSite ||
                elm_ instanceof KBim.KmBuilding ||
                elm_ instanceof KBim.KmStorey);
            let mdl = this._doc.Elements
                .filter(o_ => o_ instanceof KBim.KmModel)[0];
            let items = this.View3Context.getTypeVisibles();
            let view3content = this.View3Context;
            let treelist = $("#treeviewExplorer").dxTreeList({
                dataSource: nodes,
                keyExpr: "KEY_ID",
                parentIdExpr: "KEY_PID",
                showRowLines: true,
                showBorders: true,
                showColumnHeaders: true,
                rootValue: mdl.ID,
                selection: {
                    mode: "single"
                },
                searchPanel: {
                    visible: true,
                    searchVisibleColumnsOnly: true,
                },
                columns: [
                    {
                        caption: "Name",
                        cellTemplate: (element_, info_) => {
                            var _a;
                            let data_ = info_.data;
                            if (data_ instanceof KBim.KmStorey ||
                                data_ instanceof KBim.KmBuilding) {
                                let $div = $("<div>");
                                let $ck = $("<div>").css("position", "relative");
                                let ckbox = $ck.dxCheckBox({
                                    value: !data_.node3Context.getIsHidden(),
                                    onValueChanged: (opt_) => {
                                        var _a;
                                        data_.node3Context.setIsHidden(!((_a = opt_.value) !== null && _a !== void 0 ? _a : true));
                                    }
                                }).dxCheckBox("instance");
                                let cls = new ckBinding();
                                cls.ckbox = ckbox;
                                const $item = $("<div>").text(data_.LABEL)
                                    .css("display", "inline-block")
                                    .css("margin-left", "4px");
                                (_a = data_.node3Context) === null || _a === void 0 ? void 0 : _a.PropertyChanged.Add(cls, cls.propertyChanged);
                                $div.append($ck);
                                $div.append($item);
                                element_.append($div);
                            }
                            else {
                                const $item = $("<div>").text(data_.LABEL);
                                element_.append($item);
                            }
                        }
                    },
                    {
                        caption: "",
                        width: "50px",
                        cellTemplate: (element_, info_) => {
                            if (info_.data instanceof KBim.KmStorey) {
                                let story = info_.data;
                                element_.append(`<a href="StoreyView?prj=${ProjNo}&mdl=${story.Model.fnum}&stry=${story.ifcId}" target="_blank">` +
                                    `<img style="cursor:pointer" src = "./Icons/webgl.png" height = "30" width = "30"/>` +
                                    `</a>`);
                            }
                        }
                    },
                    {
                        caption: "",
                        width: "50px",
                        cellTemplate: (element_, info_) => {
                            if (info_.data instanceof KBim.KmStorey) {
                                let story = info_.data;
                                element_.append(`<a href="StoreyAR?prj=${ProjNo}&mdl=${info_.data.fnum}&stry=${story.ifcId}" target="_blank">` +
                                    `<img style="cursor:pointer" src = "./Icons/ar.png" height = "30" width = "30"/>` +
                                    `</a>`);
                            }
                        }
                    },
                    {
                        caption: "",
                        width: "50px",
                        cellTemplate: (element_, info_) => {
                            if (info_.data instanceof KBim.KmStorey) {
                                let story = info_.data;
                                element_.append(`<a href="StoreyVR?prj=${ProjNo}&mdl=${info_.data.fnum}&stry=${story.ifcId}" target="_blank">` +
                                    `<img style="cursor:pointer" src = "./Icons/vr.png" height = "30" width = "30"/>` +
                                    `</a>`);
                            }
                        }
                    },
                ],
                columnAutoWidth: true,
                autoExpandAll: true,
                onRowClick: (e_) => {
                    if (e_.data instanceof KBim.KmNode) {
                        e_.data.Document.Selection.Add(e_.data, true);
                    }
                },
                onCellDblClick: (e_) => {
                    if (e_.data instanceof KBim.KmNode) {
                        this.selectAndFocus(e_.data);
                    }
                },
                onDataErrorOccurred: (e_) => {
                    console.log(e_.error);
                },
                onInitialized: (e_) => {
                }
            })
                .dxTreeList("instance");
            this.initTreeviewContextMenu(treelist);
        }
    }
    KBim.BuildingView = BuildingView;
    class ckBinding {
        propertyChanged(obj_, prop_) {
            if (prop_ != "IsHidden")
                return;
            if (obj_ instanceof KBim.KmNode_ViewContext)
                this.ckbox.option("value", !obj_.getIsHidden());
        }
    }
    KBim.ckBinding = ckBinding;
    ;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class SiteView_ToolbarVM extends KBim.BaseVM {
        constructor() {
            super();
            this._clipboard = [];
            this._isShowGrid = true;
        }
        get KDocument() {
            var doc = this.SiteView.Document;
            return doc;
        }
        get rootelement() {
            return document.getElementById('id_tool_bar');
        }
        get IsShowGrid() {
            return this.SiteView.View3.Scene.World.ShowGrid;
        }
        set IsShowGrid(value) {
            if (value)
                this.SiteView.View3.Scene.World.ShowGrid = true;
            else
                this.SiteView.View3.Scene.World.ShowGrid = false;
            this.SiteView.View3.Invalidate();
            if (value != this._isShowGrid) {
                if (value) {
                    $("#bi_toolbar_onoffgrid").css("background-color", "lightblue");
                }
                else {
                    $("#bi_toolbar_onoffgrid").css("background-color", "white");
                }
            }
            this._isShowGrid = value;
            this.InvokdPropertyChanged('IsShowGrid');
            $("#bi_toolbar_onoffgrid").focusout();
        }
        get IsPerspectiveView() {
            return this.SiteView.View3.Scene.SceneMode == KBim.Views.SceneMode.Perspective3D;
        }
        set IsPerspectiveView(value) {
            if (value) {
                this.SiteView.View3.Scene.SceneMode = KBim.Views.SceneMode.Perspective3D;
                $("#bi_toolbar_toggleProjection").attr("src", "./icons/PerspectiveView.png");
                this.SiteView.View3.Invalidate();
            }
            else {
                this.SiteView.View3.Scene.SceneMode = KBim.Views.SceneMode.Orthographic3D;
                $("#bi_toolbar_toggleProjection").attr("src", "./icons/OrthoView.png");
                this.SiteView.View3.Invalidate();
            }
            $("#bi_toolbar_toggleProjection").focusout();
        }
        Init() {
            this.InitBinders();
            this.UpdateBinders();
            var doc = this.SiteView.Document;
            doc.Selection.SelectionChanged.Add(this, this.OnSelectionChanged);
            this.SiteView.Document.AfterChanged.Add(this, this.OnAfterChanged);
            this.InvokeProps();
        }
        InitBinders() {
            if (document.getElementById('bi_toolbar_undo') != null) {
                this.binders["bi_toolbar_undo"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdUndo")
                    .setTarget($("#bi_toolbar_undo").get(0))
                    .setIsVisibleSource('IsVisibleUndo');
            }
            if (document.getElementById('bi_toolbar_onoffgrid') != null) {
                this.binders["bi_toolbar_onoffgrid"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleGridOnOff")
                    .setTarget($("#bi_toolbar_onoffgrid").get(0));
            }
            if (document.getElementById('bi_toolbar_toggleProjection') != null) {
                this.binders["bi_toolbar_toggleProjection"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleProjectionMode")
                    .setTarget($("#bi_toolbar_toggleProjection").get(0));
            }
            if (document.getElementById('bi_toolbar_zoomfit') != null) {
                this.binders["bi_toolbar_zoomfit"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdZoomFit")
                    .setTarget($("#bi_toolbar_zoomfit").get(0));
            }
            if (document.getElementById('bi_toolbar_homeview') != null) {
                this.binders["bi_toolbar_homeview"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdHomeView")
                    .setTarget($("#bi_toolbar_homeview").get(0));
            }
            if (document.getElementById('bi_toolbar_toggleExtend') != null) {
                this.binders["bi_toolbar_toggleExtend"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleExtend")
                    .setTarget($("#bi_toolbar_toggleExtend").get(0));
            }
            let color = this.SiteView.ViewBackground.toHexRGBString();
            document.getElementById('bi_color_picker')
                .value = color;
            $("#bi_color_picker")
                .on("change", (e_, args_) => {
                let input = e_.currentTarget;
                this.SiteView.ViewBackground = U1.Color.fromHexString(input.value);
            });
        }
        OnAfterChanged(document) {
            this.UpdateBinders();
        }
        InvokeProps() {
            this.InvokdPropertyChanged('IsShowGrid');
            this.InvokdPropertyChanged('IsPerspectiveView');
            this.InvokdPropertyChanged('IsVisibleOnOffGrid');
            this.InvokdPropertyChanged('IsVisibleViewMode');
            this.UpdateBinders();
        }
        updateVisibleTypes() {
            let items = this.SiteView.View3Context.getTypeVisibles();
            let view3content = this.SiteView.View3Context;
            $("#bi_show_hide").dxDropDownButton({
                items: items,
                splitButton: true,
                dropDownOptions: {
                    width: 330,
                    maxHeight: 400
                },
                itemTemplate: (data_, num_, dxitem_) => {
                    let $div = $("<div>");
                    $div.dxCheckBox({
                        value: view3content.getTypeVisible(data_.ifcType),
                        width: 300,
                        text: data_.ifcType.substr(3),
                        onValueChanged: (opt_) => {
                            view3content.setTypeVisible(data_.ifcType, opt_.value);
                        }
                    });
                    return $div;
                },
                onButtonClick: function (e) {
                },
                onItemClick: function (e) {
                },
                icon: "icons/ShowHide.png",
                useSelectMode: false
            });
        }
        get CmdToggleGridOnOff() {
            if (this._cmdToggleGridOnOff === undefined) {
                this._cmdToggleGridOnOff = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.IsShowGrid = !this.IsShowGrid;
                    }
                });
            }
            return this._cmdToggleGridOnOff;
        }
        get CmdToggleProjectionMode() {
            if (this._cmdProjectionMode === undefined) {
                this._cmdProjectionMode = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.IsPerspectiveView = !this.IsPerspectiveView;
                    }
                });
            }
            return this._cmdProjectionMode;
        }
        get CmdToggleExtend() {
            if (this._cmdToggleExtend === undefined) {
                this._cmdToggleExtend = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.SiteView.IsExtended = !this.SiteView.IsExtended;
                    }
                });
            }
            return this._cmdToggleExtend;
        }
        get CmdZoomFit() {
            if (this._cmdZoomFit === undefined) {
                this._cmdZoomFit = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.SiteView.View3.ZoomFit();
                    }
                });
            }
            return this._cmdZoomFit;
        }
        get CmdHomeView() {
            if (this._cmdHomeView === undefined) {
                this._cmdHomeView = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.SiteView.View3.HomeView();
                        $("#bi_toolbar_homeview").focusout();
                    }
                });
            }
            return this._cmdHomeView;
        }
        OnSelectionChanged(sel) {
        }
    }
    KBim.SiteView_ToolbarVM = SiteView_ToolbarVM;
})(KBim || (KBim = {}));
var AppRoot;
var ProjNo;
var ModelNums;
var KBim;
(function (KBim) {
    class SiteView extends KBim.ViewPageContext {
        constructor() {
            super(...arguments);
            this._hideBottomArea = true;
            this._splitterThick = 6;
            this._isExtended = false;
            this._bottomAreaHeight = 220;
            this._rightAreaWidth = 300;
            this._propAreaHeight = 200;
        }
        static get Instance() {
            if (SiteView._instance == null)
                SiteView._instance = new SiteView();
            return SiteView._instance;
        }
        get IsExtended() {
            return this._isExtended;
        }
        set IsExtended(value) {
            this._isExtended = value;
            this.resize();
        }
        intialize() {
            if (this.isMobile()) {
                this._isExtended = true;
            }
            this._toolbar = new KBim.SiteView_ToolbarVM();
            this._toolbar.SiteView = this;
            this._doc = new KBim.KDocument();
            this._doc.Selection.SelectionChanged.Add(this, this.SelectionChanged);
            window.onresize = (ev) => { this.resize(ev); };
            this._panelProp = document.getElementById("panelProp");
            this.LoadingBar3 = document.getElementById("3dLoading");
            this.LoadingValue3 = document.getElementById("3dLoading_value");
            this._mainArea = document.getElementById("MainArea");
            this._viewArea = document.getElementById("ViewArea");
            this._workArea = document.getElementById("WorkArea");
            this._rightArea = document.getElementById("RightArea");
            this._bottomArea = document.getElementById("BottomArea");
            this._panelExplorer = document.getElementById("panelExplorer");
            this._vSplitter = document.createElement("div");
            this._hSplitter = document.createElement("div");
            this._vSplitterProp = document.createElement("div");
            this._workArea.appendChild(this._vSplitter);
            this._mainArea.appendChild(this._hSplitter);
            this._rightArea.appendChild(this._vSplitterProp);
            this._hSplitter.style.position = "absolute";
            this._hSplitter.style.cursor = "w-resize";
            this._hSplitter.style.backgroundColor = "lightgray";
            this._hSplitter.style.width = `${this._splitterThick}px`;
            this._hSplitter.style.height = "100%";
            this._vSplitter.style.position = "absolute";
            this._vSplitter.style.cursor = "s-resize";
            this._vSplitter.style.backgroundColor = "lightgray";
            this._vSplitter.style.height = `${this._splitterThick}px`;
            this._vSplitter.style.width = "100%";
            this._vSplitterProp.style.position = "absolute";
            this._vSplitterProp.style.cursor = "s-resize";
            this._vSplitterProp.style.backgroundColor = "lightgray";
            this._vSplitterProp.style.height = `${this._splitterThick}px`;
            this._vSplitterProp.style.width = "100%";
            $(this._hSplitter).hover(q_ => { $(this._hSplitter).css("background-color", "lightblue"); }, q_ => { $(this._hSplitter).css("background-color", "lightgray"); });
            $(this._vSplitter).hover(q_ => { $(this._vSplitter).css("background-color", "lightblue"); }, q_ => { $(this._vSplitter).css("background-color", "lightgray"); });
            $(this._vSplitterProp).hover(q_ => { $(this._vSplitterProp).css("background-color", "lightblue"); }, q_ => { $(this._vSplitterProp).css("background-color", "lightgray"); });
            this._viewArea.style.position = "absolute";
            this._bottomArea.style.position = "absolute";
            this.InitViews();
            this.resize(null);
            this.initHSplitter();
            this.initVSplitter();
            this.initVSplitterProp();
            this._toolbar.Init();
            this.loadModelScene3D(0);
            this.init3DContextMenu();
        }
        InitViews() {
            let vcontext = this._view3Context = new KBim.ViewContext(this, true);
            vcontext.canvas3 = document.getElementById("view3DCanvas");
            vcontext.svg3dcanvas = document.getElementById("view3DSvgOverlay");
            vcontext.textSvg = document.getElementById("view3DTextSvg");
            vcontext.view3DTextCanvas = document.getElementById("view3DTextCanvas");
            vcontext.board3 = document.getElementById("ViewArea");
            vcontext.Init();
            this.View3.Scene.World.ShowGrid = false;
            this.View3.Scene.useSSAO = true;
            this._toolbar.IsShowGrid = false;
            this.View3.Scene.ClearColor = this.ViewBackground;
            this.View3.ShowNavicator = true;
            this.View3.CanPaning = true;
            this.View3.Scene.SceneMode = KBim.Views.SceneMode.Perspective3D;
            this.View3.DefaultTool = new KBim.Views.Selection3DTool();
            this.View3.ActiveTool = null;
            var cam3d = this.View3.Scene.Camera;
            cam3d.Position = new U1.Vector3(0, 0, 10);
            cam3d.LookAt = new U1.Vector3(0, 0, 0);
            cam3d.Up = new U1.Vector3(0, 1, 1).Normalize();
        }
        resize(ev) {
            var hideBottom = this._hideBottomArea;
            var ma = this._mainArea;
            var wa = this._workArea;
            var btmAraHeight = hideBottom ? 0 : this._bottomAreaHeight;
            var maW = ma.clientWidth;
            var maH = ma.clientHeight;
            var work_h = wa.clientHeight;
            var work_w = ma.clientWidth - this._rightAreaWidth - this._splitterThick;
            var prop_h = this._propAreaHeight;
            var x1 = work_w;
            var x2 = ma.clientWidth - this._rightAreaWidth;
            var y1 = work_h - btmAraHeight - this._splitterThick;
            var y2 = work_h - btmAraHeight;
            var y3 = maH - prop_h;
            if (this._isExtended) {
                this._workArea.style.width = `${maW}px`;
                this._viewArea.style.width = `${maW}px`;
                this._viewArea.style.height = `${maH}px`;
                this._view3Context.setSize(0, 0, maW, maH);
                this._bottomArea.hidden = true;
                this._rightArea.hidden = true;
                this._vSplitter.hidden = true;
                this._hSplitter.hidden = true;
            }
            else {
                this._bottomArea.hidden = hideBottom ? true : false;
                this._rightArea.hidden = false;
                this._vSplitter.hidden = hideBottom ? true : false;
                ;
                this._hSplitter.hidden = false;
                this._workArea.style.width = `${work_w}px`;
                this._viewArea.style.width = `${work_w}px`;
                this._rightArea.style.width = `${this._rightAreaWidth}px`;
                this._rightArea.style.left = `${x2}`;
                this._panelExplorer.style.height = `${y3}px`;
                this._panelProp.style.top = `${y3 + this._splitterThick}px`;
                this._panelProp.style.height = `${prop_h - this._splitterThick}px`;
                this._viewArea.style.top = "0px";
                this._viewArea.style.height = `${y1}px`;
                this._vSplitter.style.top = `${y1}px`;
                this._hSplitter.style.left = `${x1}px`;
                this._vSplitterProp.style.top = `${y3}px`;
                this._bottomArea.style.top = `${y2}px`;
                this._bottomArea.style.height = `${btmAraHeight}px`;
                this._viewArea.style.visibility = work_w == 0 ? "hidden" : "visible";
                this._view3Context.setSize(0, 0, work_w, work_h);
            }
        }
        initHSplitter() {
            let start_x = 0;
            let cur_x = 0;
            let start_w = this._rightAreaWidth;
            $(this._hSplitter).kendoDraggable({
                axis: "x",
                dragstart: (e_) => {
                    start_x = cur_x = e_.clientX;
                    start_w = this._rightAreaWidth;
                },
                drag: (e_) => {
                    cur_x = e_.clientX;
                    this._rightAreaWidth = start_w - (cur_x - start_x);
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._rightAreaWidth = start_w - (cur_x - start_x);
                    this.resize(null);
                }
            });
        }
        initVSplitter() {
            let start_y = 0;
            let cur_y = 0;
            let start_h = this._bottomAreaHeight;
            $(this._vSplitter).kendoDraggable({
                axis: "y",
                dragstart: (e_) => {
                    start_y = e_.clientY;
                    cur_y = start_y;
                    start_h = this._bottomAreaHeight;
                },
                drag: (e_) => {
                    cur_y = e_.clientY;
                    this._bottomAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._bottomAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                }
            });
        }
        initVSplitterProp() {
            let start_y = 0;
            let cur_y = 0;
            let start_h = this._propAreaHeight;
            $(this._vSplitterProp).kendoDraggable({
                axis: "y",
                dragstart: (e_) => {
                    start_y = e_.clientY;
                    cur_y = start_y;
                    start_h = this._propAreaHeight;
                },
                drag: (e_) => {
                    cur_y = e_.clientY;
                    this._propAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._propAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                }
            });
        }
        init3DContextMenu() {
            var miHideSel = {
                text: "Hide selected object"
            };
            var miUnhideAll = {
                text: "Unhide all"
            };
            var miToggleSpace = {
                text: "Space show/hide"
            };
            var menuitems = [
                miHideSel, miUnhideAll, miToggleSpace
            ];
            $(() => {
                $("#context-menu").dxContextMenu({
                    items: menuitems,
                    width: 200,
                    target: "#ViewArea",
                    onShowing: (e_) => {
                        let canHide = this._doc.Selection.Count;
                        let canUnhide = this._hiddenNodes.length > 0;
                        e_.component.option("items[0].disabled", !canHide);
                        e_.component.option("items[1].disabled", !canUnhide);
                        if (this.View3.Mode == U1.Views.ViewModes.Orbitting) {
                            e_.cancel = true;
                        }
                    },
                    onItemClick: (e_) => {
                        var _a;
                        if (e_.itemData == miHideSel) {
                            for (let elm of this._doc.Selection.SelectedElements) {
                                if (elm instanceof KBim.KmNode) {
                                    this._doc.Selection.Clear();
                                    this._hiddenNodes.push(elm);
                                    elm.SetHidden3(true);
                                }
                            }
                        }
                        else if (e_.itemData == miUnhideAll) {
                            for (let node of this._hiddenNodes) {
                                node.SetHidden3(false, "all", true);
                            }
                            this._hiddenNodes.length = 0;
                        }
                        else if (e_.itemData == miToggleSpace) {
                            for (let mdl of this._models.values()) {
                                mdl.space3Visible = !mdl.space3Visible;
                            }
                            (_a = this.View3) === null || _a === void 0 ? void 0 : _a.Invalidate();
                        }
                    }
                });
            });
        }
        initTreeviewContextMenu(treeList) {
            return;
            var miHideSel = {
                id: 0,
                text: "Hide All"
            };
            var miUnhide = {
                id: 1,
                text: "Show All"
            };
            var menuitems = [
                miHideSel, miUnhide
            ];
            var contextMenu = $('#treeviewContextMenu').dxContextMenu({
                items: menuitems,
                target: '#treeviewExplorer .dx-row',
                onItemClick: (e_) => {
                    let selNode = treeList.getSelectedRowsData()[0];
                    if (selNode instanceof KBim.KmNode) {
                        this._doc.Selection.Clear();
                        this._hiddenNodes.push(selNode);
                        if (e_.itemData.id == 0)
                            selNode.SetHidden3(true, "all", true);
                        else if (e_.itemData.id == 1)
                            selNode.SetHidden3(false, "all", true);
                        this.View3.Invalidate();
                    }
                }
            }).dxContextMenu('instance');
        }
        loadPSets(node) {
            var fnum = node.Model.fnum;
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + fnum
                + "&eid=" + node.ifcId
                + "&file=" + "pset";
            $.ajax({
                url: fileURL
            })
                .done((data) => {
                var psets = KBim.KmPSet.ReadFromJson(data);
                var props = KBim.KmPSet.GetAllPropItems(psets);
                $("#gridProp").dxDataGrid({
                    dataSource: props,
                    columns: [
                        {
                            dataField: "psetName",
                            groupIndex: 0,
                            caption: ":"
                        },
                        {
                            dataField: "name",
                            width: 120
                        },
                        {
                            dataField: "value",
                            width: 80,
                        },
                        {
                            dataField: "unit",
                            width: 60
                        }
                    ],
                    showBorders: true,
                    showRowLines: true,
                    showColumnLines: true,
                    rowAlternationEnabled: true,
                    grouping: {
                        autoExpandAll: false
                    },
                    searchPanel: {
                        visible: true,
                        searchVisibleColumnsOnly: true
                    },
                    selection: {
                        mode: "single"
                    }
                });
            })
                .always(() => {
            });
            ;
        }
        get ViewBackground() {
            if (this._viewbackground == null) {
                let strClr = U1.Cookie.getCookie("background");
                if (String.IsNullOrEmpty(strClr))
                    strClr = "#a9a9a9";
                this._viewbackground = U1.Color.fromHexString(strClr);
            }
            return this._viewbackground;
        }
        set ViewBackground(value) {
            this._viewbackground = value;
            this.View3.Scene.ClearColor = this._viewbackground;
            U1.Cookie.setCookie("background", this._viewbackground.toHexString());
            this.View3.Invalidate();
        }
        SelectionChanged(selection) {
            this.updateSelection(this.oldselection, false);
            this.oldselection = selection === null || selection === void 0 ? void 0 : selection.SelectedElements.map((o_, i_) => o_);
            this.updateSelection(this.oldselection, true);
        }
        ResultSelectionChanged(results) {
            if (this._ccvControl == null) {
                this._ccvControl = this.View3.Controls.AddControl(KBim.Views.CcvControl);
            }
            var selEntities = [];
            results.map((o_, i_) => {
                var _a;
                let res = o_;
                let ent = (_a = res === null || res === void 0 ? void 0 : res.selector) === null || _a === void 0 ? void 0 : _a.Entity;
                selEntities.push(ent);
            });
            this._ccvControl.SelectedAreas = selEntities;
        }
        updateSelection(elements, isSelected) {
            var _a;
            if (elements == null)
                return;
            (_a = this._ccvControl) === null || _a === void 0 ? void 0 : _a.SetSelectedAreas(null);
            for (var elm of elements) {
                if (elm instanceof KBim.KmNode) {
                    elm.SetIsSelected(isSelected);
                }
            }
            if (isSelected && elements.length == 1 && elements[0] instanceof KBim.KmNode) {
                this.loadPSets(elements[0]);
            }
        }
        updateExplorer() {
            let nodes = this._doc.Elements
                .filter(elm_ => elm_ instanceof KBim.KmModel);
            let treeList = $("#treeviewExplorer").dxTreeList({
                dataSource: nodes,
                keyExpr: "KEY_ID",
                parentIdExpr: "KEY_PID",
                showRowLines: true,
                showBorders: true,
                showColumnHeaders: true,
                rootValue: -1,
                selection: {
                    mode: "single"
                },
                searchPanel: {
                    visible: true,
                    searchVisibleColumnsOnly: true,
                },
                columns: [
                    {
                        caption: "Name",
                        cellTemplate: (element_, info_) => {
                            var _a;
                            let data_ = info_.data;
                            if (data_ instanceof KBim.KmModel) {
                                let $div = $("<div>");
                                let $ck = $("<div>").css("position", "relative");
                                let ckbox = $ck.dxCheckBox({
                                    value: !data_.node3Context.getIsHidden(),
                                    onValueChanged: (opt_) => {
                                        var _a;
                                        data_.node3Context.setIsHidden(!((_a = opt_.value) !== null && _a !== void 0 ? _a : true));
                                    }
                                }).dxCheckBox("instance");
                                let cls = new KBim.ckBinding();
                                cls.ckbox = ckbox;
                                const $item = $("<div>").text(data_.LABEL)
                                    .css("display", "inline-block")
                                    .css("margin-left", "4px");
                                (_a = data_.node3Context) === null || _a === void 0 ? void 0 : _a.PropertyChanged.Add(cls, cls.propertyChanged);
                                $div.append($ck);
                                $div.append($item);
                                element_.append($div);
                            }
                            else {
                                const $item = $("<div>").text(data_.LABEL);
                                element_.append($item);
                            }
                        }
                    },
                    {
                        caption: "",
                        width: "60px",
                        cellTemplate: (element_, info_) => {
                            if (info_.data instanceof KBim.KmModel) {
                                element_.append(`<a href="BuildingView?prj=${ProjNo}&mdl=${info_.data.fnum}" target="_blank">` +
                                    `<img style="cursor:pointer" src = "./Icons/webgl.png" height = "30" width = "30"/>` +
                                    `</a>`);
                            }
                        }
                    },
                    {
                        caption: "",
                        width: "60px",
                        cellTemplate: (element_, info_) => {
                            if (info_.data instanceof KBim.KmModel) {
                                element_.append(`<a href="BuildingAr?prj=${ProjNo}&mdl=${info_.data.fnum}" target="_blank">` +
                                    `<img style="cursor:pointer" src = "./Icons/vr.png" height = "30" width = "30"/>` +
                                    `</a>`);
                            }
                        }
                    },
                ],
                autoExpandAll: true,
                onRowClick: (e_) => {
                    if (e_.data instanceof KBim.KmNode) {
                        e_.data.Document.Selection.Add(e_.data, true);
                    }
                },
                onCellDblClick: (e_) => {
                    if (e_.data instanceof KBim.KmNode) {
                        this.selectAndFocus(e_.data);
                    }
                },
                onDataErrorOccurred: (e_) => {
                    console.log(e_.error);
                },
                onInitialized: (e_) => {
                }
            })
                .dxTreeList("instance");
            this._toolbar.updateVisibleTypes();
            this.initTreeviewContextMenu(treeList);
        }
    }
    KBim.SiteView = SiteView;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class StoreyView_Toolbar2VM extends KBim.BaseVM {
        constructor() {
            super();
            this._clipboard = [];
            this._isShowGrid = true;
        }
        get View2D() {
            return this.StoreyView.View2;
        }
        get KDocument() {
            var doc = this.StoreyView.Document;
            return doc;
        }
        get rootelement() {
            return document.getElementById('id_tool_bar');
        }
        get IsShowGrid() {
            return this.View2D.Scene.World.ShowGrid;
        }
        set IsShowGrid(value) {
            if (value)
                this.View2D.Scene.World.ShowGrid = true;
            else
                this.View2D.Scene.World.ShowGrid = false;
            this.View2D.Invalidate();
            if (value != this._isShowGrid) {
                if (value) {
                    $("#bi_toolbar_onoffgrid").css("background-color", "lightblue");
                }
                else {
                    $("#bi_toolbar_onoffgrid").css("background-color", "white");
                }
            }
            this._isShowGrid = value;
            this.InvokdPropertyChanged('IsShowGrid');
            $("#bi_toolbar_onoffgrid").focusout();
        }
        get IsPerspectiveView() {
            return this.View2D.Scene.SceneMode == KBim.Views.SceneMode.Perspective3D;
        }
        set IsPerspectiveView(value) {
            if (value) {
                this.View2D.Scene.SceneMode = KBim.Views.SceneMode.Perspective3D;
                $("#bi_toolbar_toggleProjection").attr("src", "/icons/PerspectiveView.png");
                this.View2D.Invalidate();
            }
            else {
                this.View2D.Scene.SceneMode = KBim.Views.SceneMode.Orthographic3D;
                $("#bi_toolbar_toggleProjection").attr("src", "/icons/OrthoView.png");
                this.View2D.Invalidate();
            }
            $("#bi_toolbar_toggleProjection").focusout();
        }
        Init() {
            this.InitBinders();
            this.UpdateBinders();
            var doc = this.StoreyView.Document;
            doc.Selection.SelectionChanged.Add(this, this.OnSelectionChanged);
            this.StoreyView.Document.AfterChanged.Add(this, this.OnAfterChanged);
            this.InvokeProps();
        }
        InitBinders() {
            if (document.getElementById('bi_toolbar_onoffgrid2') != null) {
                this.binders["bi_toolbar_onoffgrid2"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleGridOnOff")
                    .setTarget($("#bi_toolbar_onoffgrid2").get(0));
            }
            if (document.getElementById('bi_toolbar_zoomfit2') != null) {
                this.binders["bi_toolbar_zoomfit2"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdZoomFit")
                    .setTarget($("#bi_toolbar_zoomfit2").get(0));
            }
            if (document.getElementById('bi_toolbar_homeview2') != null) {
                this.binders["bi_toolbar_homeview2"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdHomeView")
                    .setTarget($("#bi_toolbar_homeview2").get(0));
            }
            if (document.getElementById('bi_toolbar_toggleExtend2') != null) {
                this.binders["bi_toolbar_toggleExtend2"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleExtend")
                    .setTarget($("#bi_toolbar_toggleExtend2").get(0));
            }
            let color = this.StoreyView.View2Background.toHexRGBString();
            document.getElementById('bi_color_picker2')
                .value = color;
            $("#bi_color_picker2")
                .on("change", (e_, args_) => {
                let input = e_.currentTarget;
                this.StoreyView.View2Background = U1.Color.fromHexString(input.value);
            });
        }
        OnAfterChanged(document) {
            this.UpdateBinders();
        }
        InvokeProps() {
            this.InvokdPropertyChanged('IsShowGrid');
            this.InvokdPropertyChanged('IsPerspectiveView');
            this.InvokdPropertyChanged('IsVisibleOnOffGrid');
            this.InvokdPropertyChanged('IsVisibleViewMode');
            this.UpdateBinders();
        }
        updateVisibleTypes() {
            let items = this.StoreyView.View2Context.getTypeVisibles();
            let view2content = this.StoreyView.View2Context;
            for (let item of items) {
                switch (item.ifcType) {
                    case "IFCSLAB":
                    case "IFCWALL":
                    case "IFCWALLSTANDARDCASE":
                    case "IFCCOLUMN":
                    case "IFCSITE":
                    case "IFCPLATE":
                    case "IFCGEOGRAPHICELEMENT":
                    case "IFCDOOR":
                    case "IFCWINDOW":
                    case "IFCSPACE":
                        {
                            view2content.setTypeVisible(item.ifcType, true, false);
                            break;
                        }
                    default:
                        view2content.setTypeVisible(item.ifcType, false, false);
                }
            }
            $("#bi_show_hide2").dxDropDownButton({
                items: items,
                splitButton: true,
                dropDownOptions: {
                    width: 330,
                    maxHeight: 400
                },
                itemTemplate: (data_, num_, dxitem_) => {
                    let $div = $("<div>");
                    $div.dxCheckBox({
                        value: view2content.getTypeVisible(data_.ifcType),
                        width: 300,
                        text: data_.ifcType.substr(3),
                        onValueChanged: (opt_) => {
                            view2content.setTypeVisible(data_.ifcType, opt_.value);
                        }
                    });
                    return $div;
                },
                onButtonClick: function (e) {
                },
                onItemClick: function (e) {
                },
                icon: "icons/ShowHide.png",
                useSelectMode: false
            });
        }
        get CmdToggleGridOnOff() {
            if (this._cmdToggleGridOnOff === undefined) {
                this._cmdToggleGridOnOff = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.IsShowGrid = !this.IsShowGrid;
                    }
                });
            }
            return this._cmdToggleGridOnOff;
        }
        get CmdToggleProjectionMode() {
            if (this._cmdProjectionMode === undefined) {
                this._cmdProjectionMode = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.IsPerspectiveView = !this.IsPerspectiveView;
                    }
                });
            }
            return this._cmdProjectionMode;
        }
        get CmdToggleExtend() {
            if (this._cmdToggleExtend === undefined) {
                this._cmdToggleExtend = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        if (this.StoreyView.Is2D3D)
                            this.StoreyView.IsExtended2 = true;
                        else if (this.StoreyView.IsExtended2)
                            this.StoreyView.IsFull2 = true;
                        else
                            this.StoreyView.Is2D3D = true;
                    }
                });
            }
            return this._cmdToggleExtend;
        }
        get CmdZoomFit() {
            if (this._cmdZoomFit === undefined) {
                this._cmdZoomFit = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.View2D.ZoomFit();
                    }
                });
            }
            return this._cmdZoomFit;
        }
        get CmdHomeView() {
            if (this._cmdHomeView === undefined) {
                this._cmdHomeView = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.View2D.HomeView();
                        $("#bi_toolbar_homeview2").focusout();
                    }
                });
            }
            return this._cmdHomeView;
        }
        OnSelectionChanged(sel) {
        }
    }
    KBim.StoreyView_Toolbar2VM = StoreyView_Toolbar2VM;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class StoreyView_Toolbar3VM extends KBim.BaseVM {
        constructor() {
            super();
            this._isShowGrid = true;
        }
        get KDocument() {
            var doc = this.StoreyView.Document;
            return doc;
        }
        get IsShowGrid() {
            return this.StoreyView.View3.Scene.World.ShowGrid;
        }
        set IsShowGrid(value) {
            if (value)
                this.StoreyView.View3.Scene.World.ShowGrid = true;
            else
                this.StoreyView.View3.Scene.World.ShowGrid = false;
            this.StoreyView.View3.Invalidate();
            if (value != this._isShowGrid) {
                if (value) {
                    $("#bi_toolbar_onoffgrid").css("background-color", "lightblue");
                }
                else {
                    $("#bi_toolbar_onoffgrid").css("background-color", "white");
                }
            }
            this._isShowGrid = value;
            this.InvokdPropertyChanged('IsShowGrid');
            $("#bi_toolbar_onoffgrid").focusout();
        }
        get IsPerspectiveView() {
            return this.StoreyView.View3.Scene.SceneMode == KBim.Views.SceneMode.Perspective3D;
        }
        set IsPerspectiveView(value) {
            if (value) {
                this.StoreyView.View3.Scene.SceneMode = KBim.Views.SceneMode.Perspective3D;
                $("#bi_toolbar_toggleProjection").attr("src", "./icons/PerspectiveView.png");
                this.StoreyView.View3.Invalidate();
            }
            else {
                this.StoreyView.View3.Scene.SceneMode = KBim.Views.SceneMode.Orthographic3D;
                $("#bi_toolbar_toggleProjection").attr("src", "./icons/OrthoView.png");
                this.StoreyView.View3.Invalidate();
            }
            $("#bi_toolbar_toggleProjection").focusout();
        }
        Init() {
            this.InitBinders();
            this.UpdateBinders();
            var doc = this.StoreyView.Document;
            doc.Selection.SelectionChanged.Add(this, this.OnSelectionChanged);
            this.StoreyView.Document.AfterChanged.Add(this, this.OnAfterChanged);
            this.InvokeProps();
        }
        InitBinders() {
            if (document.getElementById('bi_toolbar_undo') != null) {
                this.binders["bi_toolbar_undo"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdUndo")
                    .setTarget($("#bi_toolbar_undo").get(0))
                    .setIsVisibleSource('IsVisibleUndo');
            }
            if (document.getElementById('bi_toolbar_onoffgrid') != null) {
                this.binders["bi_toolbar_onoffgrid"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleGridOnOff")
                    .setTarget($("#bi_toolbar_onoffgrid").get(0));
            }
            if (document.getElementById('bi_toolbar_toggleProjection') != null) {
                this.binders["bi_toolbar_toggleProjection"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleProjectionMode")
                    .setTarget($("#bi_toolbar_toggleProjection").get(0));
            }
            if (document.getElementById('bi_toolbar_zoomfit') != null) {
                this.binders["bi_toolbar_zoomfit"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdZoomFit")
                    .setTarget($("#bi_toolbar_zoomfit").get(0));
            }
            if (document.getElementById('bi_toolbar_homeview') != null) {
                this.binders["bi_toolbar_homeview"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdHomeView")
                    .setTarget($("#bi_toolbar_homeview").get(0));
            }
            if (document.getElementById('bi_toolbar_toggleExtend') != null) {
                this.binders["bi_toolbar_toggleExtend"] = new U1.UIs.BiButton()
                    .setSource(this)
                    .setCommandSource("CmdToggleExtend")
                    .setTarget($("#bi_toolbar_toggleExtend").get(0));
            }
            let color = this.StoreyView.View3Background.toHexRGBString();
            document.getElementById('bi_color_picker')
                .value = color;
            $("#bi_color_picker")
                .on("change", (e_, args_) => {
                let input = e_.currentTarget;
                this.StoreyView.View3Background = U1.Color.fromHexString(input.value);
            });
        }
        OnAfterChanged(document) {
            this.UpdateBinders();
        }
        InvokeProps() {
            this.InvokdPropertyChanged('IsShowGrid');
            this.InvokdPropertyChanged('IsPerspectiveView');
            this.InvokdPropertyChanged('IsVisibleOnOffGrid');
            this.InvokdPropertyChanged('IsVisibleViewMode');
            this.UpdateBinders();
        }
        updateVisibleTypes() {
            let items = this.StoreyView.View3Context.getTypeVisibles();
            let view3content = this.StoreyView.View3Context;
            $("#bi_show_hide").dxDropDownButton({
                items: items,
                splitButton: true,
                dropDownOptions: {
                    width: 330,
                    maxHeight: 400
                },
                itemTemplate: (data_, num_, dxitem_) => {
                    let $div = $("<div>");
                    $div.dxCheckBox({
                        value: view3content.getTypeVisible(data_.ifcType),
                        width: 300,
                        text: data_.ifcType.substr(3),
                        onValueChanged: (opt_) => {
                            view3content.setTypeVisible(data_.ifcType, opt_.value);
                        }
                    });
                    return $div;
                },
                onButtonClick: function (e) {
                },
                onItemClick: function (e) {
                },
                icon: "icons/ShowHide.png",
                useSelectMode: false
            });
        }
        get CmdToggleGridOnOff() {
            if (this._cmdToggleGridOnOff === undefined) {
                this._cmdToggleGridOnOff = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.IsShowGrid = !this.IsShowGrid;
                    }
                });
            }
            return this._cmdToggleGridOnOff;
        }
        get CmdToggleProjectionMode() {
            if (this._cmdProjectionMode === undefined) {
                this._cmdProjectionMode = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.IsPerspectiveView = !this.IsPerspectiveView;
                    }
                });
            }
            return this._cmdProjectionMode;
        }
        get CmdToggleExtend() {
            if (this._cmdToggleExtend === undefined) {
                this._cmdToggleExtend = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        if (this.StoreyView.Is2D3D)
                            this.StoreyView.IsExtended3 = true;
                        else if (this.StoreyView.IsExtended3)
                            this.StoreyView.IsFull3 = true;
                        else
                            this.StoreyView.Is2D3D = true;
                    }
                });
            }
            return this._cmdToggleExtend;
        }
        get CmdZoomFit() {
            if (this._cmdZoomFit === undefined) {
                this._cmdZoomFit = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.StoreyView.View3.ZoomFit();
                    }
                });
            }
            return this._cmdZoomFit;
        }
        get CmdHomeView() {
            if (this._cmdHomeView === undefined) {
                this._cmdHomeView = new U1.UCommand({
                    ExecuteFunc: (arg) => {
                        this.StoreyView.View3.HomeView();
                        $("#bi_toolbar_homeview").focusout();
                    }
                });
            }
            return this._cmdHomeView;
        }
        OnSelectionChanged(sel) {
        }
    }
    KBim.StoreyView_Toolbar3VM = StoreyView_Toolbar3VM;
})(KBim || (KBim = {}));
var AppRoot;
var ProjNo;
var ModelNo;
var StoreyID;
var KBim;
(function (KBim) {
    let ViewExtends;
    (function (ViewExtends) {
        ViewExtends[ViewExtends["none"] = 0] = "none";
        ViewExtends[ViewExtends["extend3d"] = 1] = "extend3d";
        ViewExtends[ViewExtends["extend2d"] = 2] = "extend2d";
        ViewExtends[ViewExtends["full3d"] = 3] = "full3d";
        ViewExtends[ViewExtends["full2d"] = 4] = "full2d";
    })(ViewExtends = KBim.ViewExtends || (KBim.ViewExtends = {}));
    class StoreyView extends KBim.ViewPageContext {
        constructor() {
            super(...arguments);
            this._hideBottomArea = true;
            this._splitterThick = 6;
            this._viewExtend = ViewExtends.none;
            this._bottomAreaHeight = 220;
            this._view3DwRatio = 0.5;
            this._rightAreaWidth = 300;
            this._propAreaHeight = 200;
        }
        get IsExtended3() {
            return this._viewExtend == ViewExtends.extend3d;
        }
        set IsExtended3(value) {
            if (value) {
                this._viewExtend = ViewExtends.extend3d;
                this.resize();
            }
        }
        get IsFull3() {
            return this._viewExtend == ViewExtends.full3d;
        }
        set IsFull3(value) {
            if (value) {
                this._viewExtend = ViewExtends.full3d;
                this.resize();
            }
        }
        get IsExtended2() {
            return this._viewExtend == ViewExtends.extend2d;
        }
        set IsExtended2(value) {
            if (value) {
                this._viewExtend = ViewExtends.extend2d;
                this.resize();
            }
        }
        get IsFull2() {
            return this._viewExtend == ViewExtends.full2d;
        }
        set IsFull2(value) {
            if (value) {
                this._viewExtend = ViewExtends.full2d;
                this.resize();
            }
        }
        get Is2D3D() {
            return this._viewExtend == ViewExtends.none;
        }
        set Is2D3D(value) {
            if (value) {
                this._viewExtend = ViewExtends.none;
                this.resize();
            }
        }
        intialize() {
            this._toolbar3 = new KBim.StoreyView_Toolbar3VM();
            this._toolbar3.StoreyView = this;
            this._toolbar2 = new KBim.StoreyView_Toolbar2VM();
            this._toolbar2.StoreyView = this;
            this._doc = new KBim.KDocument();
            this._doc.Selection.SelectionChanged.Add(this, this.SelectionChanged);
            window.onresize = (ev) => { this.resize(ev); };
            this._panelProp = document.getElementById("panelProp");
            this.LoadingBar3 = document.getElementById("3dLoading");
            this.LoadingValue3 = document.getElementById("3dLoading_value");
            this.LoadingBar2 = document.getElementById("2dLoading");
            this.LoadingValue2 = document.getElementById("2dLoading_value");
            this._mainArea = document.getElementById("MainArea");
            this._viewArea3 = document.getElementById("ViewArea");
            this._viewArea2 = document.getElementById("View2DArea");
            this._workArea = document.getElementById("WorkArea");
            this._rightArea = document.getElementById("RightArea");
            this._bottomArea = document.getElementById("BottomArea");
            this._panelExplorer = document.getElementById("panelExplorer");
            this._vSplitter = document.createElement("div");
            this._hSplitter = document.createElement("div");
            this._hSplitter1 = document.createElement("div");
            this._vSplitterProp = document.createElement("div");
            this._workArea.appendChild(this._vSplitter);
            this._mainArea.appendChild(this._hSplitter);
            this._mainArea.appendChild(this._hSplitter1);
            this._rightArea.appendChild(this._vSplitterProp);
            this._hSplitter.style.position = "absolute";
            this._hSplitter.style.cursor = "w-resize";
            this._hSplitter.style.backgroundColor = "lightgray";
            this._hSplitter.style.width = `${this._splitterThick}px`;
            this._hSplitter.style.height = "100%";
            this._hSplitter1.style.position = "absolute";
            this._hSplitter1.style.cursor = "w-resize";
            this._hSplitter1.style.backgroundColor = "lightgray";
            this._hSplitter1.style.width = `${this._splitterThick}px`;
            this._hSplitter1.style.height = "100%";
            this._vSplitter.style.position = "absolute";
            this._vSplitter.style.cursor = "s-resize";
            this._vSplitter.style.backgroundColor = "lightgray";
            this._vSplitter.style.height = `${this._splitterThick}px`;
            this._vSplitter.style.width = "100%";
            this._vSplitterProp.style.position = "absolute";
            this._vSplitterProp.style.cursor = "s-resize";
            this._vSplitterProp.style.backgroundColor = "lightgray";
            this._vSplitterProp.style.height = `${this._splitterThick}px`;
            this._vSplitterProp.style.width = "100%";
            $(this._hSplitter).hover(q_ => { $(this._hSplitter).css("background-color", "lightblue"); }, q_ => { $(this._hSplitter).css("background-color", "lightgray"); });
            $(this._hSplitter1).hover(q_ => { $(this._hSplitter1).css("background-color", "lightblue"); }, q_ => { $(this._hSplitter1).css("background-color", "lightgray"); });
            $(this._vSplitter).hover(q_ => { $(this._vSplitter).css("background-color", "lightblue"); }, q_ => { $(this._vSplitter).css("background-color", "lightgray"); });
            $(this._vSplitterProp).hover(q_ => { $(this._vSplitterProp).css("background-color", "lightblue"); }, q_ => { $(this._vSplitterProp).css("background-color", "lightgray"); });
            this._viewArea3.style.position = "absolute";
            this._bottomArea.style.position = "absolute";
            this.InitViews();
            this.resize(null);
            this.initHSplitter();
            this.initHSplitter1();
            this.initVSplitter();
            this.initVSplitterProp();
            this._toolbar3.Init();
            this._toolbar2.Init();
            this.loadElements();
            this.loadScene3();
            this.loadLine2();
            this.loadScene2();
            this.init3DContextMenu();
        }
        resize(ev) {
            var hideBtmArea = this._hideBottomArea;
            if (this._viewExtend == ViewExtends.full2d ||
                this._viewExtend == ViewExtends.full3d) {
                hideBtmArea = true;
            }
            let hideRtArea = this._viewExtend == ViewExtends.full2d
                || this._viewExtend == ViewExtends.full3d;
            let hideV3Area = this._viewExtend == ViewExtends.full2d ||
                this._viewExtend == ViewExtends.extend2d;
            let hideV2Area = this._viewExtend == ViewExtends.full3d ||
                this._viewExtend == ViewExtends.extend3d;
            var ma = this._mainArea;
            var wa = this._workArea;
            var btmAraHeight = hideBtmArea ? 0 : this._bottomAreaHeight;
            var maW = ma.clientWidth;
            var maH = ma.clientHeight;
            var work_h = wa.clientHeight;
            var work_w = ma.clientWidth - this._rightAreaWidth - this._splitterThick;
            var prop_h = this._propAreaHeight;
            var view3_w = work_w * this._view3DwRatio - this._splitterThick;
            var view2_w = work_w - view3_w - this._splitterThick;
            this._rightArea.hidden = hideRtArea;
            this._viewArea2.hidden = hideV2Area;
            this._viewArea3.hidden = hideV3Area;
            this._bottomArea.hidden = hideBtmArea;
            this._vSplitter.hidden = hideBtmArea;
            this._hSplitter.hidden = hideRtArea;
            this._hSplitter1.hidden = hideV2Area || hideV3Area;
            if (this.IsFull2) {
                view2_w = maW;
                view3_w = 0;
            }
            else if (this.IsExtended2) {
                view2_w = work_w;
                view3_w = 0;
            }
            else if (this.IsFull3) {
                view3_w = maW;
                view2_w = 0;
            }
            else if (this.IsExtended3) {
                view3_w = work_w;
                view2_w = 0;
            }
            var x_hsp = work_w;
            var x_rarea = ma.clientWidth - this._rightAreaWidth;
            var x_hsp1 = view3_w;
            var x_view2 = view3_w + this._splitterThick;
            var y1 = work_h - btmAraHeight - this._splitterThick;
            var y2 = work_h - btmAraHeight;
            var y3 = maH - prop_h;
            if (this.IsFull3 || this.IsExtended3) {
                this._workArea.style.width = `${view3_w}px`;
                this._viewArea3.style.width = `${view3_w}px`;
                this._viewArea3.style.height = `${maH}px`;
                this._view3Context.setSize(0, 0, view3_w, maH);
                this._view2Context.setSize(x_view2, 0, view2_w, work_h);
            }
            else if (this.IsFull2 || this.IsExtended2) {
                this._workArea.style.width = `${view2_w}px`;
                this._viewArea2.style.width = `${view2_w}px`;
                this._viewArea2.style.height = `${maH}px`;
                this._view2Context.setSize(0, 0, view2_w, maH);
                this._viewArea2.style.left = `${x_view2}px`;
                this._view3Context.setSize(0, 0, view3_w, work_h);
                this._view2Context.setSize(x_view2, 0, view2_w, work_h);
            }
            else {
                this._workArea.style.width = `${work_w}px`;
                this._viewArea3.style.width = `${view3_w}px`;
                this._viewArea2.style.width = `${view2_w}px`;
                this._viewArea3.style.top = "0px";
                this._viewArea2.style.left = `${x_view2}px`;
                this._viewArea2.style.height = `${y1}px`;
                this._viewArea3.style.top = "0px";
                this._viewArea3.style.height = `${y1}px`;
                this._hSplitter1.style.left = `${x_hsp1}px`;
                this._view3Context.setSize(0, 0, view3_w, work_h);
                this._view2Context.setSize(x_view2, 0, view2_w, work_h);
            }
            if (!hideBtmArea) {
                this._vSplitter.style.top = `${y1}px`;
                this._bottomArea.style.top = `${y2}px`;
                this._bottomArea.style.height = `${btmAraHeight}px`;
            }
            if (!hideRtArea) {
                this._hSplitter.style.left = `${x_hsp}px`;
                this._rightArea.style.width = `${this._rightAreaWidth}px`;
                this._rightArea.style.left = `${x_rarea}`;
                this._panelExplorer.style.height = `${y3}px`;
                this._panelProp.style.top = `${y3 + this._splitterThick}px`;
                this._panelProp.style.height = `${prop_h - this._splitterThick}px`;
                this._vSplitterProp.style.top = `${y3}px`;
            }
        }
        initHSplitter() {
            let start_x = 0;
            let cur_x = 0;
            let start_w = this._rightAreaWidth;
            $(this._hSplitter).kendoDraggable({
                axis: "x",
                dragstart: (e_) => {
                    start_x = cur_x = e_.clientX;
                    start_w = this._rightAreaWidth;
                },
                drag: (e_) => {
                    cur_x = e_.clientX;
                    this._rightAreaWidth = start_w - (cur_x - start_x);
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._rightAreaWidth = start_w - (cur_x - start_x);
                    this.resize(null);
                }
            });
        }
        initHSplitter1() {
            let start_x = 0;
            let cur_x = 0;
            let start_w = this._workArea.clientWidth * this._view3DwRatio;
            $(this._hSplitter1).kendoDraggable({
                axis: "x",
                dragstart: (e_) => {
                    start_x = cur_x = e_.clientX;
                    start_w = this._workArea.clientWidth * this._view3DwRatio;
                },
                drag: (e_) => {
                    cur_x = e_.clientX;
                    this._view3DwRatio = (start_w + (cur_x - start_x)) / this._workArea.clientWidth;
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._view3DwRatio = (start_w + (cur_x - start_x)) / this._workArea.clientWidth;
                    this.resize(null);
                }
            });
        }
        initVSplitter() {
            let start_y = 0;
            let cur_y = 0;
            let start_h = this._bottomAreaHeight;
            $(this._vSplitter).kendoDraggable({
                axis: "y",
                dragstart: (e_) => {
                    start_y = e_.clientY;
                    cur_y = start_y;
                    start_h = this._bottomAreaHeight;
                },
                drag: (e_) => {
                    cur_y = e_.clientY;
                    this._bottomAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._bottomAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                }
            });
        }
        initVSplitterProp() {
            let start_y = 0;
            let cur_y = 0;
            let start_h = this._propAreaHeight;
            $(this._vSplitterProp).kendoDraggable({
                axis: "y",
                dragstart: (e_) => {
                    start_y = e_.clientY;
                    cur_y = start_y;
                    start_h = this._propAreaHeight;
                },
                drag: (e_) => {
                    cur_y = e_.clientY;
                    this._propAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                },
                dragend: (e_) => {
                    this._propAreaHeight = start_h - (cur_y - start_y);
                    this.resize(null);
                }
            });
        }
        init3DContextMenu() {
            var miHideSel = {
                text: "Hide selected object"
            };
            var miUnhideAll = {
                text: "Unhide all"
            };
            var miToggleSpace = {
                text: "Space show/hide"
            };
            var menuitems = [
                miHideSel, miUnhideAll, miToggleSpace
            ];
            $(() => {
                $("#context-menu").dxContextMenu({
                    items: menuitems,
                    width: 200,
                    target: "#ViewArea",
                    onShowing: (e_) => {
                        let canHide = this._doc.Selection.Count;
                        let canUnhide = this._hiddenNodes.length > 0;
                        e_.component.option("items[0].disabled", !canHide);
                        e_.component.option("items[1].disabled", !canUnhide);
                        if (this.View3.Mode == U1.Views.ViewModes.Orbitting) {
                            e_.cancel = true;
                        }
                    },
                    onItemClick: (e_) => {
                        var _a;
                        if (e_.itemData == miHideSel) {
                            for (let elm of this._doc.Selection.SelectedElements) {
                                if (elm instanceof KBim.KmNode) {
                                    this._doc.Selection.Clear();
                                    this._hiddenNodes.push(elm);
                                    elm.SetHidden3(true);
                                }
                            }
                        }
                        else if (e_.itemData == miUnhideAll) {
                            for (let node of this._hiddenNodes) {
                                node.SetHidden3(false, "all", true);
                            }
                            this._hiddenNodes.length = 0;
                        }
                        else if (e_.itemData == miToggleSpace) {
                            for (let mdl of this._models.values()) {
                                mdl.space3Visible = !mdl.space3Visible;
                            }
                            (_a = this.View3) === null || _a === void 0 ? void 0 : _a.Invalidate();
                        }
                    }
                });
            });
        }
        initTreeviewContextMenu(treeList) {
            return;
            var miHideSel = {
                id: 0,
                text: "Hide All"
            };
            var miUnhide = {
                id: 1,
                text: "Show All"
            };
            var menuitems = [
                miHideSel, miUnhide
            ];
            var contextMenu = $('#treeviewContextMenu').dxContextMenu({
                items: menuitems,
                target: '#treeviewExplorer .dx-row',
                onItemClick: (e_) => {
                    let selNode = treeList.getSelectedRowsData()[0];
                    if (selNode instanceof KBim.KmNode) {
                        this._doc.Selection.Clear();
                        this._hiddenNodes.push(selNode);
                        if (e_.itemData.id == 0)
                            selNode.node3Context.setHiddenMesh(true, "all", true);
                        else if (e_.itemData.id == 1)
                            selNode.node3Context.setHiddenMesh(false, "all", true);
                        this.View3.Invalidate();
                    }
                }
            }).dxContextMenu('instance');
        }
        loadScene3() {
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + ModelNo
                + "&eid=" + StoreyID
                + "&file=" + "gltf_a";
            this.updateLoading3D(false, "0%");
            KBim.KmGLTFLoader.instance.load({
                url: fileURL,
                onLoad: (gltf) => {
                    this.ModelMesh3s.set(ModelNo, gltf.scene);
                    let mdl = this._models.get(ModelNo);
                    if (mdl != null) {
                        mdl.model3Context.rootMesh = gltf.scene;
                        mdl.node3Context.setHiddenMesh(false, "all", true);
                        this.updateLoading3D(true);
                    }
                },
                onProgress: (xhr) => {
                    this.updateLoading3D(false, `${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
                },
                onError: (error) => {
                    let mdl = this._models.get(ModelNo);
                    let grp = new THREE.Group();
                    this.ModelMesh3s.set(ModelNo, grp);
                    if (mdl != null) {
                        mdl.model3Context.rootMesh = grp;
                        this.updateLoading3D(true);
                    }
                    this.updateLoading3D(true);
                }
            });
            return;
        }
        loadScene2() {
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + ModelNo
                + "&eid=" + StoreyID
                + "&file=" + "gltf_a";
            this.updateLoading2D(false, "0%");
            KBim.KmGLTFLoader.instance.load({
                url: fileURL,
                onLoad: (gltf) => {
                    this.ModelMesh2s.set(ModelNo, gltf.scene);
                    let mdl = this._models.get(ModelNo);
                    if (mdl != null) {
                        mdl.model2Context.rootMesh = gltf.scene;
                        this.updateLoading2D(true);
                    }
                },
                onProgress: (xhr) => {
                    this.updateLoading2D(false, `${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
                },
                onError: (error) => {
                    let mdl = this._models.get(ModelNo);
                    let grp = new THREE.Group();
                    this.ModelMesh2s.set(ModelNo, grp);
                    if (mdl != null) {
                        mdl.model2Context.rootMesh = grp;
                        this.View2Context.setTypePrime("IFCSPACE", true);
                        this.View2Context.setTypePrime("IFCWINDOW", true);
                        this.View2Context.setTypePrime("IFCDOOR", true);
                        this.updateLoading2D(true);
                    }
                    this.updateLoading2D(true);
                }
            });
            return;
        }
        loadLine2() {
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + ModelNo
                + "&eid=" + StoreyID
                + "&file=" + "gltf_line_a";
            this.updateLoading2D(false, "0%");
            KBim.KmGLTFLoader.instance.load({
                url: fileURL,
                onLoad: (gltf) => {
                    this.ModelLine2s.set(ModelNo, gltf.scene);
                    let mdl = this._models.get(ModelNo);
                    if (mdl != null) {
                        mdl.model2Context.rootLine = gltf.scene;
                        this.updateLoading2D(true);
                    }
                },
                onProgress: (xhr) => {
                    this.updateLoading2D(false, `${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
                },
                onError: (error) => {
                }
            });
            return;
        }
        loadElements() {
            var fnum = ModelNo;
            $.ajax({
                url: `products?prj=${ProjNo}&fnum=${fnum}`
            })
                .done((data) => {
                let kmModel = new KBim.KmStoreyModel();
                kmModel.fnum = ModelNo;
                kmModel.storeyID = "" + StoreyID;
                kmModel.ReadJson(data);
                kmModel.viewPageContext = this;
                this._storey = kmModel.storey;
                this._models.set(kmModel.fnum, kmModel);
                let mesh3 = this.ModelMesh3s.get(fnum);
                let mesh2 = this.ModelMesh2s.get(fnum);
                let line2 = this.ModelLine2s.get(fnum);
                if (mesh3 != null) {
                    kmModel.model3Context.rootMesh = mesh3;
                    kmModel.node3Context.setHiddenMesh(false, "all", true);
                }
                if (mesh2 != null) {
                    kmModel.model2Context.rootMesh = mesh2;
                    this.View2Context.setTypeVisible("IFCSPACE", true, true);
                    this.View2Context.setTypeVisible("IFCWINDOW", true, true);
                    this.View2Context.setTypeVisible("IFCDOOR", true, true);
                }
                if (line2 != null) {
                    kmModel.model2Context.rootLine = line2;
                }
                this._doc.Append(kmModel);
                this.updateMinMax();
                this.updateExplorer();
                this._toolbar3.updateVisibleTypes();
                this._toolbar2.updateVisibleTypes();
            })
                .always(() => {
            });
            ;
        }
        loadPSets(node) {
            var fnum = node.Model.fnum;
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + fnum
                + "&eid=" + node.ifcId
                + "&file=" + "pset";
            $.ajax({
                url: fileURL
            })
                .done((data) => {
                var psets = KBim.KmPSet.ReadFromJson(data);
                var props = KBim.KmPSet.GetAllPropItems(psets);
                $("#gridProp").dxDataGrid({
                    dataSource: props,
                    columns: [
                        {
                            dataField: "psetName",
                            groupIndex: 0,
                            caption: "Pset"
                        },
                        {
                            dataField: "name",
                            width: 120
                        },
                        {
                            dataField: "value",
                            width: 80,
                        },
                        {
                            dataField: "unit",
                            width: 60
                        }
                    ],
                    showBorders: true,
                    showRowLines: true,
                    showColumnLines: true,
                    rowAlternationEnabled: true,
                    grouping: {
                        autoExpandAll: false
                    },
                    searchPanel: {
                        visible: true,
                        searchVisibleColumnsOnly: true
                    },
                    selection: {
                        mode: "single"
                    }
                });
            })
                .always(() => {
            });
            ;
        }
        InitViews() {
            this.InitView3D();
            this.InitView2D();
        }
        InitView3D() {
            let vcontext3 = this._view3Context = new KBim.ViewContext(this, true);
            vcontext3.canvas3 = document.getElementById("view3DCanvas");
            vcontext3.svg3dcanvas = document.getElementById("view3DSvgOverlay");
            vcontext3.textSvg = document.getElementById("view3DTextSvg");
            vcontext3.view3DTextCanvas = document.getElementById("view3DTextCanvas");
            vcontext3.board3 = document.getElementById("ViewArea");
            vcontext3.Init();
            this.View3.Scene.World.ShowGrid = false;
            this._toolbar3.IsShowGrid = false;
            this.View3.ShowNavicator = true;
            this.View3.CanPaning = true;
            this.View3.Scene.SceneMode = KBim.Views.SceneMode.Perspective3D;
            this.View3.DefaultTool = new KBim.Views.Selection3DTool();
            this.View3.ActiveTool = null;
            var cam3d = this.View3.Scene.Camera;
            cam3d.Position = new U1.Vector3(0, 0, 10);
            cam3d.LookAt = new U1.Vector3(0, 0, 0);
            cam3d.Up = new U1.Vector3(0, 1, 1).Normalize();
            this._view3Context.setTypeVisible("IFCCOVERING", false);
        }
        InitView2D() {
            let vcontext2 = this._view2Context = new KBim.ViewContext(this, false);
            vcontext2.canvas3 = document.getElementById("view2DCanvas");
            vcontext2.svg3dcanvas = document.getElementById("view2DSvgOverlay");
            vcontext2.textSvg = document.getElementById("view2DTextSvg");
            vcontext2.view3DTextCanvas = document.getElementById("view2DTextCanvas");
            vcontext2.board3 = document.getElementById("View2DArea");
            vcontext2.Init();
            this.View2.Scene.World.ShowGrid = false;
            this._toolbar2.IsShowGrid = false;
            this.View2.Scene.ClearColor = this.View2Background;
            this.View2.ShowNavicator = true;
            this.View2.CanPaning = true;
            this.View2.Scene.SceneMode = KBim.Views.SceneMode.Orthographic2D;
            this.View2.DefaultTool = new KBim.Views.Selection2DTool();
            this.View2.ActiveTool = null;
            var cam3d = this.View2.Scene.Camera;
            cam3d.Position = new U1.Vector3(0, 0, 10);
            cam3d.LookAt = new U1.Vector3(0, 0, 0);
            cam3d.Up = new U1.Vector3(0, 1, 0).Normalize();
            this._view2Context.setTypeVisible("IFCCOVERING", false);
        }
        get View3Background() {
            return this._view3Context.backgroundColor;
        }
        set View3Background(value) {
            this._view3Context.backgroundColor = value;
        }
        get View2Background() {
            return this._view2Context.backgroundColor;
        }
        set View2Background(value) {
            this._view2Context.backgroundColor = value;
        }
        SelectionChanged(selection) {
            this.updateSelection(this.oldselection, false);
            this.oldselection = selection === null || selection === void 0 ? void 0 : selection.SelectedElements.map((o_, i_) => o_);
            this.updateSelection(this.oldselection, true);
        }
        ResultSelectionChanged(results) {
            if (this._ccvControl == null) {
                this._ccvControl = this.View3.Controls.AddControl(KBim.Views.CcvControl);
            }
            var selEntities = [];
            results.map((o_, i_) => {
                var _a;
                let res = o_;
                let ent = (_a = res === null || res === void 0 ? void 0 : res.selector) === null || _a === void 0 ? void 0 : _a.Entity;
                selEntities.push(ent);
            });
            this._ccvControl.SelectedAreas = selEntities;
        }
        updateSelection(elements, isSelected) {
            var _a;
            if (elements == null)
                return;
            (_a = this._ccvControl) === null || _a === void 0 ? void 0 : _a.SetSelectedAreas(null);
            for (var elm of elements) {
                if (elm instanceof KBim.KmNode) {
                    elm.SetIsSelected(isSelected);
                }
            }
            if (isSelected && elements.length == 1 && elements[0] instanceof KBim.KmNode) {
                this.loadPSets(elements[0]);
            }
        }
        updateExplorer() {
            var tabPanel = $("#tabstrip").dxTabPanel({
                dataSource: [{ title: "공간", index: 0 }, { title: "탐색", index: 1 }],
                selectedIndex: 0,
                loop: false,
                animationEnabled: true,
                swipeEnabled: true,
                itemTitleTemplate: (data_, index_, itemElm_) => {
                    itemElm_
                        .append($("<span>").text(data_.title));
                },
                itemTemplate: (data_, index_, itemElm_) => {
                    let treeView = $("<div>")
                        .css({ "width": "100 %", "height": "100%", "position": "absolute" })
                        .appendTo(itemElm_);
                    if (index_ == 0) {
                        this.initSpaceTree(treeView);
                    }
                    else if (index_ == 1) {
                        this.initExplorerTree(treeView);
                    }
                }
            }).dxTabPanel("instance");
            return;
        }
        initExplorerTree(element) {
            let nodes = this._doc.Elements
                .filter(elm_ => !(elm_ instanceof KBim.KmModel));
            let treeList = element.dxTreeList({
                dataSource: nodes,
                keyExpr: "KEY_ID",
                parentIdExpr: "KEY_PID",
                showRowLines: true,
                showBorders: true,
                showColumnHeaders: true,
                rootValue: this._storey.Model.HND,
                selection: {
                    mode: "single"
                },
                searchPanel: {
                    visible: true,
                    searchVisibleColumnsOnly: true,
                },
                columns: [
                    {
                        dataField: "LABEL",
                        caption: "Name",
                    },
                    {
                        dataField: "IFC_TYPE",
                        caption: "Type",
                        width: "100px"
                    },
                ],
                onRowClick: (e_) => {
                    if (e_.data instanceof KBim.KmNode) {
                        e_.data.Document.Selection.Add(e_.data, true);
                    }
                },
                onCellDblClick: (e_) => {
                    if (e_.data instanceof KBim.KmNode) {
                        this.selectAndFocus(e_.data);
                    }
                },
                onDataErrorOccurred: (e_) => {
                    console.log(e_.error);
                },
                onInitialized: (e_) => {
                }
            })
                .dxTreeList("instance");
            this.initTreeviewContextMenu(treeList);
        }
        initSpaceTree(element) {
            let nodes = this._doc.Elements
                .filter(elm_ => elm_ instanceof KBim.KmSpace);
            let treeList = element.dxTreeList({
                dataSource: nodes,
                keyExpr: "KEY_ID",
                parentIdExpr: "KEY_PID",
                showRowLines: true,
                showBorders: true,
                showColumnHeaders: true,
                rootValue: this._storey.HND,
                selection: {
                    mode: "single"
                },
                searchPanel: {
                    visible: true,
                    searchVisibleColumnsOnly: true,
                },
                columns: [
                    {
                        dataField: "LABEL",
                        caption: "Name",
                    },
                ],
                columnAutoWidth: true,
                autoExpandAll: true,
                onRowClick: (e_) => {
                    if (e_.data instanceof KBim.KmNode) {
                        e_.data.Document.Selection.Add(e_.data, true);
                    }
                },
                onCellDblClick: (e_) => {
                    if (e_.data instanceof KBim.KmNode) {
                        this.selectAndFocus(e_.data);
                    }
                },
                onDataErrorOccurred: (e_) => {
                    console.log(e_.error);
                },
                onInitialized: (e_) => {
                }
            })
                .dxTreeList("instance");
            this.initTreeviewContextMenu(treeList);
        }
    }
    KBim.StoreyView = StoreyView;
})(KBim || (KBim = {}));
var AppRoot;
var ProjNo;
var ModelNums;
var KBim;
(function (KBim) {
    class ViewContext {
        constructor(pageContext, is3D) {
            this._hiddenTypes = new Set();
            this._is3D = is3D;
            this._pageContext = pageContext;
        }
        get is3D() {
            return this._is3D;
        }
        get scene() {
            return this._view.Scene;
        }
        get canvas3() {
            return this._canvas;
        }
        set canvas3(value) {
            this._canvas = value;
        }
        get view3DTextCanvas() {
            return this._textCanvas;
        }
        set view3DTextCanvas(value) {
            this._textCanvas = value;
        }
        get svg3dcanvas() {
            return this._svgcanvas;
        }
        set svg3dcanvas(value) {
            this._svgcanvas = value;
        }
        get textSvg() {
            return this._textSvg;
        }
        set textSvg(value) {
            this._textSvg = value;
        }
        get board3() {
            return this._board;
        }
        set board3(value) {
            this._board = value;
        }
        get backgroundColor() {
            if (this._backgroundColor == null) {
                let strClr = U1.Cookie.getCookie("background" + (this.is3D ? "_3d" : "_2d"));
                if (String.IsNullOrEmpty(strClr))
                    strClr = "#a9a9a9";
                this._backgroundColor = U1.Color.fromHexString(strClr);
            }
            return this._backgroundColor;
        }
        set backgroundColor(value) {
            this._backgroundColor = value;
            this.View.Scene.ClearColor = this._backgroundColor;
            U1.Cookie.setCookie("background" + (this.is3D ? "_3d" : "_2d"), this._backgroundColor.toHexString());
            this.View.Invalidate();
        }
        get Document() {
            return this._pageContext.Document;
        }
        get Models() {
            return this._pageContext.Models;
        }
        get View() {
            return this._view;
        }
        setSize(x, y, w, h) {
            this._board.style.width = `${w}px`;
            this._board.style.height = `${h}px`;
            this.canvas3.style.width = `${w}px`;
            this.canvas3.style.height = `${h}px`;
            this.svg3dcanvas.style.width = `${w}px`;
            this.svg3dcanvas.style.height = `${h}px`;
            this._textSvg.style.width = `${w}px`;
            this._textSvg.style.height = `${h}px`;
            this._textCanvas.style.width = `${w}px`;
            this._textCanvas.style.height = `${h}px`;
            this._view.Invalidate();
        }
        Init() {
            if (this.is3D) {
                this._view = new KBim.Views.View3DThree(this._canvas, this._textCanvas, this._textSvg);
                this._view.SvgOverlay = this._svgcanvas;
            }
            else {
                this._view = new KBim.Views.View2DThree(this._canvas, this._textCanvas, this._textSvg);
                this._view.SvgOverlay = this._svgcanvas;
            }
            this._view.Document = this.Document;
            this._view.Board = this._board;
            if (this.is3D)
                this._view.DocumentPresenter = this._docPresenter = new KBim.Pr3D_Doc();
            else {
                this._view.DocumentPresenter = this._docPresenter = new KBim.Pr2D_Doc();
            }
            this._view.Activate();
            this.scene.ClearColor = this.backgroundColor;
        }
        getTypeVisible(ifcType) {
            return this._hiddenTypes.has(ifcType) != true;
        }
        setTypeVisible(ifcType, visible, update = true) {
            if (visible) {
                this._hiddenTypes.delete(ifcType);
            }
            else {
                this._hiddenTypes.add(ifcType);
            }
            if (update) {
                for (let mdl of this._pageContext.Models.values()) {
                    for (let node of mdl.node_map.values()) {
                        if (node.ifcType != ifcType)
                            continue;
                        if (this.is3D) {
                            node.node3Context.updateVisible();
                        }
                        else {
                            node.node2Context.updateVisible();
                        }
                    }
                }
            }
        }
        setTypePrime(ifcType, update = true) {
            this._hiddenTypes.delete(ifcType);
            if (update) {
                for (let mdl of this._pageContext.Models.values()) {
                    for (let node of mdl.node_map.values()) {
                        if (node.ifcType != ifcType)
                            continue;
                        if (this.is3D) {
                            node.node3Context.isPrimeMesh = true;
                            node.node3Context.updateVisible();
                        }
                        else {
                            node.node2Context.isPrimeMesh = true;
                            node.node2Context.isPrimeLine = true;
                            node.node2Context.updateVisible();
                        }
                    }
                }
            }
        }
        getTypeVisibles() {
            let result = [];
            for (let typ of this._pageContext.IfcTypes
                .sort((a_, b_) => String.Compare(a_, b_, true))) {
                result.push({
                    ifcType: typ,
                    show: !this._hiddenTypes.has(typ)
                });
            }
            return result;
        }
    }
    KBim.ViewContext = ViewContext;
})(KBim || (KBim = {}));
var Kac;
(function (Kac) {
    class KacNode {
        constructor() {
            this._hnd = (++KacNode.s_hnd);
            this._lodState = 0;
            this._isSelected = false;
            this._isHilighted = false;
            this._inLoadingQueue = false;
        }
        get HND() {
            return this._hnd;
        }
        get LABEL() {
            if (!String.IsNullOrEmpty(this.longName))
                return this.longName;
            if (!String.IsNullOrEmpty(this.ifcName))
                return this.ifcName;
            return "[" + this.IFC_TYPE + "]";
        }
        get IFC_TYPE() {
            if (this.ifcType == "Model")
                return "";
            return this.ifcType.replace("IFC", "");
        }
        get KEY_ID() {
            return this.HND;
        }
        get KEY_PID() {
            let prnt = this.parent;
            if (prnt == null)
                return -1;
            return prnt.HND;
        }
        get IsSpace() {
            return this.ifcType == "IFCSPACE";
        }
        get LoadOrder() {
            if (this.IsSpace)
                return 100;
            if (this.ifcType == "IFCPIPESEGMENT")
                return 101;
            if (this.ifcType == "IFCFURNISHINGELEMENT")
                return 103;
            return 0;
        }
        get model() {
            if (this instanceof Kac.KacModel)
                return this;
            return this._mdl;
        }
        set model(value) {
            this._mdl = value;
        }
        get parent() {
            return this._parent;
        }
        get children() {
            var _a;
            return (_a = this._children) !== null && _a !== void 0 ? _a : [];
        }
        get min() {
            var _a;
            if (this._min == null) {
                var min_ = U1.Vector3.MaxValue;
                if (this.geomMin != null)
                    min_.Minimize(this.geomMin);
                (_a = this._children) === null || _a === void 0 ? void 0 : _a.forEach(o_ => {
                    if (o_ instanceof KacNode)
                        min_.Minimize(o_.min);
                });
                if (!min_.IsMaxValue)
                    this._min = min_;
            }
            return this._min;
        }
        get max() {
            var _a;
            if (this._max == null) {
                var max_ = U1.Vector3.MinValue;
                if (this.geomMax != null)
                    max_.Maximize(this.geomMax);
                (_a = this._children) === null || _a === void 0 ? void 0 : _a.forEach(o_ => {
                    if (o_ instanceof KacNode)
                        max_.Maximize(o_.max);
                });
                if (!max_.IsMinValue)
                    this._max = max_;
            }
            return this._max;
        }
        get mesh() {
            return this._mesh;
        }
        set mesh(value) {
            this._mesh = value;
        }
        readJson(json) {
            this.geomMin = new U1.Vector3();
            this.geomMax = new U1.Vector3();
            this.fnum = parseInt(json["fnum"]);
            this.geomMin.X = parseFloat(json["minX"]);
            this.geomMin.Y = parseFloat(json["minY"]);
            this.geomMin.Z = parseFloat(json["minZ"]);
            this.geomMax.X = parseFloat(json["maxX"]);
            this.geomMax.Y = parseFloat(json["maxY"]);
            this.geomMax.Z = parseFloat(json["maxZ"]);
            this.hasGeom = parseInt(json["hasGeom"]);
            if (U1.Vector3.Equals(this.geomMin, this.geomMax)) {
                this.geomMin = undefined;
                this.geomMax = undefined;
            }
            else {
                this.geomCent = U1.Vector3
                    .Add(this.geomMax, this.geomMin);
                this.geomCent.Scale(0.5);
                this.geomRad = U1.Vector3.Distance(this.geomCent, this.geomMax);
            }
            this.ifcLabel = json["label"];
            this.ifcId = json["id"];
            this.ifcName = json["name"];
            this.ifcPid = json["pid"];
            this.ifcType = json["ifcType"];
            this.globalId = json["globalId"];
            this.tag = json["tag"];
            this.desc = json["desc"];
            this.longName = json["longName"];
            this.compositionType = json["compositionType"];
            this.pSets = json["pSets"];
            this.hasLOD = parseInt(json["hasLOD"]);
            this.lod1 = json["lod1"];
            this.attr1 = json["attr1"];
            this.attr2 = json["attr2"];
            this.attr3 = json["attr3"];
            this.attr4 = json["attr4"];
            this.attr5 = json["attr5"];
            this.attr6 = json["attr6"];
            this.attr7 = json["attr7"];
            this.attr8 = json["attr8"];
            this.attr9 = json["attr9"];
            this.attr10 = json["attr10"];
        }
        removeChildNode(ch) {
            if (this._children == null)
                return;
            let idx = this._children.indexOf(ch);
            if (idx > -1)
                this._children.splice(idx, 1);
        }
        addChildNode(ch) {
            var _a;
            if (this._children == null)
                this._children = [];
            (_a = ch._parent) === null || _a === void 0 ? void 0 : _a.removeChildNode(ch);
            ch._parent = this;
            this._children.push(ch);
        }
        collectNodes(collection) {
            collection.push(this);
            if (this._children != null) {
                for (let ch of this._children) {
                    ch.collectNodes(collection);
                }
            }
        }
        findAncestor(type) {
            var _a;
            if (this._parent instanceof type)
                return this._parent;
            return (_a = this._parent) === null || _a === void 0 ? void 0 : _a.findAncestor(type);
        }
        updateVisible(visCtx) {
            if (!this.hasGeom || !this.geomCent)
                return;
            if (this.isPrime == undefined) {
                this.isPrime = false;
                let primeEl = document.querySelector('#prime');
                if (primeEl == null) {
                    primeEl = document.querySelector('#prime_' + this.model.fnum);
                }
                let sceneObj = primeEl === null || primeEl === void 0 ? void 0 : primeEl.object3D;
                if (sceneObj != null) {
                    this._mesh = KacNode.getMesh(sceneObj, "#" + this.ifcId);
                    if (this._mesh != null) {
                        this.isPrime = true;
                        this._isMeshLoaded = true;
                        return;
                    }
                }
            }
            if (this.isPrime) {
                this.hideTempBBX();
                return;
            }
            this._outOfScreen = true;
            try {
                let dist = U1.Vector3.Distance(visCtx.camPos, this.geomCent);
                dist -= (this.geomRad);
                if (dist > visCtx.disposeDist) {
                    this.disposeMesh();
                    this.hideTempBBX();
                }
                else if (dist > visCtx.hideDist) {
                    this.hideMesh();
                    this.hideTempBBX();
                }
                else {
                    this._outOfScreen = false;
                    if (this._mesh == null) {
                        this.loadMesh();
                    }
                    else {
                        if (this.mesh.parent == null)
                            this.showMesh();
                    }
                }
                if (dist < visCtx.hideLodDist) {
                    if (this._mesh == null || this._mesh.parent == null) {
                        this.showLOD();
                    }
                    else {
                        this.hideLOD();
                    }
                }
                else {
                    this.hideLOD();
                }
            }
            catch (ex) {
                var msgEl = document.querySelector('#msg');
            }
        }
        loadMesh() {
            if (this._isLoading || this._isMeshLoaded)
                return;
            this.showTempBBX();
            this._isLoading = true;
            var msgEl = document.querySelector('#msg');
            var fileURL = "product?prj=" + this.model.prjNum
                + "&model=" + this.model.mdlNum
                + "&eid=" + this.ifcId
                + "&file=" + "gltf";
            let opt = {
                url: fileURL,
                prjNum: this.model.prjNum,
                mdlNum: this.model.mdlNum,
                ifcId: this.model.ifcId,
                geomCent: this.geomCent,
                node: this,
                onLoad: (gltf) => {
                    this.mesh = gltf.scene;
                    this._isMeshLoaded = true;
                    this._isLoading = false;
                    if (!this._outOfScreen)
                        this.showMesh();
                    this.hideTempBBX();
                },
                queryCancel: () => {
                    return this._outOfScreen;
                },
                onCancel: () => {
                    this.hideTempBBX();
                    this._isLoading = false;
                },
                onError: () => {
                    this.hideTempBBX();
                    this._isMeshLoaded = true;
                    this._isLoading = false;
                }
            };
            Kac.KacGLTFLoader.instance.load(opt);
        }
        showMesh() {
            var _a;
            let world = this.model.rootObj;
            let mesh = this._mesh;
            if (mesh != null && mesh.parent != world) {
                (_a = mesh.parent) === null || _a === void 0 ? void 0 : _a.remove(mesh);
                world.add(mesh);
            }
        }
        hideMesh() {
            var _a;
            let mesh = this._mesh;
            if (mesh != null && mesh.parent != null) {
                (_a = mesh.parent) === null || _a === void 0 ? void 0 : _a.remove(mesh);
            }
        }
        disposeMesh() {
            var _a;
            let mesh3 = this._mesh;
            if (mesh3 == null)
                return;
            (_a = mesh3.parent) === null || _a === void 0 ? void 0 : _a.remove(mesh3);
            KacNode.disposeOject(this._mesh);
            this._mesh = null;
            this._isMeshLoaded = false;
        }
        static disposeOject(obj) {
            var _a;
            let meshOrline = obj;
            if (meshOrline) {
                (_a = meshOrline.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
                if (Array.isArray(meshOrline.material)) {
                    for (let mat of meshOrline.material) {
                        mat.dispose();
                    }
                }
                else if (meshOrline.material instanceof THREE.Material) {
                    meshOrline.material.dispose();
                }
            }
            else if (obj instanceof THREE.Group) {
                for (let ch of obj.children) {
                    KacNode.disposeOject(ch);
                }
            }
        }
        static getMesh(obj3d, name) {
            if (obj3d.children == null)
                return null;
            for (let ch of obj3d.children) {
                if (ch.name == name)
                    return ch;
            }
            for (let ch of obj3d.children) {
                let res = KacNode.getMesh(ch, name);
                if (res != null)
                    return res;
            }
            return null;
        }
        showTempBBX() {
            if (this._bbxObj == null) {
                if (KacNode._bbxGeom == null) {
                    var bc = [
                        new THREE.Vector3(-0.5, -0.5, -0.5),
                        new THREE.Vector3(0.5, -0.5, -0.5),
                        new THREE.Vector3(0.5, 0.5, -0.5),
                        new THREE.Vector3(-0.5, 0.5, -0.5),
                        new THREE.Vector3(-0.5, -0.5, 0.5),
                        new THREE.Vector3(0.5, -0.5, 0.5),
                        new THREE.Vector3(0.5, 0.5, 0.5),
                        new THREE.Vector3(-0.5, 0.5, 0.5)
                    ];
                    var points = [
                        bc[0], bc[1], bc[1], bc[2], bc[2], bc[3], bc[3], bc[0],
                        bc[4], bc[5], bc[5], bc[6], bc[6], bc[7], bc[7], bc[4],
                        bc[0], bc[4],
                        bc[1], bc[5],
                        bc[2], bc[6],
                        bc[3], bc[7]
                    ];
                    KacNode._bbxGeom = new THREE.BufferGeometry().setFromPoints(points);
                }
                if (KacNode._bbxMat == null) {
                    KacNode._bbxMat = new THREE.LineBasicMaterial({ color: 0xA0A0A0 });
                }
                this._bbxObj = new THREE.LineSegments(KacNode._bbxGeom, KacNode._bbxMat);
                let w = this.geomMax.X - this.geomMin.X;
                let l = this.geomMax.Y - this.geomMin.Y;
                let h = this.geomMax.Z - this.geomMin.Z;
                let cent = this.geomCent;
                this._bbxObj.scale.set(w, l, h);
                this._bbxObj.position.set(cent.X, cent.Y, cent.Z);
                let world = this.model.rootObj;
                world.add(this._bbxObj);
            }
        }
        hideTempBBX() {
            var _a;
            if (this._bbxObj == null)
                return;
            (_a = this._bbxObj.parent) === null || _a === void 0 ? void 0 : _a.remove(this._bbxObj);
            this._bbxObj = null;
        }
        showLOD() {
            var _a, _b;
            if (this.hasLOD == 0)
                return;
            if (this._mesh != null && this._mesh.parent != null) {
                this.hideLOD();
                return;
            }
            if (this._lodState < 0)
                return;
            if ((this.hasLOD & 1) != 1) {
                this._lodState = -1;
                return;
            }
            if (this._lodObj == null && this.lod1 != null) {
                this._lodObj = new THREE.Group();
                let boxstrs = this.lod1.split(';');
                for (let i = 0; i < boxstrs.length; i++) {
                    let vals = boxstrs[i].split(',')
                        .map(v_ => parseFloat(v_));
                    let clr = new THREE.Color(vals[0], vals[1], vals[2]);
                    let mat = new THREE.MeshLambertMaterial({ color: clr, opacity: vals[3] });
                    let m4 = new THREE.Matrix4();
                    vals = vals.slice(4);
                    m4.set(vals[0], vals[4], vals[8], vals[12], vals[1], vals[5], vals[9], vals[13], vals[2], vals[6], vals[10], vals[14], vals[3], vals[7], vals[11], vals[15]);
                    if (KacNode._lodGeom == null) {
                        KacNode._lodGeom = new THREE.BoxBufferGeometry();
                    }
                    if (vals[0] < 0.001 && vals[5] < 0.001 && vals[10] < 0.001)
                        continue;
                    let mesh = new THREE.Mesh(KacNode._lodGeom, mat);
                    mesh.applyMatrix4(m4);
                    this._lodObj.add(mesh);
                }
                this._lodState = 2;
                (_a = this._bbxObj) === null || _a === void 0 ? void 0 : _a.parent.remove(this._bbxObj);
                this._bbxObj = null;
            }
            if (this._lodObj != null) {
                let world = this.model.rootObj;
                if (this._lodObj.parent == world)
                    return;
                (_b = this._lodObj.parent) === null || _b === void 0 ? void 0 : _b.remove(this._lodObj);
                world.add(this._lodObj);
                return;
            }
        }
        hideLOD() {
            var _a;
            if (this._lodObj == null)
                return;
            (_a = this._lodObj.parent) === null || _a === void 0 ? void 0 : _a.remove(this._lodObj);
        }
    }
    KacNode.s_hnd = 0;
    Kac.KacNode = KacNode;
})(Kac || (Kac = {}));
var Kac;
(function (Kac) {
    class KacBuilding extends Kac.KacNode {
    }
    Kac.KacBuilding = KacBuilding;
})(Kac || (Kac = {}));
var Kac;
(function (Kac) {
    ;
    class KacGLTFLoader {
        constructor() {
            this.queue = [];
            this._isLoading = false;
            this.camCent = U1.Vector3.Zero;
        }
        load(opt) {
            if (opt.node._inLoadingQueue)
                return;
            this.queue.push(opt);
            opt.node._inLoadingQueue = true;
            if (this._isLoading) {
                return;
            }
            this.loadNext();
        }
        loadNext() {
            if (this.queue.length == 0) {
                this._isLoading = false;
                return;
            }
            this._isLoading = true;
            let nearOpt = null;
            let minDist = Number.MAX_VALUE;
            for (let i = this.queue.length - 1; i >= 0; i--) {
                let opt = this.queue[i];
                if (opt.queryCancel != null && opt.queryCancel() == true) {
                    opt.onCancel();
                    opt.node._inLoadingQueue = false;
                    this.queue.splice(i, 1);
                    continue;
                }
                let dist = U1.Vector3.DistanceSquared(opt.geomCent, this.camCent);
                if (dist < minDist) {
                    dist = minDist;
                    nearOpt = opt;
                }
            }
            if (nearOpt == null) {
                this._isLoading = false;
                return;
            }
            this.queue.splice(this.queue.indexOf(nearOpt), 1);
            nearOpt.node._inLoadingQueue = false;
            const loader = new THREE.GLTFLoader();
            loader.load(nearOpt.url, (gltf) => {
                nearOpt.onLoad(gltf);
                this._isLoading = false;
                this.loadNext();
            }, (xhr) => {
                if (nearOpt.onProgress != null)
                    nearOpt.onProgress(xhr);
            }, (error) => {
                this._isLoading = false;
                if (nearOpt.onError != null)
                    nearOpt.onError(error);
                this.loadNext();
            });
        }
    }
    KacGLTFLoader.instance = new KacGLTFLoader();
    Kac.KacGLTFLoader = KacGLTFLoader;
})(Kac || (Kac = {}));
var Kac;
(function (Kac) {
    class KacModel extends Kac.KacNode {
        constructor() {
            super(...arguments);
            this.node_map = new Map();
        }
        readJson(json) {
            this.visibleNodes = [];
            this._children = [];
            if (Array.isArray(json)) {
                let storey = null;
                for (var elm of json) {
                    let node;
                    if (elm["ifcType"] == "IFCSITE")
                        node = new Kac.KacSite();
                    else if (elm["ifcType"] == "IFCBUILDING")
                        node = new Kac.KacBuilding();
                    else if (elm["ifcType"] == "IFCBUILDINGSTOREY")
                        node = new Kac.KacStorey();
                    else
                        node = new Kac.KacNode();
                    node.readJson(elm);
                    if (node instanceof Kac.KacStorey && this.stryNum == node.ifcId) {
                        storey = node;
                    }
                    if (node.ifcType == "Model") {
                        super.readJson(elm);
                    }
                    else {
                        this.node_map.set(node.ifcId, node);
                        node.model = this;
                    }
                }
                if (storey != null)
                    this.addChildNode(storey);
                for (let entry of this.node_map.entries()) {
                    let ifcNode = entry[1];
                    if (ifcNode instanceof Kac.KacSite) {
                        if (storey == null)
                            this.addChildNode(ifcNode);
                    }
                    else if (ifcNode == storey) {
                        continue;
                    }
                    else if (ifcNode.ifcPid != null) {
                        let pnode = this.node_map.get(ifcNode.ifcPid);
                        pnode === null || pnode === void 0 ? void 0 : pnode.addChildNode(ifcNode);
                    }
                }
                let visibleNodes = [];
                for (let ch of this._children) {
                    ch.collectNodes(visibleNodes);
                }
                this.visibleNodes = visibleNodes;
                this.storey = storey;
            }
        }
        updateVisible(visCtx) {
            if (this.visibleNodes == null)
                return;
            for (let nd of this.visibleNodes) {
                if (nd.ifcType == "IFCSPACE" ||
                    (this.storey != null && nd.ifcType == "IFCCOVERING"))
                    continue;
                nd.updateVisible(visCtx);
            }
        }
    }
    Kac.KacModel = KacModel;
})(Kac || (Kac = {}));
var Kac;
(function (Kac) {
    class KacModelComponent {
        init(afComp) {
            this._afComp = afComp;
            let el = afComp.el;
            this._model = new Kac.KacModel();
            this._model.rootObj = new THREE.Group();
            let rootObj = el.object3D;
            this._rootObj = rootObj;
            rootObj.add(this._model.rootObj);
            this._model.prjNum = afComp.data.prj;
            this._model.mdlNum = afComp.data.mdl;
            this._model.stryNum = afComp.data.stry;
            Kac.KacModelLoader.instance.addModel(this._model);
            let ps = [];
            let seg = 24;
            let da = Math.PI * 2 / seg;
            let bp0;
            let tp0;
            for (let i = 0; i <= seg; i++) {
                let a = i * da;
                let x = Math.cos(a) * 0.5;
                let y = Math.sin(a) * 0.5;
                let bp1 = new THREE.Vector3(x, y, 0);
                let tp1 = new THREE.Vector3(x, y, 1);
                ps.push(bp1, tp1);
                if (i > 0) {
                    ps.push(bp0, bp1);
                    ps.push(tp0, tp1);
                }
                bp0 = bp1;
                tp0 = tp1;
            }
            this._camBG = new THREE.BufferGeometry().setFromPoints(ps);
            this._camBM = new THREE.LineBasicMaterial({ color: 0xFFA0A0 });
            this._camBO = new THREE.LineSegments(this._camBG, this._camBM);
        }
        update(afComp, oldData) {
        }
        remove(afComp) {
            let el = afComp.el;
            let rootObj = el.object3D;
            rootObj.remove(this._model.rootObj);
        }
        tick(afComp, time, timeDelt) {
            let el = afComp.el;
            let sceneEl = el.sceneEl;
            let v0 = KacModelComponent._v0;
            v0.set(0, 0, 0);
            var camEl = document.querySelector('#cam');
            var camObj = camEl.object3D;
            var cammat = camObj.matrixWorld;
            let campos = v0.applyMatrix4(cammat);
            let camdir = KacModelComponent._v1.set(cammat.elements[8], cammat.elements[9], cammat.elements[10]);
            let visCtx = this._model.storey == null ?
                Kac.KacVisibleContext.default :
                Kac.KacVisibleContext.storey;
            let invm = KacModelComponent._m0.getInverse(this._rootObj.matrixWorld);
            campos.applyMatrix4(invm);
            visCtx.camPos.Set(campos.x, campos.y, campos.z);
            visCtx.camDir.Set(camdir.x, camdir.y, camdir.z);
            Kac.KacGLTFLoader.instance.camCent.Set(campos.x, campos.y, campos.z);
            this._model.updateVisible(visCtx);
        }
    }
    KacModelComponent._v0 = new THREE.Vector3();
    KacModelComponent._v1 = new THREE.Vector3();
    KacModelComponent._m0 = new THREE.Matrix4();
    Kac.KacModelComponent = KacModelComponent;
})(Kac || (Kac = {}));
var Kac;
(function (Kac) {
    class KacModelLoader {
        constructor() {
            this._models = [];
            this._isLoading = false;
        }
        addModel(mdl) {
            this._models.push(mdl);
            if (!this._isLoading)
                this.loadModel();
        }
        loadModel() {
            if (this._models.length == 0) {
                this._isLoading = false;
                return;
            }
            this._isLoading = true;
            let mdl = this._models.shift();
            var fnum = mdl.mdlNum;
            var prjNo = mdl.prjNum;
            $.ajax({
                url: `products?prj=${prjNo}&fnum=${fnum}`
            })
                .done((data) => {
                mdl.readJson(data);
            })
                .always(() => {
                this.loadModel();
            });
            ;
        }
    }
    KacModelLoader.instance = new KacModelLoader();
    Kac.KacModelLoader = KacModelLoader;
})(Kac || (Kac = {}));
var Kac;
(function (Kac) {
    class KacSite extends Kac.KacNode {
    }
    Kac.KacSite = KacSite;
})(Kac || (Kac = {}));
var Kac;
(function (Kac) {
    class KacStorey extends Kac.KacNode {
    }
    Kac.KacStorey = KacStorey;
})(Kac || (Kac = {}));
var Kac;
(function (Kac) {
    class KacVisibleContext {
        constructor() {
            this.camPos = new U1.Vector3();
            this.camDir = new U1.Vector3();
            this.hideDist = 20;
            this.hideDistSq = 400;
            this.disposeDist = 50;
            this.disposeDistSq = 2500;
            this.hideLodDist = 100;
            this.hideLodDistSq = 10000;
            this.orign = new U1.Vector3();
        }
        static get storey() {
            if (KacVisibleContext._storey == null) {
                KacVisibleContext._storey = new KacVisibleContext();
                KacVisibleContext._storey.hideDist = 5;
                KacVisibleContext._storey.hideDistSq = 25;
                KacVisibleContext._storey.disposeDist = 10;
                KacVisibleContext._storey.disposeDistSq = 100;
                KacVisibleContext._storey.hideLodDist = 50;
                KacVisibleContext._storey.disposeDistSq = 2500;
            }
            return KacVisibleContext._storey;
        }
    }
    KacVisibleContext.default = new KacVisibleContext();
    Kac.KacVisibleContext = KacVisibleContext;
})(Kac || (Kac = {}));
var KBim;
(function (KBim) {
    class KmNode extends U1.UNode {
        constructor() {
            super(...arguments);
            this._isSelected = false;
            this._isHilighted = false;
        }
        get LABEL() {
            if (!String.IsNullOrEmpty(this.longName))
                return this.longName;
            if (!String.IsNullOrEmpty(this.ifcName))
                return this.ifcName;
            return "[" + this.IFC_TYPE + "]";
        }
        get IFC_TYPE() {
            if (this.ifcType == "Model")
                return "";
            return this.ifcType.replace("IFC", "");
        }
        get KEY_ID() {
            return this.HND;
        }
        get KEY_PID() {
            let prnt = this.Parent;
            if (prnt == null)
                return -1;
            return prnt.HND;
        }
        get IsSpace() {
            return this.ifcType == "IFCSPACE";
        }
        get LoadOrder() {
            if (this.IsSpace)
                return 100;
            if (this.ifcType == "IFCPIPESEGMENT")
                return 101;
            if (this.ifcType == "IFCFURNISHINGELEMENT")
                return 103;
            return 0;
        }
        get Model() {
            if (this instanceof KBim.KmModel)
                return this;
            return this._mdl;
        }
        set Model(value) {
            this._mdl = value;
        }
        get node3Context() {
            if (this._node3Context == null)
                this._node3Context = new KBim.KmNode_ViewContext(this, true);
            return this._node3Context;
        }
        get node2Context() {
            if (this._node2Context == null)
                this._node2Context = new KBim.KmNode_View2Context(this);
            return this._node2Context;
        }
        get Parent() {
            return this._parent;
        }
        get Children() {
            var _a;
            return (_a = this._children) !== null && _a !== void 0 ? _a : [];
        }
        get Min() {
            var _a;
            if (this._min == null) {
                var min_ = U1.Vector3.MaxValue;
                if (this.geomMin != null)
                    min_.Minimize(this.geomMin);
                (_a = this._children) === null || _a === void 0 ? void 0 : _a.forEach(o_ => {
                    if (o_ instanceof KmNode)
                        min_.Minimize(o_.Min);
                });
                if (!min_.IsMaxValue)
                    this._min = min_;
            }
            return this._min;
        }
        get Max() {
            var _a;
            if (this._max == null) {
                var max_ = U1.Vector3.MinValue;
                if (this.geomMax != null)
                    max_.Maximize(this.geomMax);
                (_a = this._children) === null || _a === void 0 ? void 0 : _a.forEach(o_ => {
                    if (o_ instanceof KmNode)
                        max_.Maximize(o_.Max);
                });
                if (!max_.IsMinValue)
                    this._max = max_;
            }
            return this._max;
        }
        get Mesh3() {
            return this.node3Context.mesh;
        }
        set Mesh3(value) {
            this.node3Context.mesh = value;
        }
        get Mesh2() {
            return this.node2Context.mesh;
        }
        set Mesh2(value) {
            this.node2Context.mesh = value;
        }
        get Line3() {
            return this.node3Context.line;
        }
        set Line3(value) {
            this.node3Context.line = value;
        }
        get Line2() {
            return this.node2Context.line;
        }
        set Line2(value) {
            this.node2Context.line = value;
        }
        get IsSelected() {
            return this._isSelected;
        }
        get IsHilighted() {
            return this._isHilighted;
        }
        removeChildNode(ch) {
            if (this._children == null)
                return;
            let idx = this._children.indexOf(ch);
            if (idx > -1)
                this._children.splice(idx, 1);
        }
        addChildNode(ch) {
            var _a;
            if (this._children == null)
                this._children = [];
            (_a = ch._parent) === null || _a === void 0 ? void 0 : _a.removeChildNode(ch);
            ch._parent = this;
            this._children.push(ch);
        }
        findAncestor(type) {
            var _a;
            if (this._parent instanceof type)
                return this._parent;
            return (_a = this._parent) === null || _a === void 0 ? void 0 : _a.findAncestor(type);
        }
        SetIsSelected(isSelected) {
            this._isSelected = isSelected;
            this.updatVCVisible();
        }
        SetHilight(isHilighted) {
            this._isHilighted = isHilighted;
            this.node2Context.updateVisible();
            this.node3Context.updateVisible();
        }
        SetHidden3(isHidden, ifcType = "all", recursive) {
            this.node3Context.setHiddenMesh(isHidden, ifcType, recursive);
        }
        SetHidden2(isHidden, ifcType = "all", recursive) {
            this.node2Context.setHiddenMesh(isHidden, ifcType, recursive);
        }
        ReadJson(json) {
            this.geomMin = new U1.Vector3();
            this.geomMax = new U1.Vector3();
            this.fnum = json["fnum"];
            this.geomMin.X = parseFloat(json["minX"]);
            this.geomMin.Y = parseFloat(json["minY"]);
            this.geomMin.Z = parseFloat(json["minZ"]);
            this.geomMax.X = parseFloat(json["maxX"]);
            this.geomMax.Y = parseFloat(json["maxY"]);
            this.geomMax.Z = parseFloat(json["maxZ"]);
            this.hasGeom = parseInt(json["hasGeom"]);
            this.hasLOD = parseInt(json["hasLOD"]);
            this.lod1 = json["lod1"];
            if (U1.Vector3.Equals(this.geomMin, this.geomMax)) {
                this.geomMin = undefined;
                this.geomMax = undefined;
            }
            else {
                this.geomCent = U1.Vector3
                    .Add(this.geomMax, this.geomMin);
                this.geomCent.Scale(0.5);
                this.geomRad = U1.Vector3.Distance(this.geomCent, this.geomMax);
            }
            this.ifcLabel = json["label"];
            this.ifcId = json["id"];
            this.ifcName = json["name"];
            this.ifcPid = json["pid"];
            this.ifcType = json["ifcType"];
            this.globalId = json["globalId"];
            this.tag = json["tag"];
            this.desc = json["desc"];
            this.longName = json["longName"];
            this.compositionType = json["compositionType"];
            this.pSets = json["pSets"];
            this.attr1 = json["attr1"];
            this.attr2 = json["attr2"];
            this.attr3 = json["attr3"];
            this.attr4 = json["attr4"];
            this.attr5 = json["attr5"];
            this.attr6 = json["attr6"];
            this.attr7 = json["attr7"];
            this.attr8 = json["attr8"];
            this.attr9 = json["attr9"];
            this.attr10 = json["attr10"];
        }
        updatVCVisible() {
            var _a, _b;
            (_a = this._node3Context) === null || _a === void 0 ? void 0 : _a.updateVisible();
            (_b = this._node2Context) === null || _b === void 0 ? void 0 : _b.updateVisible();
        }
        updateVisibe(context) {
            if (this.geomCent == null) {
                return;
            }
            if (context.Is3D)
                this.updateVisibe3(context);
            else
                this.updateVisibe2(context);
        }
        updateVisibe3(context) {
            let nodeCtx = this.node3Context;
            if (nodeCtx.isPrimeMesh) {
                if (nodeCtx.mesh != null && nodeCtx.mesh.parent == null)
                    nodeCtx.showMesh();
                return;
            }
            if (nodeCtx.mesh == null && this.hasLOD == 0) {
                return;
            }
            let dist = U1.Vector3.Distance(context.CamPos, this.geomCent);
            dist -= this.geomRad;
            if (dist > context.DisposeDetailDist) {
                if (!nodeCtx.isPrimeMesh)
                    nodeCtx.disposeMesh();
                else
                    nodeCtx.hideMesh();
                if (!nodeCtx.isPrimeLine)
                    nodeCtx.disposeLine();
                else
                    nodeCtx.hideLine();
            }
            else if (dist > context.HideDetailDist) {
                nodeCtx.hideMesh();
                nodeCtx.hideLine();
            }
            else {
                if (nodeCtx.mesh != null && nodeCtx.mesh.parent == null)
                    nodeCtx.showMesh();
            }
            if (dist < context.HideLodDist) {
                if (nodeCtx.mesh == null || nodeCtx.mesh.parent == null) {
                    nodeCtx.showLOD();
                }
                else {
                    nodeCtx.hideLOD();
                }
            }
            else {
                nodeCtx.hideLOD();
            }
        }
        updateVisibe2(context) {
            var _a;
            let nodeCtx = this.node2Context;
            if (!nodeCtx.hasMesh) {
                return;
            }
            let res = KmNode._ck_res;
            let visible_state = context.check2D(this, res);
            if (visible_state == -1) {
                if (!nodeCtx.isPrimeMesh)
                    nodeCtx.disposeMesh();
                else
                    nodeCtx.hideMesh();
                if (!nodeCtx.isPrimeLine)
                    nodeCtx.disposeLine();
                else
                    nodeCtx.hideLine();
            }
            else if (visible_state == 0) {
                nodeCtx.hideMesh();
                nodeCtx.hideLine();
            }
            else if (visible_state == 1) {
                if (nodeCtx.mesh.parent == null)
                    nodeCtx.showMesh();
                if (nodeCtx.line != null && ((_a = nodeCtx.line) === null || _a === void 0 ? void 0 : _a.parent) == null)
                    this.node2Context.showLine();
            }
            if (res.dist < context.HideLodDist) {
                if (nodeCtx.mesh == null || nodeCtx.mesh.parent == null) {
                    nodeCtx.showLOD();
                }
                else {
                    nodeCtx.hideLOD();
                }
            }
            else {
                nodeCtx.hideLOD();
            }
        }
    }
    KmNode._t0 = new U1.Vector3();
    KmNode._ck_res = { dist: 0 };
    KBim.KmNode = KmNode;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmBuilding extends KBim.KmNode {
        get KmStoreys() {
            return this.GetChildren(KBim.KmStorey);
        }
    }
    KBim.KmBuilding = KmBuilding;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    ;
    class KmGLTFLoader {
        constructor() {
            this.queue = [];
            this._isLoading = false;
        }
        static get instance() {
            if (KmGLTFLoader._instance == null) {
                KmGLTFLoader._instance = new KmGLTFLoader();
            }
            return KmGLTFLoader._instance;
        }
        load(opt) {
            this.queue.push(opt);
            if (this._isLoading) {
                return;
            }
            this.loadNext();
        }
        loadNext() {
            if (this.queue.length == 0)
                return;
            this._isLoading = true;
            let opt = this.queue[0];
            this.queue.splice(0, 1);
            const loader = new THREE.GLTFLoader();
            loader.load(opt.url, (gltf) => {
                opt.onLoad(gltf);
                this._isLoading = false;
                this.loadNext();
            }, (xhr) => {
                opt.onProgress(xhr);
            }, (error) => {
                this._isLoading = false;
                opt.onError(error);
                this.loadNext();
            });
        }
    }
    KBim.KmGLTFLoader = KmGLTFLoader;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmLine2Loader {
        constructor() {
            this._models = [];
            this._queue = [];
            this._auto_queue = [];
            this._waitingCount = 0;
            this._loadedCount = 0;
            this._autoLoadDisSq = 400;
            this._running = false;
        }
        get loadedCount() {
            return this._loadedCount;
        }
        get waitingCount() {
            return this._waitingCount;
        }
        get isRunning() {
            return this._running;
        }
        addModel(model) {
            if (this._models.Contains(model))
                return;
            this._models.push(model);
        }
        removeModel(model) {
            if (!this._models.Contains(model))
                return;
            this._models.splice(this._models.indexOf(model), 1);
        }
        dequeue(node) {
            let idx = this._queue.indexOf(node);
            if (idx >= 0) {
                node.node2Context._inLineQueue = undefined;
                this._queue.splice(idx, 1);
            }
        }
        clear() {
            this._queue.forEach(o_ => o_.node2Context._inLineQueue = undefined);
            this._queue.length = 0;
            this._waitingCount = 0;
            this._loadedCount = 0;
        }
        queue(node) {
            if (node.node2Context.hasLine)
                return;
            if (this._queue.indexOf(node) >= 0)
                return;
            node.node2Context._inLineQueue = true;
            this._queue.push(node);
            this._waitingCount++;
            this.start();
        }
        start() {
            if (this._waiting == null) {
                let loading = KBim.ViewPageContext.instance.LoadingBar2;
                let loadingvalue = KBim.ViewPageContext.instance.LoadingValue2;
                this._waitingCount = 0;
                this._waitingCount = this._queue.length;
                $(loading).off("click");
                $(loading).on("click", e_ => {
                    this.clear();
                });
                $(loading).css("cursor", "pointer");
                if (loading != null)
                    loading.hidden = false;
                if (loadingvalue != null)
                    loadingvalue.hidden = false;
            }
            if (!this._running) {
                this._running = true;
                this.loadNext();
            }
        }
        stop() {
            this._running = false;
        }
        getNext() {
            this._auto_queue.length = 0;
            let visibleCtx = KBim.KVisibleContext.get2D(KBim.ViewPageContext.instance.View2, KBim.KVisibleContext._vc2);
            var scene = KBim.ViewPageContext.instance.View2.Scene;
            var cam = scene.Camera;
            var dir = cam.GetDirection();
            var pos = cam.Position;
            var v0 = U1.Vector3.Zero;
            for (let mdl of this._models) {
                if (mdl.model2Context.autoLineDownload) {
                    for (let node of mdl.model2Context.not_loaded_line) {
                        if (node.hasGeom != 1
                            || node.node2Context.isLineLoaded
                            || node.node2Context._inLineQueue == true
                            || node.node2Context.getActualHiddenLine())
                            continue;
                        if (node.geomCent == null) {
                            node.node2Context.onErrorLineLoad();
                            continue;
                        }
                        let visible_state = visibleCtx.check2D(node);
                        if (visible_state == 1)
                            this._auto_queue.push(node);
                    }
                }
            }
            this._auto_queue.AddRange(this._queue);
            if (this._auto_queue.length == 0)
                return null;
            let min_rad;
            let min_dist;
            let next;
            let next_idx = -1;
            let isHilighted = false;
            let loadOrder = 100000;
            for (var i = 0; i < this._auto_queue.length; i++) {
                let node = this._auto_queue[i];
                if (node.node2Context.hasLine || node.node2Context.isLineLoaded) {
                    if (node.node2Context._inLineQueue) {
                        this._loadedCount++;
                        this.dequeue(node);
                    }
                    continue;
                }
                if (isHilighted && !node.IsHilighted && !node.IsSelected)
                    continue;
                let geomCent = node.geomCent;
                if (geomCent == null) {
                    if (node.node2Context._inLineQueue) {
                        this._loadedCount++;
                        this.dequeue(node);
                    }
                    continue;
                }
                v0.Set(geomCent);
                v0.Subtract(pos);
                let dt = U1.Vector3.Dot(v0, dir);
                if (dt < 0)
                    continue;
                v0 = U1.Vector3.ScaleAdd(pos, dt, dir, v0);
                let radsq = U1.Vector3.DistanceSquared(v0, geomCent);
                if (radsq < 0.5) {
                    radsq = 0;
                }
                if (!isHilighted && (node.IsHilighted || node.IsSelected)) {
                    isHilighted = true;
                    next = this._auto_queue[i];
                    next_idx = i;
                    min_dist = dt;
                    min_rad = radsq;
                    continue;
                }
                if (next == null || ((radsq <= min_rad && dt < min_dist)
                    && (radsq == 0 || node.LoadOrder <= loadOrder))) {
                    next = this._auto_queue[i];
                    loadOrder = next.LoadOrder;
                    next_idx = i;
                    min_dist = dt;
                    min_rad = radsq;
                }
            }
            if (next == null)
                next = this._auto_queue.shift();
            else {
                this._auto_queue.splice(next_idx, 1);
            }
            return next;
        }
        loadNext() {
            var scene = KBim.ViewPageContext.instance.View2.Scene;
            let loading = KBim.ViewPageContext.instance.LoadingBar2;
            let loadingvalue = KBim.ViewPageContext.instance.LoadingValue2;
            if (this._queue.length == 0 && loading.hidden == false) {
                loading.hidden = true;
                loadingvalue.hidden = true;
                loading.style.cursor = "default";
                this._waitingCount = 0;
                this._loadedCount = 0;
            }
            let next = this.getNext();
            if (!this._running || next == null) {
                if (this._running)
                    setTimeout(() => this.loadNext(), 1000);
                return;
            }
            if (this._waitingCount > 0) {
                let lc = this._loadedCount + KBim.KmMesh2Loader.instance.loadedCount;
                let wc = this._waitingCount + KBim.KmMesh2Loader.instance.waitingCount;
                loadingvalue.innerText = `${lc} / ${wc}`;
                loading.style.cursor = "pointer";
                loading.hidden = false;
                loadingvalue.hidden = false;
                $(loading).off("click");
                $(loading).on("click", e_ => {
                    this.clear();
                });
            }
            this._waiting = next;
            next.node2Context.onBeforeLineLoad();
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + next.Model.fnum
                + "&eid=" + next.ifcId
                + "&file=" + "gltf_line";
            KBim.KmGLTFLoader.instance.load({
                url: fileURL,
                onLoad: (gltf) => {
                    next.node2Context.onAfterLineLoad(gltf.scene);
                    this._waiting = null;
                    this.loadNext();
                    if (next.node2Context._inLineQueue) {
                        next.node2Context._inLineQueue = undefined;
                        this.dequeue(next);
                        this._loadedCount++;
                    }
                },
                onProgress: (xhr) => {
                },
                onError: (error) => {
                    next.node2Context.onErrorLineLoad();
                    this._waiting = null;
                    this.loadNext();
                    if (next.node2Context._inLineQueue) {
                        this.dequeue(next);
                        next.node2Context._inLineQueue = undefined;
                        this._loadedCount++;
                    }
                }
            });
        }
    }
    KmLine2Loader.instance = new KmLine2Loader();
    KBim.KmLine2Loader = KmLine2Loader;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmLine3Loader {
        constructor() {
            this._models = [];
            this._queue = [];
            this._auto_queue = [];
            this._waitingCount = 0;
            this._loadedCount = 0;
            this._autoLoadDisSq = 400;
            this._running = false;
        }
        get loadedCount() {
            return this._loadedCount;
        }
        get waitingCount() {
            return this._waitingCount;
        }
        get isRunning() {
            return this._running;
        }
        addModel(model) {
            if (this._models.Contains(model))
                return;
            this._models.push(model);
        }
        removeModel(model) {
            if (!this._models.Contains(model))
                return;
            this._models.splice(this._models.indexOf(model), 1);
        }
        dequeue(node) {
            let idx = this._queue.indexOf(node);
            if (idx >= 0) {
                node.node3Context._inLineQueue = undefined;
                this._queue.splice(idx, 1);
            }
        }
        clear() {
            this._queue.forEach(o_ => o_.node3Context._inLineQueue = undefined);
            this._queue.length = 0;
            this._waitingCount = 0;
            this._loadedCount = 0;
        }
        queue(node) {
            var _a;
            if (node.node3Context.hasLine ||
                (((_a = node.Model) === null || _a === void 0 ? void 0 : _a.space3Visible) == false && node.IsSpace))
                return;
            if (this._queue.indexOf(node) >= 0)
                return;
            node.node3Context._inLineQueue = true;
            this._queue.push(node);
            this._waitingCount++;
            this.start();
        }
        start() {
            if (this._waiting == null) {
                let loading = KBim.ViewPageContext.instance.LoadingBar3;
                let loadingvalue = KBim.ViewPageContext.instance.LoadingValue3;
                this._waitingCount = 0;
                this._waitingCount = this._queue.length;
                $(loading).off("click");
                $(loading).on("click", e_ => {
                    this.clear();
                });
                $(loading).css("cursor", "pointer");
                if (loading != null)
                    loading.hidden = false;
                if (loadingvalue != null)
                    loadingvalue.hidden = false;
            }
            if (!this._running) {
                this._running = true;
                this.loadNext();
            }
        }
        stop() {
            this._running = false;
        }
        getNext() {
            this._auto_queue.length = 0;
            var scene = KBim.ViewPageContext.instance.View3.Scene;
            var cam = scene.Camera;
            var dir = cam.GetDirection();
            var pos = cam.Position;
            var v0 = U1.Vector3.Zero;
            for (let mdl of this._models) {
                if (mdl.model3Context.autoLineDownload) {
                    for (let node of mdl.model3Context.not_loaded_line) {
                        if (node.hasGeom != 1
                            || node.node3Context.isLineLoaded
                            || node.node3Context._inLineQueue == true
                            || node.node3Context.getActualHiddenLine())
                            continue;
                        if (!mdl.model3Context.spaceVisible && node.IsSpace)
                            continue;
                        if (node.geomCent == null) {
                            node.node3Context.onErrorLineLoad();
                            continue;
                        }
                        let distSq = U1.Vector3.DistanceSquared(node.geomCent, pos);
                        if (distSq < node.geomRad * node.geomRad + this._autoLoadDisSq)
                            this._auto_queue.push(node);
                    }
                }
            }
            this._auto_queue.AddRange(this._queue);
            if (this._auto_queue.length == 0)
                return null;
            let min_rad;
            let min_dist;
            let next;
            let next_idx = -1;
            let isHilighted = false;
            let loadOrder = 100000;
            for (var i = 0; i < this._auto_queue.length; i++) {
                let node = this._auto_queue[i];
                if (node.node3Context.hasLine || node.node3Context.isLineLoaded) {
                    if (node.node3Context._inLineQueue) {
                        this._loadedCount++;
                        this.dequeue(node);
                    }
                    continue;
                }
                if (isHilighted && !node.IsHilighted && !node.IsSelected)
                    continue;
                let geomCent = node.geomCent;
                if (geomCent == null) {
                    if (node.node3Context._inLineQueue) {
                        this._loadedCount++;
                        this.dequeue(node);
                    }
                    continue;
                }
                v0.Set(geomCent);
                v0.Subtract(pos);
                let dt = U1.Vector3.Dot(v0, dir);
                if (dt < 0)
                    continue;
                v0 = U1.Vector3.ScaleAdd(pos, dt, dir, v0);
                let radsq = U1.Vector3.DistanceSquared(v0, geomCent);
                if (radsq < 0.5) {
                    radsq = 0;
                }
                if (!isHilighted && (node.IsHilighted || node.IsSelected)) {
                    isHilighted = true;
                    next = this._auto_queue[i];
                    next_idx = i;
                    min_dist = dt;
                    min_rad = radsq;
                    continue;
                }
                if (next == null || ((radsq <= min_rad && dt < min_dist)
                    && (radsq == 0 || node.LoadOrder <= loadOrder))) {
                    next = this._auto_queue[i];
                    loadOrder = next.LoadOrder;
                    next_idx = i;
                    min_dist = dt;
                    min_rad = radsq;
                }
            }
            if (next == null)
                next = this._auto_queue.shift();
            else {
                this._auto_queue.splice(next_idx, 1);
            }
            return next;
        }
        loadNext() {
            var scene = KBim.ViewPageContext.instance.View3.Scene;
            let loading = KBim.ViewPageContext.instance.LoadingBar3;
            let loadingvalue = KBim.ViewPageContext.instance.LoadingValue3;
            if (this._queue.length == 0 && loading.hidden == false) {
                loading.hidden = true;
                loadingvalue.hidden = true;
                loading.style.cursor = "default";
                this._waitingCount = 0;
                this._loadedCount = 0;
            }
            let next = this.getNext();
            if (!this._running || next == null) {
                if (this._running)
                    setTimeout(() => this.loadNext(), 1000);
                return;
            }
            if (this._waitingCount > 0) {
                let lc = this._loadedCount + KBim.KmMesh3Loader.instance.loadedCount;
                let wc = this._waitingCount + KBim.KmMesh3Loader.instance.waitingCount;
                loadingvalue.innerText = `${lc} / ${wc}`;
                loading.style.cursor = "pointer";
                loading.hidden = false;
                loadingvalue.hidden = false;
                $(loading).off("click");
                $(loading).on("click", e_ => {
                    this.clear();
                });
            }
            this._waiting = next;
            next.node3Context.onBeforeLineLoad();
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + next.Model.fnum
                + "&eid=" + next.ifcId
                + "&file=" + "gltf_line";
            KBim.KmGLTFLoader.instance.load({
                url: fileURL,
                onLoad: (gltf) => {
                    next.node3Context.onAfterLineLoad(gltf.scene);
                    this._waiting = null;
                    this.loadNext();
                    if (next.node3Context._inLineQueue) {
                        next.node3Context._inLineQueue = undefined;
                        this.dequeue(next);
                        this._loadedCount++;
                    }
                },
                onProgress: (xhr) => {
                },
                onError: (error) => {
                    next.node3Context.onErrorLineLoad();
                    this._waiting = null;
                    this.loadNext();
                    if (next.node3Context._inLineQueue) {
                        this.dequeue(next);
                        next.node3Context._inLineQueue = undefined;
                        this._loadedCount++;
                    }
                }
            });
        }
    }
    KmLine3Loader.instance = new KmLine3Loader();
    KBim.KmLine3Loader = KmLine3Loader;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmMesh2Loader {
        constructor() {
            this._models = [];
            this._queue = [];
            this._auto_queue = [];
            this._waitingCount = 0;
            this._loadedCount = 0;
            this._running = false;
        }
        get loadedCount() {
            return this._loadedCount;
        }
        get waitingCount() {
            return this._waitingCount;
        }
        get isRunning() {
            return this._running;
        }
        addModel(model) {
            if (this._models.Contains(model))
                return;
            this._models.push(model);
        }
        removeModel(model) {
            if (!this._models.Contains(model))
                return;
            this._models.splice(this._models.indexOf(model), 1);
        }
        dequeue(node) {
            let idx = this._queue.indexOf(node);
            if (idx >= 0) {
                node.node2Context._inMeshQueue = undefined;
                this._queue.splice(idx, 1);
            }
        }
        clear() {
            this._queue.forEach(o_ => o_.node2Context._inMeshQueue = undefined);
            this._queue.length = 0;
            this._waitingCount = 0;
            this._loadedCount = 0;
        }
        queue(node) {
            var _a;
            if (node.Mesh2 != null ||
                (((_a = node.Model) === null || _a === void 0 ? void 0 : _a.space3Visible) == false && node.IsSpace))
                return;
            if (this._queue.indexOf(node) >= 0)
                return;
            node.node2Context._inMeshQueue = true;
            this._queue.push(node);
            this._waitingCount++;
            this.start();
        }
        start() {
            if (this._waiting == null) {
                let loading = KBim.ViewPageContext.instance.LoadingBar2;
                let loadingvalue = KBim.ViewPageContext.instance.LoadingValue2;
                this._waitingCount = 0;
                this._waitingCount = this._queue.length;
                $(loading).off("click");
                $(loading).on("click", e_ => {
                    this.clear();
                });
                $(loading).css("cursor", "pointer");
                if (loading != null)
                    loading.hidden = false;
                if (loadingvalue != null)
                    loadingvalue.hidden = false;
            }
            if (!this._running) {
                this._running = true;
                this.loadNext();
            }
        }
        stop() {
            this._running = false;
        }
        getNext() {
            this._auto_queue.length = 0;
            let visibleCtx = KBim.KVisibleContext.get2D(KBim.ViewPageContext.instance.View2, KBim.KVisibleContext._vc1);
            var scene = KBim.ViewPageContext.instance.View2.Scene;
            var cam = scene.Camera;
            var dir = cam.GetDirection();
            var pos = cam.Position;
            var v0 = U1.Vector3.Zero;
            for (let mdl of this._models) {
                if (mdl.model2Context.autoMeshDownload) {
                    for (let node of mdl.model2Context.not_loaded_mesh) {
                        if (node.hasGeom != 1
                            || node.node2Context.isMeshLoaded
                            || node.node2Context._inMeshQueue == true
                            || node.node2Context.getActualHiddenMesh()
                            || !node.node2Context.getMeshVisible()) {
                            node.node2Context.hideTempMesh();
                            continue;
                        }
                        if (!mdl.model2Context.spaceVisible && node.IsSpace)
                            continue;
                        if (node.geomCent == null) {
                            node.node2Context.onErrorMeshLoad();
                            continue;
                        }
                        let visible_state = visibleCtx.check2D(node);
                        if (visible_state == 1) {
                            node.node2Context.showTempMesh();
                            this._auto_queue.push(node);
                        }
                        else {
                            node.node2Context.hideTempMesh();
                        }
                    }
                }
            }
            this._auto_queue.AddRange(this._queue);
            if (this._auto_queue.length == 0)
                return null;
            let min_rad;
            let min_dist;
            let next;
            let next_idx = -1;
            let isHilighted = false;
            let loadOrder = 100000;
            for (var i = 0; i < this._auto_queue.length; i++) {
                let node = this._auto_queue[i];
                if (node.node2Context.hasMesh || node.node2Context.isMeshLoaded) {
                    if (node.node2Context._inMeshQueue) {
                        this._loadedCount++;
                        this.dequeue(node);
                    }
                    continue;
                }
                if (isHilighted && !node.IsHilighted && !node.IsSelected)
                    continue;
                let geomCent = node.geomCent;
                if (geomCent == null) {
                    if (node.node2Context._inMeshQueue) {
                        this._loadedCount++;
                        this.dequeue(node);
                    }
                    continue;
                }
                v0.Set(geomCent);
                v0.Subtract(pos);
                let dt = U1.Vector3.Dot(v0, dir);
                if (dt < 0)
                    continue;
                v0 = U1.Vector3.ScaleAdd(pos, dt, dir, v0);
                let radsq = U1.Vector3.DistanceSquared(v0, geomCent);
                if (radsq < 0.5) {
                    radsq = 0;
                }
                if (!isHilighted && (node.IsHilighted || node.IsSelected)) {
                    isHilighted = true;
                    next = this._auto_queue[i];
                    next_idx = i;
                    min_dist = dt;
                    min_rad = radsq;
                    continue;
                }
                if (next == null || ((radsq <= min_rad && dt < min_dist)
                    && (radsq == 0 || node.LoadOrder <= loadOrder))) {
                    next = this._auto_queue[i];
                    loadOrder = next.LoadOrder;
                    next_idx = i;
                    min_dist = dt;
                    min_rad = radsq;
                }
            }
            if (next == null)
                next = this._auto_queue.shift();
            else {
                this._auto_queue.splice(next_idx, 1);
            }
            return next;
        }
        loadNext() {
            var scene = KBim.ViewPageContext.instance.View2.Scene;
            let loading = KBim.ViewPageContext.instance.LoadingBar2;
            let loadingvalue = KBim.ViewPageContext.instance.LoadingValue2;
            if (this._queue.length == 0 && loading.hidden == false) {
                loading.hidden = true;
                loadingvalue.hidden = true;
                loading.style.cursor = "default";
                this._waitingCount = 0;
                this._loadedCount = 0;
            }
            let next = this.getNext();
            if (!this._running || next == null) {
                if (this._running)
                    setTimeout(() => this.loadNext(), 1000);
                return;
            }
            if (this._waitingCount > 0) {
                let lc = this._loadedCount + KBim.KmLine2Loader.instance.loadedCount;
                let wc = this._waitingCount + KBim.KmLine2Loader.instance.waitingCount;
                loadingvalue.innerText = `${lc} / ${wc}`;
                loading.style.cursor = "pointer";
                loading.hidden = false;
                loadingvalue.hidden = false;
                $(loading).off("click");
                $(loading).on("click", e_ => {
                    this.clear();
                });
            }
            this._waiting = next;
            next.node2Context.onBeforeMeshLoad();
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + next.Model.fnum
                + "&eid=" + next.ifcId
                + "&file=" + "gltf";
            KBim.KmGLTFLoader.instance.load({
                url: fileURL,
                onLoad: (gltf) => {
                    next.node2Context.onAfterMeshLoad(gltf.scene);
                    this._waiting = null;
                    this.loadNext();
                    if (next.node2Context._inMeshQueue) {
                        next.node2Context._inMeshQueue = undefined;
                        this.dequeue(next);
                        this._loadedCount++;
                    }
                },
                onProgress: (xhr) => {
                },
                onError: (error) => {
                    next.node2Context.onErrorMeshLoad();
                    this._waiting = null;
                    this.loadNext();
                    if (next.node2Context._inMeshQueue) {
                        this.dequeue(next);
                        next.node2Context._inMeshQueue = undefined;
                        this._loadedCount++;
                    }
                }
            });
        }
    }
    KmMesh2Loader.instance = new KmMesh2Loader();
    KBim.KmMesh2Loader = KmMesh2Loader;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmMesh3Loader {
        constructor() {
            this._models = [];
            this._queue = [];
            this._auto_queue = [];
            this._waitingCount = 0;
            this._loadedCount = 0;
            this._autoLoadDist = 20;
            this._running = false;
        }
        get loadedCount() {
            return this._loadedCount;
        }
        get waitingCount() {
            return this._waitingCount;
        }
        get isRunning() {
            return this._running;
        }
        addModel(model) {
            if (this._models.Contains(model))
                return;
            this._models.push(model);
        }
        removeModel(model) {
            if (!this._models.Contains(model))
                return;
            this._models.splice(this._models.indexOf(model), 1);
        }
        dequeue(node) {
            let idx = this._queue.indexOf(node);
            if (idx >= 0) {
                node.node3Context._inMeshQueue = undefined;
                this._queue.splice(idx, 1);
            }
        }
        clear() {
            this._queue.forEach(o_ => o_.node3Context._inMeshQueue = undefined);
            this._queue.length = 0;
            this._waitingCount = 0;
            this._loadedCount = 0;
        }
        queue(node) {
            var _a;
            if (node.Mesh3 != null ||
                (((_a = node.Model) === null || _a === void 0 ? void 0 : _a.space3Visible) == false && node.IsSpace) ||
                node.hasGeom != 1)
                return;
            if (this._queue.indexOf(node) >= 0)
                return;
            node.node3Context._inMeshQueue = true;
            this._queue.push(node);
            this._waitingCount++;
            this.start();
        }
        start() {
            if (this._waiting == null) {
                let loading = KBim.ViewPageContext.instance.LoadingBar3;
                let loadingvalue = KBim.ViewPageContext.instance.LoadingValue3;
                this._waitingCount = 0;
                this._waitingCount = this._queue.length;
                $(loading).off("click");
                $(loading).on("click", e_ => {
                    this.clear();
                });
                $(loading).css("cursor", "pointer");
                if (loading != null)
                    loading.hidden = false;
                if (loadingvalue != null)
                    loadingvalue.hidden = false;
            }
            if (!this._running) {
                this._running = true;
                this.loadNext();
            }
        }
        stop() {
            this._running = false;
        }
        getNext() {
            this._auto_queue.length = 0;
            var scene = KBim.ViewPageContext.instance.View3.Scene;
            var cam = scene.Camera;
            var dir = cam.GetDirection();
            var pos = cam.Position;
            var v0 = U1.Vector3.Zero;
            for (let mdl of this._models) {
                if (mdl.model3Context.autoMeshDownload) {
                    for (let node of mdl.model3Context.not_loaded_mesh) {
                        if (node.hasGeom != 1
                            || node.node3Context.isMeshLoaded
                            || node.node3Context._inMeshQueue == true
                            || node.node3Context.getActualHiddenMesh()) {
                            node.node3Context.hideTempMesh();
                            continue;
                        }
                        if (!mdl.space3Visible && node.IsSpace)
                            continue;
                        if (node.geomCent == null) {
                            node.node3Context.onErrorMeshLoad();
                            continue;
                        }
                        let dist = U1.Vector3.Distance(node.geomCent, pos);
                        if (dist < node.geomRad + this._autoLoadDist) {
                            node.node3Context.showTempMesh();
                            this._auto_queue.push(node);
                        }
                        else {
                            node.node3Context.hideTempMesh();
                        }
                    }
                }
            }
            this._auto_queue.AddRange(this._queue);
            if (this._auto_queue.length == 0)
                return null;
            let min_rad;
            let min_dist;
            let next;
            let next_idx = -1;
            let isHilighted = false;
            let loadOrder = 100000;
            for (var i = 0; i < this._auto_queue.length; i++) {
                let node = this._auto_queue[i];
                if (node.node3Context.hasMesh ||
                    node.node3Context.isMeshLoaded) {
                    if (node.node3Context._inMeshQueue) {
                        this._loadedCount++;
                        this.dequeue(node);
                    }
                    continue;
                }
                if (isHilighted && !node.IsHilighted && !node.IsSelected)
                    continue;
                let geomCent = node.geomCent;
                if (geomCent == null) {
                    if (node.node3Context._inMeshQueue) {
                        this._loadedCount++;
                        this.dequeue(node);
                    }
                    continue;
                }
                v0.Set(geomCent);
                v0.Subtract(pos);
                let dt = U1.Vector3.Dot(v0, dir);
                if (dt < 0)
                    continue;
                v0 = U1.Vector3.ScaleAdd(pos, dt, dir, v0);
                let radsq = U1.Vector3.DistanceSquared(v0, geomCent);
                if (radsq < 0.5) {
                    radsq = 0;
                }
                if (!isHilighted && (node.IsHilighted || node.IsSelected)) {
                    isHilighted = true;
                    next = this._auto_queue[i];
                    next_idx = i;
                    min_dist = dt;
                    min_rad = radsq;
                    continue;
                }
                if (next == null || ((radsq <= min_rad && dt < min_dist)
                    && (radsq == 0 || node.LoadOrder <= loadOrder))) {
                    next = this._auto_queue[i];
                    loadOrder = next.LoadOrder;
                    next_idx = i;
                    min_dist = dt;
                    min_rad = radsq;
                }
            }
            if (next == null)
                next = this._auto_queue.shift();
            else {
                this._auto_queue.splice(next_idx, 1);
            }
            return next;
        }
        loadNext() {
            let loading = KBim.ViewPageContext.instance.LoadingBar3;
            let loadingvalue = KBim.ViewPageContext.instance.LoadingValue3;
            if (this._queue.length == 0 && loading.hidden == false) {
                loading.hidden = true;
                loadingvalue.hidden = true;
                loading.style.cursor = "default";
                this._waitingCount = 0;
                this._loadedCount = 0;
            }
            let next = this.getNext();
            if (!this._running || next == null) {
                if (this._running)
                    setTimeout(() => this.loadNext(), 1000);
                return;
            }
            if (this._waitingCount > 0) {
                let lc = this._loadedCount + KBim.KmLine3Loader.instance.loadedCount;
                let wc = this._waitingCount + KBim.KmLine3Loader.instance.waitingCount;
                loadingvalue.innerText = `${lc} / ${wc}`;
                loading.style.cursor = "pointer";
                loading.hidden = false;
                loadingvalue.hidden = false;
                $(loading).off("click");
                $(loading).on("click", e_ => {
                    this.clear();
                });
            }
            this._waiting = next;
            next.node3Context.onBeforeMeshLoad();
            var fileURL = "product?prj=" + ProjNo
                + "&model=" + next.Model.fnum
                + "&eid=" + next.ifcId
                + "&file=" + "gltf";
            KBim.KmGLTFLoader.instance.load({
                url: fileURL,
                onLoad: (gltf) => {
                    next.node3Context.onAfterMeshLoad(gltf.scene);
                    this._waiting = null;
                    this.loadNext();
                    if (next.node3Context._inMeshQueue) {
                        next.node3Context._inMeshQueue = undefined;
                        this.dequeue(next);
                        this._loadedCount++;
                    }
                },
                onProgress: (xhr) => {
                },
                onError: (error) => {
                    next.node3Context.onErrorMeshLoad();
                    this._waiting = null;
                    this.loadNext();
                    if (next.node3Context._inMeshQueue) {
                        this.dequeue(next);
                        next.node3Context._inMeshQueue = undefined;
                        this._loadedCount++;
                    }
                }
            });
        }
    }
    KmMesh3Loader.instance = new KmMesh3Loader();
    KBim.KmMesh3Loader = KmMesh3Loader;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmModel extends KBim.KmNode {
        constructor() {
            super(...arguments);
            this.node_map = new Map();
            this.model3Context = new KBim.KmModel_ViewContext(this, true);
            this.model2Context = new KBim.KmModel_ViewContext(this, false);
        }
        get viewPageContext() {
            return this._viewPageContext;
        }
        set viewPageContext(value) {
            this._viewPageContext = value;
            this.model3Context.viewContext = this._viewPageContext.View3Context;
            this.model2Context.viewContext = this._viewPageContext.View2Context;
        }
        get view3D() {
            return this._viewPageContext.View3;
        }
        get view2D() {
            return this._viewPageContext.View2;
        }
        get space3Visible() {
            return this.model3Context.spaceVisible;
        }
        set space3Visible(visible) {
            this.model3Context.spaceVisible = visible;
            this.updateSpaceVisibe();
        }
        get Site() {
            return this.GetChildren(KBim.KmSite)[0];
        }
        get Min() {
            return this.geomMin;
        }
        get Max() {
            return this.geomMax;
        }
        get Mesh3() {
            return this.model3Context.rootMesh;
        }
        set Mesh3(value) {
            this.model3Context.rootMesh = value;
        }
        ReadJson(json) {
            if (Array.isArray(json)) {
                for (var elm of json) {
                    let node;
                    if (elm["ifcType"] == "IFCSITE")
                        node = new KBim.KmSite();
                    else if (elm["ifcType"] == "IFCBUILDING")
                        node = new KBim.KmBuilding();
                    else if (elm["ifcType"] == "IFCBUILDINGSTOREY")
                        node = new KBim.KmStorey();
                    else
                        node = new KBim.KmProduct();
                    node.ReadJson(elm);
                    if (node.ifcType == "Model") {
                        super.ReadJson(elm);
                    }
                    else {
                        this.node_map.set(node.ifcId, node);
                        node.Model = this;
                    }
                }
                for (let entry of this.node_map.entries()) {
                    let ifcNode = entry[1];
                    if (ifcNode instanceof KBim.KmSite) {
                        this.addChildNode(ifcNode);
                    }
                    else if (ifcNode.ifcPid != null) {
                        let pnode = this.node_map.get(ifcNode.ifcPid);
                        pnode === null || pnode === void 0 ? void 0 : pnode.addChildNode(ifcNode);
                    }
                }
            }
        }
        setCcResults(result) {
            this.CcResults = result;
            if (result != null) {
                for (var ccr of result) {
                    ccr.Model = this;
                }
            }
        }
        getNode(obj3d) {
            let curObj = obj3d;
            while (curObj != null) {
                if (curObj.name.startsWith("#")) {
                    let id = curObj.name.substr(1);
                    let node = this.node_map.get(id);
                    if (node instanceof KBim.KmNode) {
                        return node;
                    }
                }
                curObj = curObj.parent;
            }
            return null;
        }
        getMesh3(name, view) {
            if (view == this.model3Context.view)
                return this.model3Context.getMesh(name);
            if (view == this.model2Context.view)
                return this.model2Context.getMesh(name);
        }
        updateVisibe(context) {
            for (let nd of this.node_map.values()) {
                if (nd == this)
                    continue;
                nd.updateVisibe(context);
            }
        }
        setVisibleBox(min, max, showOnly) {
            if (showOnly) {
                KBim.KmMesh3Loader.instance.clear();
            }
            for (let nd of this.node_map.values()) {
                if (nd.geomMin == null || nd.geomMax == null) {
                    continue;
                }
                if (nd.node3Context.getMeshVisible() && !showOnly) {
                    continue;
                }
                if (!showOnly && nd.node3Context.hasMesh)
                    continue;
                let x0 = Math.max(nd.geomMin.X, min.X);
                let y0 = Math.max(nd.geomMin.Y, min.Y);
                let z0 = Math.max(nd.geomMin.Z, min.Z);
                let x1 = Math.min(nd.geomMax.X, max.X);
                let y1 = Math.min(nd.geomMax.Y, max.Y);
                let z1 = Math.min(nd.geomMax.Z, max.Z);
                if (x1 - x0 > 0 && y1 - y0 > 0 && z1 - z0 > 0) {
                    nd.SetHidden3(false);
                }
                else {
                    if (showOnly) {
                        nd.SetHidden3(true);
                    }
                }
            }
        }
        setMesh3Loaded(node) {
            this.model3Context.setMeshLoaded(node);
        }
        updateSpaceVisibe() {
            for (let nd of this.node_map.values()) {
                if (nd.ifcType == "IFCSPACE") {
                    nd.node3Context.updateVisible();
                }
            }
        }
        contains(obj3d, view) {
            if (view == this.model3Context.view)
                return this.model3Context.contains(obj3d);
            if (view == this.model2Context.view)
                return this.model2Context.contains(obj3d);
            return null;
        }
    }
    KBim.KmModel = KmModel;
    class KmStoreyModel extends KmModel {
        constructor() {
            super(...arguments);
            this.model2Context = new KBim.KmModel_ViewContext(this, false);
        }
        ReadJson(json) {
            let anode_map = new Map();
            if (Array.isArray(json)) {
                for (var elm of json) {
                    let node;
                    if (elm["ifcType"] == "IFCSITE")
                        continue;
                    else if (elm["ifcType"] == "IFCBUILDING") {
                        node = new KBim.KmBuilding();
                    }
                    else if (elm["ifcType"] == "IFCBUILDINGSTOREY")
                        node = new KBim.KmStorey();
                    else if (elm["ifcType"] == "IFCSPACE")
                        node = new KBim.KmSpace();
                    else
                        node = new KBim.KmProduct();
                    node.ReadJson(elm);
                    if (node.ifcType == "Model") {
                        super.ReadJson(elm);
                    }
                    else {
                        if (node instanceof KBim.KmStorey && node.ifcId != this.storeyID) {
                            continue;
                        }
                        else {
                            if (node instanceof KBim.KmStorey && node.ifcId == this.storeyID) {
                                this.storey = node;
                            }
                            anode_map.set(node.ifcId, node);
                            node.Model = this;
                        }
                    }
                }
                this.geomMin = null;
                this.geomMax = null;
                for (let entry of anode_map.entries()) {
                    let ifcNode = entry[1];
                    if (ifcNode.geomMin != null && ifcNode.geomMax != null) {
                        if (this.geomMin == null) {
                            this.geomMin = ifcNode.geomMin;
                            this.geomMax = ifcNode.geomMax;
                        }
                        else {
                            this.geomMin.Minimize(ifcNode.geomMin);
                            this.geomMax.Maximize(ifcNode.geomMax);
                        }
                    }
                    if (ifcNode instanceof KBim.KmBuilding) {
                        this.addChildNode(ifcNode);
                    }
                    else if (ifcNode.ifcPid != null) {
                        let pnode = anode_map.get(ifcNode.ifcPid);
                        pnode === null || pnode === void 0 ? void 0 : pnode.addChildNode(ifcNode);
                    }
                }
                if (this.geomMin == null) {
                    this.geomMin = new U1.Vector3(-10, -10, -10);
                    this.geomMax = new U1.Vector3(10, 10, 10);
                }
                this.geomCent = U1.Vector3.Add(this.geomMin, this.geomMax).Scale(0.5);
                this.geomRad = U1.Vector3.Distance(this.geomCent, this.geomMax);
                let nodes = [];
                nodes.push(this.storey);
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes[i];
                    if (node.Children != null) {
                        for (let ch of node.Children) {
                            if (ch instanceof KBim.KmNode)
                                nodes.push(ch);
                        }
                    }
                }
                for (let nd of nodes) {
                    this.node_map.set(nd.ifcId, nd);
                }
            }
        }
    }
    KBim.KmStoreyModel = KmStoreyModel;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmModel_ViewContext {
        constructor(mdl, is3d) {
            this._mesh_map = new Map();
            this._line_map = new Map();
            this._not_loaded_mesh = [];
            this._not_loaded_line = [];
            this._spaceMeshVisible = true;
            this._autoMeshDownload = true;
            this._autoLineDownload = false;
            this.model = mdl;
            this.is3D = is3d;
        }
        get viewContext() {
            return this._viewContext;
        }
        set viewContext(value) {
            this._viewContext = value;
        }
        get view() {
            var _a;
            return (_a = this.viewContext) === null || _a === void 0 ? void 0 : _a.View;
        }
        get rootWorld() {
            if (this._rootWorld == null) {
                var sceneTHREE = this.view.Scene;
                var worldTHREE = sceneTHREE.SceneWorld;
                this._rootWorld = new THREE.Group();
                worldTHREE.add(this._rootWorld);
            }
            return this._rootWorld;
        }
        get rootOverlay() {
            if (this._rootOverlay == null) {
                var sceneTHREE = this.view.Scene;
                var overlayTHREE = sceneTHREE.SceneOverlay;
                this._rootOverlay = new THREE.Group();
                overlayTHREE.add(this._rootOverlay);
            }
            return this._rootOverlay;
        }
        get rootMesh() {
            return this._rootMesh;
        }
        set rootMesh(value) {
            if (this._rootMesh == value)
                return;
            if (this._rootMesh != null)
                this.rootWorld.remove(this._rootMesh);
            this._rootMesh = value;
            this.rootWorld.add(this._rootMesh);
            if (this._rootMesh != null && this._rootMesh.children != null) {
                for (let ch of this._rootMesh.children) {
                    let chname = ch.name;
                    if (chname.startsWith("#")) {
                        chname = chname.substr(1);
                        this._mesh_map.set(chname, ch);
                        if (this.model.node_map.has(chname)) {
                            let node = this.model.node_map.get(chname);
                            let nodeContext = this.getNodeContext(node);
                            nodeContext.mesh = ch;
                            nodeContext.isPrimeMesh = true;
                        }
                    }
                }
            }
            for (var node of this.model.node_map.values()) {
                if (!this.getNodeContext(node).hasMesh) {
                    this._not_loaded_mesh.push(node);
                }
            }
            if (this.is3D) {
                KBim.KmMesh3Loader.instance.addModel(this.model);
                KBim.KmMesh3Loader.instance.start();
            }
            else {
                KBim.KmMesh2Loader.instance.addModel(this.model);
                KBim.KmMesh2Loader.instance.start();
            }
            this.view.Invalidate();
        }
        get rootLine() {
            if (this._rootLine == null) {
                this._rootLine = new THREE.Group();
                this.rootWorld.add(this._rootLine);
            }
            return this._rootLine;
        }
        set rootLine(value) {
            if (this._rootLine == value)
                return;
            if (this._rootLine != null)
                this.rootWorld.remove(this._rootLine);
            this._rootLine = value;
            if (this._rootLine != null) {
                this.rootWorld.add(this._rootLine);
            }
            if (this._rootLine != null && this._rootLine.children != null) {
                for (let ch of this._rootLine.children) {
                    let chname = ch.name;
                    if (chname.startsWith("#")) {
                        chname = chname.substr(1);
                        this._mesh_map.set(chname, ch);
                        if (this.model.node_map.has(chname)) {
                            let node = this.model.node_map.get(chname);
                            this.getNodeContext(node).line = ch;
                            this.getNodeContext(node).isPrimeLine = true;
                        }
                    }
                }
            }
            for (var node of this.model.node_map.values()) {
                if (!this.getNodeContext(node).hasLine) {
                    this._not_loaded_line.push(node);
                }
            }
            if (this.is3D) {
                KBim.KmMesh3Loader.instance.addModel(this.model);
                KBim.KmMesh3Loader.instance.start();
            }
            else {
                KBim.KmMesh2Loader.instance.addModel(this.model);
                KBim.KmMesh2Loader.instance.start();
            }
        }
        getNodeContext(node) {
            if (this.is3D)
                return node.node3Context;
            return node.node2Context;
        }
        get spaceVisible() {
            return this._spaceMeshVisible;
        }
        set spaceVisible(visible) {
            this._spaceMeshVisible = visible;
        }
        get not_loaded_mesh() {
            return this._not_loaded_mesh;
        }
        get not_loaded_line() {
            return this._not_loaded_line;
        }
        get autoMeshDownload() {
            return this._autoMeshDownload;
        }
        set autoMeshDownload(value) {
            this._autoMeshDownload = value;
            if (this._autoMeshDownload) {
                if (this.is3D) {
                    KBim.KmMesh3Loader.instance.addModel(this.model);
                    KBim.KmMesh3Loader.instance.start();
                }
                else {
                    KBim.KmMesh2Loader.instance.addModel(this.model);
                    KBim.KmMesh2Loader.instance.start();
                }
            }
            else {
                if (this.is3D) {
                    KBim.KmMesh3Loader.instance.removeModel(this.model);
                }
                else {
                    KBim.KmMesh2Loader.instance.removeModel(this.model);
                }
            }
        }
        get autoLineDownload() {
            return this._autoLineDownload;
        }
        set autoLineDownload(value) {
            this._autoLineDownload = value;
            if (this._autoLineDownload) {
                if (this.is3D) {
                    KBim.KmLine3Loader.instance.addModel(this.model);
                    KBim.KmLine3Loader.instance.start();
                }
                else {
                    KBim.KmLine2Loader.instance.addModel(this.model);
                    KBim.KmLine2Loader.instance.start();
                }
            }
            else {
                if (this.is3D) {
                    KBim.KmLine3Loader.instance.removeModel(this.model);
                }
                else {
                    KBim.KmLine2Loader.instance.removeModel(this.model);
                }
            }
        }
        copyRootMesh(other) {
            this.rootMesh = this.copyMesh(other);
        }
        setMeshLoaded(node) {
            let idx = this._not_loaded_mesh.indexOf(node);
            if (idx >= 0)
                this._not_loaded_mesh.splice(idx, 1);
        }
        setLineLoaded(node) {
            let idx = this._not_loaded_line.indexOf(node);
            if (idx >= 0)
                this._not_loaded_line.splice(idx, 1);
        }
        getMesh(name) {
            if (this._rootMesh != null) {
                for (let ch of this._rootMesh.children) {
                    if (ch.name == name)
                        return ch;
                }
            }
            return null;
        }
        getLine(name) {
            if (this._rootMesh != null) {
                for (let ch of this._rootLine.children) {
                    if (ch.name == name)
                        return ch;
                }
            }
            return null;
        }
        contains(obj3d) {
            while (obj3d != null && obj3d != this.rootWorld &&
                obj3d != this.rootOverlay) {
                obj3d = obj3d.parent;
            }
            return obj3d == this.rootWorld ||
                obj3d == this.rootOverlay;
        }
        copyMesh(other) {
            let clone;
            if (other instanceof THREE.Group) {
                clone = new THREE.Group();
            }
            else if (other instanceof THREE.Mesh) {
                clone = new THREE.Mesh(other.geometry, other.material);
            }
            else if (other instanceof THREE.LineSegments) {
                clone = new THREE.LineSegments(other.geometry, other.material);
            }
            else if (other instanceof THREE.Line) {
                clone = new THREE.Line(other.geometry, other.material);
            }
            else if (other instanceof THREE.Points) {
                clone = new THREE.Points(other.geometry, other.material);
            }
            else {
                clone = new other.constructor;
            }
            if (clone != null) {
                clone.name = other.name;
                if (other.children != null) {
                    for (let ch of other.children) {
                        let cch = this.copyMesh(ch);
                        clone.add(cch);
                    }
                }
            }
            return clone;
        }
    }
    KBim.KmModel_ViewContext = KmModel_ViewContext;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmNode_ViewContext {
        constructor(node, is3d) {
            this.is3D = true;
            this._isPrimeMesh = false;
            this._isPrimeLine = false;
            this._hiddenMesh = false;
            this._hiddenLine = true;
            this._inMeshQueue = false;
            this._inLineQueue = false;
            this._lodState = 0;
            this._node = node;
            this.is3D = is3d;
        }
        get PropertyChanged() {
            if (this._propertyChanged == null)
                this._propertyChanged = new U1.PropertyChangedEvent();
            return this._propertyChanged;
        }
        get node() {
            return this._node;
        }
        set node(value) {
            this._node = value;
        }
        get modelContext() {
            var _a, _b;
            if (this.is3D)
                return (_a = this.model) === null || _a === void 0 ? void 0 : _a.model3Context;
            else
                return (_b = this.model) === null || _b === void 0 ? void 0 : _b.model2Context;
        }
        get view() {
            return this.modelContext.view;
        }
        get isPrimeMesh() {
            return this._isPrimeMesh;
        }
        set isPrimeMesh(value) {
            this._isPrimeMesh = value;
        }
        get isPrimeLine() {
            return this._isPrimeLine;
        }
        set isPrimeLine(value) {
            this._isPrimeLine = value;
            this._hiddenLine = false;
        }
        get isHiddenType() {
            return this.modelContext
                .viewContext
                .getTypeVisible(this.node.ifcType) == false;
        }
        getIsHidden() {
            return this._hiddenMesh;
        }
        setIsHidden(hidden) {
            this.setHiddenMesh(hidden, null, true);
        }
        get model() {
            var _a;
            return (_a = this._node) === null || _a === void 0 ? void 0 : _a.Model;
        }
        get hasMesh() {
            return this._mesh != null;
        }
        get hasLine() {
            return this._line != null;
        }
        get isMeshLoaded() {
            return this._isMeshLoaded;
        }
        set isMeshLoaded(value) {
            this._isMeshLoaded = value;
        }
        get isLineLoaded() {
            return this._isLineLoaded;
        }
        set isLineLoaded(value) {
            this._isLineLoaded = value;
        }
        get mesh() {
            if (!this._isPrimeMesh || this._isMeshLoaded)
                return this._mesh;
            if (this._mesh == null) {
                var mdl = this.model;
                this._mesh = mdl === null || mdl === void 0 ? void 0 : mdl.getMesh3("#" + this._node.ifcId, this.modelContext.view);
            }
            return this._mesh;
        }
        set mesh(value) {
            this._mesh = value;
            this._isMeshLoaded = true;
            this.hideTempMesh();
        }
        get line() {
            var _a;
            if (!this._isPrimeLine && this._isLineLoaded)
                return this._line;
            if (this._line == null) {
                this._line = (_a = this.modelContext) === null || _a === void 0 ? void 0 : _a.getLine("#" + this._node.ifcId);
                if (this._line != null) {
                    this._isLineLoaded = true;
                    this._isPrimeLine = true;
                }
            }
            if (this._line == null) {
                this.loadLine();
            }
            return this._line;
        }
        set line(value) {
            var _a;
            if (this._line != null) {
                (_a = this._line) === null || _a === void 0 ? void 0 : _a.parent.remove(this._line);
            }
            this._line = value;
            this._isLineLoaded = true;
        }
        onBeforeMeshLoad() { }
        onAfterMeshLoad(obj3d) {
            if (this._mesh != null)
                return;
            this.hideTempMesh();
            let scene = this.modelContext.view.Scene;
            this._mesh = obj3d;
            this._isMeshLoaded = true;
            this.modelContext.setMeshLoaded(this.node);
            if (this._mesh != null) {
                if (this.is3D)
                    this.node.node3Context.showMesh();
                else
                    this.node.node2Context.showMesh();
            }
            scene.View.Invalidate();
        }
        onErrorMeshLoad() {
            this.hideTempMesh();
            this._isMeshLoaded = true;
            this.modelContext.setMeshLoaded(this.node);
        }
        onBeforeLineLoad() { }
        onAfterLineLoad(obj3d) {
            if (this._line != null) {
                return;
            }
            let scene = this.modelContext.view.Scene;
            this._line = obj3d;
            this._isLineLoaded = true;
            this.modelContext.setLineLoaded(this.node);
            if (this.line != null) {
                if (this.is3D)
                    this.node.node3Context.showLine();
                else
                    this.node.node2Context.showLine();
            }
            scene.View.Invalidate();
        }
        onErrorLineLoad() {
            this._isLineLoaded = true;
            this.modelContext.setLineLoaded(this.node);
        }
        getMeshVisible() {
            if (!this.node.hasGeom)
                return false;
            var visible_ = true;
            if (this._hiddenMesh ||
                this.isHiddenType ||
                (this.is3D && this.node.ifcType == "IFCSPACE" && !this.model.space3Visible)) {
                visible_ = false;
            }
            if (this.node.IsHilighted || this.node.IsSelected)
                visible_ = true;
            return visible_;
        }
        getLineVisible() {
            if (!this.node.hasGeom)
                return false;
            let lineVisible_ = true;
            if (this.is3D && this._isPrimeLine != true) {
                lineVisible_ = false;
            }
            if ((this.is3D && this._hiddenLine)
                || this.isHiddenType) {
                lineVisible_ = false;
            }
            if (this.node.IsHilighted || this.node.IsSelected) {
                lineVisible_ = true;
            }
            return lineVisible_;
        }
        updateVisible() {
            if (this.view == null)
                return;
            let lineVisible = this.getLineVisible();
            let meshVisible = this.getMeshVisible();
            if (lineVisible) {
                if (this._isLineLoaded) {
                    this.showLine();
                }
                if (this._line == null) {
                    this.loadLine();
                }
            }
            else {
                this.hideLine();
            }
            if (meshVisible) {
                if (this.isMeshLoaded)
                    this.showMesh();
                else
                    this.loadMesh();
            }
            else {
                this.hideMesh();
            }
            this.view.Invalidate();
        }
        loadLine() {
            if (this._isLineLoaded != undefined)
                return;
            if (this.node.hasGeom != 1) {
                this._isLineLoaded = true;
                return;
            }
            this._isLineLoaded = false;
            if (this.is3D)
                KBim.KmLine3Loader.instance.queue(this.node);
            else
                KBim.KmLine2Loader.instance.queue(this.node);
            return;
        }
        showLine() {
            var _a, _b;
            if (this._line == null)
                return;
            let overlay = this.modelContext.rootOverlay;
            let world = this.modelContext.rootLine;
            let isOverlay = this.node.IsSelected || this.node.IsHilighted;
            if (isOverlay) {
                if (this._line.parent != overlay)
                    (_a = this._line.parent) === null || _a === void 0 ? void 0 : _a.remove(this._line);
                overlay.add(this._line);
            }
            else {
                if (this._line.parent != world)
                    (_b = this._line.parent) === null || _b === void 0 ? void 0 : _b.remove(this._line);
                world.add(this._line);
            }
            if (this.node.IsSelected)
                KmNode_ViewContext.setOutlineColor(this._line, 0x0000FF);
            else
                KmNode_ViewContext.setOutlineColor(this._line);
            this.view.Invalidate();
        }
        hideLine() {
            var _a;
            let line_ = this._line;
            if (line_ == null)
                return;
            (_a = line_.parent) === null || _a === void 0 ? void 0 : _a.remove(line_);
            this.view.Invalidate();
        }
        showMesh() {
            var _a, _b;
            var mesh3 = this.mesh;
            var lodObj = this._lodObj;
            if (mesh3 == null && lodObj == null)
                return;
            var visible_ = this.getMeshVisible();
            let world = this.modelContext.rootMesh;
            if (visible_) {
                if (mesh3 != null) {
                    this.hideLOD();
                    if (mesh3.parent != world) {
                        (_a = mesh3.parent) === null || _a === void 0 ? void 0 : _a.remove(mesh3);
                        world.add(mesh3);
                    }
                    if (this.node.IsHilighted)
                        KmNode_ViewContext.setMeshColor(mesh3, true, 0xFF0000);
                    else if (this.node.IsSelected)
                        KmNode_ViewContext.setMeshColor(mesh3, true, 0x0000FF);
                    else {
                        KmNode_ViewContext.setMeshColor(mesh3, false);
                    }
                }
                else if (lodObj != null) {
                    if (lodObj.parent != world) {
                        (_b = lodObj.parent) === null || _b === void 0 ? void 0 : _b.remove(lodObj);
                        world.add(lodObj);
                    }
                }
            }
            else {
                if (mesh3 != null) {
                    if (mesh3.parent == world) {
                        mesh3.parent.remove(mesh3);
                    }
                }
                if (lodObj != null) {
                    if (lodObj.parent == world) {
                        lodObj.parent.remove(lodObj);
                    }
                }
            }
            this.view.Invalidate();
        }
        loadMesh() {
            if (this.isMeshLoaded)
                return;
            if (this.node.hasGeom != 1) {
                this.isMeshLoaded = true;
                return;
            }
            if (this.mesh != null) {
                this.showMesh();
                return;
            }
        }
        hideMesh() {
            var _a;
            let mesh3 = this.mesh;
            if (mesh3 == null)
                return;
            (_a = mesh3.parent) === null || _a === void 0 ? void 0 : _a.remove(mesh3);
            this.view.Invalidate();
        }
        disposeMesh() {
            var _a;
            let mesh3 = this._mesh;
            if (mesh3 == null)
                return;
            (_a = mesh3.parent) === null || _a === void 0 ? void 0 : _a.remove(mesh3);
            KmNode_ViewContext.disposeOject(mesh3);
            this._mesh = null;
            this._isMeshLoaded = false;
            this.modelContext.not_loaded_mesh.push(this.node);
            this.view.Invalidate();
        }
        disposeLine() {
            var _a;
            let line3 = this._line;
            if (line3 == null)
                return;
            (_a = line3.parent) === null || _a === void 0 ? void 0 : _a.remove(line3);
            KmNode_ViewContext.disposeOject(line3);
            this._line = null;
            this._isLineLoaded = false;
            this.modelContext.not_loaded_line.push(this.node);
            this.view.Invalidate();
        }
        static setOutlineColor(line, hexCol) {
            if (line == null)
                return;
            if (hexCol == null) {
                hexCol = 0x808080;
            }
            if (line instanceof THREE.Line) {
                let mat = line.material;
                KmNode_ViewContext.updateLineColor(mat, hexCol);
            }
            if (line instanceof THREE.LineSegments) {
                let mat = line.material;
                KmNode_ViewContext.updateLineColor(mat, hexCol);
            }
            if (line.children != null) {
                for (let ch of line.children) {
                    KmNode_ViewContext.setOutlineColor(ch, hexCol);
                }
            }
        }
        static updateLineColor(mat, hexCol) {
            if (mat instanceof THREE.MeshBasicMaterial) {
                if (mat["_ocol_"] == undefined) {
                    mat["_ocol_"] = mat.color.getHex();
                }
                if (hexCol == null)
                    hexCol = mat["_ocol_"];
                mat.color.setHex(hexCol);
            }
            if (mat instanceof THREE.LineBasicMaterial) {
                if (mat["_ocol_"] == undefined) {
                    mat["_ocol_"] = mat.color.getHex();
                }
                if (hexCol == null)
                    hexCol = mat["_ocol_"];
                mat.color.setHex(hexCol);
            }
        }
        static setMeshColor(mesh, apply, hexCol) {
            if (mesh instanceof THREE.Group) {
                for (let ch of mesh.children) {
                    KmNode_ViewContext.setMeshColor(ch, apply, hexCol);
                }
            }
            if (mesh instanceof THREE.Mesh) {
                let mat = mesh.material;
                KmNode_ViewContext.updateMeshColor(mat, apply, hexCol);
            }
        }
        static updateMeshColor(mat, apply, hexCol) {
            if (mat instanceof THREE.MeshBasicMaterial) {
                if (mat["_ocol_"] == undefined) {
                    mat["_ocol_"] = mat.color.getHex();
                }
                if (apply)
                    mat.color.setHex(hexCol);
                else
                    mat.color.setHex(mat["_ocol_"]);
            }
            else if (mat instanceof THREE.MeshStandardMaterial) {
                if (mat["_dclr_"] == undefined) {
                    mat["_dclr_"] = mat.color.getHex();
                    mat["_eclr_"] = mat.emissive.getHex();
                }
                if (apply) {
                    mat.emissive.setHex(hexCol);
                }
                else {
                    mat.emissive.setHex(mat["_eclr_"]);
                }
            }
        }
        static disposeOject(obj) {
            var _a;
            let meshOrline = obj;
            if (meshOrline) {
                (_a = meshOrline.geometry) === null || _a === void 0 ? void 0 : _a.dispose();
                if (Array.isArray(meshOrline.material)) {
                    for (let mat of meshOrline.material) {
                        mat.dispose();
                    }
                }
                else if (meshOrline.material instanceof THREE.Material) {
                    meshOrline.material.dispose();
                }
            }
            else if (obj instanceof THREE.Group) {
                for (let ch of obj.children) {
                    KmNode_ViewContext.disposeOject(ch);
                }
            }
        }
        getActualHiddenMesh() {
            let node = this.node;
            if (this.isHiddenType)
                return false;
            if (this.is3D && node.node3Context._hiddenMesh)
                return true;
            if (!this.is3D && node.node2Context._hiddenMesh)
                return true;
            return false;
        }
        getActualHiddenLine() {
            let node = this.node;
            if (this.isHiddenType)
                return false;
            if (this.is3D && node.node3Context._hiddenLine)
                return true;
            if (!this.is3D && node.node2Context._hiddenLine)
                return true;
            return false;
        }
        setHiddenMesh(isHidden, ifcType = "all", recursive) {
            var _a;
            if (this.view == null)
                return;
            let children = this.node.Children;
            if (recursive == true && children != null) {
                for (let ch of children) {
                    if (ch instanceof KBim.KmNode) {
                        if (this.is3D)
                            ch.node3Context.setHiddenMesh(isHidden, ifcType, recursive);
                        else
                            ch.node2Context.setHiddenMesh(isHidden, ifcType, recursive);
                    }
                }
            }
            if (ifcType == "all" || ifcType == null || ifcType == this.node.ifcType) {
                this._hiddenMesh = isHidden;
                (_a = this._propertyChanged) === null || _a === void 0 ? void 0 : _a.Invoke(this, "IsHidden");
                this.updateVisible();
            }
        }
        showTempMesh() {
            if (this._lodObj == null && this._bbxObj == null) {
                if (KmNode_ViewContext._bbxGeom == null) {
                    var bc = [
                        new THREE.Vector3(-0.5, -0.5, -0.5),
                        new THREE.Vector3(0.5, -0.5, -0.5),
                        new THREE.Vector3(0.5, 0.5, -0.5),
                        new THREE.Vector3(-0.5, 0.5, -0.5),
                        new THREE.Vector3(-0.5, -0.5, 0.5),
                        new THREE.Vector3(0.5, -0.5, 0.5),
                        new THREE.Vector3(0.5, 0.5, 0.5),
                        new THREE.Vector3(-0.5, 0.5, 0.5)
                    ];
                    var points = [
                        bc[0], bc[1], bc[1], bc[2], bc[2], bc[3], bc[3], bc[0],
                        bc[4], bc[5], bc[5], bc[6], bc[6], bc[7], bc[7], bc[4],
                        bc[0], bc[4],
                        bc[1], bc[5],
                        bc[2], bc[6],
                        bc[3], bc[7]
                    ];
                    KmNode_ViewContext._bbxGeom = new THREE.BufferGeometry().setFromPoints(points);
                }
                if (KmNode_ViewContext._bbxMat == null) {
                    KmNode_ViewContext._bbxMat = new THREE.LineBasicMaterial({ color: 0xA0A0A0 });
                }
                this._bbxObj = new THREE.LineSegments(KmNode_ViewContext._bbxGeom, KmNode_ViewContext._bbxMat);
                let w = this.node.geomMax.X - this.node.geomMin.X;
                let l = this.node.geomMax.Y - this.node.geomMin.Y;
                let h = this.node.geomMax.Z - this.node.geomMin.Z;
                let cent = this.node.geomCent;
                this._bbxObj.scale.set(w, l, h);
                this._bbxObj.position.set(cent.X, cent.Y, cent.Z);
                let world = this.modelContext.rootMesh;
                world.add(this._bbxObj);
            }
            this.showLOD();
        }
        hideTempMesh() {
            var _a;
            if (this._bbxObj == null)
                return;
            (_a = this._bbxObj) === null || _a === void 0 ? void 0 : _a.parent.remove(this._bbxObj);
            this._bbxObj = null;
            if (this._mesh != null && this._mesh.parent != null)
                this.hideLOD();
        }
        showLOD() {
            var _a, _b;
            if (this.node.hasLOD == 0)
                return;
            if (this._mesh != null && this._mesh.parent != null) {
                this.hideLOD();
                return;
            }
            if (this._lodObj != null) {
                if (!this.getMeshVisible()) {
                    this.hideLOD();
                    return;
                }
            }
            if (this._lodState < 0)
                return;
            if ((this.node.hasLOD & 1) != 1) {
                this._lodState = -1;
                return;
            }
            if (this._lodObj == null && this.node.lod1 != null) {
                this._lodObj = new THREE.Group();
                let boxstrs = this.node.lod1.split(';');
                for (let i = 0; i < boxstrs.length; i++) {
                    let vals = boxstrs[i].split(',')
                        .map(v_ => parseFloat(v_));
                    let clr = new THREE.Color(vals[0], vals[1], vals[2]);
                    let mat = new THREE.MeshLambertMaterial({ color: clr, opacity: vals[3] });
                    let m4 = new THREE.Matrix4();
                    vals = vals.slice(4);
                    m4.set(vals[0], vals[4], vals[8], vals[12], vals[1], vals[5], vals[9], vals[13], vals[2], vals[6], vals[10], vals[14], vals[3], vals[7], vals[11], vals[15]);
                    if (KmNode_ViewContext._lodGeom == null) {
                        KmNode_ViewContext._lodGeom = new THREE.BoxBufferGeometry();
                    }
                    if (vals[0] < 0.001 && vals[5] < 0.001 && vals[10] < 0.001)
                        continue;
                    let mesh = new THREE.Mesh(KmNode_ViewContext._lodGeom, mat);
                    mesh.applyMatrix4(m4);
                    this._lodObj.add(mesh);
                }
                this._lodState = 2;
                (_a = this._bbxObj) === null || _a === void 0 ? void 0 : _a.parent.remove(this._bbxObj);
                this._bbxObj = null;
            }
            if (this._lodObj != null) {
                let world = this.modelContext.rootMesh;
                if (this._lodObj.parent == world)
                    return;
                (_b = this._lodObj.parent) === null || _b === void 0 ? void 0 : _b.remove(this._lodObj);
                world.add(this._lodObj);
                return;
            }
        }
        hideLOD() {
            var _a;
            if (this._lodObj == null)
                return;
            (_a = this._lodObj.parent) === null || _a === void 0 ? void 0 : _a.remove(this._lodObj);
        }
    }
    KBim.KmNode_ViewContext = KmNode_ViewContext;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmNode_View2Context extends KBim.KmNode_ViewContext {
        constructor(node) {
            super(node, false);
        }
        get modelContext() {
            var _a;
            return (_a = this.model) === null || _a === void 0 ? void 0 : _a.model2Context;
        }
        showLine() {
            var _a, _b, _c, _d;
            if (this._line == null)
                return;
            let visible_ = this.getLineVisible();
            if (visible_) {
                let overlay = this.modelContext.rootOverlay;
                let world = this.modelContext.rootLine;
                let isOverlay = this.node.IsSelected || this.node.IsHilighted;
                if (this.node.ifcType == "IFCWINDOW" || this.node.ifcType == "IFCDOOR") {
                    isOverlay = true;
                }
                if (isOverlay) {
                    if (this._line.parent != overlay)
                        (_a = this._line.parent) === null || _a === void 0 ? void 0 : _a.remove(this._line);
                    overlay.add(this._line);
                }
                else {
                    if (this._line.parent != world)
                        (_b = this._line.parent) === null || _b === void 0 ? void 0 : _b.remove(this._line);
                    world.add(this._line);
                }
                if (this.node.IsSelected)
                    KBim.KmNode_ViewContext.setOutlineColor(this._line, 0x0000FF);
                else
                    KBim.KmNode_ViewContext.setOutlineColor(this._line);
            }
            else {
                (_d = (_c = this._line) === null || _c === void 0 ? void 0 : _c.parent) === null || _d === void 0 ? void 0 : _d.remove(this._line);
            }
            this.view.Invalidate();
        }
        showMesh() {
            var _a, _b, _c;
            var mesh3 = this.mesh;
            if (mesh3 == null)
                return;
            var visible_ = this.getMeshVisible();
            if (visible_) {
                let isOverlay = false;
                if (this.node.ifcType == "IFCWINDOW" || this.node.ifcType == "IFCDOOR") {
                    isOverlay = true;
                }
                let overlay = this.modelContext.rootOverlay;
                let world = this.modelContext.rootMesh;
                if (isOverlay) {
                    if (mesh3.parent != overlay)
                        (_a = mesh3.parent) === null || _a === void 0 ? void 0 : _a.remove(mesh3);
                    overlay.add(mesh3);
                }
                else {
                    if (mesh3.parent != world)
                        (_b = mesh3.parent) === null || _b === void 0 ? void 0 : _b.remove(mesh3);
                    world.add(mesh3);
                }
                if (this.node.IsHilighted)
                    KBim.KmNode_ViewContext.setMeshColor(mesh3, true, 0xFF0000);
                else if (this.node.IsSelected)
                    KBim.KmNode_ViewContext.setMeshColor(mesh3, true, 0x0000FF);
                else {
                    KBim.KmNode_ViewContext.setMeshColor(mesh3, false);
                }
            }
            else {
                (_c = mesh3 === null || mesh3 === void 0 ? void 0 : mesh3.parent) === null || _c === void 0 ? void 0 : _c.remove(mesh3);
            }
            this.view.Invalidate();
        }
    }
    KBim.KmNode_View2Context = KmNode_View2Context;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmProduct extends KBim.KmNode {
    }
    KBim.KmProduct = KmProduct;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmProductGroup extends KBim.KmNode {
        get Products() {
            return this.GetChildren(KBim.KmProduct);
        }
    }
    KBim.KmProductGroup = KmProductGroup;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmProp {
        get psetId() {
            return this.pset.psetId;
        }
        get psetName() {
            return this.pset.psetName;
        }
        ReadJson(json) {
            this.id = json["id"];
            this.ifcType = json["ifcType"];
            this.name = json["name"];
            this.desc = json["desc"];
            this.value = json["value"];
            this.unit = json["unit"];
            this.attr1 = json["attr1"];
            this.attr2 = json["attr2"];
            this.attr3 = json["attr3"];
            this.attr4 = json["attr4"];
            this.attr5 = json["attr5"];
            this.attr6 = json["attr6"];
        }
    }
    KBim.KmProp = KmProp;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmPSet {
        get psetId() {
            return this.id;
        }
        get psetName() {
            return this.name;
        }
        ReadJson(json) {
            this.id = json["id"];
            this.globalId = json["globalId"];
            this.name = json["name"];
            this.desc = json["desc"];
            var str_props = json["props"];
            this.props = [];
            if (Array.isArray(str_props)) {
                for (let item of str_props) {
                    let prop = new KBim.KmProp();
                    prop.ReadJson(item);
                    prop.pset = this;
                    this.props.push(prop);
                }
            }
        }
        static ReadFromJson(json) {
            let result = [];
            if (Array.isArray(json)) {
                for (let item of json) {
                    let pset = new KmPSet();
                    pset.ReadJson(item);
                    result.push(pset);
                }
            }
            return result;
        }
        static GetAllPropItems(psets) {
            let result = [];
            for (let pset of psets) {
                result.AddRange(pset.props);
            }
            return result;
        }
    }
    KBim.KmPSet = KmPSet;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmSite extends KBim.KmNode {
        get Buildings() {
            return this.GetChildren(KBim.KmBuilding);
        }
    }
    KBim.KmSite = KmSite;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmSpace extends KBim.KmNode {
        get Products() {
            return this.GetChildren(KBim.KmProduct);
        }
    }
    KBim.KmSpace = KmSpace;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KmStorey extends KBim.KmNode {
        get Products() {
            return this.GetChildren(KBim.KmProduct);
        }
    }
    KBim.KmStorey = KmStorey;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CcCode {
        ReadJson(json) {
            this.ID = json["ID"];
        }
    }
    KBim.CcCode = CcCode;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CcmEntity {
        GetIfcNode() {
            if (this.EID != null) {
                return this.Selector.Result.Model.node_map.get(this.EID);
            }
            return null;
        }
        GetRelatedNodes() {
            if (this._relatedElements != null) {
                let mdl = this.GetModel();
                return this._relatedElements
                    .map(o_ => mdl.node_map.get(o_));
            }
            return null;
        }
        GetModel() {
            var _a, _b;
            return (_b = (_a = this.Selector) === null || _a === void 0 ? void 0 : _a.Result) === null || _b === void 0 ? void 0 : _b.Model;
        }
        ReadJson(json) {
            var _a;
            this.EID = json["eid"];
            this._relatedElements = (_a = json["elementsRelated"]) === null || _a === void 0 ? void 0 : _a.split(",");
        }
        get BBX() {
            return new U1.BoundingBox(new U1.Vector3(-10. - 10, -10), new U1.Vector3(10, 10, 10));
        }
        FillLineGeometry(lineGeom, tm) {
            return null;
        }
    }
    KBim.CcmEntity = CcmEntity;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CcmEmptySpace extends KBim.CcmEntity {
        ReadJson(json) {
            super.ReadJson(json);
            let strboundary = json["boundary"];
            let strHoleArr = json["holes"];
            this.boundary = [];
            if (strboundary != null) {
                let xys = strboundary.split(" ");
                for (let xy of xys) {
                    let fs = xy.split(",");
                    let p = new U1.Vector3();
                    p.X = parseFloat(fs[0]);
                    p.Y = parseFloat(fs[1]);
                    this.boundary.push(p);
                }
            }
            if (Array.isArray(strHoleArr)) {
                this.holes = [];
                for (let strHole of strHoleArr) {
                    let hole = [];
                    let xys = strHole.split(" ");
                    for (let xy of xys) {
                        let fs = xy.split(",");
                        let p = new U1.Vector3();
                        p.X = parseFloat(fs[0]);
                        p.Y = parseFloat(fs[1]);
                        hole.push(p);
                    }
                    if (hole.length > 2) {
                        this.holes.push(hole);
                    }
                }
            }
        }
        get BBX() {
            if (this._bbx == null) {
                if (this.boundary != null) {
                    var scl = this.Selector.Result.CoordScale;
                    this._bbx = U1.BoundingBox.CreateFromPoints(this.boundary
                        .map(o_ => {
                        return U1.Vector3.Scale(o_, scl);
                    }));
                }
            }
            return this._bbx;
        }
        FillLineGeometry(lineGeom, tm) {
            var _a, _b, _c;
            var z = (_c = (_b = (_a = this.GetIfcNode()) === null || _a === void 0 ? void 0 : _a.Min) === null || _b === void 0 ? void 0 : _b.Z) !== null && _c !== void 0 ? _c : this.GetModel().geomMin.Z;
            var scl = this.Selector.Result.CoordScale;
            var wm = U1.Matrix4.CreateScaleByFloats(scl, scl, scl);
            wm.Multiply(U1.Matrix4.CreateTranslationFloats(0, 0, z));
            if (tm != null)
                wm.Multiply(tm);
            lineGeom.AddppendPolygon(this.boundary, wm);
            if (this.holes != null) {
                for (var hole of this.holes) {
                    lineGeom.AddppendPolygon(hole, wm);
                }
            }
        }
    }
    KBim.CcmEmptySpace = CcmEmptySpace;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CcmEntityDistance extends KBim.CcmEntity {
        ReadJson(json) {
            super.ReadJson(json);
            this.P1 = new U1.Vector3();
            this.P2 = new U1.Vector3();
            var f1s = json["p1"].split(",");
            var f2s = json["p2"].split(",");
            this.P1.X = parseFloat(f1s[0]);
            this.P1.Y = parseFloat(f1s[1]);
            this.P1.Z = parseFloat(f1s[2]);
            this.P2.X = parseFloat(f2s[0]);
            this.P2.Y = parseFloat(f2s[1]);
            this.P2.Z = parseFloat(f2s[2]);
            this.From = json["from"];
            this.To = json["to"];
        }
        get BBX() {
            if (this._bbx == null) {
                var p1_ = this.P1.Clone();
                var p2_ = this.P2.Clone();
                var scl = this.Selector.Result.CoordScale;
                p1_.Scale(scl);
                p2_.Scale(scl);
                this._bbx = new U1.BoundingBox(U1.Vector3.Min(p1_, p2_), U1.Vector3.Max(p1_, p2_));
            }
            return this._bbx;
        }
        GetRelatedNodes() {
            return [this.GetModel().node_map.get(this.From), this.GetModel().node_map.get(this.To)];
        }
        FillLineGeometry(lineGeom, tm) {
            var p1_ = this.P1.Clone();
            var p2_ = this.P2.Clone();
            var scl = this.Selector.Result.CoordScale;
            p1_.Scale(scl);
            p2_.Scale(scl);
            lineGeom.AppendLine(p1_, p2_, tm);
        }
    }
    KBim.CcmEntityDistance = CcmEntityDistance;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CcmEntityPolygon extends KBim.CcmEntity {
        ReadJson(json) {
            super.ReadJson(json);
            let strboundary = json["boundary"];
            this.boundary = [];
            if (strboundary != null) {
                let xys = strboundary.split(" ");
                for (let xy of xys) {
                    let fs = xy.split(",");
                    let p = new U1.Vector3();
                    p.X = parseFloat(fs[0]);
                    p.Y = parseFloat(fs[1]);
                    p.Z = parseFloat(fs[2]);
                    this.boundary.push(p);
                }
            }
        }
        get BBX() {
            if (this._bbx == null) {
                if (this.boundary != null) {
                    var scl = this.Selector.Result.CoordScale;
                    this._bbx = U1.BoundingBox.CreateFromPoints(this.boundary
                        .map(o_ => {
                        return U1.Vector3.Scale(o_, scl);
                    }));
                }
            }
            return this._bbx;
        }
        FillLineGeometry(lineGeom, tm) {
            var _a, _b, _c;
            var z = (_c = (_b = (_a = this.GetIfcNode()) === null || _a === void 0 ? void 0 : _a.Min) === null || _b === void 0 ? void 0 : _b.Z) !== null && _c !== void 0 ? _c : this.GetModel().geomMin.Z;
            var scl = this.Selector.Result.CoordScale;
            var wm = U1.Matrix4.CreateScaleByFloats(scl, scl, scl);
            wm.Multiply(U1.Matrix4.CreateTranslationFloats(0, 0, z));
            if (tm != null)
                wm.Multiply(tm);
            lineGeom.AddppendPolygon(this.boundary, wm);
        }
    }
    KBim.CcmEntityPolygon = CcmEntityPolygon;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CcResult {
        get Code_Cate() {
            if (this.Category == null || this.Category == "")
                return this.Code;
            return this.Code + " " + this.Category;
        }
        ReadJson(json) {
            this.Code = json["code"];
            this.Category = json["category"];
            this.Storey = json["storey"];
            this.Result = json["result"];
            this.Check = json["check"];
            this.Message = json["message"];
            this.Comment = json["comment"];
            this.CoordScale = json["coordscale"];
            var xsel = json["selector"];
            if (xsel instanceof Object) {
                this.selector = new KBim.CcSelector();
                this.selector.Result = this;
                this.selector.ReadJson(xsel);
            }
        }
        static FromJson(json) {
            var result = [];
            for (var item of json) {
                let cc = new CcResult();
                cc.ReadJson(item);
                result.push(cc);
            }
            return result;
        }
    }
    KBim.CcResult = CcResult;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CcSelector {
        ReadJson(json) {
            this.ETYP = json["etyp"];
            if (this.ETYP == "EntityDistance") {
                this.Entity = new KBim.CcmEntityDistance();
            }
            else if (this.ETYP == "EmptySpace") {
                this.Entity = new KBim.CcmEmptySpace();
            }
            else if (this.ETYP == "EntityPolygon") {
                this.Entity = new KBim.CcmEntityPolygon();
            }
            else {
                this.Entity = new KBim.CcmEntity();
            }
            this.Entity.Selector = this;
            this.Entity.ReadJson(json["entity"]);
        }
    }
    KBim.CcSelector = CcSelector;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class CcvControl extends U1.Views.VcControl {
            constructor() {
                super();
                this._areas = [];
                this._selectedAreas = null;
                this._isInvalid = true;
                this._selectedNode = null;
            }
            get Areas() {
                return this._areas;
            }
            set Areas(value) {
                var _a;
                this._areas = value;
                this.InvokePropertyChanged("Areas");
                this._isInvalid = true;
                (_a = this.View) === null || _a === void 0 ? void 0 : _a.Invalidate();
            }
            get SelectedAreas() {
                return this._selectedAreas;
            }
            set SelectedAreas(value) {
                var _a;
                this.UpdateHilight(this._selectedNode, false);
                this._selectedAreas = value;
                this.InvokePropertyChanged("SelectedAreas");
                this._isInvalid = true;
                this._selectedNode = [];
                value === null || value === void 0 ? void 0 : value.forEach(o_ => {
                    let node = o_ === null || o_ === void 0 ? void 0 : o_.GetIfcNode();
                    let relNodes = o_ === null || o_ === void 0 ? void 0 : o_.GetRelatedNodes();
                    if (node != null)
                        this._selectedNode.push(node);
                    relNodes === null || relNodes === void 0 ? void 0 : relNodes.forEach(rn_ => this._selectedNode.push(rn_));
                });
                this.UpdateHilight(this._selectedNode, true);
                (_a = this.View) === null || _a === void 0 ? void 0 : _a.Invalidate();
            }
            SetSelectedAreas(value) {
                this.SelectedAreas = value;
            }
            AddArea(area) {
                if (this.Areas.Contains(area))
                    return;
                this.Areas.push(area);
                this.InvokePropertyChanged("Areas");
            }
            get Overlay() {
                var viewThree = this.View;
                var sceneThree = viewThree.Scene;
                var overlay = sceneThree.SceneOverlay;
                return overlay;
            }
            Clear() {
                var _a, _b, _c;
                if (this._lineSegments != null)
                    (_a = this.Overlay) === null || _a === void 0 ? void 0 : _a.remove(this._lineSegments);
                (_b = this._lineMat) === null || _b === void 0 ? void 0 : _b.dispose();
                (_c = this._lineGeometry) === null || _c === void 0 ? void 0 : _c.dispose();
                this._lineMat = null;
                this._lineGeometry = null;
                this._lineSegments = null;
                super.Clear();
            }
            OnUpdate() {
                if (!this._isInvalid)
                    return;
                this._isInvalid = false;
                var viewThree = this.View;
                var sceneThree = viewThree.Scene;
                var overlay = sceneThree.SceneOverlay;
                this.Clear();
                if (this._selectedAreas != null) {
                    var lineGeom = new U1.LineBufferGeometry();
                    lineGeom.BeginAppend();
                    for (var ent of this._selectedAreas) {
                        if (ent instanceof KBim.CcmEmptySpace ||
                            ent instanceof KBim.CcmEntityPolygon) {
                            ent.FillLineGeometry(lineGeom);
                        }
                        else {
                            ent === null || ent === void 0 ? void 0 : ent.FillLineGeometry(lineGeom);
                        }
                    }
                    lineGeom.EndAppend();
                    if (lineGeom.PointCount >= 2) {
                        this._lineGeometry = new THREE.BufferGeometry();
                        Views.ThreeUtil.ApplyLineBufferGeometry(this._lineGeometry, lineGeom);
                    }
                }
                if (this._lineGeometry != null) {
                    this._lineMat = new THREE.LineBasicMaterial();
                    this._lineMat.color.setHex(0xFF0000);
                    this._lineSegments = new THREE.LineSegments(this._lineGeometry, this._lineMat);
                    this.Overlay.add(this._lineSegments);
                }
            }
            UpdateHilight(nodes, isHilight) {
                if (nodes == null || nodes.length == 0)
                    return;
                for (var node of nodes) {
                    node === null || node === void 0 ? void 0 : node.SetHilight(isHilight);
                }
            }
        }
        Views.CcvControl = CcvControl;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class CcvEdgesControl extends U1.Views.VcControl {
        }
        Views.CcvEdgesControl = CcvEdgesControl;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class VcBDNode extends U1.Views.VcControl {
            Update() {
                var view = this.View;
                if (this.svgG == null) {
                    var svgns = "http://www.w3.org/2000/svg";
                    this.svgG = document.createElementNS(svgns, 'g');
                    var svgOverlay = this.View.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.appendChild(this.svgG);
                    var text = document.createElementNS(svgns, 'text');
                    text.textContent = this.Text;
                    text.setAttribute("x", "0" + "px");
                    text.setAttribute("y", "0" + "px");
                    text.setAttribute("text-anchor", "middle");
                    this.svgG.appendChild(text);
                    var textResoNm = document.createElementNS(svgns, 'text');
                    textResoNm.textContent = this.TextResoNm;
                    textResoNm.setAttribute("x", "0" + "px");
                    textResoNm.setAttribute("y", 10000 / this.View.Scene.Camera.OrthoHeight + "px");
                    textResoNm.setAttribute("text-anchor", "middle");
                    this.svgG.appendChild(textResoNm);
                    var textIpAddr = document.createElementNS(svgns, 'text');
                    textIpAddr.textContent = this.TextIpAddr.substring(0, 31);
                    textIpAddr.setAttribute("x", "0" + "px");
                    textIpAddr.setAttribute("y", 10000 / this.View.Scene.Camera.OrthoHeight * 2 + "px");
                    textIpAddr.setAttribute("text-anchor", "middle");
                    this.svgG.appendChild(textIpAddr);
                }
                if (this.svgG.childNodes.length > 0) {
                    let textChild = this.svgG.childNodes.item(0);
                    textChild.setAttribute("font-size", 10000 / this.View.Scene.Camera.OrthoHeight + "");
                    let textChild1 = this.svgG.childNodes.item(1);
                    textChild1.setAttribute("font-size", 10000 / this.View.Scene.Camera.OrthoHeight + "");
                    textChild1.setAttribute("y", 10000 / this.View.Scene.Camera.OrthoHeight + "px");
                    let textChild2 = this.svgG.childNodes.item(2);
                    textChild2.setAttribute("font-size", 10000 / this.View.Scene.Camera.OrthoHeight + "");
                    textChild2.setAttribute("y", 10000 / this.View.Scene.Camera.OrthoHeight * 2 + "px");
                }
                var sp = this.View.Scene.Camera.WorldToScreen(this.Position);
                this.svgG.setAttribute("transform", "matrix(1 0 0 1 " + (sp.X) + " " + (sp.Y) + ")");
            }
            Clear() {
                if (this.svgG != null) {
                    var svgOverlay = this.View.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.removeChild(this.svgG);
                    this.svgG = undefined;
                }
            }
        }
        Views.VcBDNode = VcBDNode;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class VcPoint extends U1.Views.VcControl {
            Update() {
                var view = this.View;
                if (this.svgEllipse == null) {
                    var svgns = "http://www.w3.org/2000/svg";
                    this.svgEllipse = document.createElementNS(svgns, 'ellipse');
                    var svgOverlay = this.View.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.appendChild(this.svgEllipse);
                }
                var sp = this.View.Scene.Camera.WorldToScreen(this.Position);
                this.svgEllipse.setAttribute("cx", sp.X.toString());
                this.svgEllipse.setAttribute("cy", sp.Y.toString());
                this.svgEllipse.setAttribute("rx", this.Radius.toString());
                this.svgEllipse.setAttribute("ry", this.Radius.toString());
                if (this.Fill == null)
                    this.svgEllipse.style.removeProperty("fill");
                else
                    this.svgEllipse.style.setProperty("fill", this.Fill.toHexString());
                if (this.Stroke == null)
                    this.svgEllipse.style.removeProperty("stroke");
                else
                    this.svgEllipse.style.setProperty("stroke", this.Stroke.toHexString());
            }
            Clear() {
                if (this.svgEllipse != null) {
                    var svgOverlay = this.View.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.removeChild(this.svgEllipse);
                    this.svgEllipse = undefined;
                }
            }
        }
        Views.VcPoint = VcPoint;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class VcTooltipBox extends U1.Views.VcControl {
            Update() {
                var view = this.View;
                if (this.svgG == null) {
                    var svgns = "http://www.w3.org/2000/svg";
                    this.svgG = document.createElementNS(svgns, 'g');
                    var svgOverlay = this.View.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.appendChild(this.svgG);
                    var rect = document.createElementNS(svgns, 'rect');
                    rect.style.strokeWidth = "2px";
                    rect.style.strokeDasharray = "5,5";
                    rect.setAttribute("width", "100px");
                    rect.setAttribute("height", "100px");
                    rect.setAttribute("opacity", "0.5");
                    rect.style.fill = "gray";
                    rect.addEventListener("click", (e_) => {
                        alert(this.FID + "clicked");
                    });
                    this.svgG.appendChild(rect);
                    var text = document.createElementNS(svgns, 'text');
                    text.textContent = this.Tooltip;
                    text.setAttribute("x", "2px");
                    text.setAttribute("y", "40px");
                    this.svgG.appendChild(text);
                }
                var sp = this.View.Scene.Camera.WorldToScreen(this.Position);
                this.svgG.setAttribute("transform", "matrix(1 0 0 1 " + sp.X + " " + sp.Y + ")");
            }
            Clear() {
                if (this.svgG != null) {
                    var svgOverlay = this.View.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.removeChild(this.svgG);
                    this.svgG = undefined;
                }
            }
        }
        Views.VcTooltipBox = VcTooltipBox;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class VcView3DText extends U1.Views.VcControl {
            Update() {
                var view = this.View;
                if (this.svgG == null) {
                    var svgns = "http://www.w3.org/2000/svg";
                    this.svgG = document.createElementNS(svgns, 'g');
                    var svgOverlay = this.View.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.appendChild(this.svgG);
                    var text = document.createElementNS(svgns, 'text');
                    text.textContent = this.Text;
                    text.setAttribute("x", "0" + "px");
                    text.setAttribute("y", "0" + "px");
                    text.setAttribute("text-anchor", "middle");
                    this.svgG.appendChild(text);
                }
                if (this.svgG.childNodes.length > 0) {
                    let textChild = this.svgG.childNodes.item(0);
                    if (this.View.Scene.Camera.ProjectionMode == U1.ProjectionTypeEnum.Orthographic) {
                        textChild.setAttribute("font-size", 40000 / 420 / this.View.Scene.Camera.OrthoHeight + "");
                    }
                    else {
                        textChild.setAttribute("font-size", 40000 / 30 / this.View.Scene.Camera.OrthoHeight + "");
                    }
                }
                var sp = this.View.Scene.Camera.WorldToScreen(this.Position);
                this.svgG.setAttribute("transform", "matrix(1 0 0 1 " + (sp.X) + " " + (sp.Y) + ")");
                this.View.Invalidate();
            }
            Clear() {
                if (this.svgG != null) {
                    var svgOverlay = this.View.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.removeChild(this.svgG);
                    this.svgG = undefined;
                }
            }
        }
        Views.VcView3DText = VcView3DText;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdEntity extends U1.UGeomElement {
        constructor() {
            super(...arguments);
            this.handle = "";
            this.layerName = "";
            this.lineType = "solid";
            this.lineThick = 1;
            this.linePattern = [1];
            this.isFilled = false;
            this.fillColor = U1.Colors.Gray;
            this.color = U1.Colors.Black;
            this.useLayerColor = false;
            this.useBlockColor = false;
        }
        get Handle() {
            return this.handle;
        }
        set Handle(value) {
            this.SetProperty("Handle", "handle", value);
        }
        get LayerName() {
            return this.layerName;
        }
        set LayerName(value) {
            this.SetProperty("LayerName", "layerName", value);
        }
        get LineType() {
            return this.lineType;
        }
        set LineType(value) {
            this.SetProperty("LineType", "linetype", value);
        }
        get LineThick() {
            return this.lineThick;
        }
        set LineThick(value) {
            this.SetProperty("LineThick", "lineThick", value);
        }
        get LinePattern() {
            return this.linePattern;
        }
        set LinePattern(value) {
            this.SetProperty("LinePattern", "linePattern", value);
        }
        get IsFilled() {
            return this.isFilled;
        }
        set IsFilled(value) {
            this.SetProperty("IsFilled", "isFilled", value);
        }
        get FillColor() {
            return this.fillColor;
        }
        set FillColor(value) {
            this.SetProperty("FillColor", "fillColor", value);
        }
        get Color() {
            return this.color;
        }
        set Color(value) {
            this.SetProperty("Color", "color", value);
        }
        get UseLayerColor() {
            return this.useLayerColor;
        }
        set UseLayerColor(value) {
            this.SetProperty("UseLayerColor", "useLayerColor", value);
        }
        get UseBlockColor() {
            return this.useBlockColor;
        }
        set UseBlockColor(value) {
            this.SetProperty("UseBlockColor", "useBlockColor", value);
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Handle = props.GetStr("Handle", this.handle);
            this.LayerName = props.GetStr("LayerName", this.layerName);
            this.LineType = props.GetStr("LineType", this.lineType);
            this.LineThick = props.GetInt("LineThick", this.lineThick);
            this.LinePattern = props.GetIntArr("LinePattern", this.linePattern);
            this.IsFilled = props.GetBool("IsFilled", this.isFilled);
            this.FillColor = props.GetValue(U1.Color, "FillColor", this.fillColor);
            this.Color = props.GetValue(U1.Color, "Color", this.color);
            this.UseLayerColor = props.GetBool("UseLayerColor", this.useLayerColor);
            this.UseBlockColor = props.GetBool("UseBlockColor", this.useBlockColor);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetStr("Handle", this.handle);
            props.SetStr("LayerName", this.layerName);
            props.SetStr("LineType", this.lineType);
            props.SetInt("LineThick", this.lineThick);
            props.SetIntArr("LinePattern", this.linePattern);
            props.SetBool("IsFilled", this.isFilled);
            props.SetValue("FillColor", this.fillColor);
            props.SetValue("Color", this.color);
            props.SetBool("UseLayerColor", this.useLayerColor);
            props.SetBool("UseBlockColor", this.useBlockColor);
        }
        static SetTransformCircle(entity, xform) {
            var s_;
            s_ = CdEntity[".stfc."] || (CdEntity[".stfc."] = s_ =
                {
                    v0: new U1.Vector3(),
                    sc: new U1.Vector3(), axis: new U1.Vector4(), loc: new U1.Vector3()
                });
            var v0 = s_.v0;
            var scale = s_.sc;
            var axis = s_.axis;
            var loc = s_.loc;
            xform.ToSRT(scale, axis, loc);
            entity.Center = U1.Vector3.Transform(entity.Center, xform, v0);
            entity.Radius *= Math.max(scale.X, Math.max(scale.Y, scale.Z));
            entity.Normal = v0.SetTransformNormal(entity.Normal, xform).Normalize();
        }
        UpdateGeoms(result) {
            super.UpdateGeoms(result);
        }
    }
    KBim.CdEntity = CdEntity;
    class CdEntitySet extends U1.UNode {
        AddEntity(ctor) {
            var entity = super.AddChild(ctor);
            return entity;
        }
        get Entities() {
            return this.Children
                .filter(o_ => o_ instanceof CdEntity);
        }
    }
    KBim.CdEntitySet = CdEntitySet;
    U1.UDocument.Creaters["CdEntity"] = CdEntity;
    U1.UDocument.Creaters["CdEntitySet"] = CdEntitySet;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdArc extends KBim.CdEntity {
        constructor() {
            super(...arguments);
            this.center = new U1.Vector3();
            this.normal = U1.Vector3.UnitZ;
            this.startAngle = 0;
            this.endAngle = 0;
            this.radius = 1;
        }
        get Center() {
            return this.center;
        }
        set Center(value) {
            this.SetProperty("Center", "center", value);
        }
        get Normal() {
            return this.normal;
        }
        set Normal(value) {
            this.SetProperty("Normal", "normal", value);
        }
        get StartAngle() {
            return this.startAngle;
        }
        set StartAngle(value) {
            this.SetProperty("StartAngle", "startAngle", value);
        }
        get EndAngle() {
            return this.endAngle;
        }
        set EndAngle(value) {
            this.SetProperty("EndAngle", "endAngle", value);
        }
        get Radius() {
            return this.radius;
        }
        set Radius(value) {
            this.SetProperty("Radius", "radius", value);
        }
        get Path() {
            if (this.path3 == null || this.path3.length === 0) {
                if (this.path3 == null)
                    this.path3 = [];
                var yAxis = CdArc[".path.uy"] || (CdArc[".path.uy"] = U1.Vector3.UnitY);
                var xAxis = CdArc[".path.ux"] || (CdArc[".path.ux"] = U1.Vector3.UnitX);
                var v = CdArc[".path.v"] || (CdArc[".path.v"] = U1.Vector3.UnitX);
                var v0 = CdArc[".path.v0"] || (CdArc[".path.v0"] = U1.Vector3.Zero);
                var v1 = CdArc[".path.v1"] || (CdArc[".path.v1"] = U1.Vector3.Zero);
                var m = CdArc[".path.m"] || (CdArc[".path.m"] = U1.Matrix4.Identity);
                U1.GeometryHelper3.GetArbitraryAxis(this.Normal, xAxis, yAxis);
                var cnt = this.Center;
                var s_a = this.StartAngle;
                var e_a = this.EndAngle;
                if (e_a <= s_a)
                    e_a += Math.PI * 2;
                var ang = e_a - s_a;
                var segment = 32;
                if (ang < Math.PI * 3 / 2)
                    segment = 24;
                if (ang < Math.PI)
                    segment = 16;
                if (ang < Math.PI / 2)
                    segment = 8;
                var delt = ang / segment;
                var plist = this.path3;
                var norm = this.Normal;
                var rad = this.Radius;
                m.SetIdentity();
                v.SetZero();
                for (var a = s_a;; a += delt) {
                    if (a >= e_a)
                        a = e_a;
                    v.SetAdd(v0.SetScale(xAxis, Math.cos(a)), v1.SetScale(yAxis, Math.sin(a)));
                    var p = U1.Vector3.Scale(v, rad);
                    p.Add(cnt);
                    plist.push(p);
                    if (a >= e_a)
                        break;
                }
            }
            return this.path3;
        }
        get PropertyCategory() {
            return "Arc";
        }
        OnGeometryChanged(source) {
            super.OnGeometryChanged(source);
            this.path3 = null;
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Center = props.GetValue(U1.Vector3, "Center", this.center);
            this.Normal = props.GetValue(U1.Vector3, "Normal", this.normal);
            this.StartAngle = props.GetFloat("StartAngle", this.startAngle);
            this.EndAngle = props.GetFloat("EndAngle", this.endAngle);
            this.Radius = props.GetFloat("Radius", this.radius);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetValue("Center", this.center);
            props.SetValue("Normal", this.normal);
            props.SetFloat("StartAngle", this.startAngle);
            props.SetFloat("EndAngle", this.endAngle);
            props.SetFloat("Radius", this.radius);
        }
        OnPropertyChanged(name) {
            if (name === "IsMouseOver") {
            }
            else {
                if (name === "Center" ||
                    name === "EndAngle" ||
                    name === "StartAngle" ||
                    name === "Normal") {
                    this.InvokeTransformChanged();
                    this.InvokeGeometryChanged();
                }
            }
            super.OnPropertyChanged(name);
        }
        UpdateBounding() {
            var path = this.Path;
            if (path.length > 0) {
                var lbb = CdArc[".ub.lbb"] || (CdArc[".ub.lbb"] = new U1.BoundingBox());
                lbb.SetCreateFromPoints(path);
                lbb.Max.Z += 0.1;
                this.m_boundingBox.SetCreateFromPoints(path);
                this.m_boundingBox.Max.Z += 0.1;
                this.m_boundingSphere.SetCreateFromPoints(path);
            }
        }
        UpdateGeoms(result) {
            super.UpdateGeoms(result);
            var color = this.Color;
            var isFilled = this.IsFilled;
            var thick = this.LineThick;
            var linePattern = this.LinePattern;
            var fillColor = this.FillColor;
            var points = this.Path;
            var snapPoints = [
                new U1.Geoms.GeSnapPoint(this.Center, U1.Geoms.GeSnapTypeEnum.Center),
                new U1.Geoms.GeSnapPoint(points[0], U1.Geoms.GeSnapTypeEnum.End),
                new U1.Geoms.GeSnapPoint(points[points.length - 1], U1.Geoms.GeSnapTypeEnum.End)
            ];
            var geomEnt = null;
            if (isFilled)
                geomEnt = new U1.Geoms.GePolylineFill({ fillColor: fillColor, color: color, thick: thick, points: points, linePattern: linePattern });
            else
                geomEnt = new U1.Geoms.GePolyline({ color: color, thick: thick, points: points, linePattern: linePattern });
            if (geomEnt != null) {
                geomEnt.SnapPoints = snapPoints;
                result.push(geomEnt);
            }
        }
        SetTransform(xform) {
            KBim.CdEntity.SetTransformCircle(this, xform);
        }
    }
    KBim.CdArc = CdArc;
    U1.UDocument.Creaters["CdArc"] = CdArc;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdBlock extends U1.UGeomElement {
        constructor() {
            super(...arguments);
            this.color = U1.Colors.Black;
            this.orign = new U1.Vector3();
        }
        get Entities() {
            return this.Children.filter(o_ => o_ instanceof KBim.CdEntity);
        }
        get Color() {
            return this.color;
        }
        set Color(value) {
            this.SetProperty("Color", "color", value);
        }
        get Orign() {
            return this.orign;
        }
        set Orign(value) {
            this.SetProperty("Orign", "orign", value);
        }
        AddEntity(ctor) {
            return this.AddChild(ctor);
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Color = props.GetValue(U1.Color, "Color", this.color);
            this.Orign = props.GetValue(U1.Vector3, "Orign", this.orign);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetValue("Color", this.color);
            props.SetValue("Orign", this.orign);
        }
        GetGeomNodes(parentXForm, nodes) {
            parentXForm = U1.Matrix4.Multiply(this.Transform, parentXForm);
            for (var ent of this.Entities) {
                ent.GetGeomNodes(parentXForm, nodes);
            }
        }
        OnGeometryChanged(source) {
            super.OnGeometryChanged(source);
        }
        OnChildAdded(child) {
            super.OnChildAdded(child);
            this.InvokePropertyChanged("EntityChanged");
        }
        OnChildDeleting(child) {
            super.OnChildDeleting(child);
            this.InvokePropertyChanged("EntityChanged");
        }
        UpdateTransform() {
            var orign = this.Orign;
            this.m_transform.SetCreateTranslationFloats(-orign.X, -orign.Y, -orign.Z);
        }
    }
    KBim.CdBlock = CdBlock;
    class CdBlockSet extends U1.UNode {
        GetBlock(name) {
            if (this.namedItems == null)
                this.namedItems = {};
            if (this.namedItems[name] === undefined)
                this.namedItems[name] = this.GetChild(CdBlock, name);
            return this.namedItems[name];
        }
        OnChildAdded(child) {
            super.OnChildAdded(child);
            this.namedItems = null;
        }
        OnChildDeleting(child) {
            super.OnChildDeleting(child);
            this.namedItems = null;
        }
    }
    KBim.CdBlockSet = CdBlockSet;
    U1.UDocument.Creaters["CdBlock"] = CdBlock;
    U1.UDocument.Creaters["CdBlockSet"] = CdBlockSet;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdEntity3d extends KBim.CdEntity {
        constructor() {
            super(...arguments);
            this.location = U1.Vector3.Zero;
            this.scale = U1.Vector3.One;
            this.axis = U1.Vector3.UnitZ;
            this.angle = 0;
        }
        get Location() {
            return this.location;
        }
        set Location(value) {
            this.SetProperty("Location", "location", value);
        }
        get Scale() {
            return this.scale;
        }
        set Scale(value) {
            this.SetProperty("Scale", "scale", value);
        }
        get Axis() {
            return this.axis;
        }
        set Axis(value) {
            this.SetProperty("Axis", "axis", value);
        }
        get Angle() {
            return this.angle;
        }
        set Angle(value) {
            this.SetProperty("Angle", "angle", value);
        }
        OnPropertyChanged(name) {
            super.OnPropertyChanged(name);
            if (name == "Location" ||
                name == "Scale" ||
                name == "Axis" ||
                name == "Angle") {
                this.InvokeTransformChanged();
            }
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Location = props.GetValue(U1.Vector3, "Location", this.location);
            this.Scale = props.GetValue(U1.Vector3, "Scale", this.scale);
            this.Axis = props.GetValue(U1.Vector3, "Axis", this.axis);
            this.Angle = props.GetFloat("Angle", this.angle);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetValue("Location", this.location);
            props.SetValue("Scale", this.scale);
            props.SetValue("Axis", this.axis);
            props.SetFloat("Angle", this.angle);
        }
        UpdateTransform() {
            var m0 = CdEntity3d[".utf.m0"] || (CdEntity3d[".utf.m0"] = U1.Matrix4.Identity);
            var m1 = CdEntity3d[".utf.m1"] || (CdEntity3d[".utf.m1"] = U1.Matrix4.Identity);
            this.m_transform
                .SetCreateScale(this.Scale)
                .Multiply(m0.SetCreateFromAxisAngle(this.Axis, this.Angle))
                .Multiply(m1.SetCreateTranslation(this.Location));
        }
        SetTransform(xform) {
            var s_;
            s_ = CdEntity3d[".stf."] || (CdEntity3d[".stf."] = s_ = {
                scale: new U1.Vector3(),
                axisang: new U1.Vector4(),
                axis: new U1.Vector3(),
                loc: new U1.Vector3()
            });
            xform.ToSRT(s_.scale, s_.axisang, s_.loc);
            s_.axisang.GetXYZ(s_.axis);
            this.Location = s_.loc;
            this.Scale = s_.scale;
            this.Axis = s_.axis;
            this.Angle = s_.axisang.W;
        }
    }
    KBim.CdEntity3d = CdEntity3d;
    U1.UDocument.Creaters["CdEntity3d"] = CdEntity3d;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdBlockReference extends KBim.CdEntity3d {
        constructor() {
            super(...arguments);
            this.blockName = "";
            this.blockInvalid = true;
        }
        get KDocument() {
            if (this.Document instanceof KBim.KDocument)
                return this.Document;
            return null;
        }
        get BlockSet() {
            if (!this.blockInvalid)
                return this.blockSet;
            this.blockInvalid = false;
            var vdDoc = this.KDocument;
            var cdDrawing = this.FindAncestor(KBim.CdDrawing);
            if (cdDrawing != null) {
                this.blockSet = cdDrawing.BlockSet;
            }
            return this.blockSet;
        }
        get Block() {
            var blockSet = this.BlockSet;
            if (blockSet == null)
                return null;
            return blockSet.GetBlock(this.BlockName);
        }
        set(value) {
            this.BlockName = value != null ? value.Name : "";
        }
        get BlockName() {
            return this.blockName;
        }
        set BlockName(value) {
            this.SetProperty("BlockName", "blockName", value);
        }
        get PropertyCategory() {
            return KBim.KBimStringService.LB_BLOCK_REFERENCE;
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.BlockName = props.GetStr("BlockName", this.blockName);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetStr("BlockName", this.blockName);
        }
        UpdateBounding() {
            var v0 = CdBlockReference[".ub.v0"] || (CdBlockReference[".ub.v0"] = U1.Vector3.Zero);
            var v1 = CdBlockReference[".ub.v1"] || (CdBlockReference[".ub.v1"] = U1.Vector3.Zero);
            var cv = CdBlockReference[".ub.cv"] || (CdBlockReference[".ub.cv"] =
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
            if (this.Block == null || this.Block.Entities == null) {
                return;
            }
            var min = this.m_boundingBox.Min;
            var max = this.m_boundingBox.Max;
            min.SetMaxValue();
            max.SetMinValue();
            for (var blkEntity of this.Block.Entities) {
                var lbb = blkEntity.BoundingBox;
                var tm = blkEntity.Transform;
                v0.SetTransform(lbb.Min, tm);
                v1.SetTransform(lbb.Max, tm);
                lbb.GetCorners(cv).map(o_ => o_.Transform(tm)).forEach(o_ => {
                    min.Minimize(o_);
                    max.Maximize(o_);
                });
            }
            this.m_boundingSphere.SetCreateFromBoundingBox(this.m_boundingBox);
        }
        GetProperties() {
            var result = super.GetProperties();
            var loc2 = new U1.Vector2();
            var loc3 = new U1.Vector3();
            var loc_prop = new U1.UPropLoc3();
            loc_prop.Source = this;
            loc_prop.Label = KBim.KBimStringService.LB_LOCATION;
            loc_prop.GetValueFunc = (p_) => this.Location;
            loc_prop.SetValueFunc = (p_, val_) => {
                this.Location = val_;
            };
            var scale_prop = new U1.UPropScale3();
            scale_prop.Source = this;
            scale_prop.Label = KBim.KBimStringService.LB_SCALE;
            scale_prop.GetValueFunc = (p_) => this.Scale;
            scale_prop.SetValueFunc = (p_, val_) => {
                this.Scale = val_;
            };
            var angle_prop = new U1.UPropAngle();
            angle_prop.Source = this;
            angle_prop.Label = KBim.KBimStringService.LB_ROTAION;
            angle_prop.GetValueFunc = (p_) => U1.MathHelper.ToDegrees(this.Angle);
            angle_prop.SetValueFunc = (p_, val_) => {
                this.Angle = U1.MathHelper.ToRadians(val_);
            };
            result.push(loc_prop);
            result.push(scale_prop);
            result.push(angle_prop);
            return result;
        }
        CovertToGroup() {
            var group;
            if (this.Parent instanceof KBim.CdEntitySet) {
                let parent = this.Parent;
                group = parent.AddEntity(KBim.CdGroup);
            }
            if (this.Parent instanceof KBim.CdBlock) {
                let parent = this.Parent;
                group = parent.AddEntity(KBim.CdGroup);
            }
            if (this.Parent instanceof KBim.CdGroup) {
                let parent = this.Parent;
                group = parent.AddEntity(KBim.CdGroup);
            }
            if (group != null) {
                for (var ch of this.Block.Entities) {
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
        GetGeomNodes(parentXForm, nodes) {
            parentXForm = U1.Matrix4.Multiply(this.Transform, parentXForm);
            if (this.Block != null) {
                this.Block.GetGeomNodes(parentXForm, nodes);
            }
        }
    }
    KBim.CdBlockReference = CdBlockReference;
    U1.UDocument.Creaters["CdBlockReference"] = CdBlockReference;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdCircle extends KBim.CdEntity {
        constructor() {
            super(...arguments);
            this.thickness = 1;
            this.center = new U1.Vector3();
            this.radius = 1;
            this.normal = U1.Vector3.UnitZ;
        }
        get Thickness() {
            return this.thickness;
        }
        set Thickness(value) {
            this.SetProperty("Thickness", "thickness", value);
        }
        get Center() {
            return this.center;
        }
        set Center(value) {
            this.SetProperty("Center", "center", value);
        }
        get Radius() {
            return this.radius;
        }
        set Radius(value) {
            this.SetProperty("Radius", "radius", value);
        }
        get Normal() {
            return this.normal;
        }
        set Normal(value) {
            this.SetProperty("Normal", "normal", value);
        }
        get Path3() {
            if (this._path3 == null) {
                var minAxis = U1.Vector3.Scale(U1.Vector3.UnitX, this.Radius);
                var majAxis = U1.Vector3.Scale(U1.Vector3.UnitY, this.Radius);
                var cnt = this.Center;
                var s_a = 0.0;
                var e_a = Math.PI * 2;
                if (e_a <= s_a)
                    e_a += Math.PI * 2;
                var ang = e_a - s_a;
                var segment = 32;
                if (ang < Math.PI * 3 / 2)
                    segment = 24;
                if (ang < Math.PI)
                    segment = 16;
                if (ang < Math.PI / 2)
                    segment = 8;
                var delt = ang / segment;
                var p = U1.Vector3.Zero;
                var plist = [];
                var norm = this.Normal;
                var m = U1.Matrix4.Identity;
                var v = U1.Vector3.Zero;
                for (var a = s_a;; a += delt) {
                    if (a >= e_a)
                        a = e_a;
                    v = U1.Vector3.Add(U1.Vector3.Scale(majAxis, Math.cos(a)), U1.Vector3.Scale(minAxis, Math.sin(a)));
                    p = v;
                    p.Add(cnt);
                    plist.push(p);
                    if (a >= e_a)
                        break;
                }
                this._path3 = plist;
            }
            return this._path3;
        }
        OnPropertyChanged(prop) {
            super.OnPropertyChanged(prop);
            this._path3 = null;
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Thickness = props.GetFloat("Thickness", this.thickness);
            this.Center = props.GetValue(U1.Vector3, "Center", this.center);
            this.Normal = props.GetValue(U1.Vector3, "Normal", this.normal);
            this.Radius = props.GetFloat("Radius", this.radius);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetFloat("Thickness", this.thickness);
            props.SetValue("Center", this.center);
            props.SetValue("Normal", this.normal);
            props.SetFloat("Radius", this.radius);
        }
        SetTransform(xform) {
            KBim.CdEntity.SetTransformCircle(this, xform);
        }
        UpdateGeoms(result) {
            super.UpdateGeoms(result);
            var color = this.Color;
            var isFilled = this.IsFilled;
            var thick = this.LineThick;
            var linePattern = this.LinePattern;
            var fillColor = this.FillColor;
            var points = this.Path3;
            var geEnt = null;
            var snapPoints = [
                new U1.Geoms.GeSnapPoint(this.center, U1.Geoms.GeSnapTypeEnum.Center),
                new U1.Geoms.GeSnapPointArr([points[0], points[points.length - 1]], U1.Geoms.GeSnapTypeEnum.Center)
            ];
            if (isFilled) {
                geEnt = new U1.Geoms.GePolygonFill({
                    fillColor: fillColor,
                    color: color,
                    thick: thick,
                    points: points,
                    linePattern: linePattern
                });
            }
            else {
                geEnt = new U1.Geoms.GePolygon({
                    color: color,
                    thick: thick,
                    points: points,
                    linePattern: linePattern
                });
            }
            geEnt.SnapPoints = snapPoints;
            result.push(geEnt);
        }
    }
    KBim.CdCircle = CdCircle;
    U1.UDocument.Creaters["CdCircle"] = CdCircle;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdDrawing extends U1.UNode {
        constructor() {
            super(...arguments);
            this.namedChildren = {};
        }
        get BlockSet() {
            return this.GetNamedChild(KBim.CdBlockSet, "Blocks");
        }
        get EntitySet() {
            return this.GetNamedChild(KBim.CdEntitySet, "Entities");
        }
        get LayerSet() {
            return this.GetNamedChild(KBim.CdLayerSet, "Layers");
        }
        Initialize() {
            this.AddChild(KBim.CdBlockSet, "Blocks");
            this.AddChild(KBim.CdEntitySet, "Entities");
            this.namedChildren = {};
        }
        AddEntity(ctor) {
            return this.EntitySet.AddEntity(ctor);
        }
        OnChildAdded(child) {
            super.OnChildAdded(child);
            this.namedChildren = {};
        }
        OnChildDeleting(child) {
            super.OnChildDeleting(child);
            this.namedChildren = {};
        }
        GetNamedChild(ctor, name) {
            if (this.namedChildren[name] == null)
                this.namedChildren[name] = this.GetChild(ctor, name);
            return this.namedChildren[name];
        }
        LoadDXF(dxfFileData) {
        }
    }
    KBim.CdDrawing = CdDrawing;
    class CdDrawingSet extends U1.UNode {
        constructor() {
            super(...arguments);
            this.namedItems = {};
        }
        AddDrawing(name) {
            return super.AddChild(CdDrawing, name);
        }
        GetDrawing(name) {
            if (this.namedItems[name] == null)
                this.namedItems[name] = this.GetChild(CdDrawing, name);
            return this.namedItems[name];
        }
        OnChildAdded(child) {
            super.OnChildAdded(child);
            this.namedItems = {};
        }
        OnChildDeleting(child) {
            super.OnChildDeleting(child);
            this.namedItems = {};
        }
    }
    KBim.CdDrawingSet = CdDrawingSet;
    U1.UDocument.Creaters["CdDrawing"] = CdDrawing;
    U1.UDocument.Creaters["CdDrawingSet"] = CdDrawingSet;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdEllipse extends KBim.CdEntity {
        constructor() {
            super(...arguments);
            this.center = new U1.Vector3();
            this.normal = U1.Vector3.UnitZ;
            this.majorAxis = U1.Vector3.UnitX;
            this.ratio = 1;
            this.start = 0;
            this.end = 0;
            this._path3 = null;
        }
        get Center() {
            return this.center;
        }
        set Center(value) {
            this.SetProperty("Center", "center", value);
        }
        get Normal() {
            return this.normal;
        }
        set Normal(value) {
            this.SetProperty("Normal", "normal", value);
        }
        get MajorAxis() {
            return this.majorAxis;
        }
        set MajorAxis(value) {
            this.SetProperty("MajorAxis", "majorAxis", value);
        }
        get Ratio() {
            return this.ratio;
        }
        set Ratio(value) {
            this.SetProperty("Ratio", "ratio", value);
        }
        get Start() {
            return this.start;
        }
        set Start(value) {
            this.SetProperty("Start", "start", value);
        }
        get End() {
            return this.end;
        }
        set End(value) {
            this.SetProperty("End", "end", value);
        }
        get MinorAxis() {
            var minAxis = U1.Vector3.Cross(this.Normal, this.majorAxis);
            minAxis = U1.Vector3.Scale(minAxis, this.Ratio);
            return minAxis;
        }
        get Path3() {
            if (this._path3 == null) {
                var minAxis = this.MinorAxis;
                var majAxis = this.MajorAxis;
                var cnt = this.Center;
                var rat = this.Ratio;
                var s_a = this.Start;
                var e_a = this.End;
                if (e_a <= s_a)
                    e_a += Math.PI * 2;
                var ang = e_a - s_a;
                var segment = 32;
                if (ang < Math.PI * 3 / 2)
                    segment = 24;
                if (ang < Math.PI)
                    segment = 16;
                if (ang < Math.PI / 2)
                    segment = 8;
                var delt = ang / segment;
                var p = U1.Vector3.Zero;
                var plist = new Array();
                var norm = this.Normal;
                var m = U1.Matrix4.Identity;
                var v = U1.Vector3.Zero;
                for (var a = s_a;; a += delt) {
                    if (a >= e_a)
                        a = e_a;
                    v = U1.Vector3.Add(U1.Vector3.Scale(majAxis, Math.cos(a)), U1.Vector3.Scale(minAxis, Math.sin(a)));
                    p = v;
                    p.Add(cnt);
                    plist.push(p);
                    if (a >= e_a)
                        break;
                }
                this._path3 = plist;
            }
            return this._path3;
        }
        OnPropertyChanged(prop) {
            super.OnPropertyChanged(prop);
            this._path3 = null;
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Center = props.GetValue(U1.Vector3, "Center", this.center);
            this.Normal = props.GetValue(U1.Vector3, "Normal", this.normal);
            this.MajorAxis = props.GetValue(U1.Vector3, "MajorAxis", this.majorAxis);
            this.Ratio = props.GetFloat("Ratio", this.ratio);
            this.Start = props.GetFloat("Start", this.start);
            this.End = props.GetFloat("End", this.end);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetValue("Center", this.center);
            props.SetValue("Normal", this.normal);
            props.SetValue("MajorAxis", this.majorAxis);
            props.SetFloat("Ratio", this.ratio);
            props.SetFloat("Start", this.start);
            props.SetFloat("End", this.end);
        }
        UpdateGeoms(result) {
            super.UpdateGeoms(result);
            var color = this.Color;
            var isFilled = this.IsFilled;
            var thick = this.LineThick;
            var linePattern = this.LinePattern;
            var fillColor = this.FillColor;
            var points = this.Path3;
            var geEnt = null;
            var snapPoints = [];
            {
                new U1.Geoms.GeSnapPoint(this.Center, U1.Geoms.GeSnapTypeEnum.Center),
                    new U1.Geoms.GeSnapPointArr([points[0], points[points.length - 1]], U1.Geoms.GeSnapTypeEnum.End);
            }
            ;
            if (isFilled)
                geEnt = new U1.Geoms.GePolylineFill({
                    fillColor: fillColor,
                    color: color,
                    thick: thick,
                    points: points,
                    linePattern: linePattern
                });
            else
                geEnt = new U1.Geoms.GePolyline({
                    color: color, thick: thick, points: points, linePattern: linePattern
                });
            geEnt.SnapPoints = snapPoints;
            result.push(geEnt);
        }
    }
    KBim.CdEllipse = CdEllipse;
    U1.UDocument.Creaters["CdEllipse"] = CdEllipse;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdGroup extends KBim.CdEntity3d {
        get Items() {
            return this.Children
                .filter(o_ => o_ instanceof KBim.CdEntity)
                .OrderBy(o_ => o_.ID);
        }
        AddEntity(ctor) {
            return super.AddChild(ctor);
        }
        AddEntityCopy(child) {
            return this.AddChildCopy(child);
        }
    }
    KBim.CdGroup = CdGroup;
    U1.UDocument.Creaters["CdGroup"] = CdGroup;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdLayer extends U1.UNode {
        constructor() {
            super(...arguments);
            this.color = U1.Colors.White;
            this.flag = 0;
            this.isfrozen = false;
            this.islocked = false;
            this.visible = true;
        }
        get Color() {
            return this.color;
        }
        set Color(value) {
            this.SetProperty("Color", "color", value);
        }
        get IsFrozen() {
            return this.isfrozen;
        }
        set IsFrozen(value) {
            this.SetProperty("IsFrozen", "isfrozen", value);
        }
        get IsLocked() {
            return this.islocked;
        }
        set IsLocked(value) {
            this.SetProperty("IsLocked", "islocked", value);
        }
        get Visible() {
            return this.visible;
        }
        set Visible(value) {
            this.SetProperty("Visible", "visible", value);
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Color = props.GetValue(U1.Color, "Color", this.color);
            this.IsFrozen = props.GetBool("IsFrozen", this.isfrozen);
            this.IsLocked = props.GetBool("IsLocked", this.islocked);
            this.Visible = props.GetBool("Visible", this.visible);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetValue("Color", this.color);
            props.SetBool("IsFrozen", this.isfrozen);
            props.SetBool("IsLocked", this.islocked);
            props.SetBool("Visible", this.visible);
        }
    }
    KBim.CdLayer = CdLayer;
    class CdLayerSet extends U1.UNode {
        constructor() {
            super(...arguments);
            this.namedItems = {};
        }
        AddLayer(name) {
            return super.AddChild(CdLayer, name);
        }
        GetLayer(name) {
            if (this.namedItems[name] == null)
                this.namedItems[name] = this.GetChild(CdLayer, name);
            return this.namedItems[name];
        }
        OnChildAdded(child) {
            super.OnChildAdded(child);
            this.namedItems = {};
        }
        OnChildDeleting(child) {
            super.OnChildDeleting(child);
            this.namedItems = {};
        }
    }
    KBim.CdLayerSet = CdLayerSet;
    U1.UDocument.Creaters["CdLayer"] = CdLayer;
    U1.UDocument.Creaters["CdLayerSet"] = CdLayerSet;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdLine extends KBim.CdEntity {
        constructor() {
            super(...arguments);
            this.start = U1.Vector3.Zero;
            this.end = U1.Vector3.Zero;
        }
        get Start() {
            return this.start;
        }
        set Start(value) {
            this.SetProperty("Start", "start", value);
        }
        get End() {
            return this.end;
        }
        set End(value) {
            this.SetProperty("End", "end", value);
        }
        OnPropertyChanged(name) {
            super.OnPropertyChanged(name);
            this.InvokeGeometryChanged();
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Start = props.GetValue(U1.Vector3, "Start", this.start);
            this.End = props.GetValue(U1.Vector3, "End", this.end);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetValue("Start", this.start);
            props.SetValue("End", this.end);
        }
        UpdateBounding() {
            super.UpdateBounding();
            var sp = this.Start;
            var ep = this.End;
            this.m_boundingBox.Min.SetMin(sp, ep);
            this.m_boundingBox.Max.SetMax(sp, ep);
            this.m_boundingSphere.SetCreateFromBoundingBox(this.m_boundingBox);
        }
        SetTransform(xform) {
            this.Start = U1.Vector3.Transform(this.Start, xform);
            this.End = U1.Vector3.Transform(this.End, xform);
        }
        get PropertyCategory() {
            return KBim.KBimStringService.LB_LINE;
        }
        GetProperties() {
            var result = super.GetProperties() || [];
            var p_tk = new U1.UPropDouble();
            p_tk.Source = this;
            p_tk.Category = KBim.KBimStringService.LB_POLYLINE;
            p_tk.Label = KBim.KBimStringService.LB_LINE_WIDTH;
            p_tk.GetValueFunc = (p_) => {
                return this.LineThick;
            };
            p_tk.SetValueFunc = (p_, v) => {
                this.LineThick = v;
            };
            var p_tc = new U1.UPropColor();
            p_tc.Source = this;
            p_tc.Category = KBim.KBimStringService.LB_POLYLINE;
            p_tc.Group = KBim.KBimStringService.COLOR;
            p_tc.Label = KBim.KBimStringService.LINE_COLOR;
            p_tc.GetValueFunc = (p_) => {
                return this.Color;
            };
            p_tc.SetValueFunc = (p_, v_) => {
                this.Color = v_;
            };
            return result;
        }
        UpdateGeoms(result) {
            super.UpdateGeoms(result);
            var color = this.Color;
            var isFilled = this.IsFilled;
            var thick = this.LineThick;
            var linePattern = this.LinePattern;
            var fillColor = this.FillColor;
            var sp = this.Start;
            var ep = this.End;
            var snapPoints = [
                new U1.Geoms.GeSnapPointArr([sp, ep], U1.Geoms.GeSnapTypeEnum.End)
            ];
            var geLine = new U1.Geoms.GeLine();
            geLine.Start = sp;
            geLine.End = ep,
                geLine.Color = color;
            geLine.Thick = thick;
            geLine.LinePattern = linePattern;
            geLine.SnapPoints = snapPoints;
            result.push(geLine);
            return geLine;
        }
    }
    KBim.CdLine = CdLine;
    U1.UDocument.Creaters["CdLine"] = CdLine;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdPoint extends KBim.CdEntity {
        constructor() {
            super(...arguments);
            this.pos = U1.Vector3.Zero;
        }
        get Pos() {
            return this.pos;
        }
        set Pos(value) {
            this.SetProperty("Pos", "pos", value);
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Pos = props.GetValue(U1.Vector3, "Pos", this.pos);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetValue("Pos", this.pos);
        }
        SetTransform(xform) {
            this.Pos = U1.Vector3.Transform(this.Pos, xform);
        }
    }
    KBim.CdPoint = CdPoint;
    U1.UDocument.Creaters["CdPoint"] = CdPoint;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdPolyline2d extends KBim.CdEntity {
        constructor() {
            super(...arguments);
            this.flag = 0;
            this.elevation = 0;
            this.normal = U1.Vector3.UnitZ;
        }
        get Flag() {
            return this.flag;
        }
        set Flag(value) {
            this.SetProperty("Flag", "flag", value);
        }
        get Elevation() {
            return this.elevation;
        }
        set Elevation(value) {
            this.SetProperty("Elevation", "elevation", value);
        }
        get Vertices() {
            return this.Children
                .filter(o_ => o_ instanceof KBim.CdVertex2d)
                .OrderBy((o_) => o_.Index);
        }
        get Normal() {
            return this.normal;
        }
        set Normal(value) {
            this.SetProperty("Normal", "normal", value);
        }
        get SnapPoints() {
            if (this.snapPoints == null) {
                this.snapPoints =
                    this.Vertices.map(o_ => o_.Position.Clone());
            }
            return this.snapPoints;
        }
        get Path3() {
            if (this.path3 == null) {
                var z = this.Elevation;
                var polyline = this.GetPath();
                this.path3 = polyline
                    .map(o_ => new U1.Vector3(o_, z));
            }
            return this.path3;
        }
        get Path2() {
            if (this.path2 == null) {
                var result = this.GetPath();
                this.path2 = result;
            }
            return this.path2;
        }
        GetPath() {
            var vs = this.Vertices;
            var result = [];
            if (vs.length == 0)
                return result;
            result.push(vs[0].Position.XY());
            for (var i = 1; i <= vs.length; i++) {
                if (i == vs.length && !this.IsClosed)
                    break;
                var pv = vs[i - 1];
                var cv = vs[i % vs.length];
                if (U1.Vector3.DistanceSquared(pv.Position, cv.Position) < 0.00001)
                    continue;
                if (cv.Bulge < -0.001 || cv.Bulge > 0.001) {
                    var start = pv.Position.XY();
                    var end = cv.Position.XY();
                    var bulge = U1.Vector2.Distance(start, end) / 2 * cv.Bulge;
                    var arc = new U1.Arc2(start, end, bulge);
                    var tvs = arc.Slice(16);
                    for (var j = 1; j < tvs.length; j++) {
                        result.push(tvs[j]);
                    }
                }
                else {
                    if (i != vs.length)
                        result.push(cv.Position.XY());
                }
            }
            return result;
        }
        get IsClosed() {
            return (this.Flag & 1) == 1;
        }
        set IsClosed(value) {
            if (value)
                this.Flag = (this.Flag | 1);
            else
                this.Flag = (this.Flag & ~1);
        }
        get NumberOfVertex() {
            return this.Vertices.length;
        }
        GetArcSegments() {
            var result = [];
            var vs = this.Vertices;
            if (vs.length == 0)
                return result;
            var z = this.Elevation;
            for (var i = 1; i <= vs.length; i++) {
                if (i == vs.length && !this.IsClosed)
                    break;
                var pv = vs[i - 1];
                var cv = vs[i % vs.length];
                var start = pv.Position.XY();
                var end = cv.Position.XY();
                var bulge = 0.0;
                if (cv.Bulge != 0)
                    bulge = U1.Vector2.Distance(start, end) / 2 * cv.Bulge;
                var arc = new U1.Arc2(start, end, bulge);
                arc.Tag = i - 1;
                result.push(arc);
            }
            return result;
        }
        SetArcSegments(arcs) {
            for (var v of this.Vertices.slice()) {
                v.Detach();
            }
            var v_idx = this.NextVertexIndex;
            for (var i = 0; i < arcs.length; i++) {
                var s = arcs[i].Start;
                var e = arcs[i].End;
                var bulge = arcs[i].Bulge;
                bulge /= U1.Vector2.Distance(s, e) / 2;
                this.AppendVertex(s, v_idx++, bulge);
            }
        }
        GetArcSegment(seg_num) {
            var vs = this.Vertices;
            if (seg_num < 0 || seg_num >= vs.length)
                return null;
            var s_num = seg_num;
            var e_num = seg_num + 1;
            if (e_num >= vs.length)
                e_num = 0;
            var s_v = vs[s_num];
            var e_v = vs[e_num];
            var bulge = 0.0;
            if (e_v.Bulge != 0 && U1.Vector2.Distance(s_v.Position.XY(), e_v.Position.XY()) > 0.00001) {
                bulge = e_v.Bulge * U1.Vector2.Distance(s_v.Position.XY(), e_v.Position.XY()) / 2;
            }
            var result = new U1.Arc2();
            result.Start = s_v.Position.XY();
            result.End = e_v.Position.XY();
            result.Bulge = bulge;
            return result;
        }
        SplitSegmentAt(seg_num, p) {
            var vs = this.Vertices;
            var seg_arc = this.GetArcSegment(seg_num);
            var segs = U1.Arc2.SplitWithPoint(seg_arc, p);
            if (segs.length != 2)
                return null;
            var b0 = segs[0].Bulge;
            if (b0 != 0 && U1.Vector2.Distance(segs[0].Start, segs[0].End) > 0.00001)
                b0 = b0 / (U1.Vector2.Distance(segs[0].Start, segs[0].End) / 2);
            var b1 = segs[0].Bulge;
            if (b1 != 0 && U1.Vector2.Distance(segs[1].Start, segs[1].End) > 0.00001)
                b1 = b1 / (U1.Vector2.Distance(segs[1].Start, segs[1].End) / 2);
            var v0 = vs[seg_num];
            var v1 = vs[(seg_num + 1) % vs.length];
            v1.Bulge = b1;
            return this.InsertVertexAt(v0, p, b0);
        }
        SplitSegmentAt_1(seg_num, u) {
            if (u <= 0 || u >= 1)
                return null;
            var seg_arc = this.GetArcSegment(seg_num);
            if (seg_arc == null)
                return null;
            return this.SplitSegmentAt(seg_num, seg_arc.GetPositionAtU(u));
        }
        OnPropertyChanged(name) {
            super.OnPropertyChanged(name);
            this.InvokeGeometryChanged();
        }
        OnGeometryChanged(source) {
            super.OnGeometryChanged(source);
            this.InvalidateBounding();
            this.path3 = null;
            this.snapPoints = null;
            this.path2 = null;
            this.m_invalidBounding = true;
        }
        TransmitChildPropertyChanged(source, name) {
            if (source instanceof KBim.CdVertex2d)
                return false;
            return true;
        }
        OnChildPropertyChanged(source, name) {
            if (source instanceof KBim.CdVertex2d)
                this.InvokePropertyChanged("Vertices");
            this.InvokeGeometryChanged();
        }
        OnChildAdded(child) {
            super.OnChildAdded(child);
            this.InvokeGeometryChanged();
        }
        OnChildDeleting(element) {
            super.OnChildDeleting(element);
            this.InvokeGeometryChanged();
        }
        AppendVertex(p, indx, bulge = 0) {
            var nv = this.AddChild(KBim.CdVertex2d);
            nv.Bulge = bulge;
            nv.Position = new U1.Vector3(p.X, p.Y);
            nv.Index = indx;
            return nv;
        }
        get NextVertexIndex() {
            var num = 0;
            for (var v of this.Vertices) {
                num = num < v.Index ? v.Index : num;
            }
            num++;
            return num;
        }
        AppendVertex1(p, bulge = 0) {
            var num = this.NextVertexIndex;
            var nv = this.AddChild(KBim.CdVertex2d);
            nv.Bulge = bulge;
            nv.Position = new U1.Vector3(p.X, p.Y);
            nv.Index = num;
            return nv;
        }
        InsertVertexAt(prev, p, bulge = 0) {
            var vs = this.Vertices;
            var index = prev != null ? prev.Index + 1 : 0;
            for (var v of vs) {
                if (prev == null || prev.Index < v.Index) {
                    v.Index += 1;
                }
            }
            var nv = this.AddChild(KBim.CdVertex2d);
            nv.Bulge = bulge;
            nv.Position = new U1.Vector3(p.X, p.Y);
            nv.Index = index;
            return nv;
        }
        SetVertices(ps) {
            for (var v of this.Vertices) {
                v.Detach();
            }
            var v_idx = this.NextVertexIndex;
            for (var p of ps) {
                this.AppendVertex(p, v_idx++);
            }
        }
        UpdateBounding() {
            super.UpdateBounding();
            var elv = this.Elevation;
            var path = this.Vertices
                .map(o_ => {
                var pos = o_.Position;
                return new U1.Vector3(pos.X, pos.Y, elv);
            });
            if (path.length > 0) {
                var lbb = U1.BoundingBox.CreateFromPoints(path, this.m_boundingBox);
                lbb.Max.Z += 0.1;
                this.m_boundingBox.CopyFrom(lbb);
                this.m_boundingSphere = U1.BoundingSphere.CreateFromBoundingBox(lbb);
            }
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Flag = props.GetInt("Flag", this.flag);
            this.Elevation = props.GetFloat("Elevation", this.elevation);
            this.Normal = props.GetValue(U1.Vector3, "Normal", this.normal);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetInt("Flag", this.flag);
            props.SetFloat("Elevation", this.elevation);
            props.SetValue("Normal", this.normal);
        }
        Offset(offset) {
            var vs = this.Vertices;
            var polygon = vs
                .map(o_ => o_.Position.XY());
            var offsetPolygon;
            if (this.IsClosed) {
                offsetPolygon = U1.GeometryHelper2.OffsetPolygon(polygon, offset);
                if (offsetPolygon == null)
                    return false;
                var pgon = new U1.CGAL.Polygon2();
                pgon.Points = offsetPolygon;
                if (!pgon.IsSimple()) {
                    pgon.MakeSimple();
                    offsetPolygon = pgon.Points;
                }
            }
            else {
                offsetPolygon = U1.GeometryHelper2.OffsetPolyline(polygon, offset);
                if (offsetPolygon == null)
                    return false;
            }
            for (var i = 0; i < vs.length && i < offsetPolygon.length; i++) {
                vs[i].Position = new U1.Vector3(offsetPolygon[i]);
            }
            for (var i = offsetPolygon.length; i < vs.length; i++) {
                vs[i].Detach();
            }
            this.InvokeGeometryChanged();
            return true;
        }
        CopyFrom(other) {
            for (var p of this.Vertices) {
                p.Detach();
            }
            if (other == null)
                return;
            var prev = U1.Vector2.MinValue;
            var vs = other.Vertices;
            var isClosed = other.IsClosed;
            this.AddChildCopy(vs[0], vs[0].Name);
            for (var ci = 1; ci < vs.length; ci++) {
                var pi = ci - 1;
                var ni = ci < vs.length - 1 ? ci + 1 : 0;
                var pv = vs[pi];
                var cv = vs[ci];
                var nv = vs[ni];
                var pp = pv.Position.XY();
                var cp = cv.Position.XY();
                var np = nv.Position.XY();
                if (U1.Vector2.Distance(pp, cp) < 0.1)
                    continue;
                if (ci == vs.length - 1 && U1.Vector2.Distance(cp, np) < 0.1) {
                    isClosed = true;
                    continue;
                }
                if (ni > 0 &&
                    U1.Vector2.Dot(U1.Vector2.Subtract(pp, cp).Normalize(), U1.Vector2.Subtract(np, cp).Normalize()) > 0.95)
                    continue;
                prev = cp;
                this.AddChildCopy(cv, cv.Name);
            }
            this.IsClosed = isClosed;
        }
        SetTransform(xform) {
            for (var v of this.Vertices) {
                v.Position = U1.Vector3.Transform(v.Position, xform);
            }
        }
        UpdateGeoms(result) {
            super.UpdateGeoms(result);
            var points = this.Path3;
            if (this.IsClosed &&
                points.length > 3 &&
                U1.Vector3.DistanceSquared(points[0], points[points.length - 1]) < 0.001) {
                points = points
                    .slice(0, points.length - 2);
            }
            var createArgs = {
                isClosed: this.IsClosed,
                color: this.Color,
                isFilled: this.IsFilled,
                thick: this.LineThick,
                linePattern: this.LinePattern,
                fillColor: this.FillColor,
                points: points
            };
            var snapPoints = [
                new U1.Geoms.GeSnapPointArr(points, U1.Geoms.GeSnapTypeEnum.End)
            ];
            var geEnt;
            if (this.IsFilled) {
                if (this.IsClosed)
                    geEnt = new U1.Geoms.GePolygonFill(createArgs);
                else
                    geEnt = new U1.Geoms.GePolylineFill(createArgs);
            }
            else {
                if (this.IsClosed)
                    geEnt = new U1.Geoms.GePolygon(createArgs);
                else
                    geEnt = new U1.Geoms.GePolyline(createArgs);
            }
            geEnt.SnapPoints = snapPoints;
            result.push(geEnt);
        }
        get PropertyCategory() {
            return KBim.KBimStringService.LB_POLYLINE;
        }
        Contans(loc) {
            var path2 = this.Path2;
            if (path2 == null || path2.length < 3)
                return false;
            var pgon = new U1.CGAL.Polygon2();
            pgon.Points = path2.slice();
            if (pgon.IsCW())
                pgon.Reverse();
            return pgon.HasOnBoundedSide(loc);
        }
        ContansAll(locs) {
            var path2 = this.Path2;
            if (path2 == null || path2.length < 3)
                return false;
            var src_min = this.BoundingBox.Min;
            var src_max = this.BoundingBox.Max;
            var tgt_min = U1.Vector2.MaxValue.Minimize(locs);
            var tgt_max = U1.Vector2.MinValue.Maximize(locs);
            if (tgt_max.X < src_min.X ||
                tgt_max.Y < src_min.Y ||
                tgt_min.X > src_max.X ||
                tgt_min.Y > src_max.Y)
                return false;
            var pgon = new U1.CGAL.Polygon2(path2);
            for (var loc of locs) {
                if (!pgon.HasOnBoundedSide(loc))
                    return false;
            }
            return true;
        }
        ContansAny(locs) {
            var path2 = this.Path2;
            if (path2 == null || path2.length < 3)
                return false;
            var src_min = this.BoundingBox.Min;
            var src_max = this.BoundingBox.Max;
            var tgt_min = U1.Vector2.MaxValue.Minimize(locs);
            var tgt_max = U1.Vector2.MinValue.Maximize(locs);
            if (tgt_max.X < src_min.X ||
                tgt_max.Y < src_min.Y ||
                tgt_min.X > src_max.X ||
                tgt_min.Y > src_max.Y)
                return false;
            var pgon = new U1.CGAL.Polygon2(path2);
            if (pgon.IsCW()) {
                pgon.Reverse();
            }
            for (var loc of locs) {
                if (pgon.HasOnBoundedSide(loc))
                    return true;
            }
            return false;
        }
        get ShowTooltip() {
            return this._ShowTooltip;
        }
        set ShowTooltip(value) {
            this._ShowTooltip = value;
            this.InvokePropertyChanged("ShowTooltip");
        }
    }
    KBim.CdPolyline2d = CdPolyline2d;
    U1.UDocument.Creaters["CdPolyline2d"] = CdPolyline2d;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdText extends KBim.CdEntity3d {
        constructor() {
            super(...arguments);
            this.fontSize = 1;
            this.fontStyle = KBim.FontStyleEnum.Normal;
            this.fontWeight = KBim.FontWeightEnum.Normal;
            this.fontFamily = "Arial";
            this.textAlignment = KBim.TextAlignmentEnum.Left;
            this.width = 2;
            this.widthFactor = 1;
            this.height = 1.4;
            this.isSingleLine = false;
        }
        get Text() {
            return this.text;
        }
        set Text(value) {
            this.SetProperty("Text", "text", value);
        }
        get FontSize() {
            return this.fontSize;
        }
        set FontSize(value) {
            this.SetProperty("FontSize", "fontSize", value);
        }
        get FontStyle() {
            return this.fontStyle;
        }
        set FontStyle(value) {
            this.SetProperty("FontStyle", "fontStyle", value);
        }
        get FontWeight() {
            return this.fontWeight;
        }
        set FontWeight(value) {
            this.SetProperty("FontWeight", "fontWeight", value);
        }
        get FontFamily() {
            return this.fontFamily;
        }
        set FontFamily(value) {
            this.SetProperty("FontFamily", "fontFamily", value);
        }
        get TextAlignment() {
            return this.textAlignment;
        }
        set TextAlignment(value) {
            this.SetProperty("TextAlignment", "textAlignment", value);
        }
        get Width() {
            return this.width;
        }
        set Width(value) {
            this.SetProperty("Width", "width", value);
        }
        get WidthFactor() {
            return this.widthFactor;
        }
        set WidthFactor(value) {
            this.SetProperty("WidthFactor", "widthFactor", value);
        }
        get Height() {
            return this.height;
        }
        set Height(value) {
            this.SetProperty("Height", "height", value);
        }
        get IsSingleLine() {
            return this.isSingleLine;
        }
        set IsSingleLine(value) {
            this.SetProperty("IsSingleLine", "isSingleLine", value);
        }
        get PropertyCategory() {
            return "Text";
        }
        OnGeometryChanged(source) {
            super.OnGeometryChanged(source);
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Text = props.GetStr("Text", this.text);
            this.FontStyle = props.GetInt("FontStyle", this.fontStyle);
            this.FontWeight = props.GetInt("FontWeight", this.fontWeight);
            this.FontSize = props.GetFloat("FontSize", this.fontSize);
            this.FontFamily = props.GetStr("FontFamily", this.fontFamily);
            this.TextAlignment = props.GetInt("TextAlignment", this.textAlignment);
            this.Width = props.GetFloat("Width", this.width);
            this.WidthFactor = props.GetFloat("WidthFactor", this.widthFactor);
            this.Height = props.GetFloat("Height", this.height);
            this.IsSingleLine = props.GetBool("IsSingleLine", this.isSingleLine);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetStr("Text", this.text);
            props.SetInt("FontStyle", this.fontStyle);
            props.SetInt("FontWeight", this.fontWeight);
            props.SetFloat("FontSize", this.fontSize);
            props.SetStr("FontFamily", this.fontFamily);
            props.SetInt("TextAlignment", this.textAlignment);
            props.SetFloat("Width", this.width);
            props.SetFloat("WidthFactor", this.widthFactor);
            props.SetFloat("Height", this.height);
            props.SetBool("IsSingleLine", this.isSingleLine);
        }
        OnPropertyChanged(name) {
            if (name === "IsMouseOver") {
            }
            else {
                if (name === "Center" ||
                    name === "EndAngle" ||
                    name === "StartAngle" ||
                    name === "Normal") {
                    this.InvokeTransformChanged();
                    this.InvokeGeometryChanged();
                }
            }
            super.OnPropertyChanged(name);
        }
        UpdateGeoms(result) {
            super.UpdateGeoms(result);
            var getext = new U1.Geoms.GeText();
            getext.FontSize = this.FontSize;
            getext.FontFamily = this.FontFamily;
            getext.Text = this.Text;
            getext.Height = this.Height;
            getext.Width = this.Width;
            getext.WidthFactor = this.WidthFactor;
            getext.Color = this.Color;
            getext.IsSingleLine = this.IsSingleLine;
            getext.FontStyle = this.FontStyle;
            getext.FontWeight = this.FontWeight;
            getext.TextAlignment = this.TextAlignment;
            getext.Position = this.Transform.Translation;
            getext.Rotation = this.Angle;
            result.push(getext);
        }
    }
    KBim.CdText = CdText;
    U1.UDocument.Creaters["CdText"] = CdText;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdVertex extends U1.UGeomElement {
        constructor() {
            super(...arguments);
            this.index = 0;
        }
        get Index() {
            return this.index;
        }
        set Index(value) {
            this.SetProperty("Index", "index", value);
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Index = props.GetInt("Index", this.index);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetInt("Index", this.index);
        }
    }
    KBim.CdVertex = CdVertex;
    U1.UDocument.Creaters["CdVertex"] = CdVertex;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class CdVertex2d extends KBim.CdVertex {
        constructor() {
            super(...arguments);
            this.position = U1.Vector3.Zero;
            this.bulge = 0;
            this.tangent = 0;
            this.tangentused = false;
        }
        get Position() {
            return this.position;
        }
        set Position(value) {
            this.SetProperty("Position", "position", value);
        }
        get Bulge() {
            return this.bulge;
        }
        set Bulge(value) {
            this.SetProperty("Bulge", "bulge", value);
        }
        get Tangent() {
            return this.tangent;
        }
        set Tangent(value) {
            this.SetProperty("Tangent", "tangent", value);
        }
        get TangentUsed() {
            return this.tangentused;
        }
        set TangentUsed(value) {
            this.SetProperty("TangentUsed", "tangentused", value);
        }
        Detach() {
            super.Detach();
            this.InvokeGeometryChanged();
        }
        ReadProps(props) {
            super.ReadProps(props);
            this.Position = props.GetValue(U1.Vector3, "Position", this.position);
            this.Bulge = props.GetFloat("Bulge", this.bulge);
            this.Tangent = props.GetFloat("Tangent", this.tangent);
            this.TangentUsed = props.GetBool("TangentUsed", this.tangentused);
        }
        WriteProps(props) {
            super.WriteProps(props);
            props.SetValue("Position", this.position);
            props.SetFloat("Bulge", this.bulge);
            props.SetFloat("Tangent", this.tangent);
            props.SetBool("TangentUsed", this.tangentused);
        }
        OnPropertyChanged(name) {
            super.OnPropertyChanged(name);
            this.InvokeGeometryChanged();
        }
    }
    KBim.CdVertex2d = CdVertex2d;
    U1.UDocument.Creaters["CdVertex2d"] = CdVertex2d;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    let FontStyleEnum;
    (function (FontStyleEnum) {
        FontStyleEnum[FontStyleEnum["Normal"] = 0] = "Normal";
        FontStyleEnum[FontStyleEnum["Italic"] = 1] = "Italic";
        FontStyleEnum[FontStyleEnum["Oblique"] = 2] = "Oblique";
    })(FontStyleEnum = KBim.FontStyleEnum || (KBim.FontStyleEnum = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    let FontWeightEnum;
    (function (FontWeightEnum) {
        FontWeightEnum[FontWeightEnum["Normal"] = 0] = "Normal";
        FontWeightEnum[FontWeightEnum["Black"] = 1] = "Black";
        FontWeightEnum[FontWeightEnum["Bold"] = 2] = "Bold";
        FontWeightEnum[FontWeightEnum["DemiBold"] = 3] = "DemiBold";
        FontWeightEnum[FontWeightEnum["ExtraBlack"] = 4] = "ExtraBlack";
        FontWeightEnum[FontWeightEnum["ExtraBold"] = 5] = "ExtraBold";
        FontWeightEnum[FontWeightEnum["ExtraLight"] = 6] = "ExtraLight";
        FontWeightEnum[FontWeightEnum["Heavy"] = 7] = "Heavy";
        FontWeightEnum[FontWeightEnum["Light"] = 8] = "Light";
        FontWeightEnum[FontWeightEnum["Medium"] = 9] = "Medium";
        FontWeightEnum[FontWeightEnum["Regular"] = 10] = "Regular";
        FontWeightEnum[FontWeightEnum["SemiBold"] = 11] = "SemiBold";
        FontWeightEnum[FontWeightEnum["Thin"] = 12] = "Thin";
        FontWeightEnum[FontWeightEnum["UltraBlack"] = 13] = "UltraBlack";
        FontWeightEnum[FontWeightEnum["UltraBold"] = 14] = "UltraBold";
        FontWeightEnum[FontWeightEnum["UltraLight"] = 15] = "UltraLight";
    })(FontWeightEnum = KBim.FontWeightEnum || (KBim.FontWeightEnum = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    let TextAlignmentEnum;
    (function (TextAlignmentEnum) {
        TextAlignmentEnum[TextAlignmentEnum["Left"] = 0] = "Left";
        TextAlignmentEnum[TextAlignmentEnum["Right"] = 1] = "Right";
        TextAlignmentEnum[TextAlignmentEnum["Center"] = 2] = "Center";
        TextAlignmentEnum[TextAlignmentEnum["Justify"] = 3] = "Justify";
    })(TextAlignmentEnum = KBim.TextAlignmentEnum || (KBim.TextAlignmentEnum = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KDocument extends U1.UDocument {
        GetNamedElement(ctor, name) {
            if (this.namedElements == null)
                this.namedElements = {};
            var old = this.namedElements[name];
            if (old == null || old.Document != this || !(old instanceof ctor)) {
                old = this.namedElements[name] = this
                    .GetElementsByType(ctor)
                    .filter(o_ => o_.Name === name)[0];
            }
            return old;
        }
        InvokeElementAttached(element) {
            super.InvokeElementAttached(element);
            if (this.isLoading)
                return;
        }
        InvokeElementRemoving(element) {
            super.InvokeElementRemoving(element);
            if (this.isLoading)
                return;
        }
        InvokeAfterUndoRedo(isUndo) {
            super.InvokeAfterUndoRedo(isUndo);
            if (this.isLoading)
                return;
        }
        InvokeBeforeEndTransaction() {
            super.InvokeBeforeEndTransaction();
            if (this.isLoading)
                return;
        }
        InvokeAfterEndTransaction() {
            super.InvokeAfterEndTransaction();
            if (this.isLoading)
                return;
        }
        InvokeAfterAbortTransaction() {
            super.InvokeAfterAbortTransaction();
            if (this.isLoading)
                return;
        }
        InvokeElementChanged(element, prop) {
            super.InvokeElementChanged(element, prop);
            if (this.isLoading)
                return;
        }
        InvokeBeforeClear() {
            super.InvokeBeforeClear();
        }
        InvokeAfterClear() {
            super.InvokeAfterClear();
        }
        InvokeAfterChanged() {
            super.InvokeAfterChanged();
        }
        LoadXML(doc) {
            this.Clear();
            this.BeginLoad();
            this.ReadXmlDocument(doc);
            this.EndLoad();
        }
        LoadZip(doc) {
            this.ReadXmlDocument(doc);
        }
    }
    KBim.KDocument = KDocument;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KElement extends U1.UNode {
    }
    KBim.KElement = KElement;
})(KBim || (KBim = {}));
var U1;
(function (U1) {
    var Meshes;
    (function (Meshes) {
        class MMeshOp {
            static V_DistanceToLoop(v, loop_start) {
                let vs = loop_start.GetLoopVs();
                let dir1 = new U1.Vector3();
                let dir2 = new U1.Vector3();
                let p = v.P;
                let min_dist = Number.MAX_VALUE;
                for (let i = 0; i < vs.length; i++) {
                    let ni = i + 1;
                    if (ni >= vs.length)
                        ni = 0;
                    let p1 = vs[i].P;
                    let p2 = vs[ni].P;
                    dir1.SetSubtract(p2, p1);
                    dir2.SetSubtract(p, p1);
                    let t = U1.Vector3.Dot(dir1, dir2) / U1.Vector3.Dot(dir1, dir1);
                    let dist = 0;
                    if (t >= 1 + MMeshOp.Epsilon)
                        continue;
                    if (t < MMeshOp.Epsilon)
                        dist = U1.Vector3.DistanceSquared(p1, p);
                    else {
                        dist = Math.pow(dir2.Length(), 2) - Math.pow(t * dir1.Length(), 2);
                    }
                    if (dist < min_dist) {
                        min_dist = dist;
                    }
                }
                return Math.sqrt(min_dist);
            }
            static E_Split(edg, amount) {
                if (amount <= 0 || amount >= 1)
                    return;
                let nx = edg.Next;
                let op = edg.Opp;
                let mesh = edg.Parent;
                let v1 = edg.V;
                let v2 = nx.V;
                let mv = mesh.NewVert();
                mv.P = U1.Vector3.Lerp(v1.P, v2.P, amount);
                if (mv.P.X == 2.5) {
                    let k = 0;
                }
                let n_nx = mesh.NewEdge();
                n_nx.V = mv;
                n_nx.Next = edg.Next;
                edg.Next = n_nx;
                n_nx._face_ = edg._face_;
                n_nx.UV = U1.Vector2.Lerp(edg.UV, nx.UV, amount);
                if (op != null) {
                    let op_nx = op.Next;
                    let n_op = mesh.NewEdge();
                    n_op.UV = U1.Vector2.Lerp(op_nx.UV, op.UV, amount);
                    n_op._face_ = op._face_;
                    n_op.V = mv;
                    n_op.Next = op_nx;
                    op.Next = n_op;
                    n_op.Opp = edg;
                    edg.Opp = n_op;
                    n_nx.Opp = op;
                    op.Opp = n_nx;
                }
                return n_nx;
            }
            static E_Connect(a, b) {
                let a_next = a.Next;
                let b_next = b.Next;
                let mesh = a.Parent;
                let n_edg = mesh.NewEdge();
                let n_opp = mesh.NewEdge();
                n_edg.V = a_next.V;
                n_edg.UV = a_next.UV;
                n_opp.V = b_next.V;
                n_opp.UV = b_next.UV;
                n_edg.Opp = n_opp;
                n_opp.Opp = n_edg;
                a.Next = n_edg;
                n_edg.Next = b_next;
                b.Next = n_opp;
                n_opp.Next = a_next;
                n_edg._face_ = a_next._face_;
                n_opp._face_ = b_next._face_;
                return n_edg;
            }
            static E_IsSameLoop(a, b) {
                let cur = a;
                do {
                    if (cur === b)
                        return true;
                    cur = cur.Next;
                } while (cur != a && cur != null);
                return false;
            }
            static E_SplitWithPlane(edge, plane) {
                let v1 = edge.V.P;
                let v2 = edge.Next.V.P;
                let d1 = plane.DotCoordinate(v1);
                let d2 = plane.DotCoordinate(v2);
                if (d2 > -MMeshOp.Epsilon && d2 < MMeshOp.Epsilon)
                    return edge.Next;
                if (Math.abs(d1) < MMeshOp.Epsilon)
                    return;
                if (d1 * d2 >= 0)
                    return;
                let dir = U1.Vector3.Subtract(v2, v1);
                let amount = plane.IntersectsLine(v1, dir);
                let result = MMeshOp.E_Split(edge, amount);
                return result;
            }
            static E_Remove(edg) {
                let opp = edg.Opp;
                let f1 = edg._face;
                let f2 = opp._face;
                let loop1 = edg.GetLoop();
                let loop2 = opp.GetLoop();
                loop1.shift();
                loop2.shift();
                loop2[loop2.length - 1].Next = loop1[0];
                loop1[loop1.length - 1].Next = loop2[0];
                if (f1.Loops[0] == edg) {
                    loop2[loop2.length - 1].Next = edg;
                    edg.Next = edg.Next.Next;
                }
                let holes2 = f2.Loops;
                holes2.shift();
                if (holes2.length > 0) {
                    let nloops = f1.Loops.slice();
                    nloops.push(...holes2);
                    f1.Loops = nloops;
                }
                f2.Loops = null;
            }
            static E_ReLoop(start, es_len) {
                let cur = start;
                start._floop_ = true;
                for (let i = 0; i < es_len; i++) {
                    let next = cur.Next;
                    let nextOpp = next.Opp;
                    while (next._del_ && next !== start) {
                        if (nextOpp == null || nextOpp._face_ !== start._face_) {
                            start.Next = null;
                            return;
                        }
                        next = next.Opp.Next;
                        if (next === cur || next === cur.Opp)
                            break;
                    }
                    cur.Next = next;
                    cur = next;
                    cur._floop_ = true;
                    if (cur === start)
                        break;
                }
            }
            static E_RemoveTmpVert(start) {
                let cur = start;
                do {
                    let last = cur;
                    let next = cur.Next;
                    while (next != start && next._del_) {
                        last = next;
                        next = next.Next;
                    }
                    cur.Next = next;
                    cur.Opp = last.Opp;
                    cur = next;
                } while (cur !== start);
            }
            static E_GetLoopArea(loop, norm) {
                let u = U1.Vector3.Zero;
                let v = U1.Vector3.Zero;
                U1.GeometryHelper3.GetArbitraryAxis(norm, u, v);
                let vs = loop.GetLoopVs();
                let tarea = 0;
                if (vs.length > 2) {
                    let pgon = vs.map(o_ => {
                        return new U1.Vector2(U1.Vector3.Dot(u, o_.P), U1.Vector3.Dot(v, o_.P));
                    });
                    return U1.CGAL.Polygon2.GetArea(pgon);
                }
                return 0;
            }
            static F_SplitWithPlane(face, plane, faces) {
                let mesh = face.Mesh;
                let fc = 0;
                let bc = 0;
                for (let e of face.Loops[0].GetLoop()) {
                    let d = plane.DotCoordinate(e.V.P);
                    if (d > 0)
                        fc++;
                    else if (d < 0)
                        bc++;
                }
                if (fc == 0 || bc == 0)
                    return false;
                let splited_es = [];
                let bisect = new U1.Vector3();
                face.GetNorm(bisect);
                bisect.SetCross(bisect, plane.Normal);
                let loops = face.Loops;
                let outers = [loops[0]];
                let holes = loops.filter((o_, i_) => i_ > 0);
                let contains_loop = (e_, loops_) => {
                    for (let i = 0; i < loops_.length; i++) {
                        if (MMeshOp.E_IsSameLoop(e_, loops_[i]))
                            return true;
                    }
                    return false;
                };
                let remove_loop = (e_, loops_) => {
                    for (let i = loops_.length - 1; i >= 0; i--) {
                        if (MMeshOp.E_IsSameLoop(loops_[i], e_)) {
                            loops_.splice(i, 1);
                        }
                    }
                };
                for (let e_start of loops) {
                    let es = e_start.GetLoop();
                    let pi = es.length - 1;
                    for (let ci = 0; ci < es.length; pi = ci, ci++) {
                        let e = es[ci];
                        let edg = MMeshOp.E_SplitWithPlane(e, plane);
                        if (edg == e.Next) {
                            let p0 = e.V.P;
                            let p2 = edg.Next.V.P;
                            let d0 = plane.DotCoordinate(p0);
                            let d1 = plane.DotCoordinate(p2);
                            if (Math.abs(d0) < MMeshOp.Epsilon && Math.abs(d1) < MMeshOp.Epsilon)
                                continue;
                            let isect_e = {};
                            isect_e.state = d0 > MMeshOp.Epsilon ? 1 : (d0 < -MMeshOp.Epsilon ? -1 : 0);
                            isect_e.state += d1 > MMeshOp.Epsilon ? 1 : (d1 < -MMeshOp.Epsilon ? -1 : 0);
                            isect_e.edge = e;
                            splited_es.push(isect_e);
                        }
                        else if (edg != null) {
                            splited_es.push({ state: 0, edge: e });
                        }
                    }
                }
                splited_es.sort((a_, b_) => {
                    let p1 = a_.edge.Next.V.P;
                    let p2 = b_.edge.Next.V.P;
                    let d1 = U1.Vector3.Dot(p1, bisect);
                    let d2 = U1.Vector3.Dot(p2, bisect);
                    if (d1 === d2)
                        return 0;
                    return d1 < d2 ? -1 : 1;
                });
                let edges = [];
                for (let i = 0; i < splited_es.length - 1; i++) {
                    let isec0 = splited_es[i];
                    let isec1 = splited_es[i + 1];
                    if (Math.abs(isec0.state) === 1 &&
                        Math.abs(isec1.state) === 1) {
                        continue;
                    }
                    let e0 = isec0.edge;
                    let e1 = isec1.edge;
                    let nedg = MMeshOp.E_Connect(e0, e1);
                    remove_loop(e0, holes);
                    remove_loop(e1, holes);
                    if (!contains_loop(e0, outers))
                        outers.push(e0);
                    if (!contains_loop(e1, outers))
                        outers.push(e1);
                    if (isec1.state == 2 || isec1.state == -2) {
                        isec1.edge = nedg;
                    }
                    else {
                        i++;
                    }
                }
                let f_data = [];
                for (let j = 0; j < outers.length; j++) {
                    let isFront = false;
                    for (let v of outers[j].GetLoopVs()) {
                        let dt = plane.DotCoordinate(v.P);
                        if (dt == 0)
                            continue;
                        isFront = (dt > 0);
                        break;
                    }
                    f_data[j] = {
                        isFront: isFront,
                        loops: [outers[j]]
                    };
                }
                for (let j = 0; j < holes.length; j++) {
                    let hole_s = holes[j];
                    let outer = null;
                    let min_dist = Number.MAX_VALUE;
                    for (let fd of f_data) {
                        let dist = MMeshOp.V_DistanceToLoop(hole_s.V, fd.loops[0]);
                        if (dist < min_dist) {
                            min_dist = dist;
                            outer = fd;
                        }
                    }
                    if (outer != null) {
                        outer.loops.push(hole_s);
                    }
                }
                for (let i = 0; i < f_data.length; i++) {
                    if (i == 0) {
                        face.Loops = f_data[i].loops;
                    }
                    else {
                        let nface = mesh.NewFace();
                        nface.Loops = f_data[i].loops;
                        nface.SG = face.SG;
                        nface.FG = face.FG;
                        nface.MG = face.MG;
                        nface._orgn_ = face._orgn_;
                        if (faces !== undefined)
                            faces.push(nface);
                    }
                }
                return true;
            }
            static F_SplitWithFace(face1, face2, faces) {
                let s_ = MMeshOp['.fswf.'] || (MMeshOp['.fswf.'] = {});
                let bbx1 = s_.bbx1 || (s_.bbx1 = new U1.BoundingBox());
                let bbx2 = s_.bbx2 || (s_.bbx2 = new U1.BoundingBox());
                let offset = s_.ofs || (s_.ofs = new U1.Vector3(MMeshOp.Epsilon, MMeshOp.Epsilon, MMeshOp.Epsilon));
                face1.GetBBX(bbx1);
                face2.GetBBX(bbx2);
                bbx1.Min.Subtract(offset);
                bbx1.Max.Add(offset);
                if (!bbx1.IntersectsBoundingBox(bbx2))
                    return false;
                let norm = s_.norm || (s_.norm = new U1.Vector3());
                let plane = s_.plane || (s_.plane = new U1.Plane());
                face2.GetPlane(plane);
                return MMeshOp.F_SplitWithPlane(face1, plane, faces);
            }
            static F_IsectRay(face, p, dir, res) {
                let s_ = MMeshOp['.fir.'] || (MMeshOp['.fir.'] = {});
                let sp = s_.sp || (s_.sp = new U1.BoundingSphere());
                let isct = s_.isct || (s_.isct = new U1.Vector3());
                let fpln = s_.fpln || (s_.fpln = new U1.Plane());
                isct = res || isct;
                let bbx = face.GetBBX();
                sp.Center.SetAdd(bbx.Min, bbx.Max).Scale(0.5);
                sp.Radius = U1.Vector3.Distance(bbx.Max, bbx.Min);
                let distsq = U1.Ray3.DistanceSquared1(p, dir, sp.Center);
                if (distsq > sp.Radius * sp.Radius)
                    return null;
                let plane = face.GetPlane(fpln);
                let t = plane.IntersectsLine(p, dir);
                if (t == null || t < -MMeshOp.Epsilon)
                    return null;
                isct.SetScaleAdd(p, t, dir);
                let stat = MMeshOp.F_Contains(face, isct);
                if (stat == U1.FaceIntersectionTypeEnum.Outside)
                    return null;
                return isct;
            }
            static F_Contains(face, p) {
                let s_ = MMeshOp[".fc."] || (MMeshOp[".fc."] = {});
                let u = s_["u"] || (s_["u"] = new U1.Vector3());
                let v = s_["v"] || (s_["v"] = new U1.Vector3());
                let pln_norm = s_["pn"] || (s_["pn"] = new U1.Vector3());
                let crs = s_["crs"] || (s_["crs"] = new U1.Vector3());
                let pln = s_["pln"] || (s_["pln"] = new U1.Plane());
                let points = s_["points"] || (s_["points"] = []);
                let f_norm = s_["f_norm"] || (s_["f_norm"] = new U1.Vector3());
                let sqEp = MMeshOp.SqEpsilon;
                f_norm = face.GetNorm(f_norm);
                U1.GeometryHelper3.GetArbitraryAxis(f_norm, u, v);
                for (let a = 0; a < Math.PI; a += MMeshOp.ang_delt) {
                    let ca = Math.cos(a);
                    let sa = Math.sin(a);
                    pln_norm.SetScale(u, ca);
                    pln_norm.ScaleAdd(sa, v);
                    pln.SetFromPointNormal(p, pln_norm);
                    points = MMeshOp.F_IsectPlane(face, pln, points);
                    if (points.length == 0)
                        return U1.FaceIntersectionTypeEnum.Outside;
                    crs.SetCross(pln_norm, f_norm);
                    let fc = 0;
                    let bc = 0;
                    for (let i = 0; i < points.length; i++) {
                        let iscp = points[i];
                        iscp.Subtract(p);
                        if (iscp.LengthSquareduared() < sqEp)
                            return U1.FaceIntersectionTypeEnum.Boundary;
                        let t1 = U1.Vector3.Dot(crs, iscp);
                        if (t1 < 0)
                            bc++;
                        else if (t1 > 0)
                            fc++;
                    }
                    if (fc % 2 != bc % 2)
                        continue;
                    if (fc % 2 == 1)
                        return U1.FaceIntersectionTypeEnum.Inside;
                    return U1.FaceIntersectionTypeEnum.Outside;
                }
                return U1.FaceIntersectionTypeEnum.Outside;
            }
            static F_IsectPlane(face, pln, res) {
                let dir = MMeshOp[".fip.dir"] || (MMeshOp[".fip.dir"] = new U1.Vector3());
                res = res || [];
                res.length = 0;
                for (let l_s of face.Loops) {
                    let vs = l_s.GetLoopVs();
                    for (let ci = 0; ci < vs.length; ci++) {
                        let pi = (ci - 1);
                        if (pi < 0)
                            pi = vs.length - 1;
                        let ni = (ci + 1);
                        if (ni >= vs.length)
                            ni = 0;
                        let pp = vs[pi].P;
                        let cp = vs[ci].P;
                        let np = vs[ni].P;
                        let t1 = pln.DotCoordinate(cp);
                        let t2 = pln.DotCoordinate(np);
                        if (t1 >= -MMeshOp.Epsilon && t1 <= MMeshOp.Epsilon) {
                            if (Math.abs(t2) < MMeshOp.Epsilon)
                                continue;
                            res.push(cp.Clone());
                            continue;
                        }
                        if (t1 * t2 >= 0)
                            continue;
                        dir.SetSubtract(np, cp);
                        let t = pln.IntersectsLine(cp, dir);
                        if (t == null || t < 0 || t > 1)
                            continue;
                        let isectp = U1.Vector3.ScaleAdd(cp, t, dir);
                        res.push(isectp);
                    }
                }
                return res;
            }
            static M_ApplyTransform(mesh, xform) {
                if (xform != null) {
                    for (let v of mesh.Vertics) {
                        v.P = U1.Vector3.Transform(v.P, xform);
                    }
                }
                mesh.CacheVer++;
            }
            static M_Contains(mesh, p, res) {
                let s_ = MMeshOp['.mc.'] || (MMeshOp['.mc.'] = {});
                let abbx = s_.bbx1 || (s_.bbx1 = new U1.BoundingBox());
                let offset = MMeshOp.EpVector3;
                abbx = mesh.GetBoundingBox(abbx);
                abbx.Min.Subtract(offset);
                abbx.Max.Add(offset);
                if (!abbx.ContainsPoint(p))
                    return U1.FaceIntersectionTypeEnum.Outside;
                let bdir = s_.bdir || (s_.bdir = new U1.Vector3());
                let f_isetp = s_.fp || (s_.fp = new U1.Vector3());
                let b_isetp = s_.bp || (s_.bp = new U1.Vector3());
                let tvec = s_.tvec || (s_.tvec = new U1.Vector3());
                let rdvs = U1.RandomVector3();
                let vs = mesh.Vertics;
                let fs = mesh.Faces;
                for (let i = 0; i < rdvs.length; i++) {
                    let fdir = rdvs[i];
                    let f_count = 0;
                    let b_count = 0;
                    for (let v of vs) {
                        let t = U1.Vector3.Dot(fdir, tvec.SetSubtract(v.P, p));
                        if (t > MMeshOp.Epsilon) {
                            f_count++;
                        }
                        else if (t < -MMeshOp.Epsilon) {
                            b_count++;
                        }
                        else {
                            break;
                        }
                    }
                    if (f_count == vs.length || b_count == vs.length)
                        return U1.FaceIntersectionTypeEnum.Outside;
                    f_count = 0;
                    b_count = 0;
                    bdir.SetScale(fdir, -1);
                    for (let f of fs) {
                        let fp = MMeshOp.F_IsectRay(f, p, fdir, f_isetp);
                        let bp = MMeshOp.F_IsectRay(f, p, bdir, b_isetp);
                        if (fp)
                            f_count++;
                        if (bp)
                            b_count++;
                        if ((fp && U1.Vector3.Distance(fp, p) < MMeshOp.Epsilon) ||
                            (bp && U1.Vector3.Distance(bp, p) < MMeshOp.Epsilon)) {
                            if (res)
                                res.on_face = f;
                            return U1.FaceIntersectionTypeEnum.Boundary;
                        }
                    }
                    f_count = f_count % 2;
                    b_count = b_count % 2;
                    if (f_count != b_count)
                        continue;
                    return f_count == 0 ? U1.FaceIntersectionTypeEnum.Outside : U1.FaceIntersectionTypeEnum.Inside;
                }
            }
            static M_BeginBoolean(ab) {
                let last_sg = 0;
                let last_fg = 0;
                let last_mg = 0;
                let isA = true;
                for (let mesh of ab) {
                    let fs = mesh.Faces;
                    let es = mesh.Edges;
                    let vs = mesh.Vertics;
                    for (let v of vs) {
                        v._old_ = true;
                    }
                    for (let e of es) {
                        delete e._face_;
                        delete e._floop_;
                        delete e._face_;
                    }
                    for (let f of fs) {
                        f._orgn_ = f;
                        delete f._del_;
                        if (isA) {
                            last_sg = Math.max(last_sg, f.SG + 1);
                            last_fg = Math.max(last_fg, f.FG + 1);
                            last_mg = Math.max(last_mg, f.MG + 1);
                        }
                        else {
                            f.SG += last_sg;
                            f.FG += last_fg;
                            f.MG += last_mg;
                        }
                        let loops = f.Loops;
                        if (loops.length > 1) {
                            let k = 2;
                        }
                        for (let loop of loops) {
                            let cur = loop;
                            do {
                                cur._face_ = f;
                                cur = cur.Next;
                            } while (cur != loop && cur != null);
                        }
                    }
                    isA = false;
                }
            }
            static M_EndBoolean(mesh) {
                let s_ = MMeshOp['.meb.'] || (MMeshOp['.meb.'] = {});
                let d0 = s_.d0 || (s_.d0 = new U1.Vector3());
                let d1 = s_.d1 || (s_.d1 = new U1.Vector3());
                mesh.RemoveUnused();
            }
            static M_EndBoolean__(mesh) {
                let s_ = MMeshOp['.meb.'] || (MMeshOp['.meb.'] = {});
                let d0 = s_.d0 || (s_.d0 = new U1.Vector3());
                let d1 = s_.d1 || (s_.d1 = new U1.Vector3());
                mesh.RemoveUnused();
                let es = mesh.Edges;
                let fs = mesh.Faces;
                let es_len = es.length;
                for (let e of es) {
                    let opp = e.Opp;
                    if (e._del_ || e.Opp == null || e.Opp.Parent != mesh)
                        continue;
                    let f1 = e._face_;
                    let f2 = opp._face_;
                    if (f1 === f2) {
                        e._del_ = true;
                        opp._del_ = true;
                    }
                }
                let f_map = {};
                for (let f of fs) {
                    let loops = f.Loops;
                    let nloops = [];
                    for (let i = 0; i < loops.length; i++) {
                        let loop = loops[i];
                        let start = loop;
                        while (start != null && start._del_ && !start._floop_) {
                            start = start.Next;
                            if (start === loop)
                                break;
                        }
                        if (start == null || start._del_ || start._floop_)
                            continue;
                        MMeshOp.E_ReLoop(start, es_len);
                        if (start.Next != null)
                            nloops.push(start);
                    }
                    f.Loops = nloops;
                    if (nloops.length > 0) {
                        if (f_map[f._orgn_.HND] == null) {
                            f_map[f._orgn_.HND] = [];
                        }
                        f_map[f._orgn_.HND].push(f);
                    }
                }
                for (let hdn in f_map) {
                    let fs = f_map[hdn];
                    for (let i = fs.length - 1; i >= 0; i--) {
                        let src = fs[i];
                        if (src.Loops == null || src.Loops.length == 0)
                            continue;
                        for (let j = i - 1; j >= 0; j--) {
                            let tgt = fs[j];
                            if (tgt.Loops == null || tgt.Loops.length == 0)
                                continue;
                            if (MMeshOp.F_Contains(src, tgt.Loops[0].V.P) == U1.FaceIntersectionTypeEnum.Inside) {
                                let loops = src.Loops.slice();
                                loops.push(...tgt.Loops);
                                src.Loops = loops;
                                tgt.Loops = null;
                                break;
                            }
                            else if (MMeshOp.F_Contains(tgt, src.Loops[0].V.P) == U1.FaceIntersectionTypeEnum.Inside) {
                                let loops = tgt.Loops.slice();
                                loops.push(...src.Loops);
                                src.Loops = loops;
                                tgt.Loops = null;
                                break;
                            }
                        }
                    }
                }
                mesh.RemoveUnused();
                es = mesh.Edges;
                for (let e of es) {
                    delete e._face_;
                    let v = e.Next.V;
                    if (v._old_)
                        continue;
                    let ne = e.Next;
                    let op = e.Opp;
                    let nop = ne.Opp;
                    let p0 = e.V.P;
                    let p1 = ne.V.P;
                    let p2 = ne.Next.V.P;
                    d0.SetSubtract(p1, p0).Normalize();
                    d1.SetSubtract(p2, p1).Normalize();
                    let dt = U1.Vector3.Dot(d0, d1);
                    if (dt < 0.99)
                        continue;
                    if (e.Opp == null || ne.Opp == null) {
                        if (e.Opp != null || ne.Opp != null)
                            continue;
                        ne._del_ = true;
                    }
                    else if (nop.Next === op) {
                        ne._del_ = true;
                    }
                }
                fs = mesh.Faces;
                for (let f of fs) {
                    let loops = f.Loops;
                    let nloops = [];
                    for (let i = 0; i < loops.length; i++) {
                        let loop = loops[i];
                        let start = loop;
                        while (start != null && start._del_) {
                            start = start.Next;
                            if (start === loop)
                                break;
                        }
                        MMeshOp.E_RemoveTmpVert(start);
                        nloops[i] = start;
                    }
                    f.Loops = nloops;
                }
                mesh.RemoveUnused();
            }
            static M_EndBoolean_(mesh) {
                let s_ = MMeshOp['.meb.'] || (MMeshOp['.meb.'] = {});
                let d0 = s_.d0 || (s_.d0 = new U1.Vector3());
                let d1 = s_.d1 || (s_.d1 = new U1.Vector3());
                let norm = s_.norm || (s_.norm = new U1.Vector3());
                mesh.RemoveUnused();
                let es = mesh.Edges;
                let fs = mesh.Faces;
                let es_len = es.length;
                for (let e of es) {
                    let opp = e.Opp;
                    if (e._del_ || e.Opp == null || e.Opp.Parent != mesh)
                        continue;
                    let f1 = e._face_;
                    let f2 = opp._face_;
                    if (f1 === f2) {
                        e._del_ = true;
                        opp._del_ = true;
                    }
                }
                let f_loops_map = {};
                for (let e of es) {
                    if (e._del_ || e._floop_)
                        continue;
                    MMeshOp.E_ReLoop(e, es_len);
                    if (e.Next != null) {
                        if (f_loops_map[e._face_.HND] === undefined)
                            f_loops_map[e._face_.HND] = { f: e._face_, loops: [] };
                        f_loops_map[e._face_.HND].loops.push(e);
                    }
                }
                for (let f of fs) {
                    if (f_loops_map[f.HND] === undefined)
                        f.Loops = null;
                }
                for (let hnd in f_loops_map) {
                    let f_loop = f_loops_map[hnd];
                    let face = f_loop.f;
                    let loops = f_loop.loops;
                    if (loops.length > 1) {
                        norm = face.GetNorm(norm);
                        loops.sort((a_, b_) => {
                            let area0 = MMeshOp.E_GetLoopArea(a_, norm);
                            let area1 = MMeshOp.E_GetLoopArea(b_, norm);
                            return area0 == area1 ? 0 : (area0 > area1 ? -1 : 1);
                        });
                    }
                    face.Loops = loops;
                }
                mesh.RemoveUnused();
                es = mesh.Edges;
                for (let e of es) {
                    delete e._face_;
                    let v = e.Next.V;
                    if (v._old_)
                        continue;
                    let ne = e.Next;
                    let op = e.Opp;
                    let nop = ne.Opp;
                    let p0 = e.V.P;
                    let p1 = ne.V.P;
                    let p2 = ne.Next.V.P;
                    d0.SetSubtract(p1, p0).Normalize();
                    d1.SetSubtract(p2, p1).Normalize();
                    let dt = U1.Vector3.Dot(d0, d1);
                    if (dt < 0.99)
                        continue;
                    if (e.Opp == null || ne.Opp == null) {
                        if (e.Opp != null || ne.Opp != null)
                            continue;
                        ne._del_ = true;
                    }
                    else if (nop.Next === op) {
                        ne._del_ = true;
                    }
                }
                fs = mesh.Faces;
                for (let f of fs) {
                    let loops = f.Loops;
                    let nloops = [];
                    for (let i = 0; i < loops.length; i++) {
                        let loop = loops[i];
                        let start = loop;
                        while (start != null && start._del_) {
                            start = start.Next;
                            if (start === loop)
                                break;
                        }
                        MMeshOp.E_RemoveTmpVert(start);
                        nloops[i] = start;
                    }
                    f.Loops = nloops;
                }
                mesh.RemoveUnused();
            }
            static M_Sub(a, b) {
                let bbx0 = new U1.BoundingBox();
                let abbx = new U1.BoundingBox();
                let bbbx = new U1.BoundingBox();
                a.GetBoundingBox(abbx);
                b.GetBoundingBox(bbbx);
                abbx.Min.Subtract(MMeshOp.EpVector3);
                abbx.Max.Add(MMeshOp.EpVector3);
                bbbx.Min.Subtract(MMeshOp.EpVector3);
                bbbx.Max.Add(MMeshOp.EpVector3);
                if (!abbx.IntersectsBoundingBox(bbbx)) {
                    return null;
                }
                let a1 = a.Clone();
                let b1 = b.Clone();
                MMeshOp.M_BeginBoolean([a1, b1]);
                b1.Flip();
                let a1fs = a1.Faces.filter(o_ => {
                    o_.GetBBX(bbx0);
                    return bbx0.IntersectsBoundingBox(bbbx);
                });
                let b1fs = b1.Faces.filter(o_ => {
                    o_.GetBBX(bbx0);
                    return bbx0.IntersectsBoundingBox(abbx);
                });
                for (let bf of b.Faces) {
                    bf.GetBBX(bbx0);
                    if (!bbx0.IntersectsBoundingBox(abbx))
                        continue;
                    let fc = a1fs.length;
                    for (let fi = 0; fi < fc; fi++) {
                        let af = a1fs[fi];
                        MMeshOp.F_SplitWithFace(af, bf, a1fs);
                    }
                }
                for (let af of a.Faces) {
                    af.GetBBX(bbx0);
                    if (!bbx0.IntersectsBoundingBox(bbbx))
                        continue;
                    let fc = b1fs.length;
                    for (let fi = 0; fi < fc; fi++) {
                        let bf = b1fs[fi];
                        MMeshOp.F_SplitWithFace(bf, af, b1fs);
                    }
                }
                let newfs = [];
                let newvs = [];
                let newes = [];
                let innerp = new U1.Vector3();
                let res = {};
                let fnorm = new U1.Vector3();
                for (let f of a1.Faces) {
                    f.GetNorm(fnorm);
                    f.GetInnerPoint(innerp);
                    let isecttype = MMeshOp.M_Contains(b, innerp, res);
                    if (isecttype == U1.FaceIntersectionTypeEnum.Inside)
                        continue;
                    if (isecttype == U1.FaceIntersectionTypeEnum.Boundary) {
                        if (U1.Vector3.Dot(res.on_face.GetNorm(), fnorm) > 0.1)
                            continue;
                    }
                    newfs.push(f);
                }
                for (let f of b1.Faces) {
                    f.GetInnerPoint(innerp);
                    let isecttype = MMeshOp.M_Contains(a, innerp, res);
                    if (isecttype != U1.FaceIntersectionTypeEnum.Inside)
                        continue;
                    newfs.push(f);
                }
                let newmesh = new Meshes.MMesh();
                let e_num = -1;
                let v_num = -1;
                let f_num = -1;
                for (let f of newfs) {
                    if (f.GetArea() < MMeshOp.Min_FaceArea)
                        continue;
                    f.Parent = newmesh;
                    f.Num = ++f_num;
                    for (let loop of f.Loops) {
                        for (let e of loop.GetLoop()) {
                            e.Parent = newmesh;
                            e.Num = ++e_num;
                        }
                        for (let v of loop.GetLoopVs()) {
                            v.Num = ++v_num;
                            v.Parent = newmesh;
                        }
                    }
                }
                MMeshOp.M_EndBoolean(newmesh);
                return newmesh;
            }
            static M_Union(a, b) {
                let bbx0 = new U1.BoundingBox();
                let abbx = new U1.BoundingBox();
                let bbbx = new U1.BoundingBox();
                a.GetBoundingBox(abbx);
                b.GetBoundingBox(bbbx);
                abbx.Min.Subtract(MMeshOp.EpVector3);
                abbx.Max.Add(MMeshOp.EpVector3);
                bbbx.Min.Subtract(MMeshOp.EpVector3);
                bbbx.Max.Add(MMeshOp.EpVector3);
                if (!abbx.IntersectsBoundingBox(bbbx)) {
                    return null;
                }
                let a1 = a.Clone();
                let b1 = b.Clone();
                MMeshOp.M_BeginBoolean([a1, b1]);
                let a1fs = a1.Faces.filter(o_ => {
                    o_.GetBBX(bbx0);
                    return bbx0.IntersectsBoundingBox(bbbx);
                });
                let b1fs = b1.Faces.filter(o_ => {
                    o_.GetBBX(bbx0);
                    return bbx0.IntersectsBoundingBox(abbx);
                });
                for (let bf of b.Faces) {
                    bf.GetBBX(bbx0);
                    if (!bbx0.IntersectsBoundingBox(abbx))
                        continue;
                    let fc = a1fs.length;
                    for (let fi = 0; fi < fc; fi++) {
                        let af = a1fs[fi];
                        MMeshOp.F_SplitWithFace(af, bf, a1fs);
                    }
                }
                for (let af of a.Faces) {
                    af.GetBBX(bbx0);
                    if (!bbx0.IntersectsBoundingBox(bbbx))
                        continue;
                    let fc = b1fs.length;
                    for (let fi = 0; fi < fc; fi++) {
                        let bf = b1fs[fi];
                        MMeshOp.F_SplitWithFace(bf, af, b1fs);
                    }
                }
                let newfs = [];
                let newvs = [];
                let newes = [];
                let innerp = new U1.Vector3();
                let res = {};
                let fnorm = new U1.Vector3();
                for (let f of a1.Faces) {
                    f.GetNorm(fnorm);
                    f.GetInnerPoint(innerp);
                    let isecttype = MMeshOp.M_Contains(b, innerp, res);
                    if (isecttype == U1.FaceIntersectionTypeEnum.Inside)
                        continue;
                    if (isecttype == U1.FaceIntersectionTypeEnum.Boundary) {
                        if (U1.Vector3.Dot(res.on_face.GetNorm(), fnorm) < -0.1)
                            continue;
                    }
                    newfs.push(f);
                }
                for (let f of b1.Faces) {
                    f.GetInnerPoint(innerp);
                    let isecttype = MMeshOp.M_Contains(a, innerp, res);
                    if (isecttype != U1.FaceIntersectionTypeEnum.Outside)
                        continue;
                    newfs.push(f);
                }
                let newmesh = new Meshes.MMesh();
                let e_num = -1;
                let v_num = -1;
                let f_num = -1;
                for (let f of newfs) {
                    if (f.GetArea() < MMeshOp.Min_FaceArea)
                        continue;
                    f.Parent = newmesh;
                    f.Num = ++f_num;
                    for (let loop of f.Loops) {
                        for (let e of loop.GetLoop()) {
                            e.Parent = newmesh;
                            e.Num = ++e_num;
                        }
                        for (let v of loop.GetLoopVs()) {
                            if (v.Parent != newmesh) {
                                v.Num = ++v_num;
                                v.Parent = newmesh;
                            }
                        }
                    }
                }
                MMeshOp.M_EndBoolean(newmesh);
                return newmesh;
            }
            static M_Intersect(a, b) {
                let bbx0 = new U1.BoundingBox();
                let abbx = new U1.BoundingBox();
                let bbbx = new U1.BoundingBox();
                a.GetBoundingBox(abbx);
                b.GetBoundingBox(bbbx);
                abbx.Min.Subtract(MMeshOp.EpVector3);
                abbx.Max.Add(MMeshOp.EpVector3);
                bbbx.Min.Subtract(MMeshOp.EpVector3);
                bbbx.Max.Add(MMeshOp.EpVector3);
                if (!abbx.IntersectsBoundingBox(bbbx)) {
                    return null;
                }
                let a1 = a.Clone();
                let b1 = b.Clone();
                MMeshOp.M_BeginBoolean([a1, b1]);
                let a1fs = a1.Faces.filter(o_ => {
                    o_.GetBBX(bbx0);
                    return bbx0.IntersectsBoundingBox(bbbx);
                });
                let b1fs = b1.Faces.filter(o_ => {
                    o_.GetBBX(bbx0);
                    return bbx0.IntersectsBoundingBox(abbx);
                });
                for (let bf of b.Faces) {
                    bf.GetBBX(bbx0);
                    if (!bbx0.IntersectsBoundingBox(abbx))
                        continue;
                    let fc = a1fs.length;
                    for (let fi = 0; fi < fc; fi++) {
                        let af = a1fs[fi];
                        MMeshOp.F_SplitWithFace(af, bf, a1fs);
                    }
                }
                for (let af of a.Faces) {
                    af.GetBBX(bbx0);
                    if (!bbx0.IntersectsBoundingBox(bbbx))
                        continue;
                    let fc = b1fs.length;
                    for (let fi = 0; fi < fc; fi++) {
                        let bf = b1fs[fi];
                        MMeshOp.F_SplitWithFace(bf, af, b1fs);
                    }
                }
                let newfs = [];
                let newvs = [];
                let newes = [];
                let innerp = new U1.Vector3();
                let res = {};
                let fnorm = new U1.Vector3();
                for (let f of a1.Faces) {
                    f.GetNorm(fnorm);
                    f.GetInnerPoint(innerp);
                    let isecttype = MMeshOp.M_Contains(b, innerp, res);
                    if (isecttype == U1.FaceIntersectionTypeEnum.Outside)
                        continue;
                    if (isecttype == U1.FaceIntersectionTypeEnum.Boundary) {
                        if (U1.Vector3.Dot(res.on_face.GetNorm(), fnorm) < -0.1)
                            continue;
                    }
                    newfs.push(f);
                }
                for (let f of b1.Faces) {
                    f.GetInnerPoint(innerp);
                    let isecttype = MMeshOp.M_Contains(a, innerp, res);
                    if (isecttype != U1.FaceIntersectionTypeEnum.Inside)
                        continue;
                    newfs.push(f);
                }
                let newmesh = new Meshes.MMesh();
                let e_num = -1;
                let v_num = -1;
                let f_num = -1;
                for (let f of newfs) {
                    if (f.GetArea() < MMeshOp.Min_FaceArea)
                        continue;
                    f.Parent = newmesh;
                    f.Num = ++f_num;
                    for (let loop of f.Loops) {
                        for (let e of loop.GetLoop()) {
                            e.Parent = newmesh;
                            e.Num = ++e_num;
                        }
                        for (let v of loop.GetLoopVs()) {
                            v.Num = ++v_num;
                            v.Parent = newmesh;
                        }
                    }
                }
                MMeshOp.M_EndBoolean(newmesh);
                return newmesh;
            }
            static MD_Sub(amodel, bmodel) {
                let bbx1 = amodel.GetWorldOBB();
                let bbx2 = bmodel.GetWorldOBB();
                if (!bbx1.IntersectsBoundingBox(bbx2))
                    return null;
                let amesh = amodel.Mesh;
                let bmesh = bmodel.Mesh;
                amesh = amesh.Clone();
                bmesh = bmesh.Clone();
                MMeshOp.M_ApplyTransform(amesh, amodel.Transform);
                MMeshOp.M_ApplyTransform(bmesh, bmodel.Transform);
                let result = Meshes.MMeshOp.M_Sub(amesh, bmesh);
                if (result == null)
                    return null;
                let invm = U1.Matrix4.Invert(amodel.Transform);
                MMeshOp.M_ApplyTransform(result, invm);
                let rmodel = new Meshes.MModel();
                rmodel.Transform = amodel.Transform.Clone();
                rmodel.Append(result);
                rmodel.Mesh = result;
                rmodel.Mats = amodel.Mats;
                let lst_mg = 0;
                amesh.Faces.forEach(o_ => lst_mg = lst_mg < o_.MG ? o_.MG : lst_mg);
                lst_mg++;
                for (let muse of bmodel.Mats) {
                    rmodel.SetMat(muse.MGrp + lst_mg, muse.Mat);
                }
                return rmodel;
            }
            static MD_Union(amodel, bmodel) {
                let bbx1 = amodel.GetWorldOBB();
                let bbx2 = bmodel.GetWorldOBB();
                if (!bbx1.IntersectsBoundingBox(bbx2))
                    return null;
                let amesh = amodel.Mesh;
                let bmesh = bmodel.Mesh;
                amesh = amesh.Clone();
                bmesh = bmesh.Clone();
                MMeshOp.M_ApplyTransform(amesh, amodel.Transform);
                MMeshOp.M_ApplyTransform(bmesh, bmodel.Transform);
                let result = Meshes.MMeshOp.M_Union(amesh, bmesh);
                if (result == null)
                    return null;
                let invm = U1.Matrix4.Invert(amodel.Transform);
                MMeshOp.M_ApplyTransform(result, invm);
                let rmodel = new Meshes.MModel();
                rmodel.Transform = amodel.Transform.Clone();
                rmodel.Append(result);
                rmodel.Mesh = result;
                rmodel.Mats = amodel.Mats;
                let lst_mg = 0;
                amesh.Faces.forEach(o_ => lst_mg = lst_mg < o_.MG ? o_.MG : lst_mg);
                lst_mg++;
                for (let muse of bmodel.Mats) {
                    rmodel.SetMat(muse.MGrp + lst_mg, muse.Mat);
                }
                return rmodel;
            }
            static MD_Intersect(amodel, bmodel) {
                let bbx1 = amodel.GetWorldOBB();
                let bbx2 = bmodel.GetWorldOBB();
                if (!bbx1.IntersectsBoundingBox(bbx2))
                    return null;
                let amesh = amodel.Mesh;
                let bmesh = bmodel.Mesh;
                amesh = amesh.Clone();
                bmesh = bmesh.Clone();
                MMeshOp.M_ApplyTransform(amesh, amodel.Transform);
                MMeshOp.M_ApplyTransform(bmesh, bmodel.Transform);
                let result = Meshes.MMeshOp.M_Intersect(amesh, bmesh);
                if (result == null)
                    return null;
                let invm = U1.Matrix4.Invert(amodel.Transform);
                MMeshOp.M_ApplyTransform(result, invm);
                let rmodel = new Meshes.MModel();
                rmodel.Transform = amodel.Transform.Clone();
                rmodel.Append(result);
                rmodel.Mesh = result;
                rmodel.Mats = amodel.Mats;
                let lst_mg = 0;
                amesh.Faces.forEach(o_ => lst_mg = lst_mg < o_.MG ? o_.MG : lst_mg);
                lst_mg++;
                for (let muse of bmodel.Mats) {
                    rmodel.SetMat(muse.MGrp + lst_mg, muse.Mat);
                }
                return rmodel;
            }
        }
        MMeshOp.Epsilon = 0.00001;
        MMeshOp.SqEpsilon = MMeshOp.Epsilon * MMeshOp.Epsilon;
        MMeshOp.EpVector3 = new U1.Vector3(MMeshOp.Epsilon, MMeshOp.Epsilon, MMeshOp.Epsilon);
        MMeshOp.Min_FaceArea = 0.0001;
        MMeshOp.ang_delt = Math.PI / 50;
        Meshes.MMeshOp = MMeshOp;
    })(Meshes = U1.Meshes || (U1.Meshes = {}));
})(U1 || (U1 = {}));
var KBim;
(function (KBim) {
    class PanelCreate extends U1.UIs.PanelBase {
        constructor() {
            super();
            this.HtmlPage = './KBim/Panels/PanelCreate.html';
        }
        static get Instance() {
            if (PanelCreate._instance == null) {
                PanelCreate._instance = new PanelCreate();
            }
            return PanelCreate._instance;
        }
        Show() {
            if (!this._isInit) {
                this.Init();
            }
            var htmlPanel = document.getElementById("panelCreate");
            if (htmlPanel == null)
                return;
            while (htmlPanel.hasChildNodes()) {
                htmlPanel.removeChild(htmlPanel.lastChild);
            }
            htmlPanel.appendChild(this._root);
        }
    }
    PanelCreate._propPanelSize = 150;
    KBim.PanelCreate = PanelCreate;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class PanelManager {
        static get Instance() {
            if (PanelManager._instance == null) {
                PanelManager._instance = new PanelManager();
            }
            return PanelManager._instance;
        }
        Init() {
        }
        ShowPanelCreate() {
            let li_panelCreate = document.getElementById('li_panelCreate');
            let panelCreate = document.getElementById('panelCreate');
            let tabButton_children = li_panelCreate.parentElement.children;
            let content_children = panelCreate.parentElement.children;
            for (var i = 0; i < tabButton_children.length; i++) {
                tabButton_children[i].classList.remove('active');
            }
            for (var i = 0; i < content_children.length; i++) {
                content_children[i].classList.remove('in');
                content_children[i].classList.remove('active');
            }
            li_panelCreate.classList.add('active');
            panelCreate.classList.add('in');
            panelCreate.classList.add('active');
        }
        ShowPanelProp() {
            let li_panelProp = document.getElementById('li_panelProp');
            let panelProp = document.getElementById('panelProp');
            let tabButton_children = li_panelProp.parentElement.children;
            let content_children = panelProp.parentElement.children;
            for (var i = 0; i < tabButton_children.length; i++) {
                tabButton_children[i].classList.remove('active');
            }
            for (var i = 0; i < content_children.length; i++) {
                content_children[i].classList.remove('in');
                content_children[i].classList.remove('active');
            }
            li_panelProp.classList.add('active');
            panelProp.classList.add('in');
            panelProp.classList.add('active');
        }
    }
    KBim.PanelManager = PanelManager;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class PanelProp extends U1.UIs.PanelBase {
        constructor() {
            super();
            this._selectedColor = "";
            this.HtmlPage = './KBim/Panels/PanelProp.html';
        }
        static get Instance() {
            if (PanelProp._instance == null) {
                PanelProp._instance = new PanelProp();
            }
            return PanelProp._instance;
        }
        get Props() {
            return this._props;
        }
        set Props(value) {
            if (this._props != null) {
                for (let prop of this._props) {
                    prop.Dispose();
                }
            }
            this._props = value;
            this.InvokePropertyChanged("Props");
        }
        get SelectedColor() {
            return this._selectedColor;
        }
        set SelectedColor(value) {
            let sel = KBim.SiteView.Instance.Document.Selection.SelectedElements;
            let sel2 = KBim.SiteView.Instance.View3.DocumentPresenter.Selection;
            this._selectedColor = value;
            this.InvokePropertyChanged("SelectedColor");
        }
        get IsEnableChangeColor() {
            let sel = KBim.SiteView.Instance.Document.Selection.SelectedElements;
            return false;
        }
        Show() {
            if (!this._isInit) {
                this.Init();
            }
            var htmlPanel = document.getElementById("panelProp");
            while (htmlPanel.hasChildNodes()) {
                htmlPanel.removeChild(htmlPanel.lastChild);
            }
            htmlPanel.appendChild(this._root);
        }
        InitBinders() {
            let this_ = this;
            this.binders["bi_PropsGrid"] = new KBim.BiPropGrid()
                .setSource(this)
                .setTarget($(this._root).find("#bi_PropsGrid").get(0))
                .setItemsSource("Props");
            if (document.getElementById('bi_colorPicker') != null) {
                this.binders["bi_colorPicker"] = new U1.UIs.BiComboBox()
                    .setSource(this)
                    .setTarget($("#bi_colorPicker").get(0))
                    .setItems(["노란색", "주황색", "회색", "파란색", "빨간색"])
                    .setSelectedItemSource('SelectedColor')
                    .setIsEnableSource('IsEnableChangeColor');
            }
            KBim.SiteView.Instance.Document.Selection.SelectionChanged.Add(this, this.SelectionChanged);
            this.InvokePropertyChanged('IsEnableChangeColor');
        }
        SelectionChanged(selection) {
            this.Props = U1.UPropCategoryGroup.Categorize(selection.SelectedElements);
            this.InvokePropertyChanged('IsEnableChangeColor');
            this.SelectedColor = "";
        }
    }
    KBim.PanelProp = PanelProp;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class BiPropGrid extends U1.UIs.BiBase {
        static createItemEdit(item, row) {
            var editor = BiPropGrid.editCreater != null ? BiPropGrid.editCreater(item, row) : null;
            if (editor == null) {
                if (item instanceof U1.UPropCategoryGroup) {
                    editor = new BiPropCateGroup()
                        .setSource(item)
                        .setTarget(row);
                }
                else if (item instanceof U1.UPropCategory) {
                    editor = new BiPropCategory()
                        .setSource(item)
                        .setTarget(row);
                }
            }
            if (editor == null) {
                editor = new BiPropEdit()
                    .setSource(item)
                    .setTarget(row);
            }
            return editor;
        }
        setItemsSource(source) {
            this.ItemsSource = source;
            return this;
        }
        OnPropertyChanged(sender, prop) {
            super.OnPropertyChanged(sender, prop);
            if (sender != this.Source || this.IsPasued)
                return;
            if (sender === this.Source) {
                if (prop === this.ItemsSource) {
                    this.UpdateItems();
                }
            }
        }
        OnUpdate() {
            this.UpdateItems();
        }
        UnBind() {
            super.UnBind();
            if (this.PropertyEdits != null) {
                for (var prop of this.PropertyEdits) {
                    prop.UnBind();
                }
            }
            if (this.Target != null)
                this.Target.onchange = null;
            return this;
        }
        UpdateItems() {
            var items = this.Source[this.ItemsSource] || [];
            var isChanged = this.Items == null;
            if (!isChanged)
                isChanged = items.length != this.Items.length;
            if (!isChanged) {
                for (var i = 0; i < items.length; i++) {
                    isChanged = items[i] != this.Items[i];
                    if (isChanged)
                        break;
                }
            }
            if (!isChanged)
                return;
            while (this.Target.children.length > 0) {
                this.Target.removeChild(this.Target.lastChild);
            }
            if (this.PropertyEdits != null) {
                for (var prop of this.PropertyEdits) {
                    prop.UnBind();
                }
            }
            this.Items = items;
            this.PropertyEdits = [];
            if (this.Items != null) {
                for (var i = 0; i < this.Items.length; i++) {
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
        Pause() {
            super.Pause();
            if (this.PropertyEdits != null) {
                for (var prop of this.PropertyEdits) {
                    prop.Pause();
                }
            }
            return this;
        }
        Resume() {
            super.Resume();
            if (this.PropertyEdits != null) {
                for (var prop of this.PropertyEdits) {
                    prop.Resume();
                }
            }
            return this;
        }
    }
    KBim.BiPropGrid = BiPropGrid;
    class BiPropEdit extends U1.UIs.BiBase {
        get Property() {
            return this.Source;
        }
        setContentRenderer(renderer) {
            this.ContentRenderer = renderer;
            return this;
        }
        setSource(source) {
            super.setSource(source);
            return this;
        }
        OnPropertyChanged(sender, prop) {
            super.OnPropertyChanged(sender, prop);
            if (sender != this.Source || this.IsPasued)
                return;
            if (prop == "ValueText") {
                this.input.value = this.Property.ValueText;
                this.text = null;
            }
        }
        OnUpdate() {
            if (this.ContentRenderer != null) {
                while (this.Target.children.length > 0) {
                    this.Target.removeChild(this.Target.lastChild);
                }
                this.ContentRenderer(this.Target);
                return this;
            }
            if (this.label == null) {
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
            if (this.input == null) {
                this.input = document.createElement("input");
                this.input.type = "text";
                this.input.value = this.Property.ValueText;
                if (this.Property instanceof U1.UPropString) {
                    this.input.setAttribute("type", "text");
                }
                else {
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
        UnBind() {
            super.UnBind();
            if (this.input != null) {
                this.input.onkeyup = null;
                this.input.onchange = null;
            }
            return this;
        }
        OnChange(event) {
            var input = event.target;
            this.OnTextChange(input.value);
        }
        OnKeyUp(event) {
            if (event.keyCode == 13) {
                var input = event.target;
                event.preventDefault();
                this.OnTextChange(input.value);
            }
        }
        OnTextChange(text) {
            this.text = text;
            if (this.text != null && this.text != this.Property.ValueText)
                this.Property.ValueText = this.text;
            this.text = null;
        }
    }
    KBim.BiPropEdit = BiPropEdit;
    class BiPropCategory extends BiPropEdit {
        get Category() {
            return this.Source;
        }
        get Items() {
            return this.Category.Items;
        }
        UnBind() {
            super.UnBind();
            if (this.PropertyEdits != null) {
                for (var prop of this.PropertyEdits) {
                    prop.UnBind();
                }
            }
            return this;
        }
        OnPropertyChanged(sender, prop) {
        }
        OnUpdate() {
            this.UpdateItems();
            return this;
        }
        UpdateItems() {
            var items = this.Items;
            while (this.Target.children.length > 0) {
                this.Target.removeChild(this.Target.lastChild);
            }
            if (this.PropertyEdits != null) {
                for (var prop of this.PropertyEdits) {
                    prop.UnBind();
                }
            }
            this.PropertyEdits = [];
            if (this.Items != null) {
                for (var i = 0; i < this.Items.length; i++) {
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
    KBim.BiPropCategory = BiPropCategory;
    class BiPropCateGroup extends BiPropEdit {
        get CateGroup() {
            return this.Source;
        }
        OnPropertyChanged(sender, prop) {
        }
        OnUpdate() {
            if (this.PropertyEdits != null) {
                for (var prop of this.PropertyEdits) {
                    prop.UnBind();
                }
            }
            this.PropertyEdits = [];
            if (this.button == null) {
                this.button = document.createElement("button");
                this.button.textContent = this.CateGroup.Label;
                this.button.className = "w3-btn-block w3-center-align w3-light-gray";
                let btn = this.button;
                this.button.onclick = function (ev) {
                    let content = btn.nextElementSibling;
                    if (content.className.indexOf("w3-show") == -1) {
                        content.className += " w3-show";
                    }
                    else {
                        content.className = content.className.replace(" w3-show", "");
                    }
                };
                this.Target.appendChild(this.button);
            }
            if (this.divContent == null) {
                this.divContent = document.createElement("div");
                this.divContent.className = "w3-accordion-content  w3-show";
                this.divContent.style.marginTop = "4px";
                this.Target.appendChild(this.divContent);
            }
            while (this.divContent.children.length > 0) {
                this.divContent.removeChild(this.divContent.lastChild);
            }
            let categories = this.CateGroup.Categories;
            if (categories != null) {
                for (var i = 0; i < categories.length; i++) {
                    var category = categories[i];
                    var tr = document.createElement("div");
                    this.divContent.appendChild(tr);
                    var editor = BiPropGrid.createItemEdit(category, tr);
                    editor.Update();
                    this.PropertyEdits.push(editor);
                }
            }
            return this;
        }
        UnBind() {
            super.UnBind();
            if (this.PropertyEdits != null) {
                for (var prop of this.PropertyEdits) {
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
    }
    KBim.BiPropCateGroup = BiPropCateGroup;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class Pr3D_Doc extends U1.Views.UDocumentPresenter {
        constructor() {
            super(...arguments);
            this._bbx = new U1.BoundingBox;
            this._xform = U1.Matrix4.Identity;
        }
        get ScaleM() {
            return this._xform;
        }
        CreatePresenter(elm_) {
            if (elm_ instanceof U1.Meshes.MMtl) {
                return new KBim.Pr3D_MMat();
            }
            else if (elm_ instanceof U1.Meshes.MMesh) {
                return new KBim.Pr3D_MMesh();
            }
            else if (elm_ instanceof U1.Meshes.MTexture) {
                return new KBim.Pr3D_MTexture();
            }
            else if (elm_ instanceof KBim.CdEntity) {
                if (elm_.FindAncestor(KBim.CdBlock) != null)
                    return null;
                return new KBim.Pr3D_CdEntity();
            }
            return null;
        }
        GetWorldBounding() {
            var kview = this.View;
            this._bbx.Min.CopyFrom(kview.Min);
            this._bbx.Max.CopyFrom(kview.Max);
            return this._bbx;
        }
        Pick(isectContext) {
            let res_isect = null;
            let view = isectContext.View;
            let isectInfo = null;
            let raycaster = new THREE.Raycaster();
            let mouse = { x: 0, y: 0 };
            let sceneThree = this.View.Scene;
            raycaster.params.Line.threshold = 0.01;
            raycaster.params.Points.threshold = 0.01;
            let selNode;
            mouse.x = (view.X / this.View.Width) * 2 - 1;
            mouse.y = -(view.Y / this.View.Height) * 2 + 1;
            if (sceneThree.SceneMode == KBim.Views.SceneMode.Orthographic3D)
                raycaster.setFromCamera(mouse, sceneThree.CamOrtho);
            else
                raycaster.setFromCamera(mouse, sceneThree.CamPersp);
            for (let c = 0; c < 2; c++) {
                let objs = c == 0
                    ? sceneThree.SceneOverlay.children
                    : sceneThree.SceneWorld.children;
                var intersects = raycaster.intersectObjects(objs, true);
                for (var i = 0; i < intersects.length; i++) {
                    let isectThree = intersects[i];
                    isectInfo = new U1.ISectInfo();
                    isectInfo.IsectPosition = KBim.Views.ThreeUtil.FromVector3(isectThree.point);
                    isectInfo.Distance = intersects[i].distance;
                    let obj = isectThree.object;
                    if (obj.visible) {
                        selNode = KBim.ViewPageContext.instance.getNode(obj, this.View);
                        if (selNode != null)
                            break;
                    }
                }
                if (selNode != null)
                    break;
            }
            let result = null;
            if (selNode != null) {
                let res_node = new KBim.Pr3D_SelNode();
                res_node.KDoc = this.Document;
                res_node.SelectedNode = selNode;
                res_node.Element = selNode;
                result = new U1.Views.PickResult();
                result.ISect = res_isect;
                result.Presenter = res_node;
            }
            return result;
        }
        UpdateVisible() {
            let visibleContext = new KBim.KVisibleContext();
            let cam = this.View.Scene.Camera;
            visibleContext.CamPos = cam.Position.Clone();
            visibleContext.CamDir = cam.GetDirection();
            for (let mdl of KBim.ViewPageContext.instance.Models.values()) {
                mdl.updateVisibe(visibleContext);
            }
        }
    }
    KBim.Pr3D_Doc = Pr3D_Doc;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class Pr2D_Doc extends KBim.Pr3D_Doc {
        CreatePresenter(elm_) {
            if (elm_ instanceof U1.Meshes.MMtl) {
                return new KBim.Pr3D_MMat();
            }
            else if (elm_ instanceof U1.Meshes.MMesh) {
                return new KBim.Pr3D_MMesh();
            }
            else if (elm_ instanceof U1.Meshes.MTexture) {
                return new KBim.Pr3D_MTexture();
            }
            else if (elm_ instanceof KBim.CdEntity) {
                if (elm_.FindAncestor(KBim.CdBlock) != null)
                    return null;
                return new KBim.Pr3D_CdEntity();
            }
            return null;
        }
        Pick(isectContext) {
            let res_isect = null;
            let view = isectContext.View;
            let isectInfo = null;
            let raycaster = new THREE.Raycaster();
            raycaster.params.Line.threshold = 0.01;
            raycaster.params.Points.threshold = 0.01;
            let mouse = { x: 0, y: 0 };
            let sceneThree = this.View.Scene;
            let selNode;
            mouse.x = (view.X / this.View.Width) * 2 - 1;
            mouse.y = -(view.Y / this.View.Height) * 2 + 1;
            raycaster.setFromCamera(mouse, sceneThree.CamOrtho);
            for (let c = 0; c < 2; c++) {
                let objs = c == 0
                    ? sceneThree.SceneOverlay.children
                    : sceneThree.SceneWorld.children;
                var intersects = raycaster.intersectObjects(objs, true);
                for (var i = 0; i < intersects.length; i++) {
                    let isectThree = intersects[i];
                    isectInfo = new U1.ISectInfo();
                    isectInfo.IsectPosition = KBim.Views.ThreeUtil.FromVector3(isectThree.point);
                    isectInfo.Distance = intersects[i].distance;
                    let obj = isectThree.object;
                    if (obj.visible) {
                        selNode = KBim.ViewPageContext.instance.getNode(obj, this.View);
                        if (selNode != null)
                            break;
                    }
                }
                if (selNode != null)
                    break;
            }
            let result = null;
            if (selNode != null) {
                let res_node = new KBim.Pr3D_SelNode();
                res_node.KDoc = this.Document;
                res_node.SelectedNode = selNode;
                res_node.Element = selNode;
                result = new U1.Views.PickResult();
                result.ISect = res_isect;
                result.Presenter = res_node;
            }
            return result;
        }
        UpdateVisible() {
            let kview = this.View;
            let visibleContext = KBim.KVisibleContext.get2D(kview, KBim.KVisibleContext._vc0);
            for (let mdl of KBim.ViewPageContext.instance.Models.values()) {
                mdl.updateVisibe(visibleContext);
            }
        }
    }
    KBim.Pr2D_Doc = Pr2D_Doc;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class Pr3D_CdEntity extends U1.Views.UElementPresenter3D {
        constructor() {
            super(...arguments);
            this.ver = -1;
            this.updateVer = -1;
            this._z = -100;
        }
        get Entity() {
            return this.Element;
        }
        OnClear() {
            if (this._lineInfos != null) {
                for (var ln of this._lineInfos) {
                    ln.Remove();
                }
            }
            if (this._text3s != null) {
                for (var tx3 of this._text3s) {
                    tx3.Dispose();
                }
            }
            if (this._meshes != null) {
                for (var mi of this._meshes) {
                    mi.Remove();
                }
            }
            if (this._overMeshes != null) {
                for (var mi of this._overMeshes) {
                    mi.Remove();
                }
            }
            this._lineInfos = undefined;
            this._text3s = undefined;
            this._meshes = undefined;
            this._overMeshes = undefined;
            super.OnClear();
        }
        OnUpdate() {
            if (!this.Visible()) {
                this.OnClear();
                return;
            }
            if ((this._lineInfos == null &&
                this._text3s == null && this._meshes == null) ||
                this.ver != this.updateVer) {
                this.OnClear();
                this.ShowEntity(this.Entity);
                this.updateVer = this.ver;
            }
            if (this.Entity instanceof KBim.CdPolyline2d) {
                if (this.Entity.ShowTooltip) {
                    this.ShowTooltop();
                }
                else {
                    this.HideTooltip();
                }
                var layer_name = this.Entity.LayerName;
                var prefix = layer_name.substr(0, layer_name.indexOf('_'));
                if (prefix == "01") {
                    this._z = -10;
                    this.FillPolygon(this.Entity, U1.Colors.LightBlue);
                }
                else if (prefix == "02") {
                    this._z = -5;
                    this.FillPolygon(this.Entity, U1.Colors.LightGray);
                }
                else if (prefix == "03") {
                    this._z = -3;
                    this.FillPolygon(this.Entity, U1.Colors.LightGreen);
                }
                else if (prefix == "04") {
                    this._z = -1;
                    this.FillPolygon(this.Entity, U1.Colors.LightSalmon);
                }
            }
        }
        ShowEntity(geom) {
            if (geom instanceof KBim.CdEntity) {
                var pm = this.DocumentPresesnter.ScaleM;
                this.ShowEntity1(pm, geom);
            }
        }
        ShowEntity1(wm, entity) {
            if (entity instanceof KBim.CdBlockReference) {
                var blockRef = entity;
                if (blockRef.Block == null || blockRef.Block.Entities == null)
                    return;
                wm = U1.Matrix4.Multiply(entity.Transform, wm);
                for (var ent of blockRef.Block.Entities) {
                    this.ShowEntity1(wm, ent);
                }
                return;
            }
            var geoms = [];
            entity.UpdateGeoms(geoms);
            for (var geom of geoms) {
                if (geom instanceof U1.Geoms.GeLine) {
                    this.ShowLine(wm, geom);
                }
                else if (geom instanceof U1.Geoms.GePolygon) {
                    this.ShowPolygon(wm, geom);
                }
                else if (geom instanceof U1.Geoms.GePolyline) {
                    this.ShowPolyline(wm, geom);
                }
                else if (geom instanceof U1.Geoms.GeText) {
                    this.ShowText(wm, geom);
                }
            }
        }
        ShowLine(wm, geLine) {
            var sceneThree = this.Scene;
            var lineBatch = null;
            lineBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScLineBatch, "CadEntities");
            var item = lineBatch.AddItem();
            item.Path = [geLine.Start, geLine.End];
            item.Color = geLine.Color;
            item.Transform = wm;
            if (this._lineInfos == null)
                this._lineInfos = [];
            this._lineInfos.push(item);
        }
        ShowPolygon(wm, gePolygon) {
            var lineBatch = null;
            lineBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScLineBatch, "CadEntities");
            var points = gePolygon.Points.map(o_ => new U1.Vector3(o_));
            points.push(points[0]);
            var item = lineBatch.AddItem();
            item.Path = points;
            item.Color = gePolygon.Color;
            item.Transform = wm;
            if (this._lineInfos == null)
                this._lineInfos = [];
            this._lineInfos.push(item);
            if (gePolygon instanceof U1.Geoms.GePolygonFill) {
                try {
                    var triangles = U1.Views.ScPolyLine.Tesselate(gePolygon.Points);
                    var geom = U1.MeshBufferGeometry.CreateFromTriangles(triangles);
                    var meshBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScMeshBatch, "CadEntitiesMesh");
                    var mi = meshBatch.AddItem();
                    mi.Geom = geom;
                    mi.Color = gePolygon.FillColor;
                    mi.Transform = wm;
                    if (this._meshes == null)
                        this._meshes = [];
                    this._meshes.push(mi);
                }
                catch (ex) {
                }
            }
        }
        ShowPolyline(wm, gePolyline) {
            var lineBatch = null;
            lineBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScLineBatch, "CadEntities");
            var points = gePolyline.Points.map(o_ => new U1.Vector3(o_));
            points.push(points[0]);
            var points = gePolyline.Points.map(o_ => new U1.Vector3(o_));
            var item = lineBatch.AddItem();
            item.Path = points;
            item.Color = gePolyline.Color;
            item.Transform = wm;
            if (this._lineInfos == null)
                this._lineInfos = [];
            this._lineInfos.push(item);
            if (gePolyline instanceof U1.Geoms.GePolylineFill) {
                try {
                    var triangles = U1.Views.ScPolyLine.Tesselate(gePolyline.Points);
                    var geom = U1.MeshBufferGeometry.CreateFromTriangles(triangles);
                    var meshBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScMeshBatch, "CadEntitiesMesh");
                    var mi = meshBatch.AddItem();
                    mi.Geom = geom;
                    mi.Color = gePolyline.FillColor;
                    mi.Transform = wm;
                    if (this._meshes == null)
                        this._meshes = [];
                    this._meshes.push(mi);
                }
                catch (ex) {
                }
            }
        }
        ShowText(wm, geText) {
            wm = U1.Matrix4.CreateRotationZ(geText.Rotation)
                .Multiply(U1.Matrix4.CreateTranslation(geText.Position))
                .Multiply(wm);
            var text3 = this.Scene.World.AddEntity(U1.Views.ScText);
            var style;
            text3.Style = style = new U1.Views.ScTextStyle();
            style.Fill = geText.Color;
            text3.FontSize = geText.FontSize;
            text3.Text = geText.Text;
            text3.Width = geText.Width;
            text3.Height = geText.Height;
            text3.Transform = wm;
            if (this._text3s == null)
                this._text3s = [];
            this._text3s.push(text3);
        }
        UpdateBoundingBox() {
            if (this._lineInfos != null) {
                var min = U1.Vector3.MaxValue;
                var max = U1.Vector3.MinValue;
                for (var lin of this._lineInfos) {
                    min.Minimize(U1.Vector3.Min1(lin.Path));
                    max.Maximize(U1.Vector3.Max1(lin.Path));
                }
                this._lbb = U1.BoundingBox.CreateFromPoints([min, max]);
            }
        }
        OnElementPropertyChanged(sender, prop) {
            if (prop == "ShowTooltip") {
                if (this.Element instanceof KBim.CdPolyline2d) {
                    if (this.Element.ShowTooltip)
                        this.ShowTooltop();
                    else
                        this.HideTooltip();
                }
                this.Invalid = true;
                this.View.Invalidate();
            }
        }
        CheckIntersect(isectContext) {
            var result = null;
            if (this._lineInfos != null) {
                for (let line of this._lineInfos) {
                    var isect = line.Intersect(isectContext);
                    if (isect != null && (result == null || isect.Distance < result.Distance)) {
                        isect.Source = this;
                        result = isect;
                    }
                }
            }
            if (this._meshes != null) {
                for (let mi of this._meshes) {
                    var isect = mi.Intersect(isectContext);
                    if (isect != null && (result == null || isect.Distance < result.Distance)) {
                        isect.Source = this;
                        result = isect;
                    }
                }
            }
            if (this._text3s != null) {
                for (let text of this._text3s) {
                    var isect = text.Intersect(isectContext);
                    if (isect != null && (result == null || isect.Distance < result.Distance)) {
                        isect.Source = this;
                        result = isect;
                    }
                }
            }
            return result;
        }
        CheckContains(context) {
            var contains = null;
            var ckCross = context.AllowCross;
            if (this._lineInfos != null) {
                for (let lineinfo of this._lineInfos) {
                    var isect = lineinfo.Contains(context.SelectionPlanes, ckCross);
                    if (isect == true && ckCross)
                        return true;
                    if (isect == false && !ckCross)
                        return false;
                    contains = isect;
                }
            }
            if (this._meshes != null) {
                for (let mi of this._meshes) {
                    var isect = mi.Contains(context.SelectionPlanes, ckCross);
                    if (isect == true && ckCross)
                        return true;
                    if (isect == false && !ckCross)
                        return false;
                    contains = isect;
                }
            }
            if (contains != true && this._text3s != null) {
                for (let tex of this._text3s) {
                    var isect = tex.Contains(context.SelectionPlanes, ckCross);
                    if (isect == true && ckCross)
                        return true;
                    if (isect == false && !ckCross)
                        return false;
                    contains = isect;
                }
            }
            return contains != null ? contains : false;
        }
        OnSelected() {
            var hide = true;
            if (hide) {
                if (this._lineInfos != null) {
                    for (let li of this._lineInfos) {
                        if (li["_oldColor"] == undefined)
                            li["_oldColor"] = li.Color;
                        li.Color = Pr3D_CdEntity.SelectStrokeColor;
                    }
                }
                if (this._text3s != null) {
                    for (let li of this._text3s) {
                        if (li["_oldColor"] == undefined)
                            li["_oldColor"] = li.Style.Fill;
                        li.Style.Fill = Pr3D_CdEntity.SelectStrokeColor;
                    }
                }
                if (this.Element instanceof KBim.CdPolyline2d) {
                    this.FillPolygon(this.Element);
                    this.Element.ShowTooltip = true;
                }
            }
        }
        OnDeselected() {
            if (this._lineInfos != null) {
                for (var li of this._lineInfos) {
                    if (li["_oldColor"] != undefined)
                        li.Color = li["_oldColor"];
                }
            }
            if (this._text3s != null) {
                for (let li of this._text3s) {
                    if (li["_oldColor"] != undefined)
                        li.Style.Fill = li["_oldColor"];
                }
            }
            if (this.Element instanceof KBim.CdPolyline2d) {
                this.ClearPolygon(this.Element);
                this.Element.ShowTooltip = false;
            }
        }
        FillPolygon(polygon, fill_color = U1.Colors.Red) {
            var wm = U1.Matrix4.Multiply(this.Transform, U1.Matrix4.CreateTranslation(new U1.Vector3(0, 0, this._z)));
            var triangles = U1.Views.ScPolyLine.Tesselate(polygon.Path3);
            var geom = U1.MeshBufferGeometry.CreateFromTriangles(triangles);
            var meshBatch = this.Scene.World.GetOrAddNamedEntity(U1.Views.ScMeshBatch, "CadEntitiesMesh_OV" + fill_color.toString());
            var mi = meshBatch.AddItem();
            mi.Geom = geom;
            mi.Color = fill_color;
            mi.Transform = wm;
            if (this._meshes == null)
                this._meshes = [];
            this._meshes.push(mi);
        }
        ClearPolygon(polygon) {
            if (this._meshes != null) {
                for (var mi of this._meshes) {
                    mi.Remove();
                }
            }
            this._meshes = undefined;
        }
        ShowTooltop() {
            if (this._tooltip == null) {
                var bbx = this.Entity.BoundingBox;
                var cent = U1.Vector3.Add(bbx.Min, bbx.Max).Scale(0.5);
                this._tooltip = this.View.Controls.AddControl(KBim.Views.VcTooltipBox);
                this._tooltip.Position = cent;
                this._tooltip.FID = "" + this.Entity.ID;
                this._tooltip.Tooltip = "" + this.Entity.ID;
            }
        }
        HideTooltip() {
            if (this._tooltip != null) {
                this._tooltip.Dispose();
                this._tooltip = undefined;
            }
        }
    }
    KBim.Pr3D_CdEntity = Pr3D_CdEntity;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class Pr3D_MMat extends U1.Views.UElementPresenter {
        constructor() {
            super();
            this._ver = -1;
            this.Order = 100;
        }
        get Mtl() {
            return this.Element;
        }
        get SMaterial() {
            return this._mat;
        }
        OnUpdate() {
            if (this._mat == null || this._updateVer != this._ver) {
                this.OnClear();
                var scene = this.View.Scene;
                var mtl = this.Mtl;
                var mid = mtl.ID;
                this._updateVer = this._ver;
                var mat_name = "MTL_#" + mid;
                var smat = scene.Materials.Get(U1.Views.ScMaterial, mat_name);
                if (smat == null) {
                    smat = scene.Materials.Add(U1.Views.ScMaterial, mat_name);
                }
                if (mtl instanceof U1.Meshes.MMtlColr) {
                    smat.Diffuse = mtl.Color;
                    smat.Alpha = mtl.Alpha;
                }
                else if (mtl instanceof U1.Meshes.MMtlTex) {
                    var difTexPrsnt = this.DocumentPresesnter.GetPresenter(KBim.Pr3D_MTexture, mtl.DifTex);
                    smat.Diffuse = mtl.Diffuse;
                    smat.DiffuseTexture = difTexPrsnt.STexture;
                    smat.Alpha = mtl.Alpha;
                }
                this._mat = smat;
            }
        }
        OnClear() {
            if (this._mat != null) {
                this._mat.Dispose();
                this._mat = undefined;
            }
        }
        OnElementPropertyChanged(sender, prop) {
            super.OnElementPropertyChanged(sender, prop);
            this._ver++;
        }
    }
    KBim.Pr3D_MMat = Pr3D_MMat;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class Pr3D_MMesh extends U1.Views.UElementPresenter {
        constructor() {
            super();
            this.ver = -1;
            this.updateVer = -1;
            this.Order = 200;
        }
        get Mesh() {
            return this.Element;
        }
        get MeshGeomsByMid() {
            return this._meshGeoms;
        }
        get LineGeomsByMid() {
            return this._lineGeoms;
        }
        OnClear() {
            if (this._meshGeoms != null) {
                this._meshGeoms = undefined;
            }
            this._lineGeoms = undefined;
        }
        OnUpdate() {
            if (this._meshGeoms === undefined || this.ver != this.updateVer) {
                this._meshGeoms = {};
                this.AddMesh(this.Mesh);
                this.updateVer = this.ver;
            }
        }
        AddMesh(mesh) {
            var shells = mesh.GetMeshBuffersByMid();
            var mesh = this.Mesh;
            var scene = this.View.Scene;
            for (var str_mid in shells) {
                this._meshGeoms[str_mid] = shells[str_mid];
            }
        }
        AddMesh_(mesh) {
            var shells = mesh.GetShellsByMid();
            var mesh = this.Mesh;
            var scene = this.View.Scene;
            for (var str_mid in shells) {
                var shell = new U1.BRep.Shell();
                for (var sh of shells[str_mid]) {
                    shell.Merge(sh);
                }
                var meshGeom = new U1.MeshBufferGeometry().CopyFromShell(shell);
                this._meshGeoms[str_mid] = meshGeom;
            }
        }
        OnElementPropertyChanged(sender, prop) {
            super.OnElementPropertyChanged(sender, prop);
            this.ver++;
            this.Invalid = true;
        }
    }
    KBim.Pr3D_MMesh = Pr3D_MMesh;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class Pr3D_MTexture extends U1.Views.UElementPresenter {
        constructor() {
            super();
            this._ver = -1;
            this.Order = 90;
        }
        get Texture() {
            return this.Element;
        }
        get STexture() {
            return this._texture;
        }
        OnUpdate() {
            if (this._texture == null || this._updateVer != this._ver) {
                this.OnClear();
                var scene = this.View.Scene;
                var tex = this.Texture;
                var tex_id = tex.ID;
                this._updateVer = this._ver;
                var tex_name = "TEX_#" + tex_id;
                var stexture = scene.Textures.Get(U1.Views.ScTexture, tex_name);
                if (stexture == null) {
                    stexture = scene.Textures.Add(U1.Views.ScTexture, tex_name);
                }
                stexture.Uri = tex.Uri;
                this._texture = stexture;
            }
        }
        OnClear() {
            if (this._texture != null) {
                this._texture.Dispose();
                this._texture = undefined;
            }
        }
        OnElementPropertyChanged(sender, prop) {
            super.OnElementPropertyChanged(sender, prop);
            this._ver++;
        }
    }
    KBim.Pr3D_MTexture = Pr3D_MTexture;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class Pr3D_SelNode extends U1.Views.UElementPresenter {
        get IsSelected() {
            return false;
        }
        OnMouseDown(e) {
            this.KDoc.Selection.Add(this.SelectedNode, true);
        }
        OnSelected() {
        }
    }
    KBim.Pr3D_SelNode = Pr3D_SelNode;
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KBimStringService {
    }
    KBimStringService.LB_BLOCK_REFERENCE = "Block Reference";
    KBimStringService.LB_TRANSFORM = "Transform";
    KBimStringService.LB_LOCATION = "Location";
    KBimStringService.LB_ROTAION = "Rotation";
    KBimStringService.LB_SCALE = "Scale";
    KBimStringService.LB_SIZE = "Size";
    KBimStringService.LB_LINE = "Line";
    KBimStringService.LB_POLYLINE = "Polyline";
    KBimStringService.LB_LINE_WIDTH = "Line Width";
    KBimStringService.COLOR = "Color";
    KBimStringService.LINE_COLOR = "Line Color";
    KBim.KBimStringService = KBimStringService;
})(KBim || (KBim = {}));
var U1;
(function (U1) {
    var VD;
    (function (VD) {
        class DrawBoxTool extends U1.Views.DefaultTool {
            OnAttach(view) {
            }
            OnDetach(view) {
            }
            OnMouseDown(ev) {
                if (U1.IsLeftMouseDown(ev)) {
                    let pos = this.View.ScreenToWorkingPlane(this.View.CurDn);
                    this.View.Document.BeginTransaction();
                    this.View.Document.EndTransaction();
                    return true;
                }
                return true;
            }
            OnMouseUp(ev) {
                this.isPanning = false;
                if (U1.IsLeftMouseUp(ev)) {
                    return true;
                }
                this.View.ActiveTool = null;
                return true;
            }
            GetOptions() {
                let options = [
                    new U1.UPropDouble({
                        GetValueFunc: () => DrawBoxTool.w,
                        SetValueFunc: (p_, v_) => DrawBoxTool.w = v_,
                        Label: "W"
                    }),
                    new U1.UPropDouble({
                        GetValueFunc: () => DrawBoxTool.h,
                        SetValueFunc: (p_, v_) => DrawBoxTool.h = v_,
                        Label: "H"
                    }),
                    new U1.UPropDouble({
                        GetValueFunc: () => DrawBoxTool.l,
                        SetValueFunc: (p_, v_) => DrawBoxTool.l = v_,
                        Label: "L"
                    }),
                ];
                return options;
            }
        }
        DrawBoxTool.w = 10;
        DrawBoxTool.h = 10;
        DrawBoxTool.l = 10;
        VD.DrawBoxTool = DrawBoxTool;
    })(VD = U1.VD || (U1.VD = {}));
})(U1 || (U1 = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class KView extends U1.Views.ViewBase {
            constructor() {
                super(...arguments);
                this._showNavigator = false;
                this.ShowOrbitPivotMark = true;
            }
            get SvgOverlay() {
                return null;
            }
            get SvgText() {
                return null;
            }
            DrawSelectionBox(dn, mv, p, color) {
                if (this.m_rect != null) {
                    var min = U1.Vector2.Min(dn, mv);
                    var max = U1.Vector2.Max(dn, mv);
                    this.m_rect.setAttribute("x", "" + min.X);
                    this.m_rect.setAttribute("y", "" + min.Y);
                    this.m_rect.setAttribute("width", "" + (max.X - min.X));
                    this.m_rect.setAttribute("height", "" + (max.Y - min.Y));
                    if (dn.X < mv.X) {
                        this.m_rect.style.fill = "#0000FF";
                        this.m_rect.style.stroke = "#0000FF";
                        this.m_rect.style.fillOpacity = "0.4";
                    }
                    else {
                        this.m_rect.style.fill = "#00FF00";
                        this.m_rect.style.stroke = "#00FF00";
                        this.m_rect.style.fillOpacity = "0.4";
                    }
                }
            }
            HideSelectionBox() {
                if (this.m_rect != null) {
                    var svgOverlay = this.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.removeChild(this.m_rect);
                    this.m_rect = undefined;
                }
            }
            ShowSelectionBox() {
                if (this.m_rect == null) {
                    var svgOverlay = this.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    var svgNS = "http://www.w3.org/2000/svg";
                    var rect = this.m_rect = document.createElementNS(svgNS, 'rect');
                    svgOverlay.appendChild(rect);
                    rect.style.strokeWidth = "2px";
                    rect.style.strokeDasharray = "5,5";
                }
            }
            get ShowNavicator() {
                return this._showNavigator;
            }
            set ShowNavicator(value) {
                this._showNavigator = value;
            }
            ZoomFit(bbx = null) {
                if (bbx == null && this.Min !== undefined) {
                    bbx = new U1.BoundingBox(this.Min, this.Max);
                }
                super.ZoomFit(bbx);
            }
            PickOrbitPoint(view) {
                var _a;
                var isectInfo = null;
                var raycaster = new THREE.Raycaster();
                var mouse = { x: 0, y: 0 };
                mouse.x = (view.X / this.Width) * 2 - 1;
                mouse.y = -(view.Y / this.Height) * 2 + 1;
                var sceneThree = this.Scene;
                if (sceneThree.SceneMode == Views.SceneMode.Orthographic3D ||
                    sceneThree.SceneMode == Views.SceneMode.Orthographic2D)
                    raycaster.setFromCamera(mouse, sceneThree.CamOrtho);
                else
                    raycaster.setFromCamera(mouse, sceneThree.CamPersp);
                var intersects = raycaster.intersectObjects(this.Scene.SceneWorld.children, true);
                for (var i = 0; i < intersects.length; i++) {
                    if (((_a = intersects[i].object) === null || _a === void 0 ? void 0 : _a.visible) != true)
                        continue;
                    isectInfo = new U1.ISectInfo();
                    isectInfo.IsectPosition = Views.ThreeUtil.FromVector3(intersects[i].point);
                    isectInfo.Distance = intersects[i].distance;
                    break;
                }
                return isectInfo;
            }
            OnMouseMove(ev) {
                super.OnMouseMove(ev);
                this.UpdateOrbitPivotMark();
            }
            OnTouchMove(ev) {
                var res = super.OnTouchMove(ev);
                this.UpdateOrbitPivotMark();
                return res;
            }
            UpdateOrbitPivotMark() {
                var _a;
                var visible = this.ShowOrbitPivotMark
                    && (this.Mode == U1.Views.ViewModes.Orbitting || this.Mode == U1.Views.ViewModes.Paning)
                    && this.IsMouseDown;
                if (!visible) {
                    if (this.pivotControl != null)
                        this.Controls.RemoveControl(this.pivotControl);
                    this.pivotControl = null;
                    return;
                }
                if (this.pivotControl == null) {
                    this.pivotControl = this.Controls.AddControl(Views.VcPoint);
                    this.pivotControl.Radius = 12;
                    this.pivotControl.IsPickable = false;
                    this.pivotControl.Fill = U1.Colors.Blue;
                    this.pivotControl.Fill.A = 120;
                }
                this.pivotControl.Position = (_a = this.PivotPoint) !== null && _a !== void 0 ? _a : this.Scene.Camera.LookAt;
            }
        }
        Views.KView = KView;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class VcNavigator2Three extends U1.Views.VcNavigator {
            constructor() {
                super(...arguments);
                this.m_rotPlane = new U1.Plane();
            }
            get IsDraging() {
                return this.m_isDraging;
            }
            set IsDraging(value) {
                this.m_isDraging = value;
                if (!value) {
                    return;
                }
            }
            OnUpdate() {
                if (this.m_navThree == null || this.m_navThree.IsDisposed) {
                    this.m_navThree = this.Scene.Overlay.AddEntity(KBim.Views.ScNavigatorThree);
                    this.m_navThree.IsPickable = false;
                }
            }
            Clear() {
                if (this.m_navThree != null) {
                    this.m_navThree.Dispose();
                    this.m_navThree = null;
                }
            }
            OnMouseDown(ev) {
                this.View.ActiveControl = this;
                return true;
            }
            OnMouseUp(ev) {
                if (!this.IsDraging) {
                    var screen = this.View.CurDn;
                    var isect = this.m_navThree.CheckIntersect_1(screen.X, screen.Y);
                    if (isect != null) {
                        var xdir = new U1.Vector3();
                        var ydir = new U1.Vector3();
                        var zdir = new U1.Vector3();
                        if (isect.Attr == 21
                            && this.m_navThree.GetDirectionByAttr(isect.Attr, xdir, ydir, zdir)) {
                            this.OnFitAxes(xdir, ydir, zdir);
                        }
                    }
                }
                this.IsDraging = false;
                if (this.View.ActiveControl == this)
                    this.View.ActiveControl = null;
                return true;
            }
            OnMouseMove(ev) {
                var cache = Views.VcNavigator3Three;
                var tv0 = cache[".omm.v0"] || (cache[".omm.v0"] = new U1.Vector3());
                var tv1 = cache[".omm.v1"] || (cache[".omm.v1"] = new U1.Vector3());
                var tv2 = cache[".omm.v2"] || (cache[".omm.v2"] = new U1.Vector3());
                var tv3 = cache[".omm.v3"] || (cache[".omm.v3"] = new U1.Vector3());
                var tv4 = cache[".omm.v4"] || (cache[".omm.v4"] = new U1.Vector3());
                var tv20 = cache[".omm.v20"] || (cache[".omm.v20"] = new U1.Vector2());
                var tv21 = cache[".omm.v21"] || (cache[".omm.v21"] = new U1.Vector2());
                if (ev.buttons == 1) {
                    if (!this.IsDraging) {
                        if (U1.Vector2.Distance(this.View.CurMv, this.View.OldDn) > 4) {
                            var out = {};
                            var prv = this.m_navThree.GetSnapedPoint(this.View.CurMv, out);
                            if (out.part != Views.ScNavigatorThree.PARTS.None) {
                                this.m_rotPlane.SetFromPointNormal(prv, U1.Vector3.UnitZ);
                            }
                            else {
                                this.m_rotPlane.SetZero();
                            }
                            this.IsDraging = true;
                        }
                    }
                    else {
                        var prvMv = this.View.OldMv;
                        var curMv = this.View.CurMv;
                        var xcam = this.m_navThree.Camera;
                        if (!this.m_rotPlane.IsZero) {
                            var ray0 = xcam.CalPickingRay(prvMv.X, prvMv.Y);
                            var ray1 = xcam.CalPickingRay(curMv.X, curMv.Y);
                            var p0 = new U1.Vector3();
                            var p1 = new U1.Vector3();
                            this.m_rotPlane.IntersectsLine(ray0.Position, ray0.Direction, p0);
                            this.m_rotPlane.IntersectsLine(ray1.Position, ray1.Direction, p1);
                            if (p0 != p1) {
                                var cent = new U1.Vector3(0, 0, p0.Z);
                                var v0 = tv0.SetSubtract(p0, cent).Normalize();
                                var v1 = tv1.SetSubtract(p1, cent).Normalize();
                                var axis = tv2.SetCross(v0, v1).Normalize();
                                var ang = Math.acos(U1.Vector3.Dot(v1, v0));
                                this.OnOrbit(axis, -ang);
                            }
                        }
                        else {
                            var delt = tv20.SetSubtract(curMv, prvMv);
                            delt.Scale(0.01);
                            var len = delt.Length();
                            var up = U1.Vector3.Normalize(xcam.Up, tv0);
                            var rt = U1.Vector3.Normalize(xcam.GetRight(tv1));
                            delt.X = 0;
                            if (Math.abs(delt.X) > Math.abs(delt.Y)) {
                                this.OnOrbit(U1.Vector3.UnitZ, -delt.X);
                            }
                            else {
                                this.OnOrbit(rt, delt.Y);
                            }
                        }
                    }
                    this.View.Invalidate();
                }
                else {
                    this.IsDraging = false;
                }
                return true;
            }
            OnOrbit(axis, p) {
                var cache = Views.VcNavigator3Three;
                var tv0 = cache[".orb.v0"] || (cache[".orb.v0"] = new U1.Vector3());
                var tv1 = cache[".orb.v1"] || (cache[".orb.v1"] = new U1.Vector3());
                var workplane = this.View.WorkingPlane;
                var campos = this.Scene.Camera.Position;
                var camdir = this.Scene.Camera.GetDirection(tv0);
                var cent = tv1;
                if (workplane.IntersectsLine(campos, camdir, cent) == null)
                    cent = this.Scene.Camera.LookAt;
                this.Scene.Camera.Rotate(cent, axis, p);
            }
            CheckIntersect(isectContext) {
                if (this.m_navThree == null || !this.m_navThree.Visible)
                    return null;
                var result = this.m_navThree.CheckIntersect(isectContext);
                if (result != null) {
                    var isect = result;
                    isect.Source = this;
                    isect.Distance = 0;
                    result = isect;
                }
                else {
                }
                return result;
            }
            OnFitAxes(x, y, z) {
                if (this._timerToken !== undefined)
                    clearInterval(this._timerToken);
                var cam = this.View.Scene.Camera;
                var campos = cam.Position;
                var camdir = cam.GetDirection();
                var workPlane = this.View.WorkingPlane;
                var View = this.View;
                var Scene = this.Scene;
                var isectPos = new U1.Vector3();
                var dist = View.WorkingPlane.IntersectsLine(campos, camdir, isectPos);
                var loc = cam.Position;
                var lookat = dist == null ? cam.LookAt : U1.Vector3.ScaleAdd(campos, dist, camdir);
                var cx = cam.GetRight();
                var cy = cam.Up;
                var cz = cam.GetDirection().Scale(-1);
                var srcXM = U1.Matrix4.Identity;
                srcXM.Right = cx;
                srcXM.Up = cy;
                srcXM.Backward = cz;
                var tgtXM = U1.Matrix4.Identity;
                tgtXM.Right = x;
                tgtXM.Up = y;
                tgtXM.Backward = z;
                var distance = U1.Vector3.Distance(lookat, cam.Position);
                var res = U1.Views.ScCamera.GetRotation(srcXM, tgtXM);
                var axis = res.axis;
                var angle = res.angle;
                var roll = res.roll;
                var xcam = cam.GetCamera();
                if (angle < 0.1 && roll < 0.1)
                    return;
                xcam.LookAt = lookat;
                var finish = () => {
                    this.Scene.Camera.LookAt = lookat;
                    this.Scene.Camera.Position = U1.Vector3.ScaleAdd(lookat, distance, z);
                    this.Scene.Camera.Up = y;
                    this.m_navThree.SetChanged();
                    View.Invalidate();
                };
                var Lerp = this.Lerp;
                var a = 0.0;
                var self = this;
                self._timerToken = setInterval(() => {
                    if (a <= 1 - 0.0001) {
                        a += (1 - a) * 0.2;
                        var mcam = xcam.Clone();
                        mcam.Roll(Lerp(0, roll, a));
                        mcam.Rotate(lookat, axis, Lerp(0, angle, a));
                        var tpos = U1.Vector3.ScaleAdd(mcam.LookAt, -distance, mcam.Direction);
                        Scene.Camera.LookAt = mcam.LookAt;
                        Scene.Camera.Position = tpos;
                        Scene.Camera.Up = mcam.Up;
                        View.Invalidate();
                    }
                    else {
                        clearInterval(self._timerToken);
                        self._timerToken = undefined;
                        finish();
                    }
                }, 30);
            }
            Lerp(src, tgt, amount) {
                return src * (1 - amount) + tgt * (amount);
            }
        }
        Views.VcNavigator2Three = VcNavigator2Three;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class VcNavigator3Three extends U1.Views.VcNavigator {
            constructor() {
                super(...arguments);
                this.m_rotPlane = new U1.Plane();
            }
            get IsDraging() {
                return this.m_isDraging;
            }
            set IsDraging(value) {
                this.m_isDraging = value;
                if (!value) {
                    return;
                }
            }
            OnUpdate() {
                if (this.m_navThree == null || this.m_navThree.IsDisposed) {
                    this.m_navThree = this.Scene.Overlay.AddEntity(KBim.Views.ScNavigatorThree);
                    this.m_navThree.IsPickable = false;
                }
            }
            Clear() {
                if (this.m_navThree != null) {
                    this.m_navThree.Dispose();
                    this.m_navThree = null;
                }
            }
            OnMouseDown(ev) {
                this.View.ActiveControl = this;
                return true;
            }
            OnMouseUp(ev) {
                if (!this.IsDraging) {
                    var screen = this.View.CurDn;
                    var isect = this.m_navThree.CheckIntersect_1(screen.X, screen.Y);
                    if (isect != null) {
                        var xdir = new U1.Vector3();
                        var ydir = new U1.Vector3();
                        var zdir = new U1.Vector3();
                        if (this.m_navThree.GetDirectionByAttr(isect.Attr, xdir, ydir, zdir)) {
                            this.OnFitAxes(xdir, ydir, zdir);
                        }
                    }
                }
                this.IsDraging = false;
                if (this.View.ActiveControl == this)
                    this.View.ActiveControl = null;
                return true;
            }
            OnMouseMove(ev) {
                var cache = VcNavigator3Three;
                var tv0 = cache[".omm.v0"] || (cache[".omm.v0"] = new U1.Vector3());
                var tv1 = cache[".omm.v1"] || (cache[".omm.v1"] = new U1.Vector3());
                var tv2 = cache[".omm.v2"] || (cache[".omm.v2"] = new U1.Vector3());
                var tv3 = cache[".omm.v3"] || (cache[".omm.v3"] = new U1.Vector3());
                var tv4 = cache[".omm.v4"] || (cache[".omm.v4"] = new U1.Vector3());
                var tv20 = cache[".omm.v20"] || (cache[".omm.v20"] = new U1.Vector2());
                var tv21 = cache[".omm.v21"] || (cache[".omm.v21"] = new U1.Vector2());
                if (ev.buttons == 1) {
                    if (!this.IsDraging) {
                        if (U1.Vector2.Distance(this.View.CurMv, this.View.OldDn) > 4) {
                            var out = {};
                            var prv = this.m_navThree.GetSnapedPoint(this.View.CurMv, out);
                            if (out.part != Views.ScNavigatorThree.PARTS.None) {
                                this.m_rotPlane.SetFromPointNormal(prv, U1.Vector3.UnitZ);
                            }
                            else {
                                this.m_rotPlane.SetZero();
                            }
                            this.IsDraging = true;
                        }
                    }
                    else {
                        var prvMv = this.View.OldMv;
                        var curMv = this.View.CurMv;
                        var xcam = this.m_navThree.Camera;
                        if (!this.m_rotPlane.IsZero) {
                            var ray0 = xcam.CalPickingRay(prvMv.X, prvMv.Y);
                            var ray1 = xcam.CalPickingRay(curMv.X, curMv.Y);
                            var p0 = new U1.Vector3();
                            var p1 = new U1.Vector3();
                            this.m_rotPlane.IntersectsLine(ray0.Position, ray0.Direction, p0);
                            this.m_rotPlane.IntersectsLine(ray1.Position, ray1.Direction, p1);
                            if (p0 != p1) {
                                var cent = new U1.Vector3(0, 0, p0.Z);
                                var v0 = tv0.SetSubtract(p0, cent).Normalize();
                                var v1 = tv1.SetSubtract(p1, cent).Normalize();
                                var axis = tv2.SetCross(v0, v1).Normalize();
                                var ang = Math.acos(U1.Vector3.Dot(v1, v0));
                                this.OnOrbit(axis, -ang);
                            }
                        }
                        else {
                            var delt = tv20.SetSubtract(curMv, prvMv);
                            delt.Scale(0.01);
                            var len = delt.Length();
                            var up = U1.Vector3.Normalize(xcam.Up, tv0);
                            var rt = U1.Vector3.Normalize(xcam.GetRight(tv1));
                            if (Math.abs(delt.X) > Math.abs(delt.Y)) {
                                this.OnOrbit(U1.Vector3.UnitZ, -delt.X);
                            }
                            else {
                                this.OnOrbit(rt, delt.Y);
                            }
                        }
                    }
                    this.View.Invalidate();
                }
                else {
                    this.IsDraging = false;
                }
                return true;
            }
            OnOrbit(axis, p) {
                var cache = VcNavigator3Three;
                var tv0 = cache[".orb.v0"] || (cache[".orb.v0"] = new U1.Vector3());
                var tv1 = cache[".orb.v1"] || (cache[".orb.v1"] = new U1.Vector3());
                var workplane = this.View.WorkingPlane;
                var campos = this.Scene.Camera.Position;
                var camdir = this.Scene.Camera.GetDirection(tv0);
                var cent = tv1;
                if (workplane.IntersectsLine(campos, camdir, cent) == null)
                    cent = this.Scene.Camera.LookAt;
                this.Scene.Camera.Rotate(cent, axis, p);
            }
            CheckIntersect(isectContext) {
                if (this.m_navThree == null || !this.m_navThree.Visible)
                    return null;
                var result = this.m_navThree.CheckIntersect(isectContext);
                if (result != null) {
                    var isect = result;
                    isect.Source = this;
                    isect.Distance = 0;
                    result = isect;
                }
                else {
                }
                return result;
            }
            OnFitAxes(x, y, z) {
                if (this._timerToken !== undefined)
                    clearInterval(this._timerToken);
                var cam = this.View.Scene.Camera;
                var campos = cam.Position;
                var camdir = cam.GetDirection();
                var workPlane = this.View.WorkingPlane;
                var View = this.View;
                var Scene = this.Scene;
                var isectPos = new U1.Vector3();
                var dist = View.WorkingPlane.IntersectsLine(campos, camdir, isectPos);
                var loc = cam.Position;
                var lookat = dist == null ? cam.LookAt : U1.Vector3.ScaleAdd(campos, dist, camdir);
                var cx = cam.GetRight();
                var cy = cam.Up;
                var cz = cam.GetDirection().Scale(-1);
                var srcXM = U1.Matrix4.Identity;
                srcXM.Right = cx;
                srcXM.Up = cy;
                srcXM.Backward = cz;
                var tgtXM = U1.Matrix4.Identity;
                tgtXM.Right = x;
                tgtXM.Up = y;
                tgtXM.Backward = z;
                var distance = U1.Vector3.Distance(lookat, cam.Position);
                var res = U1.Views.ScCamera.GetRotation(srcXM, tgtXM);
                var axis = res.axis;
                var angle = res.angle;
                var roll = res.roll;
                var xcam = cam.GetCamera();
                if (angle < 0.1 && roll < 0.1)
                    return;
                xcam.LookAt = lookat;
                var finish = () => {
                    this.Scene.Camera.LookAt = lookat;
                    this.Scene.Camera.Position = U1.Vector3.ScaleAdd(lookat, distance, z);
                    this.Scene.Camera.Up = y;
                    this.m_navThree.SetChanged();
                    View.Invalidate();
                };
                var Lerp = this.Lerp;
                var a = 0.0;
                var self = this;
                self._timerToken = setInterval(() => {
                    if (a <= 1 - 0.0001) {
                        a += (1 - a) * 0.2;
                        var mcam = xcam.Clone();
                        mcam.Roll(Lerp(0, roll, a));
                        mcam.Rotate(lookat, axis, Lerp(0, angle, a));
                        var tpos = U1.Vector3.ScaleAdd(mcam.LookAt, -distance, mcam.Direction);
                        Scene.Camera.LookAt = mcam.LookAt;
                        Scene.Camera.Position = tpos;
                        Scene.Camera.Up = mcam.Up;
                        View.Invalidate();
                    }
                    else {
                        clearInterval(self._timerToken);
                        self._timerToken = undefined;
                        finish();
                    }
                }, 30);
            }
            Lerp(src, tgt, amount) {
                return src * (1 - amount) + tgt * (amount);
            }
        }
        Views.VcNavigator3Three = VcNavigator3Three;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class VcXFormPt {
            constructor(xform, part) {
                this.dragStart = U1.Vector3.Zero;
                this.dragCurr = U1.Vector3.Zero;
                this.Color = U1.Colors.White;
                var Parts = VcXFormPt.PARTS;
                switch (part) {
                    case Parts.LFB:
                        break;
                    case Parts.RFB:
                        break;
                    case Parts.RKB:
                        break;
                    case Parts.LKB:
                        break;
                    case Parts.LB:
                        this.Color = U1.Colors.Black;
                        break;
                    case Parts.FB:
                        this.Color = U1.Colors.Black;
                        break;
                    case Parts.RB:
                        this.Color = U1.Colors.Black;
                        break;
                    case Parts.KB:
                        this.Color = U1.Colors.Black;
                        break;
                    case Parts.CT:
                        break;
                    case Parts.CTT:
                        break;
                }
                this.XForm = xform;
                this.Part = part;
            }
            CheckIntersect(isectContext) {
                if (this.Point == null)
                    return null;
                let isect = this.Point.CheckIntersect(isectContext);
                if (isect != null) {
                    return isect;
                }
                return null;
            }
            Update() {
                let xform = this.XForm;
                let obb = xform.OBBCorners;
                if (xform.CanScale != true)
                    return;
                if (this.Point == null) {
                    this.Point = this.XForm.Scene.Screen.AddEntity(U1.Views.ScPoint);
                    this.Point.Style.Alpha = 0.4;
                    this.Point.Radius = 10;
                    this.Point.Style.Fill = this.Color;
                    this.Point.Style.Stroke = U1.Colors.Black;
                    this.Point.Style.StrokeThickness = 1;
                    this.Point.Tag = this;
                }
                let pos = this.Pos || obb[this.Part];
                this.Point.Position = pos;
                this.Point.Style.Fill = xform.ActivePt != this ? this.Color : VcXFormPt.OverColor;
                this.Point.SetChanged();
            }
            Clear() {
                if (this.Point != null) {
                    this.Point.Dispose();
                    this.Point = undefined;
                }
            }
            GetOpp() {
                var oppPart = "";
                var Parts = VcXFormPt.PARTS;
                switch (this.Part) {
                    case Parts.LFB:
                        oppPart = Parts.RKB;
                        break;
                    case Parts.RFB:
                        oppPart = Parts.LKB;
                        break;
                    case Parts.RKB:
                        oppPart = Parts.LFB;
                        break;
                    case Parts.LKB:
                        oppPart = Parts.RFB;
                        break;
                    case Parts.LB:
                        oppPart = Parts.RB;
                        break;
                    case Parts.FB:
                        oppPart = Parts.KB;
                        break;
                    case Parts.RB:
                        oppPart = Parts.LB;
                        break;
                    case Parts.KB:
                        oppPart = Parts.FB;
                        break;
                    case Parts.CT:
                        oppPart = Parts.CB;
                        break;
                    case Parts.CTT:
                        oppPart = Parts.CB;
                        break;
                }
                return this.XForm.OBBCorners[oppPart];
            }
            OnMouseLeave(ev) {
                return true;
            }
            OnMouseMove(ev) {
                let xform = this.XForm;
                var view = xform.View;
                let corners = xform.OBBCorners;
                var pos = corners[this.Part];
                var opp = this.GetOpp();
                var dir = U1.Vector3.Subtract(pos, opp);
                var ray = view.GetRay(view.CurMv);
                var res = { s: 0, t: 0 };
                var dist = U1.Line3.SquardDistance1(pos, dir, ray.Position, ray.Direction, res);
                this.dragCurr.SetScaleAdd(pos, res.s, dir);
                if (xform.TM_Mode == U1.Views.VcXForm.TM_Modes.None) {
                    this.dragStart.CopyFrom(this.dragCurr);
                    xform.BeginScale();
                }
                xform.Scale(opp, this.dragStart, this.dragCurr);
                return true;
            }
            OnMouseUp(ev) {
                let xform = this.XForm;
                var view = xform.View;
                let corners = xform.OBBCorners;
                var pos = corners[this.Part];
                var opp = this.GetOpp();
                var dir = U1.Vector3.Subtract(pos, opp);
                var ray = view.GetRay(view.CurUp);
                var res = { s: 0, t: 0 };
                var dist = U1.Line3.SquardDistance1(pos, dir, ray.Position, ray.Direction, res);
                this.dragCurr.SetScaleAdd(pos, res.s, dir);
                if (this.XForm.TM_Mode == U1.Views.VcXForm.TM_Modes.Scale) {
                    this.XForm.EndScale(opp, this.dragStart, this.dragCurr);
                }
                return true;
            }
        }
        VcXFormPt.PARTS = {
            CENT: "CENT",
            LB: "LB",
            FB: "FB",
            RB: "RB",
            KB: "KB",
            CB: "CB",
            LT: "LT",
            FT: "FT",
            RT: "RT",
            KT: "KT",
            CT: "CT",
            CTT: "CTT",
            LFB: "LFB",
            RFB: "RFB",
            RKB: "RKB",
            LKB: "LKB",
            LFT: "LFT",
            RFT: "RFT",
            RKT: "RKT",
            LKT: "LKT",
            BTM: "BTM",
            TOP: "TOP",
            ROT_X: "ROT_X",
            ROT_Y: "ROT_Y",
            ROT_Z: "ROT_Z"
        };
        VcXFormPt.OverColor = U1.Colors.Orange;
        Views.VcXFormPt = VcXFormPt;
        class VcXFormPtRot extends VcXFormPt {
            constructor(xform, part) {
                super(xform, part);
                this.Plane = new U1.Plane();
                this.Color = U1.Colors.Red;
            }
            Update() {
                let xform = this.XForm;
                let pos = this.GetPos();
                if (xform.CanRotate != true)
                    return;
                if (this.Point == null) {
                    this.Point = this.XForm.Scene.Screen.AddEntity(U1.Views.ScPoint);
                    this.Point.Style.Alpha = 0.4;
                    this.Point.Radius = 10;
                    this.Point.Style.Fill = this.Color;
                    this.Point.Style.Stroke = U1.Colors.Black;
                    this.Point.Style.StrokeThickness = 1;
                    this.Point.Tag = this;
                }
                this.Point.Position = pos;
                this.Point.Style.Fill = xform.ActivePt != this ? this.Color : VcXFormPt.OverColor;
                this.Point.SetChanged();
            }
            GetPos() {
                let xform = this.XForm;
                let corners = xform.OBBCorners;
                let pos;
                switch (this.Part) {
                    case VcXFormPt.PARTS.ROT_Z:
                        pos = corners[VcXFormPt.PARTS.ROT_Z];
                        break;
                    case VcXFormPt.PARTS.ROT_Y:
                        pos = corners[VcXFormPt.PARTS.ROT_Y];
                        break;
                    case VcXFormPt.PARTS.ROT_X:
                        pos = corners[VcXFormPt.PARTS.ROT_X];
                        break;
                }
                return pos;
            }
            GetAxis() {
                let xform = this.XForm;
                let corners = xform.OBBCorners;
                let axis;
                switch (this.Part) {
                    case VcXFormPt.PARTS.ROT_Z:
                        axis = corners.ZAXIS;
                        break;
                    case VcXFormPt.PARTS.ROT_Y:
                        axis = corners.YAXIS;
                        break;
                    case VcXFormPt.PARTS.ROT_X:
                        axis = corners.XAXIS;
                        break;
                }
                return axis;
            }
            OnMouseMove(ev) {
                let xform = this.XForm;
                var view = xform.View;
                let corners = xform.OBBCorners;
                var pos = this.GetPos();
                var cent = corners.CB;
                var rad = U1.Vector3.Distance(pos, cent);
                var norm = this.GetAxis();
                this.Plane.SetFromPointNormal(cent, norm);
                view.ViewToPlane(view.CurMv, this.Plane, this.dragCurr);
                if (xform.TM_Mode == U1.Views.VcXForm.TM_Modes.None) {
                    this.dragStart.CopyFrom(this.dragCurr);
                    xform.BeginRotate();
                }
                xform.Rotate(cent, norm, this.dragStart, this.dragCurr);
                return true;
            }
            OnMouseUp(ev) {
                let xform = this.XForm;
                var view = xform.View;
                var view = xform.View;
                let corners = xform.OBBCorners;
                var pos = this.GetPos();
                var cent = corners.CB;
                var rad = U1.Vector3.Distance(pos, cent);
                var norm = this.GetAxis();
                this.Plane.SetFromPointNormal(cent, norm);
                view.ViewToPlane(view.CurMv, this.Plane, this.dragCurr);
                if (this.XForm.TM_Mode == U1.Views.VcXForm.TM_Modes.Rotate) {
                    this.XForm.EndRotate(cent, norm, this.dragStart, this.dragCurr);
                }
                return true;
            }
        }
        Views.VcXFormPtRot = VcXFormPtRot;
        class VcXFormMvUp extends VcXFormPt {
            constructor(xform, part) {
                super(xform, part);
            }
            OnMouseMove(ev) {
                let xform = this.XForm;
                if (xform.CanRotate != true)
                    return;
                var view = xform.View;
                let corners = xform.OBBCorners;
                var pos = corners[this.Part];
                var opp = this.GetOpp();
                var dir = U1.Vector3.Subtract(pos, opp);
                var ray = view.GetRay(view.CurMv);
                var res = { s: 0, t: 0 };
                var dist = U1.Line3.SquardDistance1(pos, dir, ray.Position, ray.Direction, res);
                this.dragCurr.SetScaleAdd(pos, res.s, dir);
                if (xform.TM_Mode == U1.Views.VcXForm.TM_Modes.None) {
                    this.dragStart.CopyFrom(this.dragCurr);
                    xform.BeginMove();
                }
                xform.Move(this.dragStart, this.dragCurr);
                return true;
            }
            OnMouseUp(ev) {
                let xform = this.XForm;
                var view = xform.View;
                let corners = xform.OBBCorners;
                var pos = corners[this.Part];
                var opp = this.GetOpp();
                var dir = U1.Vector3.Subtract(pos, opp);
                var ray = view.GetRay(view.CurUp);
                var res = { s: 0, t: 0 };
                var dist = U1.Line3.SquardDistance1(pos, dir, ray.Position, ray.Direction, res);
                this.dragCurr.SetScaleAdd(pos, res.s, dir);
                if (this.XForm.TM_Mode == U1.Views.VcXForm.TM_Modes.Move) {
                    this.XForm.EndMove(this.dragStart, this.dragCurr);
                }
                return true;
            }
        }
        Views.VcXFormMvUp = VcXFormMvUp;
        class VcXFormThree extends U1.Views.VcXForm {
            constructor() {
                super(...arguments);
                this.m_sc_ps = {
                    LFB: new VcXFormPt(this, VcXFormPt.PARTS.LFB),
                    RFB: new VcXFormPt(this, VcXFormPt.PARTS.RFB),
                    RKB: new VcXFormPt(this, VcXFormPt.PARTS.RKB),
                    LKB: new VcXFormPt(this, VcXFormPt.PARTS.LKB),
                    LB: new VcXFormPt(this, VcXFormPt.PARTS.LB),
                    FB: new VcXFormPt(this, VcXFormPt.PARTS.FB),
                    RB: new VcXFormPt(this, VcXFormPt.PARTS.RB),
                    KB: new VcXFormPt(this, VcXFormPt.PARTS.KB),
                    KT: new VcXFormPt(this, VcXFormPt.PARTS.CT),
                    ROT_Z: new VcXFormPtRot(this, VcXFormPt.PARTS.ROT_Z),
                    ROT_X: new VcXFormPtRot(this, VcXFormPt.PARTS.ROT_X),
                    ROT_Y: new VcXFormPtRot(this, VcXFormPt.PARTS.ROT_Y),
                    MOV_Z: new VcXFormMvUp(this, VcXFormPt.PARTS.CTT)
                };
                this.OBBCorners = VcXFormThree.part_pts;
                this.m_ps = [];
            }
            get KView() {
                return this.View;
            }
            get ActivePt() {
                return this.m_isect_pt;
            }
            OnUpdate() {
                var bps = this.OBBCorners;
                var cam = this.View.Scene.Camera;
                var obb = this.OBB;
                this.UpdateCorners();
                if (this.m_bottom == null) {
                    this.m_bottom = this.View.Scene.Screen.AddEntity(U1.Views.ScPolygon);
                    this.m_bottom.Style.Alpha = 0.4;
                    this.m_bottom.Style.Fill = U1.Colors.Green;
                    this.m_bottom.Style.Stroke = U1.Colors.DarkBlue;
                    this.m_bottom.Style.StrokeThickness = 5;
                    this.m_bottom.Style.StrokeDash = [3, 3];
                }
                this.m_bottom.Points = bps.BTM;
                this.m_bottom.SetChanged();
                for (let idx in this.m_sc_ps) {
                    this.m_sc_ps[idx].Update();
                }
            }
            UpdateCorners() {
                var bps = this.OBBCorners;
                var obb = this.OBB;
                obb.LFB(bps.LFB);
                obb.RFB(bps.RFB);
                obb.RKB(bps.RKB);
                obb.LKB(bps.LKB);
                obb.LFT(bps.LFT);
                obb.RFT(bps.RFT);
                obb.RKT(bps.RKT);
                obb.LKT(bps.LKT);
                bps.LB.SetAdd(bps.LFB, bps.LKB).Scale(0.5);
                bps.FB.SetAdd(bps.LFB, bps.RFB).Scale(0.5);
                bps.RB.SetAdd(bps.RFB, bps.RKB).Scale(0.5);
                bps.KB.SetAdd(bps.RKB, bps.LKB).Scale(0.5);
                bps.LT.SetAdd(bps.LFT, bps.LKT).Scale(0.5);
                bps.FT.SetAdd(bps.LFT, bps.RFT).Scale(0.5);
                bps.RT.SetAdd(bps.RFT, bps.RKT).Scale(0.5);
                bps.KT.SetAdd(bps.RKT, bps.LKT).Scale(0.5);
                bps.LB.SetAdd(bps.LFB, bps.LKB).Scale(0.5);
                bps.FB.SetAdd(bps.LFB, bps.RFB).Scale(0.5);
                bps.RB.SetAdd(bps.RFB, bps.RKB).Scale(0.5);
                bps.KB.SetAdd(bps.RKB, bps.LKB).Scale(0.5);
                bps.CT.SetAdd(bps.LFT, bps.RKT).Scale(0.5);
                bps.CB.SetAdd(bps.LFB, bps.RKB).Scale(0.5);
                bps.CENT.SetAdd(bps.LFB, bps.RKT).Scale(0.5);
                bps.CTT.SetScaleAdd(bps.CT, 1, U1.Vector3.Subtract(bps.CT, bps.CENT).Normalize());
                bps.BTM[0] = bps.LFB;
                bps.BTM[1] = bps.RFB;
                bps.BTM[2] = bps.RKB;
                bps.BTM[3] = bps.LKB;
                bps.FRT[0] = bps.LFB;
                bps.FRT[1] = bps.RFB;
                bps.FRT[2] = bps.RFT;
                bps.FRT[3] = bps.LFT;
                bps.TOP[0] = bps.LFT;
                bps.TOP[1] = bps.RFT;
                bps.TOP[2] = bps.RKT;
                bps.TOP[3] = bps.LKT;
                bps.ZLINE[0] = bps.CB;
                bps.ZLINE[1] = bps.CT;
                bps.ZAXIS.SetSubtract(bps.CT, bps.CB).Normalize();
                bps.XAXIS.SetSubtract(bps.RB, bps.LB).Normalize();
                bps.YAXIS.SetSubtract(bps.KB, bps.FB).Normalize();
                bps.ROT_Z.SetScaleAdd(bps.RFB, 1, U1.Vector3.Subtract(bps.RFB, bps.CENT).Normalize());
                bps.ROT_X.SetScaleAdd(bps.FT, 1, U1.Vector3.Subtract(bps.FT, bps.CENT).Normalize());
                bps.ROT_Y.SetScaleAdd(bps.RT, 1, U1.Vector3.Subtract(bps.RT, bps.CENT).Normalize());
            }
            AddPt(ptInfo) {
                var scp = this.View.Scene.Screen.AddEntity(U1.Views.ScPoint);
                scp.Style.Alpha = 0.4;
                scp.Radius = 10;
                scp.Style.Fill = ptInfo.Color;
                scp.Style.Stroke = U1.Colors.Black;
                scp.Style.StrokeThickness = 1;
                scp.Tag = ptInfo;
                return scp;
            }
            CheckIntersect(isectContext) {
                this.m_isect_pt = undefined;
                if (this.m_sc_ps != null) {
                    for (let idx in this.m_sc_ps) {
                        let sp = this.m_sc_ps[idx];
                        let isect = sp.CheckIntersect(isectContext);
                        if (isect != null) {
                            this.m_isect_pt = sp;
                            return isect;
                        }
                    }
                }
                return null;
            }
            Clear() {
                if (this.m_bottom != null) {
                    this.m_bottom.Dispose();
                    this.m_bottom = undefined;
                }
                if (this.m_sc_ps != null) {
                    for (let idx in this.m_sc_ps) {
                        let sp = this.m_sc_ps[idx];
                        sp.Clear();
                    }
                    this.m_sc_ps = undefined;
                }
                if (this.m_zaxis != null) {
                    this.m_zaxis.Dispose();
                    this.m_zaxis = undefined;
                }
            }
            OnMouseEnter(ev) {
                if (this.m_isect_pt != null) {
                }
                return false;
            }
            OnMouseLeave(ev) {
                if (this.m_isect_pt != null) {
                    return this.m_isect_pt.OnMouseLeave(ev);
                }
                return false;
            }
            OnMouseMove(ev) {
                if (this.m_isect_pt != null) {
                    return this.m_isect_pt.OnMouseMove(ev);
                }
                return false;
            }
            OnMouseUp(ev) {
                if (this.m_isect_pt != null) {
                    let res = this.m_isect_pt.OnMouseUp(ev);
                    this.m_isect_pt = undefined;
                    return res;
                }
                return false;
            }
            OnMouseDown(ev) {
                return false;
            }
            OnMouseWheel(ev) {
                return false;
            }
        }
        VcXFormThree.part_pts = {
            CENT: U1.Vector3.Zero,
            LB: U1.Vector3.Zero,
            FB: U1.Vector3.Zero,
            RB: U1.Vector3.Zero,
            KB: U1.Vector3.Zero,
            CB: U1.Vector3.Zero,
            LT: U1.Vector3.Zero,
            FT: U1.Vector3.Zero,
            RT: U1.Vector3.Zero,
            CT: U1.Vector3.Zero,
            KT: U1.Vector3.Zero,
            CTT: U1.Vector3.Zero,
            LFB: U1.Vector3.Zero,
            RFB: U1.Vector3.Zero,
            RKB: U1.Vector3.Zero,
            LKB: U1.Vector3.Zero,
            LFT: U1.Vector3.Zero,
            RFT: U1.Vector3.Zero,
            RKT: U1.Vector3.Zero,
            LKT: U1.Vector3.Zero,
            BTM: new Array(4),
            TOP: new Array(4),
            FRT: new Array(4),
            ZLINE: new Array(2),
            XAXIS: U1.Vector3.Zero,
            YAXIS: U1.Vector3.Zero,
            ZAXIS: U1.Vector3.Zero,
            ROT_X: U1.Vector3.Zero,
            ROT_Y: U1.Vector3.Zero,
            ROT_Z: U1.Vector3.Zero
        };
        Views.VcXFormThree = VcXFormThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScEllipseThree extends U1.Views.ScEllipse {
        }
        ScEllipseThree._p0 = new U1.Vector3();
        ScEllipseThree._p1 = new U1.Vector3();
        Views.ScEllipseThree = ScEllipseThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        let SceneMode;
        (function (SceneMode) {
            SceneMode[SceneMode["Orthographic2D"] = 0] = "Orthographic2D";
            SceneMode[SceneMode["Orthographic3D"] = 1] = "Orthographic3D";
            SceneMode[SceneMode["Perspective2D"] = 2] = "Perspective2D";
            SceneMode[SceneMode["Perspective3D"] = 3] = "Perspective3D";
        })(SceneMode = Views.SceneMode || (Views.SceneMode = {}));
        class SceneThree extends U1.Views.Scene {
            constructor(view) {
                super(view);
                this._frustum = new U1.BoundingFrustum();
                this._customRenderers = [];
                this._sceneMode = SceneMode.Orthographic2D;
                this.useSSAO = false;
                this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                this.Camera.OrthoHeight = 40;
                this.Camera.Far = 50000;
                this._sceneWorld = new THREE.Scene();
                this._sceneOverlay = new THREE.Scene();
                this._cam3d = new THREE.PerspectiveCamera(0, 1, 0, 1);
                this._cam2d = new THREE.OrthographicCamera(0, 1, 0, 1);
                var canvas = this.View.Canvas;
                this._renderer = new THREE.WebGLRenderer({
                    canvas: canvas,
                    antialias: true
                });
                this._renderer.setClearColor(Views.ThreeUtil.Color(this.ClearColor));
                this._light1_world = new THREE.DirectionalLight();
                this._light2_world = new THREE.DirectionalLight();
                this._light3_world = new THREE.DirectionalLight();
                this._light1_overlay = new THREE.DirectionalLight();
                this._light2_overlay = new THREE.DirectionalLight();
                this._light3_overlay = new THREE.DirectionalLight();
                this._sceneWorld.add(this._light1_world);
                this._sceneWorld.add(this._light2_world);
                this._sceneWorld.add(this._light3_world);
                this._sceneOverlay.add(this._light1_overlay);
                this._sceneOverlay.add(this._light2_overlay);
                this._sceneOverlay.add(this._light3_overlay);
                this._composer = new THREE.EffectComposer(this._renderer);
                var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam2d);
                this._composer.addPass(renderPass);
                this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam2d);
                this._composer.addPass(this.outlinePass);
                this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
                this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
                this.effectFXAA.renderToScreen = true;
                this._composer.addPass(this.effectFXAA);
            }
            get CamPersp() {
                return this._cam3d;
            }
            get CamOrtho() {
                return this._cam2d;
            }
            get SceneMode() {
                return this._sceneMode;
            }
            set SceneMode(value) {
                this._sceneMode = value;
                this.ChangeComposer();
            }
            get SceneWorld() {
                return this._sceneWorld;
            }
            get SceneOverlay() {
                return this._sceneOverlay;
            }
            ChangeComposer() {
                this._composer = new THREE.EffectComposer(this._renderer);
                switch (this.SceneMode) {
                    case SceneMode.Orthographic2D:
                        {
                            var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam2d);
                            this._composer.addPass(renderPass);
                            this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                            this.Camera.OrthoHeight = 40;
                            break;
                        }
                    case SceneMode.Orthographic3D:
                        {
                            var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam3d);
                            this._composer.addPass(renderPass);
                            this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                            break;
                        }
                    case SceneMode.Perspective2D:
                        {
                            var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam2d);
                            this._composer.addPass(renderPass);
                            this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                            this.Camera.OrthoHeight = 40;
                            break;
                        }
                    case SceneMode.Perspective3D:
                        {
                            var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam3d);
                            this._composer.addPass(renderPass);
                            if (this.useSSAO) {
                                var ssaoPass = new THREE.SSAOPass(this._sceneWorld, this._cam3d, this.View.Width, this.View.Height);
                                ssaoPass.kernelRadius = 16;
                                this._composer.addPass(ssaoPass);
                            }
                            this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Perspective;
                            break;
                        }
                    default:
                        {
                            var renderPass = new THREE.RenderPass(this._sceneWorld, this._cam2d);
                            this._composer.addPass(renderPass);
                            this.Camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                            this.Camera.OrthoHeight = 40;
                            break;
                        }
                }
                switch (this.SceneMode) {
                    case SceneMode.Orthographic2D:
                        {
                            this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam2d);
                            this._composer.addPass(this.outlinePass);
                            break;
                        }
                    case SceneMode.Orthographic3D:
                        {
                            this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam3d);
                            this._composer.addPass(this.outlinePass);
                            break;
                        }
                    case SceneMode.Perspective2D:
                        {
                            this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam2d);
                            this._composer.addPass(this.outlinePass);
                            break;
                        }
                    case SceneMode.Perspective3D:
                        {
                            this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam3d);
                            this._composer.addPass(this.outlinePass);
                            break;
                        }
                    default:
                        {
                            this.outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this._sceneWorld, this._cam2d);
                            this._composer.addPass(this.outlinePass);
                            break;
                        }
                }
                this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
                this.effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
                this.effectFXAA.renderToScreen = true;
                this._composer.addPass(this.effectFXAA);
            }
            newEntity(ctor) {
                var c = ctor;
                var result;
                if (c === U1.Views.ScPoint)
                    result = new Views.ScPointThree();
                else if (c === U1.Views.ScPolyLine)
                    result = new Views.ScPolyLineThree();
                else if (c === U1.Views.ScPolygon)
                    result = new Views.ScPolygonThree();
                else if (c === U1.Views.ScText)
                    result = new Views.ScTextThree();
                else if (c === U1.Views.ScModel)
                    result = new Views.ScModelThree();
                else if (c === U1.Views.ScEllipse)
                    result = new Views.ScEllipseThree();
                else if (c === U1.Views.ScGrid)
                    result = new Views.ScGridThree();
                else if (c === U1.Views.ScLight)
                    result = new Views.ScLightTree();
                else if (c === U1.Views.ScLineBatch)
                    result = new Views.ScLineBatchThree();
                else if (c === U1.Views.ScText)
                    result = new Views.ScTextThree();
                else if (c === U1.Views.ScMeshBatch)
                    result = new Views.ScMeshBatchThree();
                else
                    result = super.newEntity(ctor);
                return result;
            }
            newResource(ctor) {
                var c = ctor;
                var result;
                if (c === U1.Views.ScTexture)
                    result = new Views.ScTextureThree();
                else if (c === U1.Views.ScMaterial)
                    result = new Views.ScMaterialThree();
                else
                    result = super.newResource(ctor);
                return result;
            }
            get CustomRenderers() {
                return this._customRenderers;
            }
            CreateUpdateContext() {
                var view2 = this.View;
                if (this._updateContext == null) {
                    this._updateContext = new UpdateContextThree(this);
                    this._updateContext.Scene = this;
                    this._updateContext.SceneWorld = this._sceneWorld;
                    this._updateContext.SceneOverlay = this._sceneOverlay;
                }
                return this._updateContext;
            }
            CreateDrawContext() {
                var view2 = this.View;
                if (this._drawContext == null) {
                    this._drawContext = new DrawContextThree(this);
                    this._drawContext.Scene = this;
                    this._drawContext.WorldToScreen =
                        (wpos, result) => {
                            return this.Camera.WorldToScreen(wpos, result);
                        };
                }
                this._drawContext.ViewMatrix = this.Camera.GetViewMatrix(this._drawContext.ViewMatrix);
                this._drawContext.ProjMatrix = this.Camera.GetProjMatrix(this._drawContext.ProjMatrix);
                this._drawContext.ViewProjMatrix.SetMultiply(this._drawContext.ViewMatrix, this._drawContext.ProjMatrix);
                return this._drawContext;
            }
            OnBeginUpdate() {
                if (this._test_box == null) {
                }
            }
            OnEndUpdate() {
                var _a;
                var cam = this.Camera;
                (_a = this.View.DocumentPresenter) === null || _a === void 0 ? void 0 : _a.UpdateVisible();
                switch (this.SceneMode) {
                    case SceneMode.Orthographic2D:
                        {
                            Views.ThreeUtil.ApplyOrthographicCamera(this._cam2d, cam);
                            break;
                        }
                    case SceneMode.Orthographic3D:
                        {
                            Views.ThreeUtil.ApplyOrthographicCamera(this._cam2d, cam);
                            break;
                        }
                    case SceneMode.Perspective2D:
                        {
                            break;
                        }
                    case SceneMode.Perspective3D:
                        {
                            Views.ThreeUtil.ApplyPerspectiveCamera(this._cam3d, cam);
                            break;
                        }
                    default:
                        {
                            Views.ThreeUtil.ApplyOrthographicCamera(this._cam2d, cam);
                            break;
                        }
                }
                var w = this.View.Width;
                var h = this.View.Height;
                Views.ThreeUtil.ApplyDirectionalLight(this._light1_world, this.Light1);
                Views.ThreeUtil.ApplyDirectionalLight(this._light2_world, this.Light2);
                Views.ThreeUtil.ApplyDirectionalLight(this._light3_world, this.Light3);
                Views.ThreeUtil.ApplyDirectionalLight(this._light1_overlay, this.Light1);
                Views.ThreeUtil.ApplyDirectionalLight(this._light2_overlay, this.Light2);
                Views.ThreeUtil.ApplyDirectionalLight(this._light3_overlay, this.Light3);
                this._renderer.setViewport(cam.ViewportX, cam.ViewportY, cam.ViewportWidth, cam.ViewportHeight);
                this._renderer.setScissor(cam.ViewportX, cam.ViewportY, cam.ViewportWidth, cam.ViewportHeight);
                this._renderer.setClearColor(Views.ThreeUtil.Color(this.ClearColor));
                this._renderer.setSize(w, h);
                this._renderer.autoClear = true;
                switch (this.SceneMode) {
                    case SceneMode.Orthographic2D:
                        {
                            this._renderer.render(this._sceneWorld, this._cam2d);
                            break;
                        }
                    case SceneMode.Orthographic3D:
                        {
                            this._renderer.render(this._sceneWorld, this._cam2d);
                            break;
                        }
                    case SceneMode.Perspective2D:
                        {
                            this._renderer.render(this._sceneWorld, this._cam2d);
                            break;
                        }
                    case SceneMode.Perspective3D:
                        {
                            this._renderer.render(this._sceneWorld, this._cam3d);
                            break;
                        }
                    default:
                        {
                            this._renderer.render(this._sceneWorld, this._cam2d);
                            break;
                        }
                }
                this._renderer.clearDepth();
                this._renderer.autoClear = false;
                switch (this.SceneMode) {
                    case SceneMode.Orthographic2D:
                        {
                            this._renderer.render(this._sceneOverlay, this._cam2d);
                            break;
                        }
                    case SceneMode.Orthographic3D:
                        {
                            this._renderer.render(this._sceneOverlay, this._cam2d);
                            break;
                        }
                    case SceneMode.Perspective2D:
                        {
                            this._renderer.render(this._sceneOverlay, this._cam2d);
                            break;
                        }
                    case SceneMode.Perspective3D:
                        {
                            this._renderer.render(this._sceneOverlay, this._cam3d);
                            break;
                        }
                    default:
                        {
                            this._renderer.render(this.SceneOverlay, this._cam2d);
                            break;
                        }
                }
                for (var ctmR of this.CustomRenderers) {
                    ctmR.Render(this._renderer);
                }
            }
            RemoveCustomRenderer(renderer) {
                var idx = this.CustomRenderers.indexOf(renderer);
                if (idx >= 0) {
                    this.CustomRenderers.splice(idx, 1);
                }
            }
            AddCustomRenderer(renderer) {
                var idx = this.CustomRenderers.indexOf(renderer);
                if (idx >= 0) {
                    return;
                }
                this.CustomRenderers.push(renderer);
            }
        }
        Views.SceneThree = SceneThree;
        class UpdateContextThree extends U1.Views.UpdateContext {
            constructor(scene) {
                super();
                this.ShowTextBounding = false;
            }
            Dispose() {
            }
        }
        Views.UpdateContextThree = UpdateContextThree;
        class DrawContextThree extends U1.Views.DrawContext {
            constructor(scene) {
                super();
                this.ShowTextBounding = false;
                this.ViewMatrix = new U1.Matrix4();
                this.ProjMatrix = new U1.Matrix4();
                this.ViewProjMatrix = new U1.Matrix4();
            }
            Dispose() {
            }
        }
        Views.DrawContextThree = DrawContextThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScGridThree extends U1.Views.ScGrid {
            OnUpdate(context) {
                super.OnUpdate(context);
                if (this.Ver != this.UpdateVer) {
                    this.OnClear();
                    this.UpdateLines(context);
                    this.UpdateVer = this.Ver;
                }
                this.UpdateTransform();
            }
            OnClear() {
                var sceneThree = this.Scene;
                if (this._linesThree != null) {
                    sceneThree.SceneWorld.remove(this._linesThree);
                    sceneThree.SceneOverlay.remove(this._linesThree);
                    this._linesThree = null;
                }
                if (this._geomThree != null) {
                    this._geomThree.dispose();
                    this._geomThree = null;
                }
                if (this._material != null) {
                    this._material.dispose();
                    this._material = null;
                }
            }
            UpdateLines(context) {
                if (this._linesThree == null) {
                    this._linesThree = new THREE.LineSegments();
                    if (context.IsOveraySpace)
                        context.SceneOverlay.add(this._linesThree);
                    else
                        context.SceneWorld.add(this._linesThree);
                }
                if (this._material == null) {
                    this._material = new THREE.LineBasicMaterial({ color: 0xd3d3d3, linewidth: 1 });
                }
                if (this._geomThree == null) {
                    var geom = this._geomThree = new THREE.Geometry();
                    var lineData = this.GetLineData();
                    var segments = [];
                    var ic = lineData.IndexCount;
                    for (var i = 0; i < ic; i += 2) {
                        var v0 = lineData.Indexes[i];
                        var v1 = lineData.Indexes[i + 1];
                        segments.push(Views.ThreeUtil.Vector3(lineData.Points[v0].Position));
                        segments.push(Views.ThreeUtil.Vector3(lineData.Points[v1].Position));
                    }
                    geom.vertices = segments;
                    geom.verticesNeedUpdate = true;
                }
                this._linesThree.geometry = this._geomThree;
                this._linesThree.material = this._material;
            }
            UpdateTransform() {
                Views.ThreeUtil.ApplyTransform(this._linesThree, this._transform);
            }
        }
        Views.ScGridThree = ScGridThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScLightTree extends U1.Views.ScLight {
            OnUpdate(context) {
                super.OnUpdate(context);
                if (this.Ver != this.UpdateVer) {
                    this.OnClear();
                    this.UpdateLight(context);
                    this.UpdateVer = this.Ver;
                }
            }
            OnClear() {
                if (this._lightThree !== undefined) {
                    this._lightThree = null;
                }
            }
            UpdateLight(context) {
                this.OnClear();
                if (this.Light.Type == U1.LightTypeEnum.DIRECTIONAL) {
                    this._lightThree = new THREE.DirectionalLight();
                    if (this.DropShadow) {
                    }
                }
            }
        }
        Views.ScLightTree = ScLightTree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScLineBatchThree extends U1.Views.ScLineBatch {
            constructor() {
                super(...arguments);
                this._positions = [];
                this._colors = [];
                this._geoms = [];
                this._objs = [];
                this._mat = new THREE.LineBasicMaterial();
            }
            OnUpdate(context) {
                super.OnUpdate(context);
                if (this._updateVer == this.Ver)
                    return;
                this._updateVer = this.Ver;
                var fillInfo = { gi: 0, vi: 0, ii: 0 };
                for (var key in this.Items) {
                    var item = this.Items[key];
                    if (item == null)
                        continue;
                    if (!this.Fill(item, fillInfo)) {
                        let geom = this._geoms[fillInfo.gi];
                        geom.computeBoundingSphere();
                        geom.attributes["position"].needsUpdate = true;
                        geom.attributes["color"].needsUpdate = true;
                        geom.setDrawRange(0, fillInfo.vi);
                        fillInfo.gi++;
                        fillInfo.vi = 0;
                        fillInfo.ii = 0;
                        this.Fill(item, fillInfo);
                    }
                }
                let geom = this._geoms[fillInfo.gi];
                if (geom != null) {
                    geom.computeBoundingSphere();
                    geom.attributes["position"].needsUpdate = true;
                    geom.attributes["color"].needsUpdate = true;
                    geom.setDrawRange(0, fillInfo.vi);
                }
                for (var i = fillInfo.gi + 1; i < this._geoms.length; i++) {
                    this._geoms[i].setDrawRange(0, 0);
                }
            }
            Fill(item, info) {
                var pointCount = this.PointCount;
                var indexCount = this.IndexCount;
                var vcount = (item.XFormedPath.length - 1) * 2;
                if (info.vi > 0 && info.vi + vcount > pointCount) {
                    return false;
                }
                if (this._geoms[info.gi] == null) {
                    this._geoms[info.gi] = new THREE.BufferGeometry();
                    this._objs[info.gi] = new THREE.LineSegments();
                    this._objs[info.gi].geometry = this._geoms[info.gi];
                    this._objs[info.gi].material = this._mat;
                    var sceneThree = this.Scene;
                    sceneThree.SceneWorld.add(this._objs[info.gi]);
                    let points = this._positions[info.gi] = new Float32Array(pointCount * 3);
                    let colors = this._colors[info.gi] = new Float32Array(pointCount * 3);
                    this._geoms[info.gi].setAttribute("position", new THREE.BufferAttribute(points, 3).setUsage(THREE.DynamicDrawUsage));
                    this._geoms[info.gi].setAttribute("color", new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));
                }
                let points = this._positions[info.gi];
                let colors = this._colors[info.gi];
                var r = item.Color.R / 255;
                var g = item.Color.G / 255;
                var b = item.Color.B / 255;
                for (var i = 1; i < item.XFormedPath.length; i++) {
                    var v0 = info.vi * 3;
                    points[v0] = item.XFormedPath[i - 1].X;
                    points[v0 + 1] = item.XFormedPath[i - 1].Y;
                    points[v0 + 2] = item.XFormedPath[i - 1].Z;
                    colors[v0] = r;
                    colors[v0 + 1] = g;
                    colors[v0 + 2] = b;
                    info.vi++;
                    v0 = info.vi * 3;
                    points[v0] = item.XFormedPath[i].X;
                    points[v0 + 1] = item.XFormedPath[i].Y;
                    points[v0 + 2] = item.XFormedPath[i].Z;
                    colors[v0] = r;
                    colors[v0 + 1] = g;
                    colors[v0 + 2] = b;
                    info.vi++;
                }
                return true;
            }
            OnClear() {
                var sceneThree = this.Scene;
                if (this._objs != null) {
                    for (var i = 0; i < this._objs.length; i++) {
                        sceneThree.SceneWorld.remove(this._objs[i]);
                        this._geoms[i].dispose();
                        this._colors[i] = undefined;
                        this._positions[i] = undefined;
                    }
                }
                if (this._mat != null) {
                    this._mat.dispose();
                }
                this._geoms = undefined;
                this._colors = undefined;
                this._positions = undefined;
                this._mat = undefined;
            }
        }
        Views.ScLineBatchThree = ScLineBatchThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScMaterialThree extends U1.Views.ScMaterial {
            constructor() {
                super();
            }
            get MaterialTh() {
                return this._matThree;
            }
            OnUpdate(context) {
                var contextx = context;
                if (this.Ver != this.UpdateVer) {
                    this.UpdateVer = this.Ver;
                    if (this._matThree == null) {
                        this._matThree = new THREE.MeshBasicMaterial();
                    }
                    this._matThree.opacity = this.Alpha;
                    this._matThree.transparent = this.Alpha < 0.99;
                    this._matThree.color = Views.ThreeUtil.Color(this.Diffuse);
                    if (this.DiffuseTexture instanceof Views.ScTextureThree) {
                        let tex = this.DiffuseTexture;
                        tex.ImageLoaded.Add(this, (tex_) => {
                            this._matThree.map = tex_.TextureThree;
                            tex_.ImageLoaded.Remove(this, null);
                        });
                        if (tex.IsImageLoaded) {
                            this._matThree.map = tex.TextureThree;
                        }
                    }
                    if (this.SpecularTexture instanceof Views.ScTextureThree) {
                        let tex = this.SpecularTexture;
                        tex.ImageLoaded.Add(this, (tex_) => {
                            this._matThree.specularMap = tex_.TextureThree;
                            tex_.ImageLoaded.Remove(this, null);
                        });
                        if (tex.IsImageLoaded) {
                            this._matThree.specularMap = tex.TextureThree;
                        }
                    }
                }
            }
            OnClear() {
                if (this._matThree != null) {
                    this._matThree.dispose();
                    this._matThree = null;
                }
            }
        }
        Views.ScMaterialThree = ScMaterialThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScMeshBatchThree extends U1.Views.ScMeshBatch {
            constructor() {
                super(...arguments);
                this._positions = [];
                this._colors = [];
                this._geoms = [];
                this._objs = [];
                this._mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
            }
            OnUpdate(context) {
                super.OnUpdate(context);
                if (this._updateVer == this.Ver)
                    return;
                this._updateVer = this.Ver;
                var fillInfo = { gi: 0, vi: 0, ii: 0 };
                for (var key in this.Items) {
                    var item = this.Items[key];
                    if (item == null)
                        continue;
                    if (!this.Fill(item, fillInfo)) {
                        let geom = this._geoms[fillInfo.gi];
                        geom.computeBoundingSphere();
                        geom.attributes["position"].needsUpdate = true;
                        geom.attributes["color"].needsUpdate = true;
                        geom.setDrawRange(0, fillInfo.vi);
                        fillInfo.gi++;
                        fillInfo.vi = 0;
                        fillInfo.ii = 0;
                        this.Fill(item, fillInfo);
                    }
                }
                let geom = this._geoms[fillInfo.gi];
                if (geom != null) {
                    geom.computeBoundingSphere();
                    geom.attributes["position"].needsUpdate = true;
                    geom.attributes["color"].needsUpdate = true;
                    geom.setDrawRange(0, fillInfo.vi);
                }
                for (var i = fillInfo.gi + 1; i < this._geoms.length; i++) {
                    this._geoms[i].setDrawRange(0, 0);
                }
            }
            Fill(item, info) {
                var pointCount = this.PointCount;
                var indices = item.XFormedGeom.indices;
                var pos = item.XFormedGeom.pos;
                var vcount = indices != null ? indices.length / 3 : pos.length;
                if (info.vi > 0 && info.vi + vcount > pointCount) {
                    return false;
                }
                if (this._geoms[info.gi] == null) {
                    this._geoms[info.gi] = new THREE.BufferGeometry();
                    this._objs[info.gi] = new THREE.Mesh();
                    this._objs[info.gi].geometry = this._geoms[info.gi];
                    this._objs[info.gi].material = this._mat;
                    var sceneThree = this.Scene;
                    sceneThree.SceneWorld.add(this._objs[info.gi]);
                    let points = this._positions[info.gi] = new Float32Array(pointCount * 3);
                    let colors = this._colors[info.gi] = new Float32Array(pointCount * 3);
                    this._geoms[info.gi].setAttribute("position", new THREE.BufferAttribute(points, 3).setUsage(THREE.DynamicDrawUsage));
                    this._geoms[info.gi].setAttribute("color", new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));
                }
                let points = this._positions[info.gi];
                let colors = this._colors[info.gi];
                var r = item.Color.R / 255;
                var g = item.Color.G / 255;
                var b = item.Color.B / 255;
                if (indices != null) {
                    for (var i = 0; i < indices.length; i += 3) {
                        var v0 = info.vi * 3;
                        var i0 = indices[i];
                        var i1 = indices[i + 1];
                        var i2 = indices[i + 2];
                        points[v0] = pos[i0];
                        points[v0 + 1] = pos[i0 + 1];
                        points[v0 + 2] = pos[i0 + 2];
                        colors[v0] = r;
                        colors[v0 + 1] = g;
                        colors[v0 + 2] = b;
                        info.vi++;
                        v0 = info.vi * 3;
                        points[v0] = pos[i1];
                        points[v0 + 1] = pos[i1 + 1];
                        points[v0 + 2] = pos[i1 + 2];
                        colors[v0] = r;
                        colors[v0 + 1] = g;
                        colors[v0 + 2] = b;
                        info.vi++;
                        v0 = info.vi * 3;
                        points[v0] = pos[i2];
                        points[v0 + 1] = pos[i2 + 1];
                        points[v0 + 2] = pos[i2 + 2];
                        colors[v0] = r;
                        colors[v0 + 1] = g;
                        colors[v0 + 2] = b;
                        info.vi++;
                    }
                }
                else {
                    for (var i = 0; i < pos.length; i += 3) {
                        var v0 = info.vi * 3;
                        points[v0] = pos[i];
                        points[v0 + 1] = pos[i + 1];
                        points[v0 + 2] = pos[i + 2];
                        colors[v0] = r;
                        colors[v0 + 1] = g;
                        colors[v0 + 2] = b;
                        info.vi++;
                    }
                }
                return true;
            }
            OnClear() {
                var sceneThree = this.Scene;
                if (this._objs != null) {
                    for (var i = 0; i < this._objs.length; i++) {
                        sceneThree.SceneWorld.remove(this._objs[i]);
                        this._geoms[i].dispose();
                        this._colors[i] = undefined;
                        this._positions[i] = undefined;
                    }
                }
                if (this._mat != null) {
                    this._mat.dispose();
                }
                this._geoms = undefined;
                this._colors = undefined;
                this._positions = undefined;
                this._mat = undefined;
            }
        }
        Views.ScMeshBatchThree = ScMeshBatchThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScModelThree extends U1.Views.ScModel {
            OnUpdate(context) {
                if (this.Ver != this.UpdateVer) {
                    this.OnClear();
                    this.UpdateMesh(context);
                    this.UpdateEdge(context);
                    this.UpdateVer = this.Ver;
                    this.TransformVer = -1;
                }
                if (this.TransformVer != this.UpdateVer) {
                    this.UpdateTransform();
                    this.TransformVer = this.UpdateVer;
                }
            }
            OnClear() {
                this.ClearMesh();
                this.ClearEdge();
            }
            ClearMesh() {
                var sceneThree = this.Scene;
                if (this._meshThree != null) {
                    sceneThree.SceneWorld.remove(this._meshThree);
                    sceneThree.SceneOverlay.remove(this._meshThree);
                    this._meshThree = null;
                }
                if (this._geomThree != null) {
                    this._geomThree.dispose();
                    this._geomThree = null;
                }
            }
            ClearEdge() {
                var sceneThree = this.Scene;
                if (this._edgeThree != null) {
                    sceneThree.SceneWorld.remove(this._edgeThree);
                    sceneThree.SceneOverlay.remove(this._edgeThree);
                    this._meshThree = null;
                }
                if (this._edgeGeomTrhee != null) {
                    this._edgeGeomTrhee.dispose();
                    this._edgeGeomTrhee = null;
                }
            }
            OnMaterialChanged() {
                if (this._meshThree == null)
                    return;
                if (this.Material instanceof Views.ScMaterialThree)
                    this._meshThree.material = this.Material.MaterialTh;
                else
                    this._meshThree.material = null;
            }
            UpdateMesh(context) {
                if (this.Geometry == null) {
                    this.ClearMesh();
                    return;
                }
                if (this._meshThree == null) {
                    this._meshThree = new THREE.Mesh();
                    if (context.IsOveraySpace)
                        context.SceneOverlay.add(this._meshThree);
                    else
                        context.SceneWorld.add(this._meshThree);
                }
                if (this._geomThree != null)
                    this._geomThree.dispose();
                var geom = this._geomThree = new THREE.BufferGeometry();
                Views.ThreeUtil.ApplyMeshBufferGeometry(geom, this.Geometry);
                this._meshThree.geometry = geom;
                if (this.Material instanceof Views.ScMaterialThree)
                    this._meshThree.material = this.Material.MaterialTh;
            }
            UpdateEdge(context) {
                if (this.EdgeGeometry == null) {
                    this._edgeGeomTrhee;
                    this.ClearEdge();
                    return;
                }
                if (this._edgeThree == null) {
                    this._edgeThree = new THREE.LineSegments();
                    if (context.IsOveraySpace)
                        context.SceneOverlay.add(this._edgeThree);
                    else
                        context.SceneWorld.add(this._edgeThree);
                }
                if (this._edgeGeomTrhee != null)
                    this._edgeGeomTrhee.dispose();
                var geom = this._edgeGeomTrhee = new THREE.BufferGeometry();
                Views.ThreeUtil.ApplyLineBufferGeometry(geom, this.EdgeGeometry);
                this._edgeThree.geometry = geom;
                if (ScModelThree._edgeMaterial == null) {
                    var edge_mat = ScModelThree._edgeMaterial = new THREE.LineBasicMaterial();
                    edge_mat.color.set(0x000000);
                }
                this._edgeThree.material = ScModelThree._edgeMaterial;
            }
            UpdateTransform() {
                if (this._meshThree != null) {
                    Views.ThreeUtil.ApplyTransform(this._meshThree, this.WorldTransform);
                }
                if (this._edgeThree != null) {
                    Views.ThreeUtil.ApplyTransform(this._edgeThree, this.WorldTransform);
                }
            }
            InvalidateWorldTransform() {
                super.InvalidateWorldTransform();
                this.TransformVer++;
            }
        }
        Views.ScModelThree = ScModelThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var AppRoot;
var ProjNo;
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScNavigatorThree extends U1.Views.ScEntity {
            constructor() {
                super();
                this.m_isInitialized = false;
                this.m_camera = new U1.Views.ScCamera();
                this.m_activeAttr = -1;
                this.m_tmp_ray = new U1.Ray3();
                this.m_materials = {};
                if (ScNavigatorThree.s_meshes === undefined) {
                    var tv = new U1.Vector3();
                    var tm = new U1.Matrix4();
                    var discMesh = ScNavigatorThree.CreateDisc();
                    var meshes = [];
                    var lines = [];
                    var textures = [];
                    var PARTS = ScNavigatorThree.PARTS;
                    ScNavigatorThree.CreateBox(meshes, textures, lines);
                    var m = U1.Matrix4.CreateTranslationFloats(-0.5, -0.5, -0.5).Multiply(U1.Matrix4.CreateScaleByFloats(1.2, 1.2, 1.2));
                    for (var mesh of meshes)
                        mesh.Transform(m);
                    for (var line of lines)
                        line.Transform(m);
                    ScNavigatorThree.s_meshes = meshes;
                    ScNavigatorThree.s_lines = lines;
                    var south = ScNavigatorThree.CreatePlane("NvSouth", PARTS.South);
                    var west = ScNavigatorThree.CreatePlane("NvWest", PARTS.West);
                    var north = ScNavigatorThree.CreatePlane("NvNorth", PARTS.North);
                    var east = ScNavigatorThree.CreatePlane("NvEast", PARTS.East);
                    meshes.push(west.Transform(tm.SetCreateTranslation(tv.Set(-1.5, 0, -0.5))));
                    meshes.push(east.Transform(tm.SetCreateTranslation(tv.Set(1.5, 0, -0.5))));
                    meshes.push(south.Transform(tm.SetCreateTranslation(tv.Set(0, -1.5, -0.5))));
                    meshes.push(north.Transform(tm.SetCreateTranslation(tv.Set(0, 1.5, -0.5))));
                    meshes.push(discMesh.Transform(tm.SetCreateTranslation(tv.Set(0, 0, -0.51))));
                    textures.push("NvWest", "NvEast", "NvSouth", "NvNorth", "disc");
                    ScNavigatorThree.s_materials = textures.map(o_ => {
                        var mt = new U1.MeshMaterial();
                        if (o_ === "disc")
                            mt.Tag = ScNavigatorThree.PARTS.Disc;
                        else {
                            mt.DiffuseTexture = new U1.Texture();
                            mt.DiffuseTexture.Url = o_;
                        }
                        return mt;
                    });
                }
            }
            get ActiveAttr() {
                return this.m_activeAttr;
            }
            set ActiveAttr(value) {
                this.m_activeAttr = value;
            }
            get Camera() {
                return this.m_camera;
            }
            static CreatePlane(texture, tag) {
                var pos = [
                    -0.3, -0.3, 0,
                    0.3, -0.3, 0,
                    0.3, 0.3, 0,
                    -0.3, 0.3, 0
                ];
                var nom = [
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,
                ];
                var uv = [
                    0, 1,
                    1, 1,
                    1, 0,
                    0, 0,
                ];
                var indics = [
                    0, 1, 2,
                    0, 2, 3
                ];
                var result = new U1.MeshBufferGeometry();
                result.pos = new Float32Array(pos);
                result.normal = new Float32Array(nom);
                result.uv0 = new Float32Array(uv);
                result.indices = new Uint16Array(indics);
                return result;
            }
            OnUpdate(context) {
                if (!this.Visible) {
                    return;
                }
                if (!this.m_isInitialized) {
                    this.Initialize();
                }
                if (this.m_meshThrees == null)
                    return;
                var PARTS = ScNavigatorThree.PARTS;
                var s_materials = ScNavigatorThree.s_materials;
                var ray = this.m_tmp_ray;
                this.Scene.Camera.GetDirection(ray.Direction);
                ray.Position.SetScale(ray.Direction, -10);
                var alpha = 1;
                var raydir = ray.Direction;
                var dir = new U1.Vector3();
                for (var i = 0; i < s_materials.length; i++) {
                    var dir = this.GetDirectionByAttr_1(i, dir);
                    if (this.m_meshThrees[i].material == null)
                        continue;
                    var mat = this.m_meshThrees[i].material;
                    if (s_materials[i].Tag == PARTS.Disc) {
                        continue;
                    }
                    var line = this.m_lineThrees[i];
                    if (this.ActiveAttr == i) {
                        mat.opacity = alpha + 0.25;
                        mat.color = ScNavigatorThree.over_colorThree;
                    }
                    else if (U1.Vector3.Dot(dir, raydir) > 0.9) {
                        mat.opacity = 1;
                        mat.color = ScNavigatorThree.over_colorThree;
                        if (line != null)
                            line.material.color = ScNavigatorThree.over_linecolorThree;
                    }
                    else {
                        mat.opacity = alpha;
                        mat.color = ScNavigatorThree.def_colorThree;
                        if (line != null) {
                            line.material.color = ScNavigatorThree.def_linecolorThree;
                        }
                    }
                }
                this.Scene.Camera.GetDirection(this.m_camera.Position).Scale(-4);
                this.m_camera.Up.CopyFrom(this.Scene.Camera.Up);
                this.m_camera.ViewportX = this.Scene.Camera.ViewportWidth - ScNavigatorThree.s_viewportSize - ScNavigatorThree.s_viewportMargin;
                this.m_camera.ViewportY = ScNavigatorThree.s_viewportMargin;
                super.OnUpdate(context);
            }
            Initialize() {
                if (this.m_isInitialized)
                    return;
                this.m_isInitialized = true;
                this.Scene.AddCustomRenderer(this);
                var s_materials = ScNavigatorThree.s_materials;
                this.m_scneThree = new THREE.Scene();
                this.m_meshThrees = [];
                this.m_lineThrees = [];
                var textureLoader = new THREE.TextureLoader();
                var idx = 0;
                var onLoad = () => {
                    this.Invalidate();
                };
                for (var mesh of ScNavigatorThree.s_meshes) {
                    var geom = new THREE.BufferGeometry();
                    Views.ThreeUtil.ApplyMeshBufferGeometry(geom, mesh);
                    var meshThree = new THREE.Mesh();
                    meshThree.geometry = geom;
                    var meshmaterial = s_materials[idx];
                    var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
                    if (meshmaterial.DiffuseTexture != null && meshmaterial.DiffuseTexture.Url != null) {
                        var textureLoader = new THREE.TextureLoader();
                        material.map = textureLoader.load('images/' + meshmaterial.DiffuseTexture.Url + ".png", onLoad);
                        material.map.flipY = false;
                        material.map.minFilter = THREE.LinearMipMapLinearFilter;
                        material.opacity = 0.8;
                        material.transparent = true;
                    }
                    ;
                    meshThree.material = material;
                    idx++;
                    this.m_meshThrees.push(meshThree);
                    this.m_scneThree.add(meshThree);
                }
                for (var line of ScNavigatorThree.s_lines) {
                    var geom = new THREE.BufferGeometry();
                    Views.ThreeUtil.ApplyLineBufferGeometry(geom, line);
                    let lineThree = new THREE.LineSegments();
                    lineThree.geometry = geom;
                    let material = new THREE.LineBasicMaterial({ color: 0x000000 });
                    lineThree.material = material;
                    this.m_lineThrees.push(lineThree);
                    this.m_scneThree.add(lineThree);
                }
                var m_camera = this.m_camera = new U1.Views.ScCamera();
                m_camera.ProjectionMode = U1.ProjectionTypeEnum.Orthographic;
                m_camera.OrthoHeight = 5;
                m_camera.ViewportWidth = ScNavigatorThree.s_viewportSize;
                m_camera.ViewportHeight = ScNavigatorThree.s_viewportSize;
                m_camera.LookAt = U1.Vector3.Zero;
                this.m_isInitialized = true;
            }
            CheckIntersect(isectContext) {
                if (!this.Visible)
                    return null;
                return this.CheckIntersect_1(isectContext.View.X, isectContext.View.Y);
            }
            CheckIntersect_1(screen_x, screen_y) {
                if (!this.Visible)
                    return null;
                var ray = this.m_camera.CalPickingRay(screen_x, screen_y, this.m_tmp_ray);
                var result;
                for (var i = 0; i < ScNavigatorThree.s_meshes.length; i++) {
                    var meshgeom = ScNavigatorThree.s_meshes[i];
                    var isect = meshgeom.Intersect(ray);
                    if (isect == null)
                        continue;
                    if (result == null || result.Distance > isect.Distance) {
                        isect.Source = this;
                        isect.Geometry = meshgeom;
                        isect.Attr = i;
                        result = isect;
                    }
                }
                ;
                return result;
            }
            Render(renderer) {
                if (this.m_camThree == null) {
                    var left = this.m_camera.OrthoHeight * this.m_camera.Aspect;
                    this.m_camThree = new THREE.OrthographicCamera(-10, 10, 10, -10);
                }
                Views.ThreeUtil.ApplyOrthographicCamera(this.m_camThree, this.m_camera);
                var view = this.Scene.View;
                var vieww = view.Width;
                var viewh = view.Height;
                var cam = this.m_camera;
                var left = cam.ViewportX;
                var bottom = viewh - cam.ViewportHeight - cam.ViewportY;
                var width = cam.ViewportWidth;
                var height = cam.ViewportHeight;
                renderer.autoClear = false;
                renderer.setViewport(left, bottom, width, height);
                renderer.clearDepth();
                renderer.render(this.m_scneThree, this.m_camThree);
            }
            OnDisposing() {
                if (this.Scene != null) {
                    this.Scene.RemoveCustomRenderer(this);
                }
                if (this.m_scneThree != null) {
                    if (this.m_lineThrees != null) {
                        for (var line of this.m_lineThrees) {
                            line.geometry.dispose();
                            if (line.material instanceof THREE.Material)
                                line.material.dispose();
                            this.m_scneThree.remove(line);
                        }
                        this.m_lineThrees = null;
                    }
                    if (this.m_meshThrees != null) {
                        for (let mesh of this.m_meshThrees) {
                            mesh.geometry.dispose();
                            if (mesh.material instanceof THREE.Material)
                                mesh.material.dispose();
                            this.m_scneThree.remove(mesh);
                        }
                        this.m_meshThrees = null;
                    }
                    this.m_scneThree = null;
                }
                super.OnDisposing();
            }
            static CreateBox(meshes, textures, lines) {
                var camPtLocs = [-0.6, 0, 0.6];
                var boxPtLocs = [0, 0.18, 0.82, 1];
                var attr = 0;
                var s_camPosMap = ScNavigatorThree.s_camPosMap;
                for (var zi = 1; zi < 4; zi++) {
                    for (var yi = 1; yi < 4; yi++) {
                        for (var xi = 1; xi < 4; xi++) {
                            var ps = [
                                new U1.Vector3(boxPtLocs[xi - 1], boxPtLocs[yi - 1], boxPtLocs[zi - 1]),
                                new U1.Vector3(boxPtLocs[xi], boxPtLocs[yi - 1], boxPtLocs[zi - 1]),
                                new U1.Vector3(boxPtLocs[xi], boxPtLocs[yi], boxPtLocs[zi - 1]),
                                new U1.Vector3(boxPtLocs[xi - 1], boxPtLocs[yi], boxPtLocs[zi - 1]),
                                new U1.Vector3(boxPtLocs[xi - 1], boxPtLocs[yi - 1], boxPtLocs[zi]),
                                new U1.Vector3(boxPtLocs[xi], boxPtLocs[yi - 1], boxPtLocs[zi]),
                                new U1.Vector3(boxPtLocs[xi], boxPtLocs[yi], boxPtLocs[zi]),
                                new U1.Vector3(boxPtLocs[xi - 1], boxPtLocs[yi], boxPtLocs[zi])
                            ];
                            var fids = [];
                            if (yi == 1)
                                fids.push(0, 1, 5, 4);
                            if (yi == 3)
                                fids.push(2, 3, 7, 6);
                            if (xi == 3)
                                fids.push(1, 2, 6, 5);
                            if (xi == 1)
                                fids.push(3, 0, 4, 7);
                            if (zi == 3)
                                fids.push(4, 5, 6, 7);
                            if (zi == 1)
                                fids.push(3, 2, 1, 0);
                            if (fids.length > 0) {
                                var camPos = new U1.Vector3(camPtLocs[xi - 1], camPtLocs[yi - 1], camPtLocs[zi - 1]);
                                s_camPosMap[attr++] = camPos;
                                var texture = null;
                                if (xi == 2 && yi == 1 && zi == 2)
                                    texture = "NvFront";
                                else if (xi == 2 && yi == 2 && zi == 3)
                                    texture = "NvTop";
                                else if (xi == 3 && yi == 2 && zi == 2)
                                    texture = "NvRight";
                                else if (xi == 2 && yi == 3 && zi == 2)
                                    texture = "NvBack";
                                else if (xi == 1 && yi == 2 && zi == 2)
                                    texture = "NvLeft";
                                else if (xi == 2 && yi == 2 && zi == 1)
                                    texture = "NvBottom";
                                var mesh = ScNavigatorThree.CreateMesh(ps, fids, texture);
                                var line = ScNavigatorThree.CreteLine(ps, fids, U1.Colors.White);
                                meshes.push(mesh);
                                textures.push(texture);
                                lines.push(line);
                            }
                        }
                    }
                }
            }
            GetDirectionByAttr(attr, xDir, yDir, zDir) {
                var ux = ScNavigatorThree[".gdb.v0"] || (ScNavigatorThree[".gdb.v0"] = U1.Vector3.UnitX);
                var uy = ScNavigatorThree[".gdb.v1"] || (ScNavigatorThree[".gdb.v1"] = U1.Vector3.UnitY);
                var uz = ScNavigatorThree[".gdb.v2"] || (ScNavigatorThree[".gdb.v2"] = U1.Vector3.UnitZ);
                var pos = ScNavigatorThree[".gdb.v3"] || (ScNavigatorThree[".gdb.v3"] = U1.Vector3.Zero);
                xDir.SetUnitX();
                yDir.SetUnitY();
                zDir.SetUnitZ();
                var PARTS = ScNavigatorThree.PARTS;
                var s_camPosMap = ScNavigatorThree.s_camPosMap;
                var s_boxMaterials = ScNavigatorThree.s_materials;
                if (attr < 0)
                    return false;
                if (s_camPosMap[attr]) {
                    pos = s_camPosMap[attr];
                }
                else {
                    var dir = s_boxMaterials[attr].Tag;
                    switch (dir) {
                        case PARTS.South:
                            pos.SetUnitY().Scale(-1);
                            break;
                        case PARTS.North:
                            pos.SetUnitY();
                            break;
                        case PARTS.West:
                            pos.SetUnitX().Scale(-1);
                            break;
                        case PARTS.East:
                            pos.SetUnitX();
                            break;
                        default:
                            break;
                    }
                }
                if (!pos.IsZero) {
                    zDir.CopyFrom(pos).Normalize();
                    yDir.SetUnitZ();
                    xDir.SetUnitX();
                    var dt = U1.Vector3.Dot(zDir, uz);
                    if (dt > 0.99 || dt < -0.99) {
                        yDir.SetUnitY();
                        if (dt < 0)
                            xDir.SetUnitX().Scale(-1);
                    }
                    else {
                        xDir.SetCross(uz, zDir);
                        yDir.SetCross(zDir, xDir).Normalize();
                    }
                }
                return true;
            }
            GetDirectionByAttr_1(attr, result) {
                var PARTS = ScNavigatorThree.PARTS;
                var s_camPosMap = ScNavigatorThree.s_camPosMap;
                var s_materials = ScNavigatorThree.s_materials;
                var pos = result || U1.Vector3.UnitY;
                if (s_camPosMap[attr] != null) {
                    pos.CopyFrom(s_camPosMap[attr]);
                }
                else {
                    var dir = s_materials[attr].Tag;
                    switch (dir) {
                        case PARTS.South:
                            pos.SetUnitY().Scale(-1);
                            break;
                        case PARTS.North:
                            pos.SetUnitY();
                            break;
                        case PARTS.West:
                            pos.SetUnitX().Scale(-1);
                            break;
                        case PARTS.East:
                            pos.SetUnitX();
                            break;
                        default:
                            break;
                    }
                }
                return pos.Scale(-1).Normalize();
            }
            GetSnapedPoint(screenPos, out) {
                out.attr = -1;
                out.part = ScNavigatorThree.PARTS.None;
                var isectInfo = this.CheckIntersect_1(screenPos.X, screenPos.Y);
                if (isectInfo != null) {
                    out.attr = isectInfo.Attr;
                    out.part = ScNavigatorThree.s_materials[out.attr].Tag;
                    return isectInfo.IsectPosition;
                }
                return null;
            }
            static CreteLine(vs, fids, color) {
                var pos = [];
                var col = [];
                var ilist = [];
                vs.forEach(o_ => {
                    pos.push(o_.X);
                    pos.push(o_.Y);
                    pos.push(o_.Z);
                    col.push(color.R / 255, color.G / 255, color.B / 255);
                });
                for (var i = 0; i < fids.length; i += 4) {
                    var i0 = fids[i];
                    var i1 = fids[i + 1];
                    var i2 = fids[i + 2];
                    var i3 = fids[i + 3];
                    ilist.push(i0, i1, i1, i2, i2, i3, i3, i0);
                }
                var result = new U1.LineBufferGeometry();
                result.pos = new Float32Array(pos);
                result.color = new Float32Array(col);
                result.indices = new Uint16Array(ilist);
                return result;
            }
            static CreateMesh(vs, fids, texture) {
                var tv0 = new U1.Vector3();
                var tv1 = new U1.Vector3();
                var tv2 = new U1.Vector3();
                var tv3 = new U1.Vector3();
                var pos = [];
                var nom = [];
                var uv0 = [];
                var ilist = [];
                var alist = [];
                var mlist = [];
                var uvs = [new U1.Vector2(0, 1), new U1.Vector2(1, 1), new U1.Vector2(1, 0), new U1.Vector2(0, 0)];
                for (var i = 0; i < fids.length; i += 4) {
                    var f_0 = fids[i];
                    var f_1 = fids[i + 1];
                    var f_2 = fids[i + 2];
                    var f_3 = fids[i + 3];
                    var ps = [fids[i], fids[i + 1], fids[i + 2], fids[i + 3]];
                    var p0 = vs[f_0];
                    var p1 = vs[f_1];
                    var p2 = vs[f_2];
                    var p3 = vs[f_3];
                    var n0 = tv2.SetCross(tv0.SetSubtract(p1, p0), tv1.SetSubtract(p2, p0)).Normalize();
                    var lastvi = pos.length / 3 | 0;
                    pos.push(p0.X, p0.Y, p0.Z);
                    nom.push(n0.X, n0.Y, n0.Z);
                    uv0.push(uvs[0].X, uvs[0].Y);
                    pos.push(p1.X, p1.Y, p1.Z);
                    nom.push(n0.X, n0.Y, n0.Z);
                    uv0.push(uvs[1].X, uvs[1].Y);
                    pos.push(p2.X, p2.Y, p2.Z);
                    nom.push(n0.X, n0.Y, n0.Z);
                    uv0.push(uvs[2].X, uvs[2].Y);
                    pos.push(p3.X, p3.Y, p3.Z);
                    nom.push(n0.X, n0.Y, n0.Z);
                    uv0.push(uvs[3].X, uvs[3].Y);
                    ilist.push(0 + lastvi, 1 + lastvi, 2 + lastvi);
                    ilist.push(0 + lastvi, 2 + lastvi, 3 + lastvi);
                }
                var result = new U1.MeshBufferGeometry();
                result.pos = new Float32Array(pos);
                result.normal = new Float32Array(nom);
                result.indices = new Uint16Array(ilist);
                result.uv0 = new Float32Array(uv0);
                return result;
            }
            static CreateDisc() {
                var tv0 = new U1.Vector3();
                var tv1 = new U1.Vector3();
                var tm0 = new U1.Matrix4();
                var pos = [];
                var norm = [];
                var indics = [];
                var side = 24;
                var delt = (Math.PI * 2 / side);
                for (var disc = 0; disc < 2; disc++) {
                    for (var i = 0; i <= side; i++) {
                        var p0 = tv0.Set(1, 0, 0);
                        var p1 = tv1.Set(1.1, 0, 0);
                        if (disc == 1) {
                            p0.X = 1.2;
                            p1.X = 1.5;
                        }
                        var rot = tm0.SetCreateRotationZ(delt * i);
                        p0.Transform(rot);
                        p1.Transform(rot);
                        var v0 = new U1.MeshVertex();
                        v0.Position.SetTransform(p0, rot);
                        v0.Normal.SetUnitZ();
                        var v1 = new U1.MeshVertex();
                        v1.Position.SetTransform(p1, rot);
                        v1.Normal.SetUnitZ();
                        pos.push(p0.X, p0.Y, p0.Z);
                        norm.push(0, 0, 1);
                        pos.push(p1.X, p1.Y, p1.Z);
                        norm.push(0, 0, 1);
                        if (i > 0) {
                            var i0 = pos.length / 3 - 4;
                            var i1 = i0 + 1;
                            var i2 = i1 + 1;
                            var i3 = i2 + 1;
                            indics.push(i0, i3, i2);
                            indics.push(i0, i1, i3);
                        }
                    }
                }
                var disc0 = new U1.MeshBufferGeometry();
                disc0.pos = new Float32Array(pos);
                disc0.indices = new Uint16Array(indics);
                return disc0;
            }
        }
        ScNavigatorThree.PARTS = {
            None: 0,
            South: 1,
            North: 2,
            West: 3,
            East: 4,
            Disc: 5
        };
        ScNavigatorThree.s_viewportSize = 150;
        ScNavigatorThree.s_viewportMargin = 5;
        ScNavigatorThree.s_discColor = U1.Colors.Gray;
        ScNavigatorThree.s_boxColor = U1.Colors.Gray;
        ScNavigatorThree.s_boxAmbient = new U1.Color(30, 30, 30, 255);
        ScNavigatorThree.s_emissive = new U1.Color(50, 50, 50, 155);
        ScNavigatorThree.s_shininess = 300;
        ScNavigatorThree.def_colorThree = new THREE.Color(0xcccccc);
        ScNavigatorThree.over_colorThree = new THREE.Color(0x888888);
        ScNavigatorThree.def_linecolorThree = new THREE.Color(0xbbbbbb);
        ScNavigatorThree.over_linecolorThree = new THREE.Color(0x787878);
        ScNavigatorThree.s_camPosMap = {};
        Views.ScNavigatorThree = ScNavigatorThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScPointThree extends U1.Views.ScPoint {
            get KView() {
                return this.Scene.View;
            }
            OnUpdate(context) {
                if (this.Ver === this.UpdateVer) {
                    return;
                }
                this.UpdateVer = this.Ver;
            }
            OnDraw(context) {
                if (context.IsScreenSpace) {
                    this.OnDrawScreen(context);
                }
            }
            OnDrawScreen(context) {
                if (this.svgEllipse == null) {
                    var svgOverlay = this.KView.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    var svgNS = "http://www.w3.org/2000/svg";
                    this.svgEllipse = document.createElementNS(svgNS, 'ellipse');
                    svgOverlay.appendChild(this.svgEllipse);
                }
                var ellipse = this.svgEllipse;
                var style = this.Style;
                ellipse.style.strokeWidth = style.StrokeThickness + "px";
                ellipse.style.strokeDasharray = style.StrokeDash != null ? style.StrokeDash.join(",") : "none";
                ellipse.style.fill = style.FillStr;
                ellipse.style.stroke = style.StrokeStr;
                ellipse.style.opacity = "" + style.Alpha;
                var wm = this.WorldTransform;
                var pos = this.Position;
                var radius = this.Radius;
                let cp = U1.Vector3.Transform(pos, wm, ScPointThree._p1);
                cp = context.WorldToScreen(cp, cp);
                ellipse.setAttribute("cx", cp.X.toString());
                ellipse.setAttribute("cy", cp.Y.toString());
                ellipse.setAttribute("rx", radius.toString());
                ellipse.setAttribute("ry", radius.toString());
            }
            OnClear() {
                if (this.svgEllipse != null) {
                    var svgOverlay = this.KView.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.removeChild(this.svgEllipse);
                    this.svgEllipse = undefined;
                }
            }
        }
        ScPointThree._p1 = new U1.Vector3();
        ScPointThree._p2 = new U1.Vector3();
        ScPointThree._p3 = new U1.Vector3();
        Views.ScPointThree = ScPointThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScPolygonThree extends U1.Views.ScPolygon {
            constructor() {
                super(...arguments);
                this._scnPoints = [];
            }
            get KView() {
                return this.Scene.View;
            }
            OnUpdate(context) {
                if (this.Ver === this.UpdateVer) {
                    return;
                }
                this.UpdateVer = this.Ver;
            }
            OnDraw(context) {
                if (context.IsScreenSpace) {
                    this.OnDrawScreen(context);
                }
            }
            OnDrawScreen(context) {
                if (this.svgPolygon == null) {
                    var svgOverlay = this.KView.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    var svgNS = "http://www.w3.org/2000/svg";
                    this.svgPolygon = document.createElementNS(svgNS, 'polygon');
                    svgOverlay.appendChild(this.svgPolygon);
                }
                var pgon = this.svgPolygon;
                var style = this.Style;
                pgon.style.strokeWidth = style.StrokeThickness + "px";
                pgon.style.strokeDasharray = style.StrokeDash != null ? style.StrokeDash.join(",") : "none";
                pgon.style.fill = style.FillStr;
                pgon.style.stroke = style.StrokeStr;
                pgon.style.opacity = "" + style.Alpha;
                var lps = this.Points;
                var sps = this._scnPoints;
                var wm = this.WorldTransform;
                var plen = sps.length = lps.length;
                for (var i = 0; i < plen; i++) {
                    sps[i] = U1.Vector3.Transform(lps[i], wm, sps[i]);
                    sps[i] = context.WorldToScreen(sps[i], sps[i]);
                }
                var ps_attr = sps.map(o_ => "" + Math.round(o_.X) + "," + Math.round(o_.Y)).join(',');
                pgon.setAttribute("points", ps_attr);
            }
            OnClear() {
                if (this.svgPolygon != null) {
                    var svgOverlay = this.KView.SvgOverlay;
                    if (svgOverlay == null)
                        return;
                    svgOverlay.removeChild(this.svgPolygon);
                    this.svgPolygon = undefined;
                }
            }
        }
        ScPolygonThree._p1 = new U1.Vector3();
        ScPolygonThree._p2 = new U1.Vector3();
        ScPolygonThree._p3 = new U1.Vector3();
        ScPolygonThree._empty_dash = [];
        Views.ScPolygonThree = ScPolygonThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScPolyLineThree extends U1.Views.ScPolyLine {
            get KView() {
                return this.Scene.View;
            }
            OnUpdate(context) {
                if (this.Ver === this.UpdateVer) {
                    return;
                }
                this.OnClear();
                this.UpdateVer = this.Ver;
                var lineBuffer = new U1.LineBufferGeometry();
                lineBuffer.BeginAppend();
                lineBuffer.AddppendPolyline(this.Points, this.Transform);
                lineBuffer.EndAppend();
                this._lineSegments = new THREE.LineSegments();
                var geom = this._lineGeom = new THREE.BufferGeometry();
                Views.ThreeUtil.ApplyLineBufferGeometry(geom, lineBuffer);
                this._lineSegments.geometry = geom;
                var sceneThree = this.Scene;
                sceneThree.SceneWorld.add(this._lineSegments);
                ScPolyLineThree.count++;
            }
            OnClear() {
                var sceneThree = this.Scene;
                if (this._lineSegments != null)
                    sceneThree.SceneWorld.remove(this._lineSegments);
                if (this._lineGeom != null)
                    this._lineGeom.dispose();
                this._lineSegments = null;
                this._lineGeom = null;
            }
        }
        ScPolyLineThree.count = 0;
        Views.ScPolyLineThree = ScPolyLineThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScText3Three extends U1.Views.ScText3 {
            OnDraw(context) {
            }
            OnClear() {
            }
        }
        ScText3Three.unit_x = U1.Vector3.UnitX;
        ScText3Three._p0 = new U1.Vector3();
        ScText3Three._p1 = new U1.Vector3();
        ScText3Three._p2 = new U1.Vector3();
        ScText3Three._p3 = new U1.Vector3();
        ScText3Three._p4 = new U1.Vector3();
        ScText3Three._p5 = new U1.Vector3();
        ScText3Three._p6 = new U1.Vector3();
        ScText3Three._p7 = new U1.Vector3();
        Views.ScText3Three = ScText3Three;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScTextThree extends U1.Views.ScText {
            OnDraw(context) {
                var view = this.Scene.View;
                var contextX = context;
                var context2D = view.RenderingContext2D;
                var wm = this.WorldTransform;
                var p0 = ScTextThree._p0;
                var p1 = ScTextThree._p1;
                var p2 = ScTextThree._p2;
                var p3 = ScTextThree._p3;
                var p4 = ScTextThree._p4;
                var p5 = ScTextThree._p5;
                var p6 = ScTextThree._p6;
                var min = this.BoundingBox.Min;
                var max = this.BoundingBox.Max;
                var lb = p0.Set(min.X, min.Y, 0).Transform(wm);
                var rb = p1.Set(max.X, min.Y, 0).Transform(wm);
                var rt = p2.Set(max.X, max.Y, 0).Transform(wm);
                var lt = p3.Set(min.X, max.Y, 0).Transform(wm);
                if (!context.IsScreenSpace) {
                    context.WorldToScreen(lb, lb);
                    context.WorldToScreen(rb, rb);
                    context.WorldToScreen(rt, rt);
                    context.WorldToScreen(lt, lt);
                }
                var right = p4.Set(rb.X - lb.X, rb.Y - lb.Y, 0);
                var ydir0 = p5.Set(-right.Y, right.X, 0);
                var ydir1 = p6.Set(lt.X - lb.X, lt.Y - lb.Y, 0);
                var loc = lb;
                if (U1.Vector3.Dot(ydir0, ydir1) > 0) {
                    loc = lt;
                }
                var style = this.Style;
                if (style.Background != null) {
                    context2D.save();
                    context2D.fillStyle = "rgba(100,100,100,255)";
                    context2D.beginPath();
                    context2D.moveTo(lb.X, lb.Y);
                    context2D.lineTo(rb.X, rb.Y);
                    context2D.lineTo(rt.X, rt.Y);
                    context2D.lineTo(lt.X, lt.Y);
                    context2D.closePath();
                    context2D.fill();
                    context2D.restore();
                }
                context2D.save();
                if (contextX.ShowTextBounding) {
                    context2D.beginPath();
                    context2D.moveTo(lb.X, lb.Y);
                    context2D.lineTo(rb.X, rb.Y);
                    context2D.lineTo(rt.X, rt.Y);
                    context2D.lineTo(lt.X, lt.Y);
                    context2D.closePath();
                    context2D.stroke();
                }
                context2D.restore();
                context2D.save();
                context2D.fillStyle = style.FillStr;
                var h = U1.Vector3.Distance(lb, lt);
                h /= this.Lines.length;
                context2D.font = "10px";
                right.Normalize();
                var a = U1.Vector3.Dot(ScTextThree.unit_x, right);
                a = Math.acos(a);
                if (right.Y < 0)
                    a *= -1;
                h = h / 10;
                var lines = this.Lines;
                var lstart = ScTextThree._p7.CopyFrom(loc);
                context2D.translate(lstart.X, lstart.Y);
                context2D.rotate(a);
                context2D.scale(h, h);
                var line_num = lines.length;
                for (var i = 0; i < line_num; i++) {
                    context2D.fillText(lines[i], 0, 10 * i - 10 * (line_num - 1) - 1);
                }
                context2D.restore();
            }
        }
        ScTextThree.unit_x = U1.Vector3.UnitX;
        ScTextThree._p0 = new U1.Vector3();
        ScTextThree._p1 = new U1.Vector3();
        ScTextThree._p2 = new U1.Vector3();
        ScTextThree._p3 = new U1.Vector3();
        ScTextThree._p4 = new U1.Vector3();
        ScTextThree._p5 = new U1.Vector3();
        ScTextThree._p6 = new U1.Vector3();
        ScTextThree._p7 = new U1.Vector3();
        Views.ScTextThree = ScTextThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ScTextureThree extends U1.Views.ScTexture {
            constructor() {
                super();
                this.ImageLoaded = new U1.Event1();
            }
            get IsImageLoaded() {
                return this._isImageLoaded;
            }
            get TextureThree() {
                return this._textureThree;
            }
            OnUpdate(context) {
                var contextx = context;
                if (this.Ver != this.UpdateVer) {
                    if (this._uriUpdate != this.Uri) {
                        this.OnClear();
                        this._uriUpdate = this.Uri;
                    }
                    if (this._textureThree == null) {
                        var loader = new THREE.TextureLoader();
                        let loaded = (tex) => {
                            if (this.Scene != null)
                                this.Scene.View.Invalidate();
                        };
                        this._textureThree = loader.load(this.Uri, loaded);
                        this._textureThree.flipY = false;
                        this.OnImageLoaded();
                    }
                    this.UpdateVer = this.Ver;
                }
            }
            OnClear() {
                if (this._textureThree != null) {
                    this._textureThree.dispose();
                    this._textureThree = null;
                }
                this._isImageLoaded = false;
            }
            OnDisposing() {
                super.OnDisposing();
                this.ImageLoaded.Clear();
                this.ImageLoaded = undefined;
            }
            OnImageLoaded() {
                if (this.IsDisposed)
                    return;
                this._isImageLoaded = true;
                this.ImageLoaded.Invoke(this);
            }
        }
        Views.ScTextureThree = ScTextureThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class ThreeUtil {
            static Color(color) {
                return new THREE.Color(color.R / 255, color.G / 255, color.B / 255);
            }
            static getHex(color) {
                return (color.R) << 16 ^ (color.G) << 8 ^ (color.B) << 0;
            }
            static FromVector2(vector2, res) {
                res = res || new U1.Vector2();
                return res.Set(vector2.x, vector2.y);
            }
            static FromVector3(vector3, res) {
                res = res || new U1.Vector3();
                return res.Set(vector3.x, vector3.y, vector3.z);
            }
            static Vector2(vector2, res) {
                res = res || new THREE.Vector2();
                return res.set(vector2.X, vector2.Y);
            }
            static Vector3(vector3, res) {
                res = res || new THREE.Vector3();
                return res.set(vector3.X, vector3.Y, vector3.Z);
            }
            static Quaternion(quat, res) {
                res = res || new THREE.Quaternion();
                return res.set(quat.X, quat.Y, quat.Z, quat.W);
            }
            static Matrix4(m, res) {
                res = res || new THREE.Matrix4();
                res.set(m.M11, m.M21, m.M31, m.M41, m.M12, m.M22, m.M32, m.M42, m.M13, m.M23, m.M33, m.M43, m.M14, m.M24, m.M34, m.M44);
                return res;
            }
            static Texture(texture) {
                if (texture == null)
                    return null;
                if (texture instanceof Views.ScTextureThree)
                    return texture.TextureThree;
                return null;
            }
            static ApplyTransform(obj3D, matrix) {
                var pos = ThreeUtil[".atf.v0"] || (ThreeUtil[".atf.v0"] = new THREE.Vector3());
                var qut = ThreeUtil[".atf.q0"] || (ThreeUtil[".atf.q0"] = new THREE.Quaternion());
                var scl = ThreeUtil[".atf.v1"] || (ThreeUtil[".atf.v1"] = new THREE.Vector3());
                var m = ThreeUtil[".atf.m0"] || (ThreeUtil[".atf.m0"] = new THREE.Matrix4());
                ThreeUtil.Matrix4(matrix, m);
                m.decompose(pos, qut, scl);
                obj3D.position.copy(pos);
                obj3D.quaternion.copy(qut);
                obj3D.scale.copy(scl);
                obj3D.updateMatrix();
            }
            static ApplyPerspectiveCamera(cam3d, cam) {
                cam3d.position.x = cam.Position.X;
                cam3d.position.y = cam.Position.Y;
                cam3d.position.z = cam.Position.Z;
                cam3d.up.x = cam.Up.X;
                cam3d.up.y = cam.Up.Y;
                cam3d.up.z = cam.Up.Z;
                cam3d.near = cam.Near;
                cam3d.far = cam.Far;
                cam3d.lookAt(new THREE.Vector3(cam.LookAt.X, cam.LookAt.Y, cam.LookAt.Z));
                cam3d.aspect = cam.Aspect;
                cam3d.fov = cam.FOV / Math.PI * 180;
                cam3d.updateProjectionMatrix();
            }
            static ApplyOrthographicCamera(camThree, cam) {
                camThree.position.x = cam.Position.X;
                camThree.position.y = cam.Position.Y;
                camThree.position.z = cam.Position.Z;
                camThree.up.x = cam.Up.X;
                camThree.up.y = cam.Up.Y;
                camThree.up.z = cam.Up.Z;
                camThree.lookAt(new THREE.Vector3(cam.LookAt.X, cam.LookAt.Y, cam.LookAt.Z));
                var h = cam.OrthoHeight;
                var w = cam.OrthoHeight * cam.Aspect;
                camThree.left = -w / 2;
                camThree.right = w / 2;
                camThree.top = h / 2;
                camThree.bottom = -h / 2;
                camThree.near = cam.Near;
                camThree.far = cam.Far;
                camThree.updateProjectionMatrix();
            }
            static ApplyDirectionalLight(light3D, light) {
                light3D.position.set(-light.Direction.X, -light.Direction.Y, -light.Direction.Z);
                light3D.color.setRGB(light.Diffuse.R / 255.0, light.Diffuse.G / 255.0, light.Diffuse.B / 255.0);
                light3D.updateMatrix();
            }
            static ApplyMeshBufferGeometry(geomThree, geometry) {
                geomThree.setAttribute('position', new THREE.BufferAttribute(geometry.pos, 3));
                if (geometry.normal != null)
                    geomThree.setAttribute('normal', new THREE.BufferAttribute(geometry.normal, 3));
                if (geometry.color != null && geometry.color.length > 0)
                    geomThree.setAttribute('color', new THREE.BufferAttribute(geometry.color, 3));
                if (geometry.uv0 != null && geometry.uv0.length > 0)
                    geomThree.setAttribute('uv', new THREE.BufferAttribute(geometry.uv0, 2));
                if (geometry.uv1 != null && geometry.uv1.length > 0)
                    geomThree.setAttribute('uv1', new THREE.BufferAttribute(geometry.uv1, 2));
                if (geometry.indices != null)
                    geomThree.setIndex(new THREE.BufferAttribute(geometry.indices, 1));
                geomThree.computeBoundingBox();
                geomThree.computeBoundingSphere();
            }
            static ApplyLineBufferGeometry(geomThree, geometry) {
                geomThree.setAttribute('position', new THREE.BufferAttribute(geometry.pos, 3));
                if (geometry.color != null && geometry.color.length > 0)
                    geomThree.setAttribute('color', new THREE.BufferAttribute(geometry.color, 3));
                if (geometry.indices != null)
                    geomThree.setIndex(new THREE.BufferAttribute(geometry.indices, 1));
            }
        }
        Views.ThreeUtil = ThreeUtil;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class Default3DTool extends U1.Views.DefaultTool {
            constructor() {
                super();
            }
            OnMouseMove(ev) {
                var tv0 = Default3DTool[".omm.v20"] || (Default3DTool[".omm.v20"] = new U1.Vector2());
                if (ev.buttons === 4) {
                    tv0.SetSubtract(this.View.CurMv, this.View.OldMv);
                    this.View.Orbit(tv0);
                    return true;
                }
                return super.OnMouseMove(ev);
            }
        }
        Views.Default3DTool = Default3DTool;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class Selection2DTool extends U1.Views.SelectionTool {
            constructor() {
                super();
            }
            OnMouseMove(e) {
                var tv0 = Views.Selection3DTool[".omm.v20"]
                    || (Views.Selection3DTool[".omm.v20"] = new U1.Vector2());
                if (e.buttons === 2) {
                    tv0.SetSubtract(this.View.CurMv, this.View.OldMv);
                    tv0.Y = 0;
                    this.View.Mode = U1.Views.ViewModes.Orbitting;
                    this.View.Orbit(tv0);
                    return true;
                }
                else {
                    if (this.View.Mode == U1.Views.ViewModes.Orbitting) {
                        this.View.Mode = U1.Views.ViewModes.None;
                    }
                }
                return super.OnMouseMove(e);
            }
        }
        Views.Selection2DTool = Selection2DTool;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class Selection3DTool extends U1.Views.SelectionTool {
            constructor() {
                super();
            }
            OnMouseMove(e) {
                var tv0 = Selection3DTool[".omm.v20"]
                    || (Selection3DTool[".omm.v20"] = new U1.Vector2());
                if (e.buttons === 2) {
                    tv0.SetSubtract(this.View.CurMv, this.View.OldMv);
                    this.View.Mode = U1.Views.ViewModes.Orbitting;
                    this.View.Orbit(tv0);
                    return true;
                }
                else {
                    if (this.View.Mode == U1.Views.ViewModes.Orbitting) {
                        this.View.Mode = U1.Views.ViewModes.None;
                    }
                }
                return super.OnMouseMove(e);
            }
        }
        Views.Selection3DTool = Selection3DTool;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class View2DThree extends Views.KView {
            constructor(canvas, textCanvas = null, textSvg = null) {
                super();
                this._canPaning = false;
                this._3dcanvas = canvas;
                this._textCanvas = textCanvas;
                this._textSvg = textSvg;
                this.DefaultTool = new U1.Views.SelectionTool();
            }
            get SvgOverlay() {
                return this._svgOverlay;
            }
            set SvgOverlay(value) {
                this._svgOverlay = value;
            }
            get SvgText() {
                return this._textSvg;
            }
            get Canvas() {
                return this._3dcanvas;
            }
            set Canvas(value) {
                this._3dcanvas = value;
            }
            get CanPaning() {
                return this._canPaning;
            }
            set CanPaning(value) {
                this._canPaning = value;
            }
            CreateScene() {
                var scene = new Views.SceneThree(this);
                scene.ClearColor = U1.Colors.Azure;
                return scene;
            }
            OnBeginUpdate() {
                super.OnBeginUpdate();
                this._3dcanvas.width = this.Width;
                this._3dcanvas.height = this.Height;
                this._textCanvas.width = this.Width;
                this._textCanvas.height = this.Height;
                this.RenderingContext2D.globalCompositeOperation = 'destination-out';
                this.RenderingContext2D.fillStyle = "rgba(255,255,255,0.2)";
                this.RenderingContext2D.fillRect(0, 0, this.Width, this.Height);
                this.RenderingContext2D.globalCompositeOperation = "source-over";
                if (this._showNavigator) {
                    if (this._scNav == null) {
                        this._scNav = this.Controls.AddControl(U1.Views.VcNavigator);
                    }
                }
                else {
                    if (this._scNav != null) {
                        this._scNav.Dispose();
                        this._scNav = null;
                    }
                }
            }
            OnEndUpdate() {
                super.OnEndUpdate();
            }
            get TextSvg() {
                return this._textSvg;
            }
            get RenderingContext2D() {
                if (this._context2D == null) {
                    this._context2D = this._textCanvas.getContext('2d');
                }
                return this._context2D;
            }
            newControlInstance(ctor) {
                var result;
                var ctlType = ctor;
                if (ctlType === U1.Views.VcNavigator)
                    result = new KBim.Views.VcNavigator2Three();
                else if (ctlType === U1.Views.VcXForm)
                    result = new Views.VcXFormThree();
                else
                    result = super.newControlInstance(ctor);
                return result;
            }
            OnMouseDown(ev) {
                super.OnMouseDown(ev);
            }
            OnMouseEnter(ev) {
                super.OnMouseEnter(ev);
            }
            HomeView(box) {
                if (box == null) {
                    box = this.DocumentPresenter.GetWorldBounding();
                }
                if (box == null) {
                    box = new U1.BoundingBox(new U1.Vector3(-10, -10, -10), new U1.Vector3(10, 10, 10));
                }
                var min = box.Min;
                var max = box.Max;
                if (min == U1.Vector3.MaxValue)
                    min = U1.Vector3.One.Scale(-10);
                if (max == U1.Vector3.MinValue)
                    max = U1.Vector3.One.Scale(10);
                var cent = U1.Vector3.Add(min, max).Scale(1 / 2);
                cent.Z = max.Z;
                var radius = U1.Vector3.Distance(min, max) / 2;
                var dist = 10;
                var lookAt = cent;
                var pos = U1.Vector3.ScaleAdd(cent, dist, new U1.Vector3(0, 0, 1));
                var up = U1.Vector3.Normalize(new U1.Vector3(0, 1, 0));
                this.Scene.Camera.LookAt = lookAt;
                this.Scene.Camera.Position = pos;
                this.Scene.Camera.OrthoHeight = radius * 2 * 1.2;
                this.Scene.Camera.Up = up;
                if (this.PivotPoint == null) {
                    this.PivotPoint = cent;
                }
                this.Invalidate();
            }
            OnSelectionChanged(sel) {
                if (sel.Count > 0) {
                }
                else {
                }
                super.OnSelectionChanged(sel);
            }
            Orbit(delt) {
                delt.Y = 0;
                super.Orbit(delt);
            }
            PickOrbitPoint(view) {
                var isectInfo = new U1.ISectInfo();
                isectInfo.IsectPosition = this.ScreenToWorkingPlane(view);
                return isectInfo;
            }
        }
        Views.View2DThree = View2DThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    var Views;
    (function (Views) {
        class View3DThree extends Views.KView {
            constructor(canvas, textCanvas = null, textSvg = null) {
                super();
                this._canPaning = false;
                this._prevTouchTime = Date.now();
                this._curTouchTime = Date.now();
                this._3dcanvas = canvas;
                this._textCanvas = textCanvas;
                this._textSvg = textSvg;
                this.DefaultTool = new U1.Views.SelectionTool();
            }
            get SvgOverlay() {
                return this._svgOverlay;
            }
            set SvgOverlay(value) {
                this._svgOverlay = value;
            }
            get SvgText() {
                return this._textSvg;
            }
            get Canvas() {
                return this._3dcanvas;
            }
            set Canvas(value) {
                this._3dcanvas = value;
            }
            get CanPaning() {
                return this._canPaning;
            }
            set CanPaning(value) {
                this._canPaning = value;
            }
            CreateScene() {
                var scene = new Views.SceneThree(this);
                scene.ClearColor = U1.Colors.Azure;
                return scene;
            }
            OnBeginUpdate() {
                super.OnBeginUpdate();
                this._3dcanvas.width = this.Width;
                this._3dcanvas.height = this.Height;
                this._textCanvas.width = this.Width;
                this._textCanvas.height = this.Height;
                this.RenderingContext2D.globalCompositeOperation = 'destination-out';
                this.RenderingContext2D.fillStyle = "rgba(255,255,255,0.2)";
                this.RenderingContext2D.fillRect(0, 0, this.Width, this.Height);
                this.RenderingContext2D.globalCompositeOperation = "source-over";
                if (this._showNavigator) {
                    if (this._scNav == null) {
                        this._scNav = this.Controls.AddControl(U1.Views.VcNavigator);
                    }
                }
                else {
                    if (this._scNav != null) {
                        this._scNav.Dispose();
                        this._scNav = null;
                    }
                }
            }
            OnEndUpdate() {
                super.OnEndUpdate();
            }
            get TextSvg() {
                return this._textSvg;
            }
            get RenderingContext2D() {
                if (this._context2D == null) {
                    this._context2D = this._textCanvas.getContext('2d');
                }
                return this._context2D;
            }
            newControlInstance(ctor) {
                var result;
                var ctlType = ctor;
                if (ctlType === U1.Views.VcNavigator)
                    result = new KBim.Views.VcNavigator3Three();
                else if (ctlType === U1.Views.VcXForm)
                    result = new Views.VcXFormThree();
                else
                    result = super.newControlInstance(ctor);
                return result;
            }
            OnMouseDown(ev) {
                super.OnMouseDown(ev);
            }
            OnMouseEnter(ev) {
                super.OnMouseEnter(ev);
            }
            OnSelectionChanged(sel) {
                if (sel.Count > 0) {
                }
                else {
                }
                super.OnSelectionChanged(sel);
            }
            ZoomHit(view) {
                var _a, _b;
                if (((_a = this.Scene) === null || _a === void 0 ? void 0 : _a.Camera.ProjectionMode) != U1.ProjectionTypeEnum.Perspective)
                    return;
                let isect = this.PickOrbitPoint(view);
                if (isect != null) {
                    let min = isect.IsectPosition.Clone();
                    let max = isect.IsectPosition.Clone();
                    let dist = U1.Vector3.Distance(isect.IsectPosition, this.Scene.Camera.Position);
                    let rad = Math.max(3, dist * 0.1);
                    min.Subtract(new U1.Vector3(rad, rad, rad));
                    max.Add(new U1.Vector3(rad, rad, rad));
                    let bbx = new U1.BoundingBox(min, max);
                    this.ZoomFit(bbx);
                    (_b = this.Document) === null || _b === void 0 ? void 0 : _b.Selection.Clear();
                }
            }
            OnDblClick(ev) {
                this.ZoomHit(new U1.Vector2(ev.offsetX, ev.offsetY));
            }
            OnTouchStart(te) {
                this._curTouchTime = Date.now();
                let delt = this._curTouchTime - this._prevTouchTime;
                super.OnTouchStart(te);
                if (te.touches.length == 1 && delt < 300) {
                    this.ZoomHit(this.CurDn);
                }
                this._prevTouchTime = this._curTouchTime;
            }
        }
        Views.View3DThree = View3DThree;
    })(Views = KBim.Views || (KBim.Views = {}));
})(KBim || (KBim = {}));
var KBim;
(function (KBim) {
    class KVisibleContext {
        constructor() {
            this.HideDetailDist = 20;
            this.DisposeDetailDist = 50;
            this.HideLodDist = 100;
            this.InvisiblePixelSize = 10;
            this.Is3D = true;
        }
        static get2D(view, result) {
            result = result !== null && result !== void 0 ? result : new KVisibleContext();
            let cam = view.Scene.Camera;
            let cent = cam.Position.Clone();
            result.CamPos = cent;
            result.CamDir = cam.GetDirection();
            result.Is3D = false;
            let h = cam.OrthoHeight;
            let w = cam.Aspect * h;
            result.WMin = U1.Vector3.Add(cent, new U1.Vector3(-w / 2, -h / 2, 0));
            result.WMax = U1.Vector3.Add(cent, new U1.Vector3(w / 2, h / 2, 1));
            result.WWidth = w;
            result.WHeight = h;
            result.WtoS = view.Height / h;
            result.WRadOut = Math.max(h / 2, w / 2);
            result.WRadIn = Math.min(h / 2, w / 2);
            return result;
        }
        check2D(node, res) {
            let nodeCtx = node.node2Context;
            if (nodeCtx.isPrimeMesh) {
                return 1;
            }
            let invisible = false;
            let grad = node.geomRad * this.WtoS;
            if (grad < this.InvisiblePixelSize)
                invisible = true;
            let geCent = node.geomCent;
            let geRad = node.geomRad;
            if (invisible ||
                geCent.X - geRad > this.WMax.X ||
                geCent.Y - geRad > this.WMax.Y ||
                geCent.X + geRad < this.WMin.X ||
                geCent.Y + geRad < this.WMin.Y) {
                invisible = true;
            }
            let dist = U1.Vector2.Distance(this.CamPos.XY(KVisibleContext._v20), node.geomCent.XY(KVisibleContext._v21));
            dist -= (this.WRadOut + node.geomRad);
            if (res != null)
                res.dist = dist;
            if (dist > this.DisposeDetailDist) {
                return -1;
            }
            else if (invisible || dist > this.HideDetailDist) {
                return 0;
            }
            else {
                return 1;
            }
        }
    }
    KVisibleContext._v20 = U1.Vector2.Zero;
    KVisibleContext._v21 = U1.Vector2.Zero;
    KVisibleContext._vc0 = new KVisibleContext();
    KVisibleContext._vc1 = new KVisibleContext();
    KVisibleContext._vc2 = new KVisibleContext();
    KBim.KVisibleContext = KVisibleContext;
})(KBim || (KBim = {}));
//# sourceMappingURL=KBim.WebViewer.js.map