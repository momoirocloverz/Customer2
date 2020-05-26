<template>
    <div>
        <el-button class="myplain-btn1" style="margin: 30px 14px 18px 14px" @click="addNew">新增参数</el-button>
        <el-table class="table-outline" :data="tableDataPlat">
            <el-table-column prop="paramName" :show-overflow-tooltip="true" label="参数" align="center" min-width="180">
            </el-table-column>
            <el-table-column prop="paramValue" :show-overflow-tooltip="true" label="参数值" align="center" min-width="180">
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click="deleteItem(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-container">
            <el-pagination class="pagebox" @current-change="changePagePlat" :current-page="currentPagePlat" :page-count="pageCountPlat" background layout="prev, pager, next">
            </el-pagination>
        </div>
        <el-dialog title="" :visible.sync="confirmDia" width="500px" center>
            <div class="dialog-head">
                <span>新增参数</span>
            </div>
            <div class="bodyDiv">
                <el-form ref="formManger" :model="addForm" label-width="80px" label-position="left" :rules="managerFormrules">
                    <el-form-item label="参数：" style="margin-top:30px" prop="name">
                        <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="addForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="参数值：" prop="value">
                        <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="addForm.value"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button round size="medium" type="primary" @click="save">确 认</el-button>
                <el-button round size="medium" @click="confirmDia = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="" :visible.sync="delDia" width="400px" center>
            <div class="dialog-head">
                <span>确认删除吗？</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button round size="medium" type="primary" @click="deleteOk">确 认</el-button>
                <el-button round size="medium" @click="delDia = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "RoleList",
    data() {
        return {
            form: {
                name: ""
            },
            confirmDia: false,
            delDia: false,
            tableDataPlat: [],
            currentPagePlat: 1,
            pageCountPlat: 1,
            total: 0,
            addForm: {
                name: "",
                value: ""
            },
            managerFormrules: {
                name: [
                    {
                        required: true,
                        message: "参数不能为空",
                        trigger: "blur"
                    }
                ],
                value: [
                    {
                        required: true,
                        message: "参数值不能为空",
                        trigger: "blur"
                    }
                ]
            },
            id: "",
            isEdit: false
        };
    },
    methods: {
        getList() {
            const params = {
                pageNum: this.currentPagePlat,
                pageSize: 20
            };
            this.$api
                .ParamsList(params)
                .then(response => {
                    // console.log(response)
                    this.tableDataPlat = response.data.list;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        changePagePlat(val) {
            this.currentPagePlat = val;
            this.getList();
        },
        addNew() {
            this.confirmDia = true;
            this.isEdit = false;
        },
        save() {
            this.$refs.formManger.validate(valid => {
                if (valid) {
                    if (!this.isEdit) {
                        const params = {
                            paramName: this.addForm.name,
                            paramValue: this.addForm.value
                        };
                        this.$api
                            .AddParams(params)
                            .then(response => {
                                if (response.data.respCode == 0) {
                                    this.$message.success("新增成功");
                                    this.getList();
                                    this.confirmDia = false;
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    } else {
                        const params = {
                            id: this.id,
                            paramName: this.addForm.name,
                            paramValue: this.addForm.value
                        };
                        this.$api
                            .EditParams(params)
                            .then(response => {
                                if (response.data.respCode == 0) {
                                    this.$message.success("编辑成功");
                                    this.getList();
                                    this.confirmDia = false;
                                }
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        deleteItem(row) {
            this.id = row.id;
            this.delDia = true;
        },
        deleteOk() {
            const params = {
                id: this.id
            };
            this.$api
                .DeleteParams(params)
                .then(response => {
                    this.$message.success("删除成功");
                    this.getList();
                    this.delDia = false;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        edit(row) {
            this.confirmDia = true;
            this.isEdit = true;
            this.id = row.id;
            this.addForm.name = row.paramName;
            this.addForm.value = row.paramValue;
        }
    },
    mounted() {
        this.getList();
    },
    watch: {
        confirmDia: function(val, old) {
            if (val == false) {
                this.addForm.name = "";
                this.addForm.value = "";
                this.$refs["formManger"].resetFields();
            }
        }
    }
};
</script>
<style scoped>
.myplain-btn1 {
    padding: 10px 12px;
    color: #e84518;
    width: 150px;
    height: 32px;
    background-color: #ffffff;
    border: solid 1px #e84518;
    border-radius: 0;
    font-size: 12px !important;
}
.bodyDiv {
    padding: 20px 26px 0;
}
</style>
