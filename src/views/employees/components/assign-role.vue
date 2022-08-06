<template>
  <el-dialog :visible="showDialog" title="编辑" @close="close">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
      <!-- <el-checkbox label="复选框 B" />
      <el-checkbox label="复选框 C" />
      <el-checkbox label="禁用" disabled />
      <el-checkbox label="选中且禁用" disabled /> -->
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
      <el-button size="mini" @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'AssignRole',
  props: {
    showDialog: {
      type: Boolean,
      // required: true
      default: false
    },
    correntId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      roleIds: [],
      list: []
    }
  },
  created() {
    this.getRoleList()
    // this.getUserDetailById()
  },
  methods: {
    close() {
      this.$emit('update:showDialog', false)
    },
    async getRoleList() {
      const { rows } = await getRoleList()
      // console.log(res)
      this.list = rows
    },
    async getUserDetailById(id) {
      console.log(id)
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
      // this.roleIds = roleIds // 赋值本用户的角色
    },
    async btnOK() {
      try {
        await assignRoles({
          id: this.correntId,
          roleIds: this.roleIds
        })
        this.$message.success('更新成功')
        this.close()
      } catch (e) {
        this.$message.error('更新失败')
        this.close()
      }
      // 关闭窗体
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
