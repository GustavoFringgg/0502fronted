import axios from 'axios'
window.axios = axios

class UploadAdapter {
  constructor (loader) {
    this.loader = loader
  }

  upload () {
    return this.loader.file.then(file => new Promise((resolve, reject) => {
      let formData = new FormData()
      formData.append('upload', file)
      axios.post(`/api/Develop/Product_Structure/UpLoad_CKEditor_Photo`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => {
          console.log('UpLoad_CKEditor_Photo response=>', response)
          if (response) {
            resolve({
              default: response.data.url
            })
          } else {
            reject(response.data.msg)
          }
        })
        .catch(function (error) {
          console.log(error)
          reject(error)
        })
    }))
  }
  abort () {
  }
}

// 加载了适配器
// editor.plugins.get('FileRepository').createUploadAdapter = (loader)=>{
//     return new UploadAdapter(loader);
// };

function MyCustomUploadAdapterPlugin (editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    // 在这里将URL配置为后端上载脚本
    return new UploadAdapter(loader)
  }
}

export { MyCustomUploadAdapterPlugin }
