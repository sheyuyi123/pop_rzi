<template>
  <div>
    <el-card style="margin:20px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <el-button style="margin-bottom:20px" type="primary" icon="el-icon-plus" @click="showDialog=true">新增角色</el-button>
          <el-table
            :data="list"
            border
            style="width: 100%"
          >
            <el-table-column
              label="序号"
              width="180"
              type="index"
            />
            <el-table-column
              prop="name"
              label="角色名称"
              width="180"
            />
            <el-table-column
              prop="description"
              label="描述"
            />
            <el-table-column
              prop="address"
              label="操作"
            >
              <template v-slot="{row}">
                <el-button size="small" type="success" @click="assignperm(row.id)">分配权限</el-button>
                <el-button size="small" type="primary" @click="edit(row.id)">编辑</el-button>
                <el-button size="small" type="danger" @click="del(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" style="margin-top:20px">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :current-page="page.pagesize"
              :page-size="page.page"
              @current-change="currentPage"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
          />
          <el-form label-width="120px" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input :placeholder="formData.name" disabled style="width:25%" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input :placeholder="formData.companyAddress" disabled style="width:25%" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input :placeholder="formData.mailbox" disabled style="width:25%" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input :placeholder="formData.remarks" disabled type="textarea" style="width:25%" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="`${roleFormData.id ? '编辑角色' : '新增角色'}`" :visible="showDialog" @close="close">
      <el-form ref="roleForm" label-width="120px" :model="roleFormData" :rules="roleRules">
        <el-form-item label="角色" prop="name">
          <el-input v-model="roleFormData.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleFormData.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="btnok">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="分配权限" :visible="showPermission" @close="closePermission">
      <el-tree
        ref="RomeRef"
        :props="props"
        :data="PermissionList"
        show-checkbox
        default-expand-all
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectCheck"
      />
      <template #footer>
        <el-button size="mini" @click="closePermission">取消</el-button>
        <el-button size="mini" type="primary" @click="btnOkPermission">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
import { getPermissionList, assignPerm } from '@/api/permisson'
import { getRoleList, getCompanyInfo, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { transListToTree } from '@/utils'
export default {
  data() {
    return {
      props: {
        label: 'name'
      },
      roleId: null,
      PermissionList: [],
      showPermission: false,
      showDialog: false,
      activeName: 'second',
      list: [],
      checkedKeys: [],
      selectCheck: [],
      page: {
        page: 1,
        pagesize: 10
      },
      currentRoleId: [],
      total: 0,
      formData: {},
      roleRules: {
        name: [{
          required: true, message: '名称必填', trigger: 'blur'
        }]
      },
      roleFormData: {
        name: '',
        description: ''
      }
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async btnOkPermission() {
      const checkedKeys = this.$refs.RomeRef.getCheckedKeys()
      console.log(checkedKeys)
      await assignPerm({
        id: this.currentRoleId,
        permIds: checkedKeys
      })
      this.$message.success('分配权限成功')
      this.closePermission()
    },
    closePermission() {
      this.showPermission = false
      this.checkedKeys = []
    },
    async assignperm(id) {
      this.currentRoleId = id
      // console.log(id)
      this.PermissionList = transListToTree(await getPermissionList(), '0')

      // console.log(res)
      // this.getPermissionList = res

      const { permIds } = await getRoleDetail(id)
      this.selectCheck = permIds
      this.showPermission = true
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      console.log(rows)
      this.list = rows
      this.total = total
    },
    currentPage(newPage) {
      console.log(newPage)
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
      console.log(this.formData)
    },
    async del(id) {
      await this.$confirm('确认删除？')
      await deleteRole(id)
      const len = this.list.length
      if (len === 1 && this.page.page > 1) {
        this.page.page--
      }

      this.$message.success('删除成功')
      await this.getRoleList()
    },
    async edit(id) {
      this.showDialog = true
      this.roleFormData = await getRoleDetail(id)
      console.log(this.roleFormData)
    },
    close() {
      this.showDialog = false
      this.$refs.roleForm.resetFields()
      this.roleFormData = {
        name: '',
        description: ''
      }
    },
    async btnok() {
      await this.$refs.roleForm.validate()
      if (this.roleFormData.id) {
        await updateRole(this.roleFormData)
      } else {
        await addRole(this.roleFormData)
      }
      this.$message.success('成功')
      this.getRoleList()
      this.close()
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
