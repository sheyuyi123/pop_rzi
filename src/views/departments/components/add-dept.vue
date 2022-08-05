<template>
  <el-dialog :visible="isShowAddDept" :title="showTitle" @close="close">
    <el-form ref="form" :model="fomrData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="fomrData.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="fomrData.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="fomrData.manager" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="fomrData.introduce" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" @click="close">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'AddDept',
  props: {
    isShowAddDept: {
      type: [Boolean],
      required: true
    },
    currentNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkName = async(rules, value) => {
      // 需求是什么
      // 当前输入的name值 是否跟同级的节点有重复的 （pid===this.currentName.id）
      const { depts } = await getDepartments()
      // console.log(depts)
      let currentChildren = null
      if (this.fomrData.id) {
        currentChildren = depts.filter(item => item.pid === this.currentNode.pid && item.id !== this.currentNode.id)
      } else {
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.id
        })
      }

      const isRepeat = currentChildren.some(item => item.name === value)
      if (isRepeat) {
        return Promise.reject('部门名称重复了')
      }
    }
    const checkCode = async(rule, value) => {
      const { depts } = await getDepartments()
      let ischeckCode
      if (this.fomrData.id) {
        ischeckCode = depts.filter(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        ischeckCode = depts.some(item => item.code === value)
      }
      if (ischeckCode) {
        return Promise.reject('部门名称重复了')
      }
    }
    return {
      options: [],
      fomrData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '1-50字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkName }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '1-50字符', trigger: 'blur' },
          { trigger: 'blur', validator: checkCode }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '1-300字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    showTitle() {
      return this.fomrData.id ? '编辑部门' : '新增部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.options = await getEmployeeSimple()
      console.log(this.options)
    },
    async getDepartDetail(id) {
      this.fomrData = await getDepartDetail(id)
    },
    // 点击确定时触发
    async submit() {
      await this.$refs.form.validate()
      if (this.fomrData.id) {
        await updateDepartments(this.fomrData)
      } else {
        await addDepartments({
        // 调用新增接口 添加父部门的id
          ...this.fomrData, pid: this.currentNode.id
        })
      }
      this.$message.success(`${this.showTitle}`)
      this.$emit('getDepartments')
      this.close()
    },
    close() {
      // 表单数据需要重置
      // this.$refs.form.resetFields()
      this.fomrData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 通过.sync
      this.$emit('update:isShowAddDept', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
