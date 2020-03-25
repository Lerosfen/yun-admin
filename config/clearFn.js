'use strict'
/*
* tableDat-->table数据，Array
* multAll-->记忆数组，Array
*select-->选中数组，Array
* idkey-->唯一标识，string
* tableList-->目标展示tableList,Array
* */
// 记忆选择核心方法
let record=(self,tableDat,multAll,select,idkey,tableList)=>
  {
      // 标识当前行的唯一键的名称
    let idKey = idkey;
    let that = self;
    // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
    if (multAll.length <= 0) {
      multAll = select;
      tableList = multAll;
      console.log(multAll, tableList, '为空')
      return  tableList;
    }
    // 总选择里面的key集合
    let selectAllIds = [];
    multAll.forEach(row => {
      selectAllIds.push(row[idKey]);
      console.log("jinlaile")
    });
    let selectIds = [];
    // 获取当前页选中的id
    select.forEach(row => {
      selectIds.push(row[idKey]);
      // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
      if (selectAllIds.indexOf(row[idKey]) < 0) {
        multAll.push(row);
      }
    });
    let noSelectIds = [];
    // 得到当前页没有选中的id
    tableData.forEach(row => {
      if (selectIds.indexOf(row[idKey]) < 0) {
        noSelectIds.push(row[idKey]);
      }
    });
    noSelectIds.forEach(id => {
      if (selectAllIds.indexOf(id) >= 0) {
        for (let i = 0; i < multAll.length; i++) {
          if (multAll[i][idKey] == id) {
            // 如果总选择中有未被选中的，那么就删除这条
            multAll.splice(i, 1);
            break;
          }
        }
      }
    });
  }
    // 设置选中的方法
let selected=(self,tableData,multAll,select,idkey,tableList,tableName)=>
    {
      console.log(multAll,'加载时查看')
      if (!multAll || multAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey =idkey;
      let selectAllIds = [];
      multAll.forEach(row => {
        selectAllIds.push(row[idKey]);
        console.log('jg')
      });
     tableName.clearSelection();
     console.log(tableName,'lll')
      self.$nextTick(function() {
        for (var i = 0; i < tableData.length; i++) {
          if (selectAllIds.indexOf(tableData[i][idKey]) >= 0) {
            console.log('jg1',tableData[i][idKey])
            tableName.toggleRowSelection(tableData[i]);
          }
        }
      })
    }
module.exports={
  record,
  selected}
