import app from './app';
const port = app.config.port || 4000;

app.listen(port,()=>{  
  console.log(`Running ${app.get('name_app')} APP in PORT ::::${port}`)
})