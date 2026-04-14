<template>
    <div class="wrap">
        <main class="content">
            <h1 class="page-title">차량 카테고리 관리</h1>

            <!-- 그리드 영역 시작 -->
            <!-- 1행 영역 시작 (55:45) -->
            <div class="grid-row row-1st">
                <!-- 제조사 Grid -->
                <section class="grid-section">
                    <div class="grid-title">
                        <div class="title-text">
                            <span class="line"></span> 제조사 <span v-if="selectedMakerName" class="selected-name">: {{ selectedMakerName }}</span>
                        </div>
                        <div class="btn-area">
                            <button class="btn-add" @click="onAdd('maker')">추가</button>
                            <button class="btn-del" @click="onDelete('maker')" :disabled="!makerState.hasDelete">삭제</button>
                            <button class="btn-save" @click="onSave('maker')" :disabled="!makerState.hasSave">저장</button>
                            <button class="btn-cancel" @click="onCancel('maker')" :disabled="!makerState.hasChange">취소</button>
                        </div>
                    </div>

                    <div class="grid-box ag-theme-alpine">
                         <ag-grid-vue
                            style="width: 100%; height: 350px;"
                            :columnDefs="makerCols"
                            :rowData="makerList"
                            :defaultColDef="defaultColDef"
                            :gridOptions="gridOptions"
                            rowSelection="multiple"
                            :rowClassRules="rowClassRules"
                            @selection-changed="onSelectionChanged"
                            @grid-ready="onMakerGridReady"
                            @rowClicked="onMakerClick"
                            suppressRowClickSelection="true"
                        />
                    </div>
                </section>

                <!-- 모델 Grid -->
                <section class="grid-section" :class="{ disabled : !selectedMakerId || makerState.hasChange }">
                    <div class="grid-title">
                        <div class="title-text">
                            <span class="line"></span> 모델 <span v-if="selectedModelName" class="selected-name">: {{ selectedModelName }}</span>
                        </div>
                        <div class="btn-area">
                            <button class="btn-add" @click="onAdd('model')">추가</button>
                            <button class="btn-del" @click="onDelete('model')" :disabled="!modelState.hasDelete">삭제</button>
                            <button class="btn-save" @click="onSave('model')" :disabled="!modelState.hasSave">저장</button>
                            <button class="btn-cancel" @click="onCancel('model')" :disabled="!modelState.hasChange">취소</button>
                        </div>
                    </div>

                    <div class="grid-box ag-theme-alpine">
                        <ag-grid-vue
                            style="width: 100%; height: 350px;"
                            :columnDefs="modelCols"
                            :rowData="modelList"
                            :defaultColDef="defaultColDef"
                            :gridOptions="gridOptions"
                            rowSelection="multiple"
                            :rowClassRules="rowClassRules"
                            @selection-changed="onSelectionChanged"
                            @grid-ready="onModelGridReady"
                            @rowClicked="onModelClick"
                            suppressRowClickSelection="true"
                        />
                    </div>
                </section>
            </div>
            <!-- 1행 영역 끝 -->

            <!-- 2행 영역 시작 (45:55) -->
            <div class="grid-row row-2nd">
                <!-- 세부모델 Grid -->
                <section class="grid-section" :class="{ disabled : !selectedModelId  || modelState.hasChange }">
                    <div class="grid-title">
                        <div class="title-text">
                            <span class="line"></span> 세부모델 <span v-if="selectedDetailName" class="selected-name">: {{ selectedDetailName }}</span>
                        </div>
                        <div class="btn-area">
                            <button class="btn-add" @click="onAdd('detail')">추가</button>
                            <button class="btn-del" @click="onDelete('detail')" :disabled="!detailState.hasDelete">삭제</button>
                            <button class="btn-save" @click="onSave('detail')" :disabled="!detailState.hasSave">저장</button>
                            <button class="btn-cancel" @click="onCancel('detail')" :disabled="!detailState.hasChange">취소</button>
                        </div>                
                    </div>

                    <div class="grid-box ag-theme-alpine">
                        <ag-grid-vue
                            style="width: 100%; height: 350px;"
                            :columnDefs="modelDetailCols"
                            :rowData="modelDetailList"
                            :defaultColDef="defaultColDef"
                            :gridOptions="gridOptions"
                            rowSelection="multiple"
                            :rowClassRules="rowClassRules"
                            @selection-changed="onSelectionChanged"
                            @grid-ready="onDetailGridReady"
                            @rowClicked="onDetailClick"
                            suppressRowClickSelection="true"
                        />
                    </div>
                </section>

                <!-- 등급 Grid -->
                <section class="grid-section" :class="{ disabled : !selectedDetailId || detailState.hasChange }">
                    <div class="grid-card">
                        <div class="grid-title">
                            <div class="title-text">
                                <span class="line"></span> 등급 <span v-if="selectedTrimName" class="selected-name">: {{ selectedTrimName }}</span>
                            </div>
                            <div class="btn-area">
                                <button class="btn-add" @click="onAdd('trim')">추가</button>
                                <button class="btn-del" @click="onDelete('trim')" :disabled="!trimState.hasDelete">삭제</button>
                                <button class="btn-save" @click="onSave('trim')" :disabled="!trimState.hasSave">저장</button>
                                <button class="btn-cancel" @click="onCancel('trim')" :disabled="!trimState.hasChange">취소</button>
                            </div> 
                        </div>
                    </div>

                    <div class="grid-box ag-theme-alpine">
                        <ag-grid-vue
                            style="width: 100%; height: 350px;"
                            :columnDefs="trimCols"
                            :rowData="trimList"
                            :defaultColDef="defaultColDef"
                            :gridOptions="gridOptions"
                            rowSelection="multiple"
                            :rowClassRules="rowClassRules"
                            @selection-changed="onSelectionChanged"
                            @grid-ready="onTrimGridReady"
                            @rowClicked="onTrimClick"
                            suppressRowClickSelection="true"
                        />
                    </div>
                </section>
            </div>
            <!-- 2행 영역 끝 -->
            <!-- 그리드 영역 끝 -->
        </main>
    </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import vhclApi from '../services/vhclApi';

