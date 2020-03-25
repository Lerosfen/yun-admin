'use strict'
//表管理分类
//0-6
const  tableType={
        'AcquisitionSource':'采集源',
        'AcquisitionTarget':'采集目标',
        'CleaningTarget':'清洗目标',
        'FusionTarget':'融合目标',
        'DataqualityMonitor':'数据质量检测',
         'moduleTarget':'模型目标',
}
//模型状态
const  moduleState={
          'unSet':'未设置',
          'start':'启用',
          'close':'禁用'
}
module.exports={
  tableType,
  moduleState
}
