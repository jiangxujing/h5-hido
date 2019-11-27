<template>
    <!-- 我的报告 -->
    <div class="main-content report-list">
        <div v-if="request">
            <div v-if="reportList && reportList.length > 0">
                <div v-for="(item, index) in reportList" :key="index" class="report-item"  @click="openDetail(item)">
                    <img class="report-img" src="../assets/images/report_icon.png" />
                    <div class="report-item-info">
                        <p class="report-item-title">{{item.reportTitle}}</p>
                        <p class="report-item-time">{{item.reportTime}}</p>
                    </div>
                    <img class="report-arrow" src="../assets/images/arrow.png" />
                </div>
            </div>
            <div class="no-content" v-else>暂无报告</div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { formatMoney } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'report-list',
    data () {
        return {
            reportList: [],
            request: false
        }
    },
    mounted () {
        document.title = '我的报告'
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.setNative('callInit', {interceptBack: false})
            setTimeout(() => {
                this.getReportList()
            }, 600)
        } else {
            this.getReportList()
        }
    },
    methods: {
        // 获取报告列表
        getReportList () {
            // api.post(api.getUrl('customer-myReports'), {}).then(res => {
            //     if (!!res && res.code === 0) {
            //         this.request = true
            //         if (!!res.content && res.content.length > 0) {
            //             this.reportList = res.content.map(item => {return item})
            //         } else {
            //             this.reportList = []
            //         }
            //     }
            // })
            let res = {
                content: []
            }
            res.content = [{
                reportUrl: 'http://kfb.mxfvip.com/upload/case/47593/c_1564401361.html',
                reportTitle: '长期 头孢 静脉 脂肪',
                reportTime: '2019-07-29 19:56:03'
            
            }, {
                reportUrl: 'http://kfb.mxfvip.com/upload/case/47593/c_1564401358.html',
                reportTitle: '临时 头孢 静脉 脂肪',
                reportTime: '2019-07-29 19:56:51'
            }, {
                reportUrl: 'http://kfb.mxfvip.com/upload/case/47593/c_1564401365.html',
                reportTitle: '体温单',
                reportTime: '2019-07-29 19:57:50'
            }, {
                reportUrl: 'http://kfb.mxfvip.com/upload/case/47593/c_1564401374.html',
                reportTitle: '手术患者与病房交接记录单',
                reportTime: '2019-07-29 19:59:09'
            }]
            this.reportList = res.content.map(item => {return item})
            this.request = true
        },
        // 跳转报告详情
        openDetail (item) {
            if (!item.reportUrl) {return false}
            // if (!item.reportNo) {return false}
            // let query = {
            //     reportNo: item.reportNo
            // }
            // let pageName = '/reportDetail'
            // this.$router.push({
            //     path: pageName,
            //     query: query
            // })
            window.location.href = item.reportUrl
        }
    }
}
</script>

<style lang="scss">

</style>