export default {
    components: { AgGridVue },

    data() {
        return {
            makerGridApi: null,
            modelGridApi: null,
            detailGridApi: null,
            trimGridApi: null,

            // 조회 원본 백업용
            originalMakerList: [],
            originalModelList: [],
            originalDetailList: [],
            originalTrimList: [],

            // 데이터 목록
            makerList: [],
            modelList: [],
            modelDetailList: [],
            trimList: [],

            isReset: false,  // 리셋 플래그

            // 선택 행 id (하위 그리드 조회)
            selectedMakerId: null,
            selectedModelId: null,
            selectedDetailId: null,

            // 선택 행 name (화면 표출)
            selectedMakerName: null,
            selectedModelName: null,
            selectedDetailName: null,
            selectedTrimName: null,

            // 체크 박스 선택 개수 (삭제)
            makerSelectedCount: 0,
            modelSelectedCount: 0,
            detailSelectedCount: 0,
            trimSelectedCount: 0,

            // 그리드 공통옵션
            gridOptions: {
                overlayNoRowsTemplate: '<span>조회 결과가 없습니다</span>'
            },

            // 그리드 공통 컬럼 옵션
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true,
                editable: true,
                // 그리드 셀 수정
                onCellValueChanged: (params) => {
                    // 수정 CSS 적용
                    if (!params.data._isNew) {
                        params.data._isEdit = true;
                    }

                    // 제조사 그리드 셀 수정 시 하위 그리드 초기화
                    if ((params.colDef.field === 'makerName' || params.colDef.field === 'country') && params.data.makerId === this.selectedMakerId) {
                        this.modelList = [];
                        this.modelDetailList = [];
                        this.trimList = [];

                        this.selectedModelId = null;
                        this.selectedDetailId = null;

                        this.selectedModelName = null;
                        this.selectedDetailName = null;
                        this.selectedTrimName = null;
                    }

                    // 모델 그리드 셀 수정 시 하위 그리드 초기화
                    if (params.colDef.field === 'modelName' && params.data.modelId === this.selectedModelId) {
                        this.modelDetailList = [];
                        this.trimList = [];

                        this.selectedDetailId = null;

                        this.selectedDetailName = null;
                        this.selectedTrimName = null;
                    }

                    // 세부모델 그리드 셀 수정 시 하위 그리드 초기화
                    if (( params.colDef.field === 'detailName' || params.colDef.field === 'yearFrom' || params.colDef.field === 'yearTo') && params.data.detailId === this.selectedDetailId) {
                        this.trimList = [];
                        this.selectedTrimName = null;
                    }

                    params.api.redrawRows({ rowNodes: [params.node] });
                }
            },

            // 그리드 행 스타일 적용 (추가, 수정, 삭제)
            rowClassRules: {
                'row-new': params => params.data._isNew,
                'row-edit': params => params.data._isEdit && !params.data._isDel,
                'row-del': params => params.data._isDel,
                'row-selected': params => params.node.isSelected() && !params.data._isDel
            }, 

            // 그리드 컬럼 정의
            makerCols: [
                {
                    headerName: '',
                    width: 50,
                    checkboxSelection: true,
                    headerCheckboxSelection: false,
                    pinned: 'left',
                    suppressMenu: true,
                    suppressSorting: true,
                    suppressSizeToFit: true
                },
                { headerName: '제조사명', field: 'makerName', flex: 1, editable: true },
                { headerName: '제조국가', field: 'country', flex: 1, editable: true },
                { headerName: '제조사ID', field: 'makerId', hide: true }   // hidden
            ],
            modelCols: [
                {
                    headerName: '',
                    width: 50,
                    checkboxSelection: true,
                    headerCheckboxSelection: false,
                    pinned: 'left',
                    suppressMenu: true,
                    suppressSorting: true,
                    suppressSizeToFit: true
                },
                { headerName: '모델명', field: 'modelName', flex: 1, editable: true },
                { headerName: '모델ID', field: 'modelId', hide: true },     // hidden
                { headerName: '제조사ID', field: 'makerId', hide: true }    // hidden
            ],
            modelDetailCols: [
                {
                    headerName: '',
                    width: 50,
                    checkboxSelection: true,
                    headerCheckboxSelection: false,
                    pinned: 'left',
                    suppressMenu: true,
                    suppressSorting: true,
                    suppressSizeToFit: true
                },
                { headerName: '세부모델명', field: 'detailName', flex: 1.5, editable: true },
                { headerName: '출시 시작연도', field: 'yearFrom', flex: 1, editable: true },
                { headerName: '출시 종료연도', field: 'yearTo', flex: 1, editable: true },
                { headerName: '세부모델ID', field: 'detailId', hide: true }, // hidden
                { headerName: '모델ID', field: 'modelId', hide: true }      // hidden
            ],
            trimCols: [
                {
                    headerName: '',
                    width: 50,
                    checkboxSelection: true,
                    headerCheckboxSelection: false,
                    pinned: 'left',
                    suppressMenu: true,
                    suppressSorting: true,
                    suppressSizeToFit: true
                },
                { headerName: '등급명', field: 'trimName', flex: 1.5, editable: true },
                { headerName: '엔진', field: 'engine', flex: 1, editable: true },
                { headerName: '연료', field: 'fuel', flex: 1, editable: true },
                { headerName: '변속기', field: 'transmission', flex: 1, editable: true },
                { headerName: '등급ID', field: 'trimId', hide: true },      // hidden
                { headerName: '세부모델ID', field: 'detailId', hide: true } // hidden
            ],
        }
    },
    computed: {
        // 그리드별 상태 확인 -> 버튼 및 화면 제어
        makerState() {
            const list = this.makerList || []; 
            
            return {
                //hasDelete: list.some(r => r._isDel),
                hasDelete: this.makerSelectedCount > 0,
                hasSave: list.some(r => r._isNew || r._isEdit),
                hasChange: list.some(r => r._isNew || r._isEdit || r._isDel)
            }
        },
        modelState() {
            const list = this.modelList || [];

            return {
                //hasDelete: list.some(r => r._isDel),
                hasDelete: this.modelSelectedCount > 0,
                hasSave: list.some(r => r._isNew || r._isEdit),
                hasChange: list.some(r => r._isNew || r._isEdit || r._isDel)
            };
        },
        detailState() {
            const list = this.modelDetailList || [];

            return {
                //hasDelete: list.some(r => r._isDel),
                hasDelete: this.detailSelectedCount > 0,
                hasSave: list.some(r => r._isNew || r._isEdit),
                hasChange: list.some(r => r._isNew || r._isEdit || r._isDel)
            };
        },
        trimState() {
            const list = this.trimList || [];

            return {
                //hasDelete: list.some(r => r._isDel),
                hasDelete: this.trimSelectedCount > 0,
                hasSave: list.some(r => r._isNew || r._isEdit),
                hasChange: list.some(r => r._isNew || r._isEdit || r._isDel)
            };
        }
    },
    mounted() {
        this.getMakerList();    // 초기 제작사 목록 조회
    },
    methods: {
        // grid ready
        onMakerGridReady(params) { this.makerGridApi = params.api },
        onModelGridReady(params) { this.modelGridApi = params.api },
        onDetailGridReady(params) { this.detailGridApi = params.api },
        onTrimGridReady(params) { this.trimGridApi = params.api },

        // 공통 목록 조회용
        applyRowState(list) {
            return list.map(row => ({
                ...row,
                _isNew: false,
                _isEdit: false,
                _isDel: false
            }));
        },

        // 제작사 목록 조회
        async getMakerList() {
            try {
                const res = await vhclApi.makerList();
                this.originalMakerList = JSON.parse(JSON.stringify(res.data));  // 조회 원본 백업
                this.makerList = this.applyRowState(res.data);  // UI 상태 적용
            } catch(e) {
                console.error('>>> 제작사 목록 조회 실패', e);
            }
        },

        // 제조사 그리드 행 클릭 이벤트
        onMakerClick(event) {
            // 체크박스 클릭이면 무시 (행 삭제용)
            if (event.event.target.closest('.ag-selection-checkbox') || event.event.target.closest('.ag-checkbox')) {
                return;
            }
            
            // 변경사항 있는 경우 행 클릭 X
            if (this.makerState.hasChange) {
                return;
            }

            // 편집 중인 경우 강제 종료하여 최신값 확정 (에러 방지)
            if (event.api) event.api.stopEditing();
            
            this.selectedMakerId = event.data.makerId; // 클릭 행 id 값 셋팅 (조회를 위해 즉시 업데이트)
            // 클릭 행 name 값 셋팅 (조회 시점의 name 저장, 그리드 수정 내용에 영향받지 않기 위함)
            this.selectedMakerName = event.data.makerName;

            this.clearBelow('maker');   // 제조사 변경 시 하위 데이터 초기화
            this.getModelList(this.selectedMakerId); // 모델 목록 조회 호출
        },

        // 모델 목록 조회
        async getModelList(makerId) {
            try {
                const res = await vhclApi.modelList(makerId);
                this.originalModelList = JSON.parse(JSON.stringify(res.data));  // 조회 원본 백업
                this.modelList = this.applyRowState(res.data);  // UI 상태 적용
            } catch(e) {
                console.error('>>> 모델 목록 조회 실패', e);
            }
        },

        // 모델 그리드 행 클릭 이벤트
        onModelClick(event) {
            // 체크박스 클릭이면 무시 (행 삭제용)
            if (event.event.target.closest('.ag-checkbox')) return;

            // 변경사항 있는 경우 행 클릭 X
            if (this.modelState.hasChange) {
                return;
            }

            // 편집 중인 경우 강제 종료하여 최신값 확정 (에러 방지)
            if (event.api) event.api.stopEditing();

            this.selectedModelId = event.data.modelId;
            this.selectedModelName = event.data.modelName; 

            this.clearBelow('model');   // 모델 변경 시 하위 데이터 초기화
            this.getModelDetailList(this.selectedModelId); // 세부모델 목록 조회 호출
        },

        // 세부모델 목록 조회
        async getModelDetailList(modelId) {
            try {
                const res = await vhclApi.detailModelList(modelId);
                this.originalDetailList = JSON.parse(JSON.stringify(res.data));  // 조회 원본 백업
                this.modelDetailList  = this.applyRowState(res.data);  // UI 상태 적용
            } catch(e) {
                console.error('>>> 세부모델 목록 조회 실패', e);
            }
        },

        // 세부모델 그리드 행 클릭 이벤트
        onDetailClick(event) {
            // 체크박스 클릭이면 무시 (행 삭제용)
            if (event.event.target.closest('.ag-checkbox')) return;

            // 변경사항 있는 경우 행 클릭 X
            if (this.detailState.hasChange) {
                return;
            }

            // 편집 중인 경우 강제 종료하여 최신값 확정 (에러 방지)
            if (event.api) event.api.stopEditing();

            this.selectedDetailId = event.data.detailId;
            this.selectedDetailName = event.data.detailName;
            
            this.clearBelow('detail');   // 세부모델 변경 시 하위 데이터 초기화
            this.getTrimList(this.selectedDetailId);   // 등급 목록 조회 호출
        },

        // 등급 목록 조회
        async getTrimList(detailId) {
            try {
                const res = await vhclApi.trimList(detailId);
                this.originalTrimList = JSON.parse(JSON.stringify(res.data));  // 조회 원본 백업
                this.trimList = this.applyRowState(res.data);  // UI 상태 적용
            } catch(e) {
                console.error('>>> 등급 목록 조회 실패', e);
            }
        },

        // 등급 그리드 행 클릭 이벤트
        onTrimClick(event) {
            // 체크박스 클릭이면 무시 (행 삭제용)
            if (event.event.target.closest('.ag-checkbox')) return;

            // 변경사항 있는 경우 행 클릭 x
            if (this.trimState.hasChange) {
                return;
            }

            // 편집 중인 경우 강제 종료하여 최신값 확정 (에러 방지)
            if (event.api) event.api.stopEditing();
            
            this.selectedTrimId = event.data.trimId;
            this.selectedTrimName = event.data.trimName;
        },
        
        // [추가] 버튼 클릭 -> 그리드 행 추가 이벤트 호출
        onAdd(type) {
            switch (type) {
                case 'maker' :
                    this.addMakerRow();
                    break;
                case 'model' :
                    this.addModelRow();
                    break;    
                case 'detail' :
                    this.addDetailRow();
                    break;
                case 'trim' :
                    this.addTrimRow();
                    break;
            }
        },

        // 제조사 그리드 행 추가 이벤트
        addMakerRow() {
            if (!this.makerGridApi) return;

            // 하위 항목 초기화
            this.clearBelow('maker');

            this.selectedMakerId = null;
            this.selectedMakerName = null;

            const newRow = {
                tempId: `tmp_${Date.now()}_${Math.random()}`,   // 신규 행 임시 아이디 (프론트용)
                makerId: null,
                makerName: '',
                country: '',
                // 행 플래그
                _isNew: true,
                _isEdit: false,
                _isDel: false
            };

            this.makerList.unshift(newRow); // 뷰 상태 반영

            this.makerGridApi.applyTransaction({
                add: [newRow],
                addIndex: 0     // 맨 위에 신규 행 추가
            });

            // 제조사명 입력 모드 진입 (입력 커서 이동)
            this.$nextTick(() => {
                this.makerGridApi.startEditingCell({
                    rowIndex: 0,
                    colKey: 'makerName'
                });
            });
        },

        // 모델 그리드 행 추가 이벤트
        addModelRow() {
            if (!this.selectedMakerId) {
                alert('제조사를 먼저 선택하세요.');
                return;
            }

            // 하위 항목 초기화
            this.clearBelow('model');

            this.selectedModelId = null;
            this.selectedModelName = null;

            const newRow = {
                tempId: `tmp_${Date.now()}_${Math.random()}`,   // 신규 행 임시 아이디 (프론트용)
                modelId: null,
                modelName: '',
                makerId: this.selectedMakerId,
                // 행 플래그
                _isNew: true,
                _isEdit: false,
                _isDel: false
            };

            this.modelList.unshift(newRow); // 뷰 상태 반영

            this.modelGridApi.applyTransaction({
                add: [newRow],
                addIndex: 0     // 맨 위에 신규 행 추가
            });

            // 모델명 입력 모드 진입 (입력 커서 이동)
            this.$nextTick(() => {
                this.modelGridApi.startEditingCell({
                    rowIndex: 0,
                    colKey: 'modelName'
                });
            });
        },

        // 세부모델 그리드 행 추가 이벤트
        addDetailRow() {
            if (!this.selectedModelId) {
                alert('모델을 먼저 선택하세요.');
                return;
            }

            // 하위 항목 초기화
            this.clearBelow('detail');

            this.selectedDetailId = null;
            this.selectedDetailName = null;

            const newRow = {
                tempId: `tmp_${Date.now()}_${Math.random()}`,   // 신규 행 임시 아이디 (프론트용)
                detailId: null,
                detailName: '',
                yearFrom: '',
                yearTo: '',
                makerId: this.selectedMakerId,
                modelId: this.selectedModelId,
                // 행 플래그
                _isNew: true,
                _isEdit: false,
                _isDel: false
            };

            this.modelDetailList.unshift(newRow);   // 뷰 상태 반영

            this.detailGridApi.applyTransaction({
                add: [newRow],
                addIndex: 0     // 맨 위에 신규 행 추가
            });

            // 세부모델명 입력 모드 진입 (입력 커서 이동)
            this.$nextTick(() => {
                this.detailGridApi.startEditingCell({
                    rowIndex: 0,
                    colKey: 'detailName'
                });
            });
        },

        // 등급 그리드 행 추가 이벤트
        addTrimRow() {
            if (!this.selectedDetailId) {
                alert('세부모델을 먼저 선택하세요.');
                return;
            }

            // 항목 초기화
            this.selectedTrimId = null;
            this.selectedTrimName = null;

            const newRow = {
                tempId: `tmp_${Date.now()}_${Math.random()}`,   // 신규 행 임시 아이디 (프론트용)
                trimId: null,
                trimName: '',
                engine: '',
                fuel: '',
                transmission: '',
                makerId: this.selectedMakerId,
                modelId: this.selectedModelId,
                detailId: this.selectedDetailId,
                // 행 플래그
                _isNew: true,
                _isEdit: false,
                _isDel: false
            };

            this.trimList.unshift(newRow);  // 뷰 상태 반영

            this.trimGridApi.applyTransaction({
                add: [newRow],
                addIndex: 0     // 맨 위에 신규 행 추가
            });

            // 등급명 입력 모드 진입 (입력 커서 이동)
            this.$nextTick(() => {
                this.trimGridApi.startEditingCell({
                    rowIndex: 0,
                    colKey: 'trimName'
                });
            });
        },

        // 삭제 체크박스 이벤트 (삭제 CSS 적용)
        onSelectionChanged(event) {
            if (this.isReset) return;

            const api = event.api;
            let hasChanged = false;

            api.forEachNode(node => {
                if (node.data._isNew) return;

                const isSelected = node.isSelected();

                if (node.data._isDel !== isSelected) {
                    node.data._isDel = isSelected;
                    hasChanged = true;
                }
            });

            // 그리드별 삭제 체크박스 선택 개수
            const count = event.api.getSelectedNodes().length;
            if (event.api === this.makerGridApi) this.makerSelectedCount = count;
            if (event.api === this.modelGridApi) this.modelSelectedCount = count;
            if (event.api === this.detailGridApi) this.detailSelectedCount = count;
            if (event.api === this.trimGridApi) this.trimSelectedCount = count;

            // 변경여부 플래그 적용
            if (!hasChanged) return;

            // 상위 그리드 삭제 선택 시 하위 그리드 초기화
            if (api === this.makerGridApi) this.clearBelow('maker');
            if (api === this.modelGridApi) this.clearBelow('model');
            if (api === this.detailGridApi) this.clearBelow('detail');

            api.redrawRows();
        },

        // [삭제] 버튼 클릭 -> 신규 추가 행 삭제 / 데이터 삭제
        async onDelete(type) {
            const map = {
                maker: {
                    api: this.makerGridApi,
                    list: this.makerList,
                    deleteApi: vhclApi.deleteMaker,
                    idKey: 'makerId',
                    clearBelow: () => this.clearBelow('maker')
                },
                model: {
                    api: this.modelGridApi,
                    list: this.modelList,
                    deleteApi: vhclApi.deleteModel,
                    idKey: 'modelId',
                    clearBelow: () => this.clearBelow('model')
                },
                detail: {
                    api: this.detailGridApi,
                    list: this.modelDetailList,
                    deleteApi: vhclApi.deleteDetail,
                    idKey: 'detailId',
                    clearBelow: () => this.clearBelow('detail')
                },
                trim: {
                    api: this.trimGridApi,
                    list: this.trimList,
                    deleteApi: vhclApi.deleteTrim,
                    idKey: 'trimId',
                    clearBelow: () => this.clearBelow('trim')
                }
            };

            const target = map[type];
            if (!target?.api) return;

            const selectedNodes = target.api.getSelectedNodes();
            if (!selectedNodes.length) {
                alert('삭제할 항목을 선택하세요.');
                return;
            }

            // 신규 추가 / 기존 데이터 분리
            const newRows = [];
            const dbRows = [];

            selectedNodes.forEach(node => {
                if (node.data._isNew) newRows.push(node.data);
                else dbRows.push(node.data);
            });

            if ((newRows.length || dbRows.length) && !confirm('선택한 항목을 삭제하시겠습니까?\n하위 데이터도 함께 삭제되며, 삭제된 데이터는 복구할 수 없습니다.')) {
                return;
            }

            try {
                // 기존 데이터 DB 삭제
                if (dbRows.length) {
                    const ids = dbRows.map(r => r[target.idKey]);
                    await target.deleteApi(ids);
                }

                // 화면에서 제거 (신규 + 기존)
                const removeRows = [...newRows, ...dbRows];

                target.api.applyTransaction({ remove: removeRows });
                target.list.splice(
                    0,
                    target.list.length,
                    ...target.list.filter(r => !removeRows.includes(r))
                );

                target.clearBelow();

                alert('삭제가 완료되었습니다.');

            } catch (e) {
                console.error('>>> 데이터 삭제 실패', e);
                alert('삭제 중 오류가 발생했습니다.');
            }
        },

        // [저장] 버튼 클릭 -> 그리드 저장 이벤트 호출
        async onSave(type) {
            // 그리드 별 설정 사항
            const map = {
                maker: {
                    list: this.makerList,
                    gridApi: this.makerGridApi,
                    insertApi: vhclApi.insertMaker,
                    updateApi: vhclApi.updateMaker,
                    reload: async () => {
                        await this.getMakerList();
                        this.clearBelow('maker');
                    }
                },
                model: {
                    list: this.modelList,
                    gridApi: this.modelGridApi,
                    parent: {
                        key: 'makerId',
                        value: this.selectedMakerId
                    },
                    insertApi: vhclApi.insertModel,
                    updateApi: vhclApi.updateModel,
                    reload: async () => {
                        if(!this.selectedMakerId) return;
                        await this.getModelList(this.selectedMakerId);
                        this.clearBelow('model');
                    }
                },
                detail: {
                    list: this.modelDetailList,
                    gridApi: this.detailGridApi,
                    parent: {
                        key: 'modelId',
                        value: this.selectedModelId
                    },
                    insertApi: vhclApi.insertDetail,
                    updateApi: vhclApi.updateDetail,
                    reload: async () => {
                        if(!this.selectedModelId) return;
                        await this.getModelDetailList(this.selectedModelId);
                        this.clearBelow('detail');
                    }
                },
                trim: {
                    list: this.trimList,
                    gridApi: this.trimGridApi,
                    parent: {
                        key: 'detailId',
                        value: this.selectedDetailId
                    },
                    insertApi: vhclApi.insertTrim,
                    updateApi: vhclApi.updateTrim,
                    reload: async () => {
                        if(!this.selectedDetailId) return;
                        await this.getTrimList(this.selectedDetailId);
                    }
                }
            };

            const target = map[type];   // 현재 그리드의 설정 사항 가져옴 (map)
            if (!target) return;

            // 그리드 별 유효성 체크
            if (!this.validationChk(type, target)) return;

            // 신규(_isNew) / 수정(_isEdit) 분리
            const insertRows = target.list.filter(r => r._isNew);       // 신규 (insert)
            const updateRows = target.list.filter(r => r._isEdit);      // 수정 (update)

            if (!insertRows.length && !updateRows.length) {
                alert('저장할 변경 사항이 없습니다.');
                return;
            }
            
            if (!confirm("변경사항을 저장하시겠습니까?")) return;

            // 하위 그리드에 상위 그리드 id 정보 셋팅
            if (target.parent?.value) {
                this.injectParentId(insertRows, target.parent.key, target.parent.value);
                this.injectParentId(updateRows, target.parent.key, target.parent.value);
            }

            try {
                // insert
                //let inserted = [];
                if (insertRows.length) {
                    //inserted = await target.insertApi(insertRows);
                    await target.insertApi(insertRows);
                }

                // update
                if (updateRows.length) {
                    await target.updateApi(updateRows);
                }

                // 신규 저장 내용 반영, 신규 상태 해제 -> 저장 대상 제외
                // inserted.forEach(saved => {
                //     const row = target.list.find(r => r.tempId === saved.tempId);
                //     if (!row) return;
                    
                //     Object.assign(row, saved);
                //     row._isNew = false;
                //     delete row.tempId;  // 신규 저장 이후 tempId 삭제
                // });

                // 수정 상태 해제 -> 저장 대상 제외
                // updateRows.forEach(r => {
                //     r._isEdit = false;
                // });

                // 그리드 갱신 (재조회)
                await target.reload();
                // target.gridApi.refreshCells({ force: true });
                // target.gridApi.redrawRows();
                // target.gridApi.deselectAll();

                alert('저장이 완료되었습니다.');

            } catch (e) {
                console.error('>>> 데이터 저장 실패', e);
                alert('저장 중 오류가 발생했습니다.');
            }

        },

        // 유효성 체크 분기
        validationChk(type, target) {
            switch (type) {
                case 'maker':
                    return this.validateMaker(target);
                case 'model':
                    return this.validateModel(target);
                case 'detail':
                    return this.validateDetail(target);
                case 'trim':
                    return this.validateTrim(target);
                default:
                    return true;
            }
        },

        // 제조사 유효성 체크
        validateMaker(target) {
            const rows = target.list.filter(r => r._isNew || r._isEdit);

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];

                if (!row.makerName || !row.makerName.trim()) {
                    alert('제조사명은 필수입니다.');
                    this.focusCell(target, row, 'makerName');
                    return false;
                }
            }

            return true;
        },

        // 모델 유효성 체크
        validateModel(target) {
            const rows = target.list.filter(r => r._isNew || r._isEdit);

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];

                if (!row.modelName || !row.modelName.trim()) {
                    alert('모델명은 필수입니다.');
                    this.focusCell(target, row, 'modelName');
                    return false;
                }
            }

            return true;
        },

        // 세부모델 유효성 체크
        validateDetail(target) {
            const rows = target.list.filter(r => r._isNew || r._isEdit);

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];

                if (!row.detailName || !row.detailName.trim()) {
                    alert('세부모델명은 필수입니다.');
                    this.focusCell(target, row, 'detailName');
                    return false;
                }
            }

            return true;
        },

        // 등급 유효성 체크
        validateTrim(target) {
            const rows = target.list.filter(r => r._isNew || r._isEdit);

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];

                if (!row.trimName || !row.trimName.trim()) {
                    alert('등급명은 필수입니다.');
                    this.focusCell(target, row, 'trimName');
                    return false;
                }
            }

            return true;
        },

        // 셀 포커스 이동 (유효성 체크용)
        focusCell(target, row, colKey) {
            const rowIdx = target.list.indexOf(row);

            target.gridApi.ensureIndexVisible(rowIdx);
            target.gridApi.setFocusedCell(rowIdx, colKey);
            target.gridApi.startEditingCell({
                rowIdx, colKey
            });
        }, 

        // 상위 그리드 id 값 셋팅
        injectParentId(rows, parentKey, parentId) {
            rows.forEach(row => {
                row[parentKey] = parentId;
            });
        },

        // [취소] 버튼  클릭 -> 각 그리드 별 편집 내용 초기화 함수 호출
        onCancel(type) {
            const config = {
                maker: {
                    original: this.originalMakerList,
                    api: this.makerGridApi,
                    setList: list => this.makerList = list,
                    resetSelected: () => {
                        this.selectedMakerId = null;
                        this.selectedMakerName = null;
                    }
                },
                model: {
                    original: this.originalModelList,
                    api: this.modelGridApi,
                    setList: list => this.modelList = list,
                    resetSelected: () => {
                        this.selectedModelId = null;
                        this.selectedModelName = null;
                    }
                },
                detail: {
                    original: this.originalDetailList,
                    api: this.detailGridApi,
                    setList: list => this.modelDetailList = list,
                    resetSelected: () => {
                        this.selectedDetailId = null;
                        this.selectedDetailName = null;
                    }
                },
                trim: {
                    original: this.originalTrimList,
                    api: this.trimGridApi,
                    setList: list => this.trimList = list,
                    resetSelected: () => {
                        this.selectedTrimId = null;
                        this.selectedTrimName = null;
                    }
                }
            };

            const target = config[type];

            if (!target) return;
            if (!target.original || target.original.length === 0) {
                alert('변경사항이 없습니다.');
                return;
            }
            if (!confirm("변경사항이 모두 사라집니다. 계속하시겠습니까?")) return;

            this.isReset = true;

            // 조회 원본 복원
            const restored = this.applyRowState(
                JSON.parse(JSON.stringify(target.original))
            );
            
            target.setList(restored);   // 뷰 배열 교체 (그리드 데이터 교체)
            target.api.deselectAll();   // 그리드 선택 해제
            target.resetSelected();     // 선택 초기화
            this.clearBelow(type);      // 하위 항목 초기화

            // reset 모드 해제
            this.$nextTick(() => {
                this.isReset = false;
            });
        },

        // (공통) 하위 그리드 초기화
        clearBelow(level) {
            const map = {
                maker: () => {
                    this.modelList = [];
                    this.modelDetailList = [];
                    this.trimList = [];

                    this.selectedModelId = null;
                    this.selectedDetailId = null;
                    this.selectedTrimId = null;

                    this.selectedModelName = null;
                    this.selectedDetailName = null;
                    this.selectedTrimName = null;
                },

                model: () => {
                    this.modelDetailList = [];
                    this.trimList = [];

                    this.selectedDetailId = null;
                    this.selectedTrimId = null;

                    this.selectedDetailName = null;
                    this.selectedTrimName = null;
                },

                detail: () => {
                    this.trimList = [];

                    this.selectedTrimId = null;
                    this.selectedTrimName = null;
                }
            };

            map[level]?.();
        }

    },  // methods 끝
}
</script>


