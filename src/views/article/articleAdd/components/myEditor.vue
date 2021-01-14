<template>
  <div class="edit_container">
    <el-upload v-show="false" class="avatar-uploader" :action="serverUrl" name="file" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload" />
    <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption" @change="onEditorChange($event)" />
  </div>
</template>

<script>
export default {
  props: {
    editorContent: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      quillUpdateImg: false,
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: this.$toolbarOptions,
            handlers: {
              image: function (value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      },
      serverUrl: 'https://jsonplaceholder.typicode.com/posts/'
      // serverUrl:
      //   this.$http.defaults.baseURL + '/activity/savePicture', // 这里写你要上传的图片服务器地址,需要和后台商量传输格式
      // header: {
      //   // 服务器要求请求头写在这里
      // }
    }
  },
  computed: {
    content: {
      set (val) {
        this.$emit('update:editor-content', val)
      },
      get () {
        return this.editorContent
      }
    }
  },
  mounted () {
    // 初始化编辑器文字提示
    // eslint-disable-next-line no-lone-blocks
    {
      document.getElementsByClassName('ql-editor')[0].dataset.placeholder = ''
      for (const item of this.$titleConfig) {
        const tip = document.querySelector('.quill-editor ' + item.Choice)
        if (!tip) continue
        tip.setAttribute('title', item.title)
      }
    }
  },
  methods: {
    onEditorChange ({ editor, html, text }) {
      // 内容改变事件
      console.log('---内容改变事件---')
      this.content = html
      console.log(html)
    },
    // 富文本图片上传前
    beforeUpload () {
      // 显示loading动画
      this.quillUpdateImg = true
    },

    uploadSuccess (res, file, fileList) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      console.log(fileList)
      console.log(res)
      const quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res.resultCode === '0000') {
        const length = quill.getSelection().index
        // 插入图片  res.url为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.result.path)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },
    // 富文本图片上传失败
    uploadError () {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败')
    },
    saveHtml: function (event) {
      alert(this.content)
    }
  }
}
</script>

<style scoped>
.edit_container >>> .ql-toolbar.ql-snow + .ql-container.ql-snow {
  height: 450px;
  background-color: #fff;
}
</style>
