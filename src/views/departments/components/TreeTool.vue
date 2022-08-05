<template>
  <el-row style="width: 100%" type="flex" justify="space-between">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="clickItem">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉菜单 -->
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeTool',
  props: {
    treeData: {
      type: Object,
      default() { return {} }
    },
    isRoot: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    async clickItem(type) {
      if (type === 'add') {
        this.$emit('isAddDept', this.treeData)
        // console.log('添加')
        // 添加逻辑
      } else if (type === 'edit') {
        this.$emit('isEditDept', this.treeData)
        // console.log('编辑')
        // 编辑逻辑
      } else {
        console.log(123)
        await this.$confirm('确认要删除该部门')
        // console.log('点击了确认')
        await delDepartments(this.treeData.id)

        this.$message.success('删除成功')
        this.$emit('getDepartments')
      }
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