<style scoped>
@import '../assets/css/vhclCtgry.css';

/* 그리드 영역 */
.grid-row {
  display: grid;
  gap: 30px;
  margin-bottom: 30px;
}
.row-1st {
  grid-template-columns: 50% 50%;
}
.row-2nd {
  grid-template-columns: 50% 50%;
}
.grid-section {
  margin-bottom: 10px;
}
.grid-box {
  width: 100%;
  /* border: 1px solid #ddd; */
}
/* 그리드 행 스타일 적용 (신규, 수정, 삭제) */
/* AG Grid 기본 선택 배경색(파란색) 강제 제거 */
:deep(.ag-theme-alpine) {
    /* 행 선택 시 기본 배경을 투명하게 만듦 -> 지정한 배경색이 보이도록 */
    --ag-selected-row-background-color: transparent !important;
    /* 호버 시 연한 회색 */
    /* --ag-row-hover-color: #f5f5f5;  */
}
/* 스타일 우선순위 강화를 위해 .ag-row와 결합 */
:deep(.ag-theme-alpine .ag-row.row-new) {
    background-color: #f0f7ff !important;
    transition: all 0.3s ease;
}
:deep(.ag-theme-alpine .ag-row.row-edit) {
    background-color: #fffbe6 !important;
}
:deep(.ag-theme-alpine .ag-row.row-del) {
    background-color: #fff1f0 !important;
    color: #ff4d4f !important;
}
/* 행이 선택되었을 때 원하는 배경색 유지 */
:deep(.ag-theme-alpine .ag-row-selected:not(.row-del)) {
    background-color: #e6f7ff !important;
}

