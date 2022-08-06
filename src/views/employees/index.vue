<template>
  <div class="dashboard-container">
    <div class="app-container">
      <ToolBar>
        <template #before>
          <span>50条数据</span>
        </template>
        <template #after>
          <el-button size="mini" type="primary" @click="$router.push('/import')">导入</el-button>
          <el-button size="mini" type="danger" @click="exporToExcel">导出</el-button>
          <el-button size="mini" type="warning" @click="isshowAddEmployee=true">新增员工</el-button>
        </template>
      </ToolBar>
      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像">
            <template slot-scope="{ row }">
              <el-avatar style="border-radius: 50%; width: 100px; height: 100px; padding: 10px" :src="row.staffPhoto" @click.native="showQrCode(row.staffPhoto)">
                <img
                  alt=""
                >
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column :formatter="formatter" prop="formOfEmployment" label="聘用形式" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column label="入职时间" sortable="" align="center">
            <!-- 作用域插槽 -->
            <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="Dialog(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="submit(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination :current-page="page.page" :total="total" :page-size="page.size" layout="prev, pager, next" @current-change="changeCurrent" />
        </el-row>
      </el-card>
    </div>
    <AddEmployee v-if="isshowAddEmployee" :isshow-add-employee.sync="isshowAddEmployee" />
    <el-dialog title="二维码" :visible.sync="showAvatar">
      <el-row type="flex" justify="center">
        <canvas ref="canvas" />
      </el-row>
    </el-dialog>
    <AssignRole ref="roleRef" :show-dialog.sync="showDialog" :corrent-id="correntId" />
  </div>
</template>

<script>
import { formatDate } from '@/filters'
import { getEmployeeList, delEmployee } from '@/api/employees'
import ToolBar from '@/components/ToolBar/index.vue'
import QrCode from 'qrcode'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
export default {
  components: { ToolBar, AddEmployee, AssignRole },
  data() {
    return {
      showDialog: false,
      showAvatar: false,
      isshowAddEmployee: false,
      correntId: '',
      list: [],
      page: {
        page: 1,
        size: 10
      },
      total: 0
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 当前角色
    async Dialog(id) {
      await this.$refs.roleRef.getUserDetailById(id)
      // console.log(this.$refs.roleRef.getRoleDetail(id))
      this.correntId = id
      this.showDialog = true
    },
    showQrCode(url) {
      console.log(url)
      // 预览头像的弹层展示出来
      this.showAvatar = true
      // 数据更新之后不能立即渲染
      // 如果要在数据更新后获取更新后的最新的dom元素
      // 需要使用$nextTick
      // qrCode.toCanvas(this.$refs.canvas, url)
      this.$nextTick(() => {
        QrCode.toCanvas(this.$refs.canvas, url)
      })
    },
    async exporToExcel() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const { export_json_to_excel } = await import(
        /* webpackChunkName:'Export2Excel' */
        '@/utils/Export2Excel')
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      const resData = this.fromJson(headers, rows)
      // const tHeader = ['Id', '标题', '作者', '阅读', '时间']
      export_json_to_excel({
        header: Object.keys(headers), // 表头 必填
        data: resData, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填
      })
    },
    fromJson(headers, rows) {
      // rows的结构 ->
      // rows: [{username: '234234', mobile: '1398888888', 'workNumber': 123123}, ....]
      // headers的结构 ['姓名', '手机号', '入职日期', ....] -> 配置项里面生效的数据结构
      // rows的预期结果 -> result数组的每一项要和和headers一一对应
      // result -> [['张三', '138888888', '2020-10-01', ...], ['张三', '138888888', '2020-10-01', ...]]
      const result = rows.map(item => {
        // item 为对象 ->
        // 替换成数组即可 ->
        // 数组的结构要和headers对应起来 ->
        return Object.keys(headers).map(key => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return EmployeeEnum.hireType.find(child => +child.id === +item[headers[key]])?.value || '未知'
          }
          // 1. 数据里面的key是中文还是英文？ -> 英文
          // 2. headers里面取到中文key对应的英文key
          // 3. 直接去数据对象里面取数据
          return item[headers[key]]
        })
      })
      return result
    },
    async getEmployeeList() {
      const { total, rows } = await getEmployeeList(this.page)
      this.list = rows
      this.total = total
      // console.log(rows)
    },
    changeCurrent(newpage) {
      this.page.page = newpage
      this.getEmployeeList()
    },
    formatter(row, column, cellvalue) {
      const typeck = EmployeeEnum.hireType.find(item => item.name === cellvalue)?.value
      return typeck
    },
    async submit(id) {
      try {
        await this.$confirm('您确定删除该员工吗')
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (e) {
        console.log(e)
      }
    }

  }
}
</script>

<style>

</style>
