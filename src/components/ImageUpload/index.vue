<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :limit="1"
      :class="{components : isCompleted}"
      :on-change="changeList"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress style="width:200px" :percentage="percentage " />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDMbcOvEJ9l8G8mAJDtKWS9bpnW0FF0bx4', // 身份识别 ID
  SecretKey: 'uYx72iBOM6dvzoQmumPnxrWw61hANK1S' // 身份密钥
})
export default {

  name: 'ImageUpload',
  data() {
    return {
      percentage: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [
        {
          url: 'https://img2.baidu.com/it/u=3759520685,3619761528&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500'
        }
      ]
    }
  },
  computed: {
    isCompleted() {
      return this.fileList.length === 1
    }
  },
  methods: {
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      // this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    changeList(file, fileList) {
      console.log(this.fileList)
      this.fileList = fileList
    },
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('文件类型不匹配')
        return false
      }
      const maxSize = 100 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('文件太大了')
        return false
      }
    },
    upload({ file }) {
      if (!file) return
      cos.putObject({
        Bucket: 'wodetou-1313213522', // 存储桶
        Region: 'ap-nanjing', // 地域
        Key: file.name, // 文件名
        Body: file, // 要上传的文件对象
        StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
        onProgress: ({ percent }) => {
          this.percentage = percent * 100
        }
        // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
      }, (err, data) => {
        // data返回数据之后 应该如何处理
        console.log(err)
        console.log(data)
        if (err) {
          return this.$message.error(err?.message || '上传失败')
        }
        this.fileList.forEach(item => {
          if (item.uid === file.uid) {
            item.url = `http://${data.Location}`
            // 只有成功获取到了服务器端图片链接的时候，加一个标识
            // 目的：提交更新的时候，进行判断，如果当前文件对象里面没有upload属性，不进行提交
            item.upload = true
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.components{
  ::v-deep .el-upload--picture-card{
    display: none;
  }
}
</style>
