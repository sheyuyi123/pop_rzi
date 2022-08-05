<template>
  <div :v-loading="loading" class="dashboard-container">
    <el-card class="tree-card">
      <!-- 用了一个行列布局 -->
      <tree-tool :is-root="true" :tree-data="company" @isAddDept="isAddDept" />
    </el-card>
    <el-tree default-expand-all :data="departs" :props="defaultProps">
      <template v-slot="{data}">
        <tree-tool :is-root="false" :tree-data="data" @isEditDept="isEditDept" @getDepartments="getDepartments" @isAddDept="isAddDept" />
      </template>
    </el-tree>
    <div>
      <AddDept ref="addDept" :is-show-add-dept.sync="isShowAddDept" :current-node="currentNode" @getDepartments="getDepartments" />
    </div>
  </div>
</template>

<script>
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments'
import { transListToTreeNew } from '@/utils/index'
import TreeTool from './components/TreeTool.vue'
export default {
  components: { TreeTool, AddDept },
  data() {
    return {
      loading: false,
      currentNode: {},
      isShowAddDept: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      departs: [
        { name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    isAddDept(node) {
      this.isShowAddDept = true
      this.currentNode = node
      // console.log('点击了')
    },
    isEditDept(node) {
      this.isShowAddDept = true
      this.currentNode = node
      // console.log(node)
      // console.log(this.$refs.addDate)
      this.$refs.addDept.getDepartDetail(node.id)
    },
    async getDepartments() {
      const res = await getDepartments()
      // console.log(res)
      this.company = {
        name: res.companyName,
        manager: res.cimpanyManager || '管理员',
        id: ''
      }
      this.departs = transListToTreeNew(res.depts, '')
    }
  }
}
</script>

<style scope lang='scss'>
.dashboard-container{
width: 900px;
height: 476px;
// background-color: pink;
margin: 50px auto;
.tree-card {
  font-size:14px;
}
.el-card__body{
  background-color: #99ccff;
}
}
</style>
