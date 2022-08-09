<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template v-slot:after>
          <button type="primary" size="small" @click="isshow('0',1)">新增权限</button>
        </template>
      </ToolBar>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="序号" type="index" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="isshow(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>
    <el-dialog :visible.sync="showDialog" :title="`${title}权限`" lang-width="140px" @close="close">
      <el-form ref="pefForm" :rules="rules" :model="formData">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:80%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:80%" />
        </el-form-item>
        <el-form-item label="权限描述" prop="description">
          <el-input v-model="formData.description" style="width:80%" />
        </el-form-item>
        <el-form-item label="是否开启">
          <el-switch
            v-model="value"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="end">
        <el-button size="small" @click="close">取消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确认</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail, updatePermission } from '@/api/permisson'
import { transListToTree } from '@/utils'
export default {
  name: 'Permission',
  data() {
    return {
      value: true,
      list: [],
      showDialog: false,
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      rules: {
        name: [{
          required: true, message: '名称必填', trigger: 'blur'
        }],
        code: [{
          required: true, message: '标识必填', trigger: 'blur'
        }],
        description: [{
          required: true, message: '描述必填', trigger: 'blur'
        }]
      }

    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async editPermission(id) {
      // 更新
      const res = await getPermissionDetail(id)
      console.log(res)
      // 赋值
      this.formData = res
      // 拉弹框
      this.showDialog = true
    },
    async delPermission(id) {
      // 提示框
      await this.$confirm('是否确认删除？')
      // 删除
      await delPermission(id)
      // 删除成功提示
      this.$message.success('删除成功')
      // 重新拉取数据
      await this.getPermissionList()
    },
    isshow(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async getPermissionList() {
      const res = await getPermissionList()
      // console.log(res)
      this.list = transListToTree(res, '0')
      // console.log(this.list)
    },
    async btnOk() {
      await this.$refs.pefForm.validate()
      try {
        if (this.formData.id) {
          // 编辑有id
          await updatePermission(this.formData)
        } else {
          // 新增无id
          await addPermission(this.formData)
        }
        // 新增权限点判断
        this.$message.success(`${this.title}权限点成功`)
        this.close()
        await this.getPermissionList()
      } catch (e) {
        console.log(e)
        this.$message.success('修改失败')
        this.close()
      }
    },
    close() {
      this.$refs.pefForm.resetFields()
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
    }
  }
}
</script>

<style>

</style>
