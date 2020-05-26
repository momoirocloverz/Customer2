<template>
    <div id="FullTimeStaff" class="clearfix" style="margin-top: 25px;">

        <div style="float:left">
            <div class="custom-tree-container" style="width:350px">
                <el-tree :props="props1" :load="loadNode1" lazy ref="dictree" @node-click="nodeClick">
                </el-tree>
            </div>
        </div>
        <div  style="float:left">
            <el-button type="primary" size="small" @click="clearDic(1)">添加字典</el-button>
            <el-button type="primary" size="small" @click="clearDic(2)">添加子字典</el-button>
            <!--<el-button type="primary"  size="small"  @click="deleteDic">删除字典</el-button>-->
            <el-button type="primary"  size="small" @click="handleUpdateDic">修改字典</el-button>
            <div style="overflow: hidden;margin-top: 30px">
                <div style="width: 80%">
                    <el-form ref="form" :model="dictionaryInfo" :rules="institutionRules" label-width="60px">
                        <el-form-item label="名称：">
                            <el-input v-model="dictionaryInfo.dicName"></el-input>
                        </el-form-item>
                        <el-form-item label="代码：">
                            <el-input v-model="dictionaryInfo.dicCode"></el-input>
                        </el-form-item>
                        <el-form-item label="值：">
                            <el-input v-model="dictionaryInfo.dicVal"></el-input>
                        </el-form-item>
                    </el-form>

                </div>
                <div style="text-align: center;width: 80%">
                    <el-button type="primary" v-if="ableToShow" @click="operateDic">保存</el-button>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
    name: "DictionaryList",
    data() {
        return {
            dictionarys: [],
            props1: {
                label: "dicName",
                isLeaf: "hasNoSon"
            },
            ableToShow: false,
            operateType: 1,
            selectedData: {},
            selectedNode: {},
            selectedPid: "",
            selectedId: "", //选中岗位id
            dictionaryInfo: {
                dicName: "",
                dicCode: "",
                dicVal: ""
            },
            data: [],
            defaultProps: {
                children: "children",
                label: "dicName"
            },
            addParentDia: false,
            addPartmentDia: false,
            modifyInsDia: false,
            modifyPartmentDia: false
        };
    },
    methods: {
        getFirstDic(callback) {
          console.log('cccc')
            let firstDic;
            const params = {
              pId:0,
            }
          this.$api
              .DictionaryListByPid(params)
              .then(response => {
                  console.log('cccc')
                  console.log(response)
                  firstDic = response.data;
                console.log(firstDic)
                  callback(firstDic);
              })
              .catch(error => {
                console.log(error);
              });
        },
        getDic(id, callback) {
            let firstDic;
          const params={
            pId:id
          }
          this.$api
              .DictionaryListByPid(params)
              .then(response => {
                firstDic = response.data;
                callback(firstDic);
              })
              .catch(error => {
                console.log(error);
              });
        },
        getDictionary(id) {
            this.$http
                .get(
                    `${
                        this.$talentURL
                    }/dictionary/getSonNodeByParentId?pId=${id}`
                )
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.dictionarys = response.data.data;
                    }
                });
        },

        loadNode1(node, resolve) {
            var firstDic;
            var Dic;
            console.log("sssss");
            console.log(node);
//            if (node == undefined) {
//              console.log('aaa')
//                this.getFirstDic(function(arr) {
//                    firstDic = arr;
//                    console.log(firstDic);
//                    return resolve(firstDic);
//                });
//            }
            if (node.level === 0) {
              console.log('bbb')

              this.getFirstDic(function(arr) {
                    firstDic = arr;
                    console.log(firstDic);
                    return resolve(firstDic);
                });
            } else {
                //        console.log(node)
                this.getDic(node.data.id, function(arr) {
                    Dic = arr;
                    return resolve(Dic);
                });
                //          const data = [{
                //            dicName: 'leaf',
                //            hasSon: true
                //          }, {
                //            dicName: 'zone'
                //          }];
                //
                //          resolve(data);
            }
        },
        handleUpdateDic() {
            (this.selectedData.dicName = this.dictionaryInfo.dicName),
                (this.selectedData.dicVal = this.dictionaryInfo.dicVal),
                (this.selectedData.dicCode = this.dictionaryInfo.dicCode),
                (this.operateType = 3);
            this.ableToShow = true;
        },
        updateDic() {
            //        const params={
            //          id:this.selectedId,
            //          dicName:this.dictionaryInfo.dicName,
            //          dicVal:this.dictionaryInfo.dicVal,
            //          dicCode:this.dictionaryInfo.dicCode,
            //          createdAt:this.selectedData.createdAt
            //        }
            (this.selectedData.dicName = this.dictionaryInfo.dicName),
                (this.selectedData.dicVal = this.dictionaryInfo.dicVal),
                (this.selectedData.dicCode = this.dictionaryInfo.dicCode),
                this.$api
                    .EditDictionary( this.selectedData)
                    .then(response => {
                      if (response.data.respCode == 0) {
                        this.$message.success("修改字典成功");
                        this.selectedId = "";
                        this.ableToShow = false;
                      }
                    })
                    .catch(error => {
                      console.log(error);
                    });
        },
        operateDic(type) {
            if (this.operateType == 1) {
                this.addDic();
            }
            if (this.operateType == 2) {
                this.addChild();
            }
            if (this.operateType == 3) {
                this.updateDic();
            }
        },
        clearDic(type) {
            console.log("1111");
            console.log(type);
            this.dictionaryInfo.dicName = "";
            this.dictionaryInfo.dicVal = "";
            this.dictionaryInfo.dicCode = "";
            this.operateType = type;
            this.ableToShow = true;
        },
        addDic() {
            const params = {
                pid: this.selectedPid,
                dicName: this.dictionaryInfo.dicName,
                dicVal: this.dictionaryInfo.dicVal,
                dicCode: this.dictionaryInfo.dicCode
            };
          this.$api
              .AddDictionary(params)
              .then(response => {
                if (response.data.respCode == 0) {
                  this.$message.success("添加字典成功");
                  this.selectedId = "";
                  params.id = response.data.data;
                  params.hasNoSon = true;
                  this.$refs.dictree.store.append(
                      params,
                      this.selectedNode.parent
                  );
                  this.selectedNode.isLeaf = true;
                }
              })
              .catch(error => {
                console.log(error);
              });
        },
        addChild() {
            const params = {
                pid: this.selectedId,
                dicName: this.dictionaryInfo.dicName,
                dicVal: this.dictionaryInfo.dicVal,
                dicCode: this.dictionaryInfo.dicCode
            };
          this.$api
              .AddDictionary(params)
              .then(response => {
                if (response.data.respCode == 0) {
                  this.$message.success("添加字典成功");
                  this.selectedId = "";
                  this.ableToShow = false;
                  params.id = response.data.data;
                  params.hasNoSon = true;
                  this.$refs.dictree.store.append(
                      params,
                      this.selectedNode
                  );
                  this.selectedNode.expanded = true;
                  this.selectedNode.isLeaf = false;
                }
              })
              .catch(error => {
                console.log(error);
              });
        },
        deleteDic() {
            this.$http
                .get(
                    `${this.$talentURL}/dictionary/delete?id=${this.selectedId}`
                )
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.$message.success("删除字典成功");
                        this.selectedId = "";
                        this.dictionaryInfo = {};
                        this.$refs.dictree.store.remove(this.selectedNode);
                    } else {
                        this.$message.error(response.data.moreInfo);
                    }
                })
                .catch(err => {
                    //          this.$message.error('添加字典成功');
                });
        },
        deepClone(source) {
            var result;
            source instanceof Array ? (result = []) : (result = {});

            for (var key in source) {
                result[key] =
                    typeof source[key] === "object"
                        ? this.deepClone(source[key])
                        : source[key];
            }
            return result;
        },

        nodeClick(data, node) {
            //        this.$refs.dictree.store.remove(node)
            //        let node1= {
            //              "createdAt": "2018-06-22 17:49:16",
            //              "dicCode": "settlementType",
            //              "dicName": "结算方式",
            //              "dicVal": "0",
            //              "hasNoSon": true,
            //              "id":100,
            //              "pid": 0,
            //              "updatedAt": "2018-06-25 16:26:33"
            //            }
            //        this.$refs.dictree.store.append(node1,node)
            //        node.expanded=true
            //        node.isLeaf=false

            console.log(node);
            this.selectedData = data;
            this.selectedNode = node;
            this.dictionaryInfo = this.deepClone(data);
            this.selectedId = data.id;
            this.selectedPid = data.pid;
            this.getId = data.id;
            this.getcustomerId = data.customerId;
            this.jobType = data.type;
        },
        getList() {
            this.$http
                .post(`${this.$talentURL}/dictionary/treelist`)
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.data = response.data.data.list;
                        // console.log(response)
                    }
                });
        },
        getCheckedKeys() {
            console.log(this.$refs.tree.getCheckedKeys());
        },
        getCheckedNodes() {
            console.log(this.$refs.tree.getCheckedNodes());
        },
        resetChecked() {
            this.$refs.tree.setCheckedKeys([]);
        },
        addParent1() {
            //添加机构
            let params = {
                name: this.institutionForm.name,
                type: 0,
                customerId: 1
                // pId:this.selectedId
            };
            this.$http
                .post(`${this.$customerURL}/position/add`, params)
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.$message.success("添加机构成功");
                        this.selectedId = "";
                    }
                })
                .catch(err => {
                    this.$message.error("添加机构失败");
                });
            this.institutionForm.name = "";
            this.addParentDia = false;
        },
        addParent2() {
            //添加部门
            let params = {
                name: this.institutionForm.name,
                type: 0,
                customerId: 1,
                pId: this.selectedId
            };
            this.$http
                .post(`${this.$customerURL}/position/add`, params)
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.$message.success("添加机构成功");
                        this.selectedId = "";
                    }
                })
                .catch(err => {
                    this.$message.error("添加机构失败");
                });
            this.institutionForm.name = "";
            this.addParentDia2 = false;
        },
        append(data) {
            this.addPartmentDia = true;
            this.parent.id = data.id;
            this.partmentForm.insName = data.name;
            this.partmentForm.leader = data.name;
        },
        addPartment() {
            //添加岗位
            let params = {
                pId: this.parent.id,
                name: this.partmentForm.partName,
                type: 1,
                customerId: 1
            };
            this.$http
                .post(`${this.$customerURL}/position/add`, params)
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.$message.success("添加部门成功");
                        this.addPartmentDia = false;
                    }
                })
                .catch(err => {
                    this.$message.error("添加部门失败");
                });
            this.partmentForm.insName = "";
            this.partmentForm.leader = "";
            this.partmentForm.partName = "";
            this.partmentForm.duty = "";
        },
        remove(node, data) {
            console.log(data);
            this.$confirm("确认删除吗?", "谨慎操作", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error"
            }).then(() => {
                console.log(data.id);
                this.$http
                    .delete(
                        `${this.$customerURL}/position/delete?id=${data.id}`
                    )
                    .then(response => {
                        if (response.data.errorCode === 10000) {
                            this.$message.success("删除成功");
                        }
                    })
                    .catch(err => {
                        this.$message.error("删除失败");
                    });
            });
        },
        modify(data) {
            console.log(data);
            if (data.pId == 0) {
                this.modifyInsDia = true;
                this.modifyId = data.id;
            } else {
                this.modifyPartmentDia = true;
                this.modifyId = data.id;
                this.modiPartmentForm.insName = data.superiorLeaderName;
                this.modiPartmentForm.leader = data.superiorLeaderName;
            }
        },
        modifyIns() {
            let params = {
                name: this.modiInsForm.insName,
                id: this.modifyId
            };
            this.$http
                .post(`${this.$customerURL}/position/update`, params)
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.$message.success("修改成功");
                        this.modifyInsDia = false;
                    }
                })
                .catch(err => {
                    this.$message.error("修改失败");
                });
            this.modiInsForm.insName = "";
        },
        modifyPartment() {
            let params = {
                name: this.modiPartmentForm.partName,
                id: this.modifyId
            };
            this.$http
                .post(`${this.$customerURL}/position/update`, params)
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.$message.success("修改成功");
                        this.modifyPartmentDia = false;
                    }
                })
                .catch(err => {
                    this.$message.error("修改失败");
                });
            this.modiPartmentForm.partName = "";
        },
        getAllWorker() {
            let params = {
                // customerId：
                pageNum: 1,
                pageSize: 20,
                queryInWorkEmp: true
            };
            this.$http
                .post(`${this.$talentURL}/customertalent/list`, params)
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.allWorker = response.data.data.list;
                        // console.log(response)
                    }
                });
        },
        getWorker() {
            this.$http
                .get(
                    `${
                        this.$customerURL
                    }/position/talent/list?pageNum=1&pageSize=10&customerId=${
                        this.getcustomerId
                    }&positionId=${this.getId}`
                )
                .then(response => {
                    if (response.data.errorCode === 10000) {
                        this.worker = response.data.data.list;
                        // console.log(response)
                    }
                });
        },

        addWorker() {
            //添加岗位员工
            if (this.jobType == 1) {
                if (this.getId != "") {
                    let params = {
                        // customerId:this.setWorkcustomerId[0],
                        talentId: this.setWorktalentId[0],
                        positionId: this.getId,
                        customerId: this.getcustomerId
                    };
                    this.$http
                        .post(
                            `${this.$customerURL}/position/talent/add`,
                            params
                        )
                        .then(response => {
                            if (response.data.errorCode === 10000) {
                                this.$message.success("添加成功");
                                this.getWorker();
                            }
                        })
                        .catch(err => {
                            this.$message.error("添加失败");
                        });
                } else {
                    this.$message.error("请先选择岗位");
                }
            } else {
                this.$message.error("请在岗位下添加员工");
            }
        },
        deleteWorker(i, row) {
            console.log(row);
            this.$confirm("确认删除吗?", "谨慎操作", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "error"
            }).then(() => {
                // console.log(data.id)
                this.$http
                    .delete(
                        `${this.$customerURL}/position/talent/delete?id=${
                            row.id
                        }`
                    )
                    .then(response => {
                        if (response.data.errorCode === 10000) {
                            this.$message.success("删除成功");
                            this.getWorker();
                        }
                    })
                    .catch(err => {
                        this.$message.error("删除失败");
                    });
            });
        },
        selectLeft(val) {
            for (let i in val) {
                this.deleteId.push(val[i].id);
            }
            console.log(this.deleteId);
        },
        selectRight(val) {
            for (let i in val) {
                this.setWorktalentId.push(val[i].talentId);
                this.setWorkcustomerId.push(val[i].customerId);
            }
            // console.log(this.setWorktalentId)
            console.log(val);
        }
    },
    mounted() {
    }
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
    font-size: 18px;
}
html,
body {
    width: 100%;
}
.body-left {
    // height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    position: relative;
    top: 0;
    left: -20px;
    width: 25%;
}
.body-right {
    border-left: solid 1px #dcdcdc;
    background: #fff;
    position: absolute;
    right: 0px;
    top: 48px;
    bottom: 0px;
    left: 25%;
    // overflow-y: scroll;
    padding: 10px;
    // height:100%
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>
