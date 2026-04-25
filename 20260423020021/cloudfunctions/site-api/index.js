const cloud = require('tcb-admin-node');

cloud.init({
  env: process.env.TCB_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  // 支持 HTTP 和云函数调用
  const isHttp = !!event.httpMethod;
  
  // 从路径和查询参数获取数据
  const path = isHttp ? event.path : '/';
  const method = isHttp ? event.httpMethod.toUpperCase() : (event.action ? 'POST' : 'GET');
  
  // 解析请求体
  let body;
  if (isHttp) {
    if (typeof event.body === 'string') {
      try {
        body = event.body ? JSON.parse(event.body) : {};
      } catch (e) {
        body = {};
      }
    } else {
      body = event.body || {};
    }
  } else {
    body = event;
  }
  
  const query = isHttp ? event.queryStringParameters : {};
  
  // CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400'
  };
  
  // 处理 OPTIONS 请求
  if (isHttp && method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }
  
  try {
    let result;
    
    // 处理 POST 请求的各种 action
    if (method === 'POST' || !isHttp) {
      const { action, key, value } = body;
      
      if (action === 'get' || action === 'getByKey') {
        // 获取数据
        if (action === 'get' || !key) {
          // 获取所有数据
          const res = await db.collection('site_data').get();
          const data = {};
          res.data.forEach(item => {
            data[item.key] = item.value;
          });
          result = { success: true, data, count: res.data.length };
        } else {
          // 根据key获取单条数据
          const res = await db.collection('site_data').where({ key }).get();
          if (res.data.length > 0) {
            result = { success: true, data: res.data[0].value };
          } else {
            result = { success: true, data: null };
          }
        }
        
      } else if (action === 'set' || (isHttp && method === 'POST' && path === '/')) {
        // 更新或插入数据
        const dataKey = key || (body.data ? Object.keys(body.data)[0] : null);
        const dataValue = value || (body.data ? Object.values(body.data)[0] : null);
        
        if (dataKey) {
          const existing = await db.collection('site_data').where({ key: dataKey }).get();
          if (existing.data.length > 0) {
            await db.collection('site_data').doc(existing.data[0]._id).update({
              value: dataValue,
              updatedAt: db.serverDate()
            });
          } else {
            await db.collection('site_data').add({
              data: { key: dataKey, value: dataValue, updatedAt: db.serverDate() }
            });
          }
        }
        result = { success: true };
        
      } else if (action === 'batchSet') {
        // 批量更新
        for (const [k, v] of Object.entries(value)) {
          const exist = await db.collection('site_data').where({ key: k }).get();
          if (exist.data.length > 0) {
            await db.collection('site_data').doc(exist.data[0]._id).update({
              value: v,
              updatedAt: db.serverDate()
            });
          } else {
            await db.collection('site_data').add({
              data: { key: k, value: v, updatedAt: db.serverDate() }
            });
          }
        }
        result = { success: true };

      } else if (action === 'setChunked') {
        // 分批保存开始 - 存储第一个块
        const { totalChunks, chunkIndex, chunkData, isLast } = body;
        const chunkKey = `_chunk_${dataKey}`;
        
        // 存储 chunks 元信息
        await db.collection('site_data').where({ key: chunkKey }).get().then(async (exist) => {
          if (exist.data.length > 0) {
            await db.collection('site_data').doc(exist.data[0]._id).remove();
          }
          await db.collection('site_data').add({
            data: { 
              key: chunkKey, 
              value: { chunks: [chunkData], totalChunks, received: 1 }, 
              updatedAt: db.serverDate() 
            }
          });
        });
        
        if (isLast) {
          // 只有一块，直接保存
          const fullData = chunkData;
          const existing = await db.collection('site_data').where({ key: dataKey }).get();
          if (existing.data.length > 0) {
            await db.collection('site_data').doc(existing.data[0]._id).update({
              value: JSON.parse(fullData),
              updatedAt: db.serverDate()
            });
          } else {
            await db.collection('site_data').add({
              data: { key: dataKey, value: JSON.parse(fullData), updatedAt: db.serverDate() }
            });
          }
          // 清理 chunks
          await db.collection('site_data').where({ key: chunkKey }).get().then(async (c) => {
            if (c.data.length > 0) {
              await db.collection('site_data').doc(c.data[0]._id).remove();
            }
          });
        }
        result = { success: true, chunkReceived: chunkIndex + 1 };

      } else if (action === 'appendChunk') {
        // 分批保存继续 - 追加块
        const { chunkIndex, chunkData, isLast } = body;
        const chunkKey = `_chunk_${dataKey}`;
        
        const exist = await db.collection('site_data').where({ key: chunkKey }).get();
        if (exist.data.length > 0) {
          const chunkInfo = exist.data[0].value;
          chunkInfo.chunks[chunkIndex] = chunkData;
          chunkInfo.received = chunkIndex + 1;
          
          await db.collection('site_data').doc(exist.data[0]._id).update({
            value: chunkInfo,
            updatedAt: db.serverDate()
          });
          
          if (isLast) {
            // 所有块接收完成，合并保存
            const fullData = chunkInfo.chunks.join('');
            const existing = await db.collection('site_data').where({ key: dataKey }).get();
            if (existing.data.length > 0) {
              await db.collection('site_data').doc(existing.data[0]._id).update({
                value: JSON.parse(fullData),
                updatedAt: db.serverDate()
              });
            } else {
              await db.collection('site_data').add({
                data: { key: dataKey, value: JSON.parse(fullData), updatedAt: db.serverDate() }
              });
            }
            // 清理 chunks
            await db.collection('site_data').doc(exist.data[0]._id).remove();
          }
        }
        result = { success: true, chunkReceived: chunkIndex + 1 };
        
      } else {
        result = { success: false, error: 'Unknown action' };
      }
      
    } else {
      result = { success: false, error: 'Method not allowed' };
    }
    
    if (isHttp) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      };
    }
    return result;
    
  } catch (error) {
    const result = { success: false, error: error.message };
    if (isHttp) {
      return {
        statusCode: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      };
    }
    return result;
  }
};
