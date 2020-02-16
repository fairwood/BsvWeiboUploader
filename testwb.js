var WeiboAPI = require('./WeiboAPI')


WeiboAPI.statuses.show('', (resp)=>{
    console.log(resp);
    
},(err)=>{
    console.log('err',err);
    
})

console.log('end');
