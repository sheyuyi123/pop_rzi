<template>
  <el-dialog title="新增员工" :visible="isshowAddEmployee" @close="close">
    <!-- 表单 -->
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
          <!-- <el-option
            v-for="item in hireType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          /> -->
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName" @focus="getDepartments">
        <!-- <el-input v-model="formData.departmentName" style="width:80%" placeholder="请选择部门" /> -->
        <el-cascader
          v-model="formData.departmentName"
          :options="options"
          style="width:80%"
          clearable
          :props="{ checkStrictly: true, label: 'name', value: 'name', emitPath: false }"
          @focus="getDepartments"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small" @click="btnok">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { transListToTree } from '@/utils/index'
import { addEmployee } from '@/api/employees'
export default {
  name: 'AddEmployee',
  props: {
    isshowAddEmployee: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hireType: [
        {
          id: 1,
          value: '正式'
        },
        {
          id: 2,
          value: '非正式'
        }
      ],
      options: [], // 定义数组接收树形数据
      formData: {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '1-4字符', trigger: 'blur' }], // 用户姓名
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '输入正确的手机号', trigger: 'blur' }], // 手机号
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'change' }], // 聘用形式
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }], // 工号
        departmentName: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }], // 部门名称
        timeOfEntry: [{ required: true, message: '入职时间不能为空', trigger: 'blur' }], // 入职时间
        correctionTime: [{ required: true, message: '转正时间不能为空', trigger: 'blur' }] // 转正时间
      }
    }
  },
  methods: {
    async btnok() {
      await this.$refs.formRef.validate()
      await addEmployee(this.formData)
      this.$message.success('新增成功')
      this.close()
      this.$parent.getEmployeeList()
    },
    close() {
      this.$emit('update:isshowAddEmployee', false)

      this.$refs.formData.resetF()
      this.formData = {
        username: '', // 用户姓名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门名称
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
    },
    async getDepartments() {
      // if (this.options.length) return // 如果当前的树形数据已经有的的情况下就不需要再获取数据
      const { depts } = await getDepartments()
      console.log(depts)
      // depts是数组 但不是树形
      this.options = transListToTree(depts, '')
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
