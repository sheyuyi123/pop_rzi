<template>
  <el-card class="tabs">
    <el-tabs>
      <el-tab-pane label="账号登入设置">
        <el-form ref="formRef" label-width="120px" :model="formData" :rules="rules" class="form">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="formData.username" style="width:40%" />
          </el-form-item>
          <el-form-item label="密码" prop="password2">
            <el-input v-model="formData.password2" style="width:40%" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="btnok">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="配置管理">
        <component :is="UserInfo" />
      </el-tab-pane>
      <el-tab-pane label="角色管理">
        <component :is="JobInfo" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { saveUserDetailById } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
import UserInfo from './user-info.vue'
import JobInfo from './job-info.vue'
export default {
  name: 'Detaie',
  components: {
    UserInfo, JobInfo
  },
  data() {
    return {
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      formData: {
        username: '',
        password2: ''
      },
      rules: {
        username: [
          {
            required: true, message: '姓名必填', trigger: 'blur'
          }
        ],
        password2: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { min: 6, max: 16, message: '请输入6-16位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserDetailById()
    console.log(this)
  },
  methods: {
    async getUserDetailById() {
      console.log(123)
      const res = await getUserDetailById(this.$route.params.id)
      console.log(res)
      this.formData = res
    },
    async btnok() {
      await this.$refs.formRef.validate()
      try {
        await saveUserDetailById({ ...this.formData, password: this.formData.password2 })
        this.$message.success('更新成功')
      } catch (e) {
        this.$message.success(e.message || '更新失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs{
  margin: 20px;
  .form{
    margin-top: 20px;
  }
}
</style>
