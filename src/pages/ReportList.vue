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
            api.callHandler('callInit', {interceptBack: false})
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
            api.post(api.getUrl('customer-home-myReports'), {}).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content && res.content.length > 0) {
                        this.reportList = res.content.map(item => {return item})
                    } else {
                        this.reportList = []
                    }
                }
            })
        },
        // 跳转报告详情
        openDetail (item) {
            if (!item.reportUrl) {return false}
            window.location.href = item.reportUrl
        }
    }
}
</script>

<style lang="scss">

</style>