/* 그리드 제목 */
.grid-title {
  display: flex;
  justify-content: space-between; /* 제목: 왼쪽, 버튼: 오른쪽 */
  align-items: center;
  margin-bottom: 12px;
}
.title-text {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
}
.grid-title .line {
  width: 4px;
  height: 20px;
  background: #1e90ff;
  border-radius: 4px;
}
.selected-name {
  color: #1e90ff;
  font-weight: 600;
}

/* 그리드 버튼 */
.btn-area {
  display: flex;
  gap: 6px;
}
button {
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #fff;
  transition: all 0.2s;
}
.btn-add {
  padding: 8px 20px;
  background: #1e90ff;
  border-color: #1e90ff;
  color: #fff;
  cursor: pointer;
}
.btn-add:hover {
  background: #1878d8;
}
.btn-del {
  padding: 8px 20px;
  background: #ff4d4f;
  color: #fff;
  border-color: #ff4d4f;
  cursor: pointer;
}
.btn-del:hover {
  background: #dd3b3e;
}
.btn-del:disabled {
  opacity: 0.4;
  pointer-events: none;
  filter: grayscale(0.2);
}
.btn-save {
  padding: 8px 20px;
  background: #2ecc71;
  border-color: #2ecc71;
  color: #fff;
  cursor: pointer;
}
.btn-save:hover {
  background: #27ae60;
}
.btn-save:disabled {
  opacity: 0.4;
  pointer-events: none;
  filter: grayscale(0.2);
}
.btn-cancel {
  padding: 8px 20px;
  color: #2a2a2a;
  border-color: #2a2a2a;
  cursor: pointer;
}
.btn-cancel:hover {
  background: #c9c9c9;
}
.btn-cancel:disabled {
  opacity: 0.4;
  pointer-events: none;
  filter: grayscale(0.2);
}
</style>