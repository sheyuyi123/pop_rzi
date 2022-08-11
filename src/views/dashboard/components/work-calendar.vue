<template>
  <div>
    <el-row type="flex" justify="end">
      <el-select v-model="currentYear" size="mini">
        <el-option v-for="item in yearList" :key="item" :label="`${item}年`" :value="item" />
      </el-select>
      <el-select v-model="currendMonth" size="mini" style="margin-left:20px;">
        <el-option v-for="i in 12" :key="i" :label="`${i}月`" :value="i" />
      </el-select>
    </el-row>
    <el-calendar v-model="value">
      <template
        slot="dateCell"
        slot-scope="{data:{day},date}"
      >
        <div class="result">
          <span class="text"> {{ day | currendthao }}</span>
          <span v-if="getRset(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: 'WorkCalendar',
  filters: {
    currendthao(value) {
      return value.split('-')[2]
    }
  },
  props: {
    currendDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentYear: null,
      currendMonth: null,
      yearList: []

    }
  },
  computed: {
    value: {
      get() {
        return new Date(this.currentYear, this.currendMonth - 1)
      },
      set(value) {
        this.currentYear = value.getFullYear()
        this.currendMonth = value.getMonth() + 1
      }
    }

  },
  created() {
    this.currentYear = this.currendDate.getFullYear()
    this.currendMonth = this.currendDate.getMonth() + 1

    this.yearList = Array.from(Array(11), (item, index) => {
      return this.currentYear + index - 5
    })
  },
  methods: {
    getRset(data) {
      return [0, 6].includes(data.getDay())
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-calendar__header{
  display: none;
}
.rest{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: red;
}
.result{
  display: flex;
  justify-content: space-between;
}
 .el-calendar-day {
  height:  auto;
 }
 .el-calendar-table__row td, .el-calendar-table tr td:first-child,  .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}

.el-calendar__header {
   display: none
 }
</style>
