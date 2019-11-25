<template>
    <!-- 我的报告 -->
    <div class="main-content report-list">
        <div v-if="request">
            <div v-if="reportList && reportList.length > 0">
                <div v-for="(item, index) in reportList" :key="index" class="report-item"  @click="openPage(item.url)">
                    <img class="report-img" src="../assets/images/reportIcon.png" />
                    <div class="report-item-info">
                        <p class="report-item-title">{{item.title}}</p>
                        <p class="report-item-time">{{item.time}}</p>
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
            // api.post(api.getUrl('agent-queryBindBankList'), {}).then(res => {
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
                title: '入院记录',
                time: '2019-10-10 21:00:00',
                url: 'https://www.baidu.com/'
            }, {
                title: '手术患者与病房交接记录单',
                time: '2019-10-10 21:00:00',
                url: 'https://www.baidu.com/'
            }, {
                title: '手术记录',
                time: '2019-10-10 21:00:00',
                url: 'https://www.baidu.com/'
            }]
            this.reportList = res.content.map(item => {return item})
            this.request = true
        },
        // 查看报告
        openPage (url) {
            window.location.href = url
        }
    }
}
</script>

<style lang="scss">

</style>