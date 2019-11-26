<template>
    <!-- 报告详情 -->
    <div class="main-content report-detail">
        <div v-if="request">
            <p>{{'报告No: ' + reportForm.reportNo}}</p>
            <div v-html="reportForm.reportContent"></div>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { getQueryString } from '../common/utils.js'
import api from '../common/api.js'

export default {
    name: 'report-detail',
    data () {
        return {
            request: false,
            reportForm: {
                reportNo: '',
                reportContent: ''
            }
        }
    },
    mounted () {
        document.title = '报告详情'
        this.reportForm.reportNo = getQueryString('reportNo') ? getQueryString('reportNo') : null
        if (navigator.userAgent.toLowerCase().indexOf('hido') != -1) {
            api.setNative('callInit', {interceptBack: false})
            setTimeout(() => {
                this.getOrderDetail()
            }, 600)
        } else {
            this.getOrderDetail()
        }
    },
    methods: {
        // 获取订单详情
        getOrderDetail () {
            let datas = {
                reportNo: this.reportForm.reportNo
            }
            api.post(api.getUrl('customer-myReportDetail'), datas).then(res => {
                if (!!res && res.code === 0) {
                    this.request = true
                    if (!!res.content) {
                        document.title = res.content.reportTitle
                        this.reportForm.reportContent = res.content.reportContent
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">

</style>